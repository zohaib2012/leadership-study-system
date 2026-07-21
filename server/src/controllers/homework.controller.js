const mongoose = require('mongoose');
const Homework = require('../models/Homework');
const HomeworkSubmission = require('../models/HomeworkSubmission');
const Student = require('../models/Student');
const Class = require('../models/Class');

const getHomework = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const { classId, teacherId, startDate, endDate, subjectId } = req.query;

    const filter = { tenant: tenantId };

    if (classId) filter.class = classId;
    if (teacherId) filter.teacher = teacherId;
    if (subjectId) filter.subject = subjectId;

    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) {
        filter.dueDate.$gte = new Date(startDate);
        filter.dueDate.$gte.setHours(0, 0, 0, 0);
      }
      if (endDate) {
        filter.dueDate.$lte = new Date(endDate);
        filter.dueDate.$lte.setHours(23, 59, 59, 999);
      }
    }

    const homework = await Homework.find(filter)
      .populate('teacher', 'name email')
      .populate('class', 'name numericLevel type')
      .populate('subject', 'name')
      .sort({ dueDate: -1, createdAt: -1 });

    res.status(200).json({ success: true, data: homework });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getHomeworkById = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const { id } = req.params;

    const homework = await Homework.findOne({ _id: id, tenant: tenantId })
      .populate('teacher', 'name email')
      .populate('class', 'name numericLevel type')
      .populate('subject', 'name');

    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework not found' });
    }

    const submissions = await HomeworkSubmission.find({ homework: id })
      .populate('student', 'registrationNo firstName lastName user')
      .populate('gradedBy', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json({ success: true, data: { ...homework.toObject(), submissions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createHomework = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const teacherId = req.user._id;
    const { classId, subjectId, title, description, fileUrl, fileName, dueDate } = req.body;

    if (!classId || !title || !dueDate) {
      return res.status(400).json({ success: false, message: 'classId, title, and dueDate are required' });
    }

    const homework = await Homework.create({
      tenant: tenantId,
      teacher: teacherId,
      class: classId,
      subject: subjectId || undefined,
      title,
      description: description || '',
      fileUrl: fileUrl || '',
      fileName: fileName || '',
      dueDate: new Date(dueDate),
    });

    const populated = await Homework.findById(homework._id)
      .populate('teacher', 'name email')
      .populate('class', 'name numericLevel type')
      .populate('subject', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateHomework = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const { id } = req.params;
    const updateFields = {};

    const allowed = ['title', 'description', 'fileUrl', 'fileName', 'dueDate', 'class', 'subject', 'teacher'];
    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    }

    if (req.body.dueDate) {
      updateFields.dueDate = new Date(req.body.dueDate);
    }

    updateFields.updatedAt = new Date();

    const homework = await Homework.findOneAndUpdate(
      { _id: id, tenant: tenantId },
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('teacher', 'name email')
      .populate('class', 'name numericLevel type')
      .populate('subject', 'name');

    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework not found' });
    }

    res.status(200).json({ success: true, data: homework });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteHomework = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const { id } = req.params;

    const homework = await Homework.findOneAndDelete({ _id: id, tenant: tenantId });

    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework not found' });
    }

    await HomeworkSubmission.deleteMany({ homework: id });

    res.status(200).json({ success: true, data: { message: 'Homework deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitHomework = async (req, res) => {
  try {
    const homeworkId = req.params.id;
    const { fileUrl, fileName, textContent } = req.body;

    if (!fileUrl && !textContent) {
      return res.status(400).json({ success: false, message: 'fileUrl or textContent is required' });
    }

    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework not found' });
    }

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const now = new Date();
    const isLate = now > homework.dueDate;
    const status = isLate ? 'LATE' : 'SUBMITTED';

    const existing = await HomeworkSubmission.findOne({
      homework: homeworkId,
      student: student._id,
    });

    let submission;
    if (existing) {
      existing.fileUrl = fileUrl || existing.fileUrl;
      existing.fileName = fileName || existing.fileName;
      existing.textContent = textContent !== undefined ? textContent : existing.textContent;
      existing.status = status;
      existing.submittedAt = now;
      await existing.save();
      submission = existing;
    } else {
      submission = await HomeworkSubmission.create({
        homework: homeworkId,
        student: student._id,
        fileUrl: fileUrl || '',
        fileName: fileName || '',
        textContent: textContent || '',
        status,
        submittedAt: now,
      });
    }

    const populated = await HomeworkSubmission.findById(submission._id)
      .populate('student', 'registrationNo firstName lastName user')
      .populate('homework', 'title dueDate');

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const homeworkId = req.params.id;

    const homework = await Homework.findOne({ _id: homeworkId, tenant: req.tenant._id });
    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework not found' });
    }

    const submissions = await HomeworkSubmission.find({ homework: homeworkId })
      .populate('student', 'registrationNo firstName lastName user')
      .populate('gradedBy', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentHomework = async (req, res) => {
  try {
    const tenantId = req.tenant._id;

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    if (!student.class) {
      return res.status(400).json({ success: false, message: 'Student is not assigned to any class' });
    }

    const homework = await Homework.find({
      tenant: tenantId,
      class: student.class,
    })
      .populate('teacher', 'name email')
      .populate('class', 'name numericLevel type')
      .populate('subject', 'name')
      .sort({ dueDate: -1, createdAt: -1 });

    const submissions = await HomeworkSubmission.find({
      student: student._id,
      homework: { $in: homework.map((h) => h._id) },
    }).select('homework status submittedAt fileUrl textContent');

    const submissionMap = {};
    for (const sub of submissions) {
      submissionMap[sub.homework.toString()] = sub;
    }

    const data = homework.map((h) => ({
      ...h.toObject(),
      submission: submissionMap[h._id.toString()] || null,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const reviewSubmission = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { remarks } = req.body;

    const submission = await HomeworkSubmission.findById(submissionId)
      .populate('homework');
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const homework = await Homework.findOne({
      _id: submission.homework._id,
      tenant: req.tenant._id,
    });
    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework not found for this tenant' });
    }

    submission.status = 'REVIEWED';
    submission.remarks = remarks !== undefined ? remarks : submission.remarks;
    submission.gradedBy = req.user._id;
    await submission.save();

    const populated = await HomeworkSubmission.findById(submission._id)
      .populate('student', 'registrationNo firstName lastName user')
      .populate('gradedBy', 'name email')
      .populate('homework', 'title dueDate');

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHomework,
  getHomeworkById,
  createHomework,
  updateHomework,
  deleteHomework,
  submitHomework,
  getSubmissions,
  getStudentHomework,
  reviewSubmission,
};
