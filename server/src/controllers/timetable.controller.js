const Timetable = require('../models/Timetable');
const Class = require('../models/Class');

exports.getTimetable = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { classId, teacherId } = req.query;
    const filter = { tenant };

    if (classId) filter.class = classId;
    if (teacherId) filter.teacher = teacherId;

    const slots = await Timetable.find(filter)
      .populate('subject', 'name')
      .populate({
        path: 'teacher',
        select: 'qualification specialization',
        populate: { path: 'user', select: 'name' },
      })
      .populate('class', 'name type')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSlot = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { class: classId, dayOfWeek, startTime, endTime, subject, teacher, room } = req.body;

    if (!classId || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'class, dayOfWeek, startTime and endTime are required',
      });
    }

    if (teacher) {
      const conflict = await Timetable.findOne({
        tenant,
        teacher,
        dayOfWeek,
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: 'Teacher has a conflicting slot at this time',
        });
      }
    }

    const slot = await Timetable.create({
      tenant,
      class: classId,
      dayOfWeek,
      startTime,
      endTime,
      subject,
      teacher,
      room,
    });

    const populated = await Timetable.findById(slot._id)
      .populate('subject', 'name')
      .populate({
        path: 'teacher',
        select: 'qualification specialization',
        populate: { path: 'user', select: 'name' },
      })
      .populate('class', 'name type');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSlot = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { startTime, endTime, dayOfWeek, teacher } = req.body;

    if (teacher && dayOfWeek && startTime && endTime) {
      const conflict = await Timetable.findOne({
        tenant,
        teacher,
        dayOfWeek,
        _id: { $ne: req.params.id },
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: 'Teacher has a conflicting slot at this time',
        });
      }
    }

    const slot = await Timetable.findOneAndUpdate(
      { _id: req.params.id, tenant },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true, runValidators: true }
    )
      .populate('subject', 'name')
      .populate({
        path: 'teacher',
        select: 'qualification specialization',
        populate: { path: 'user', select: 'name' },
      })
      .populate('class', 'name type');

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Timetable slot not found' });
    }

    res.json({ success: true, data: slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const slot = await Timetable.findOneAndDelete({
      _id: req.params.id,
      tenant: req.tenant._id,
    });

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Timetable slot not found' });
    }

    res.json({ success: true, data: slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
