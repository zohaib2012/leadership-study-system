const LeaveRequest = require('../models/LeaveRequest');
const Student = require('../models/Student');

exports.getLeaves = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { tenant };

    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [leaves, total] = await Promise.all([
      LeaveRequest.find(filter)
        .populate('user', 'name email role')
        .populate('student', 'firstName lastName registrationNo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      LeaveRequest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: leaves,
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

exports.createLeave = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { student: studentId, type, fromDate, toDate, reason } = req.body;

    if (!type || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'type, fromDate, toDate and reason are required',
      });
    }

    let finalStudentId = studentId || null;

    if (!finalStudentId && req.user.role === 'STUDENT') {
      const linkedStudent = await Student.findOne({ tenant, user: req.user._id }).select('_id');
      if (linkedStudent) {
        finalStudentId = linkedStudent._id;
      }
    }

    const leave = await LeaveRequest.create({
      tenant,
      user: req.user._id,
      student: finalStudentId,
      type,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
    });

    const populated = await LeaveRequest.findById(leave._id)
      .populate('user', 'name email role')
      .populate('student', 'firstName lastName registrationNo');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id, status: 'PENDING' },
      {
        $set: {
          status: 'APPROVED',
          approvedBy: req.user._id,
          approvedAt: new Date(),
        },
      },
      { new: true }
    )
      .populate('user', 'name email role')
      .populate('student', 'firstName lastName registrationNo');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found or already processed',
      });
    }

    res.json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const leave = await LeaveRequest.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id, status: 'PENDING' },
      {
        $set: {
          status: 'REJECTED',
          rejectionReason: rejectionReason || '',
        },
      },
      { new: true }
    )
      .populate('user', 'name email role')
      .populate('student', 'firstName lastName registrationNo');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found or already processed',
      });
    }

    res.json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { page = 1, limit = 20 } = req.query;

    const filter = { tenant, user: req.user._id };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [leaves, total] = await Promise.all([
      LeaveRequest.find(filter)
        .populate('student', 'firstName lastName registrationNo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      LeaveRequest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: leaves,
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
