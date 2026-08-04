const JobApplication = require('../models/JobApplication');

exports.getJobApplications = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { page = 1, limit = 10, search, type, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const filter = { tenant };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { position: searchRegex },
      ];
    }

    if (type) filter.academyType = type;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [applications, total] = await Promise.all([
      JobApplication.find(filter).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      JobApplication.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: applications,
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

exports.getJobApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      tenant: req.tenant._id,
    }).lean();

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['NEW', 'SHORTLISTED', 'REJECTED', 'HIRED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      { status, updatedAt: Date.now() },
      { new: true }
    ).lean();

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, message: 'Application status updated', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteJobApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      tenant: req.tenant._id,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
