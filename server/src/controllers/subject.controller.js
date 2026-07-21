const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');

const requireTenant = (req) => {
  if (!req.tenant || !req.tenant._id) {
    return false;
  }
  return true;
};

exports.getSubjects = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const tenantId = req.tenant._id;
    const { type } = req.query;
    const filter = { tenant: tenantId };
    if (type) filter.type = type;

    const subjects = await Subject.find(filter).sort({ type: 1, name: 1 });

    res.json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { name, code, type } = req.body;

    const subject = await Subject.create({
      tenant: req.tenant._id,
      name,
      code,
      type,
    });

    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { name, code, type } = req.body;

    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      { name, code, type, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      tenant: req.tenant._id,
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignSubject = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { classId, subjectId, teacherId } = req.body;

    const teacher = await Teacher.findOne({
      _id: teacherId,
      tenant: req.tenant._id,
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const alreadyAssigned = teacher.assignedClasses.some(
      (ac) => ac.class.toString() === classId && ac.subject.toString() === subjectId
    );

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Subject already assigned to this teacher for this class',
      });
    }

    teacher.assignedClasses.push({ class: classId, subject: subjectId });
    teacher.updatedAt = new Date();
    await teacher.save();

    const populated = await Teacher.findById(teacher._id)
      .populate('assignedClasses.class')
      .populate('assignedClasses.subject');

    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unassignSubject = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { classId, subjectId, teacherId } = req.body;

    const teacher = await Teacher.findOne({
      _id: teacherId,
      tenant: req.tenant._id,
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const beforeLength = teacher.assignedClasses.length;

    teacher.assignedClasses = teacher.assignedClasses.filter(
      (ac) => !(ac.class.toString() === classId && ac.subject.toString() === subjectId)
    );

    if (teacher.assignedClasses.length === beforeLength) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    teacher.updatedAt = new Date();
    await teacher.save();

    const populated = await Teacher.findById(teacher._id)
      .populate('assignedClasses.class')
      .populate('assignedClasses.subject');

    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
