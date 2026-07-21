const mongoose = require('mongoose');
const FeeStructure = require('../models/FeeStructure');
const FeeChallan = require('../models/FeeChallan');
const FeePayment = require('../models/FeePayment');
const DiscountRule = require('../models/DiscountRule');
const Student = require('../models/Student');
const { generateChallanNo, generateReceiptNo, getMonthKey } = require('../utils/helpers');

exports.getFeeStructures = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { class: classId, batchType } = req.query;

    const filter = { tenant };
    if (classId) filter.class = classId;
    if (batchType) filter.batchType = batchType;

    const structures = await FeeStructure.find(filter)
      .populate('class', 'name type')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: structures });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFeeStructure = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { class: classId, batchType, name, amount, frequency } = req.body;

    if (!name || amount == null || !frequency) {
      return res.status(400).json({
        success: false,
        message: 'name, amount and frequency are required',
      });
    }

    const feeStructure = await FeeStructure.create({
      tenant,
      class: classId || undefined,
      batchType: batchType || undefined,
      name,
      amount,
      frequency,
    });

    const populated = await FeeStructure.findById(feeStructure._id)
      .populate('class', 'name type')
      .lean();

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFeeStructure = async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: new Date() };
    delete updates.tenant;
    delete updates._id;

    const feeStructure = await FeeStructure.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('class', 'name type')
      .lean();

    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }

    res.json({ success: true, data: feeStructure });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findOneAndDelete({
      _id: req.params.id,
      tenant: req.tenant._id,
    });

    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }

    res.json({ success: true, data: { _id: feeStructure._id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateChallans = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { classId, month, dueDate, studentIds } = req.body;

    if (!classId || !month || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'classId, month and dueDate are required',
      });
    }

    const feeStructures = await FeeStructure.find({
      tenant,
      class: classId,
      isActive: true,
    }).lean();

    if (!feeStructures.length) {
      return res.status(400).json({
        success: false,
        message: 'No active fee structures found for this class',
      });
    }

    const totalFeeAmount = feeStructures.reduce((sum, fs) => sum + fs.amount, 0);

    const studentFilter = {
      tenant,
      class: classId,
      status: 'ACTIVE',
    };

    if (studentIds && Array.isArray(studentIds) && studentIds.length) {
      studentFilter._id = { $in: studentIds };
    }

    const students = await Student.find(studentFilter)
      .select('_id class')
      .lean();

    if (!students.length) {
      return res.status(400).json({
        success: false,
        message: 'No active students found in this class',
      });
    }

    const existingStudentIds = (
      await FeeChallan.find({
        tenant,
        student: { $in: students.map((s) => s._id) },
        month,
      }).select('student').lean()
    ).map((c) => c.student.toString());

    const newStudents = students.filter(
      (s) => !existingStudentIds.includes(s._id.toString())
    );

    if (!newStudents.length) {
      return res.json({
        success: true,
        data: { generated: 0, message: 'All students already have challans for this month' },
      });
    }

    const batchDate = new Date(dueDate);
    const challans = [];

    for (const student of newStudents) {
      let challanNo = generateChallanNo();
      let attempts = 0;

      while (attempts < 5) {
        const exists = await FeeChallan.findOne({ challanNo });
        if (!exists) break;
        challanNo = generateChallanNo();
        attempts++;
      }

      challans.push({
        tenant,
        student: student._id,
        challanNo,
        month,
        totalAmount: totalFeeAmount,
        dueDate: batchDate,
        status: 'PENDING',
        paidAmount: 0,
        issuedAt: new Date(),
      });
    }

    await FeeChallan.insertMany(challans);

    res.status(201).json({
      success: true,
      data: { generated: challans.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChallans = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const {
      page = 1,
      limit = 10,
      class: classId,
      status,
      month,
      student: studentId,
      search,
    } = req.query;

    const filter = { tenant };

    if (classId) {
      const classStudents = await Student.find({ tenant, class: classId })
        .select('_id')
        .lean();
      filter.student = { $in: classStudents.map((s) => s._id) };
    }

    if (status) filter.status = status;
    if (month) filter.month = month;
    if (studentId) filter.student = studentId;

    if (search) {
      const studentIds = await Student.find({
        tenant,
        $or: [
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
          { registrationNo: new RegExp(search, 'i') },
        ],
      })
        .select('_id')
        .lean();

      filter.student = studentId
        ? { $in: studentIds.map((s) => s._id).filter((id) => id.toString() === studentId) }
        : { $in: studentIds.map((s) => s._id) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [challans, total] = await Promise.all([
      FeeChallan.find(filter)
        .populate({
          path: 'student',
          select: 'firstName lastName registrationNo fatherName fatherPhone class section',
          populate: { path: 'class', select: 'name type' },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      FeeChallan.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: challans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPendingChallans = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { class: classId, month } = req.query;

    const filter = { tenant, status: { $in: ['PENDING', 'OVERDUE'] } };

    if (classId) {
      const classStudents = await Student.find({ tenant, class: classId })
        .select('_id')
        .lean();
      filter.student = { $in: classStudents.map((s) => s._id) };
    }

    if (month) filter.month = month;

    const challans = await FeeChallan.find(filter)
      .populate({
        path: 'student',
        select: 'firstName lastName registrationNo fatherName fatherPhone class section',
        populate: { path: 'class', select: 'name type' },
      })
      .sort({ dueDate: 1 })
      .lean();

    res.json({ success: true, data: challans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recordPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tenant = req.tenant._id;
    const { challanId, amount, method, reference, remark } = req.body;

    if (!challanId || !amount || !method) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'challanId, amount and method are required',
      });
    }

    if (amount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero',
      });
    }

    const challan = await FeeChallan.findOne({
      _id: challanId,
      tenant,
    }).session(session);

    if (!challan) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Challan not found' });
    }

    if (challan.status === 'PAID') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Challan is already fully paid' });
    }

    if (challan.status === 'CANCELLED') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Challan is cancelled' });
    }

    let receiptNo = generateReceiptNo();
    let attempts = 0;

    while (attempts < 5) {
      const exists = await FeePayment.findOne({ receiptNo }).session(session);
      if (!exists) break;
      receiptNo = generateReceiptNo();
      attempts++;
    }

    const newPaidAmount = challan.paidAmount + amount;
    let newStatus = 'PARTIAL';

    if (newPaidAmount >= challan.totalAmount) {
      newStatus = 'PAID';
    }

    const payment = await FeePayment.create(
      [
        {
          challan: challanId,
          student: challan.student,
          tenant,
          amount,
          method,
          reference: reference || undefined,
          receiptNo,
          receivedBy: req.user._id,
          remark: remark || undefined,
          paidAt: new Date(),
        },
      ],
      { session }
    );

    challan.paidAmount = newPaidAmount;
    challan.status = newStatus;
    if (newStatus === 'PAID') {
      challan.paidAt = new Date();
    }
    challan.updatedAt = new Date();
    await challan.save({ session });

    await session.commitTransaction();
    session.endSession();

    const receipt = await FeePayment.findById(payment[0]._id)
      .populate('challan', 'challanNo month totalAmount status paidAmount')
      .populate('student', 'firstName lastName registrationNo')
      .populate('receivedBy', 'name')
      .lean();

    res.status(201).json({ success: true, data: receipt });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const {
      page = 1,
      limit = 10,
      student: studentId,
      startDate,
      endDate,
      method,
    } = req.query;

    const filter = { tenant };

    if (studentId) filter.student = studentId;
    if (method) filter.method = method;
    if (startDate || endDate) {
      filter.paidAt = {};
      if (startDate) filter.paidAt.$gte = new Date(startDate);
      if (endDate) filter.paidAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payments, total] = await Promise.all([
      FeePayment.find(filter)
        .populate('student', 'firstName lastName registrationNo')
        .populate('challan', 'challanNo month totalAmount')
        .populate('receivedBy', 'name')
        .sort({ paidAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      FeePayment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeeLedger = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { student: studentId } = req.query;

    if (!req.params.studentId && !studentId) {
      return res.status(400).json({
        success: false,
        message: 'studentId is required',
      });
    }

    const filterStudent = req.params.studentId || studentId;

    const student = await Student.findOne({ _id: filterStudent, tenant })
      .select('firstName lastName registrationNo fatherName fatherPhone class')
      .populate('class', 'name type')
      .lean();

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const [challans, payments] = await Promise.all([
      FeeChallan.find({ tenant, student: filterStudent })
        .sort({ issuedAt: -1 })
        .lean(),
      FeePayment.find({ tenant, student: filterStudent })
        .populate('challan', 'challanNo month totalAmount')
        .populate('receivedBy', 'name')
        .sort({ paidAt: -1 })
        .lean(),
    ]);

    const ledger = [];

    for (const c of challans) {
      ledger.push({
        type: 'CHALLAN',
        date: c.issuedAt,
        challanNo: c.challanNo,
        month: c.month,
        totalAmount: c.totalAmount,
        paidAmount: c.paidAmount,
        dueDate: c.dueDate,
        status: c.status,
        _id: c._id,
      });
    }

    for (const p of payments) {
      ledger.push({
        type: 'PAYMENT',
        date: p.paidAt,
        receiptNo: p.receiptNo,
        amount: p.amount,
        method: p.method,
        reference: p.reference,
        challanNo: p.challan ? p.challan.challanNo : null,
        challanMonth: p.challan ? p.challan.month : null,
        remark: p.remark,
        _id: p._id,
      });
    }

    ledger.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalCharged = challans.reduce((sum, c) => sum + c.totalAmount, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalOutstanding = challans
      .filter((c) => c.status !== 'CANCELLED')
      .reduce((sum, c) => sum + (c.totalAmount - c.paidAmount), 0);

    res.json({
      success: true,
      data: {
        student,
        ledger,
        summary: {
          totalCharged,
          totalPaid,
          totalOutstanding,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeeDashboard = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const now = new Date();
    const currentMonth = getMonthKey(now);

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [totalCollectedResult, totalPendingResult] = await Promise.all([
      FeePayment.aggregate([
        {
          $match: {
            tenant: new mongoose.Types.ObjectId(tenant),
            paidAt: {
              $gte: new Date(now.getFullYear(), now.getMonth(), 1),
              $lte: now,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]),
      FeeChallan.aggregate([
        {
          $match: {
            tenant: new mongoose.Types.ObjectId(tenant),
            status: { $in: ['PENDING', 'PARTIAL', 'OVERDUE'] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $subtract: ['$totalAmount', '$paidAmount'] } },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const collectionByClass = await FeeChallan.aggregate([
      {
        $match: {
          tenant: new mongoose.Types.ObjectId(tenant),
          status: 'PAID',
        },
      },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentDoc',
        },
      },
      { $unwind: { path: '$studentDoc', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$studentDoc.class',
          collected: { $sum: '$paidAmount' },
          challans: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'classDoc',
        },
      },
      {
        $project: {
          classId: '$_id',
          className: { $arrayElemAt: ['$classDoc.name', 0] },
          collected: 1,
          challans: 1,
          _id: 0,
        },
      },
    ]);

    const monthlyTrend = await FeePayment.aggregate([
      {
        $match: {
          tenant: new mongoose.Types.ObjectId(tenant),
          paidAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' },
          },
          collected: { $sum: '$amount' },
          transactions: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $project: {
          _id: 0,
          monthKey: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] },
            ],
          },
          collected: 1,
          transactions: 1,
        },
      },
    ]);

    const allMonths = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      allMonths.push(getMonthKey(d));
    }

    const trendMap = {};
    for (const t of monthlyTrend) {
      trendMap[t.monthKey] = t;
    }

    const filledTrend = allMonths.map((mk) =>
      trendMap[mk] || { monthKey: mk, collected: 0, transactions: 0 }
    );

    res.json({
      success: true,
      data: {
        totalCollectedThisMonth: totalCollectedResult.length
          ? totalCollectedResult[0].total
          : 0,
        totalPending: totalPendingResult.length
          ? { amount: totalPendingResult[0].total, count: totalPendingResult[0].count }
          : { amount: 0, count: 0 },
        collectionByClass,
        monthlyTrend: filledTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDiscounts = async (req, res) => {
  try {
    const tenant = req.tenant._id;

    const discounts = await DiscountRule.find({ tenant })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: discounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDiscount = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { name, type, value, valueType } = req.body;

    if (!name || !type || value == null || !valueType) {
      return res.status(400).json({
        success: false,
        message: 'name, type, value and valueType are required',
      });
    }

    const discount = await DiscountRule.create({
      tenant,
      name,
      type,
      value,
      valueType,
    });

    res.status(201).json({ success: true, data: discount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await DiscountRule.findOneAndDelete({
      _id: req.params.id,
      tenant: req.tenant._id,
    });

    if (!discount) {
      return res.status(404).json({ success: false, message: 'Discount rule not found' });
    }

    res.json({ success: true, data: { _id: discount._id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
