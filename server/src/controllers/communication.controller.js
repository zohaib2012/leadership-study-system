const SmsLog = require('../models/SmsLog');
const Announcement = require('../models/Announcement');
const smsService = require('../utils/sms');

exports.sendSms = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { phone, message, template } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ success: false, message: 'phone and message are required' });
    }

    const result = await smsService.sendSingle({
      tenantId: tenant,
      phone,
      message,
      template: template || '',
      userId: req.user._id,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendBulkSms = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { recipients, message, template } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, message: 'recipients array is required' });
    }

    if (!message) {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    const results = await smsService.sendBulk({
      tenantId: tenant,
      recipients,
      message,
      template: template || '',
      userId: req.user._id,
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSmsTemplates = async (req, res) => {
  try {
    const templates = [
      { id: 'fee_reminder', name: 'Fee Reminder', message: 'Dear {name}, your fee of {amount} is due on {date}. Please pay before the due date.' },
      { id: 'absent_notification', name: 'Absent Notification', message: 'Dear parent, your child {name} is absent today ({date}). Please inform the school office.' },
      { id: 'event_announcement', name: 'Event Announcement', message: 'Dear {name}, we are hosting {event} on {date} at {time}. You are cordially invited.' },
      { id: 'exam_schedule', name: 'Exam Schedule', message: 'Dear {name}, exams for {class} will start from {date}. Please prepare accordingly.' },
      { id: 'holiday_notice', name: 'Holiday Notice', message: 'Dear {name}, the school will remain closed on {date} on account of {holiday}.' },
    ];

    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSmsLogs = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { page = 1, limit = 20 } = req.query;

    const filter = { tenant };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      SmsLog.find(filter)
        .populate('sentBy', 'name email')
        .sort({ sentAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      SmsLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: logs,
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

exports.getAnnouncements = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { target, class: classId, page = 1, limit = 20 } = req.query;

    const filter = { tenant };

    if (target) filter.target = target;
    if (classId) filter.class = classId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .populate('createdBy', 'name email')
        .populate('class', 'name')
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Announcement.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: announcements,
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

exports.createAnnouncement = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { title, content, target, class: classId, isPinned, expiresAt } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'title and content are required' });
    }

    const announcement = await Announcement.create({
      tenant,
      title,
      content,
      target: target || 'ALL',
      class: classId || null,
      isPinned: isPinned || false,
      expiresAt: expiresAt || null,
      createdBy: req.user._id,
    });

    const populated = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name email')
      .populate('class', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('class', 'name');

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndDelete({
      _id: req.params.id,
      tenant: req.tenant._id,
    });

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
