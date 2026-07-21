const { default: mongoose } = require('mongoose');
const Class = require('../models/Class');
const Section = Class.Section;
const Student = require('../models/Student');

const requireTenant = (req) => {
  if (!req.tenant || !req.tenant._id) {
    return false;
  }
  return true;
};

exports.getClasses = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const tenantId = req.tenant._id;
    const { type } = req.query;
    const filter = { tenant: tenantId };
    if (type) filter.type = type;

    const classes = await Class.find(filter).sort({ sortOrder: 1, numericLevel: 1 });

    const sections = await Section.find({ class: { $in: classes.map((c) => c._id) } });

    const studentCounts = await Student.aggregate([
      { $match: { tenant: new mongoose.Types.ObjectId(tenantId), status: 'ACTIVE', class: { $ne: null } } },
      { $group: { _id: '$class', count: { $sum: 1 } } },
    ]);
    const studentCountMap = {};
    studentCounts.forEach((sc) => {
      studentCountMap[sc._id.toString()] = sc.count;
    });

    const sectionsByClass = {};
    sections.forEach((s) => {
      const classId = s.class.toString();
      if (!sectionsByClass[classId]) sectionsByClass[classId] = [];
      sectionsByClass[classId].push(s);
    });

    const result = classes.map((cls) => {
      const classId = cls._id.toString();
      return {
        ...cls.toObject(),
        sections: sectionsByClass[classId] || [],
        sectionCount: (sectionsByClass[classId] || []).length,
        studentCount: studentCountMap[classId] || 0,
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { name, numericLevel, type, sortOrder } = req.body;

    const newClass = await Class.create({
      tenant: req.tenant._id,
      name,
      numericLevel,
      type,
      sortOrder: sortOrder || 0,
    });

    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { name, numericLevel, type, sortOrder } = req.body;

    const cls = await Class.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      { name, numericLevel, type, sortOrder, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!cls) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    res.json({ success: true, data: cls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const studentCount = await Student.countDocuments({
      tenant: req.tenant._id,
      class: req.params.id,
      status: 'ACTIVE',
    });

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete class with ${studentCount} assigned student(s)`,
      });
    }

    await Section.deleteMany({ class: req.params.id });

    const cls = await Class.findOneAndDelete({
      _id: req.params.id,
      tenant: req.tenant._id,
    });

    if (!cls) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    res.json({ success: true, data: cls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSection = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { classId } = req.params;
    const { name, capacity } = req.body;

    const cls = await Class.findOne({ _id: classId, tenant: req.tenant._id });
    if (!cls) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const section = await Section.create({
      class: classId,
      name,
      capacity,
    });

    res.status(201).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { sectionId } = req.params;
    const { name, capacity } = req.body;

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    const cls = await Class.findOne({ _id: section.class, tenant: req.tenant._id });
    if (!cls) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (name !== undefined) section.name = name;
    if (capacity !== undefined) section.capacity = capacity;
    await section.save();

    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { sectionId } = req.params;

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    const cls = await Class.findOne({ _id: section.class, tenant: req.tenant._id });
    if (!cls) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const studentCount = await Student.countDocuments({
      tenant: req.tenant._id,
      section: sectionId,
      status: 'ACTIVE',
    });

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete section with ${studentCount} assigned student(s)`,
      });
    }

    await section.deleteOne();

    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSections = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { classId } = req.params;

    const cls = await Class.findOne({ _id: classId, tenant: req.tenant._id });
    if (!cls) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const sections = await Section.find({ class: classId }).sort({ name: 1 });

    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
