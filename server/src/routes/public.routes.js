const express = require('express');
const router = express.Router();
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Tenant = require('../models/Tenant');
const { registerTenant } = require('../controllers/auth.controller');
const { uploadDocument, uploadToCloudinary } = require('../middleware/upload.middleware');

router.get('/plans', async (req, res) => {
  const plans = await SubscriptionPlan.find({ isActive: true });
  res.json({ success: true, data: plans });
});

router.post('/tenants/register', registerTenant);

router.post('/tenants/check-subdomain', async (req, res) => {
  const { subdomain } = req.body;
  const exists = await Tenant.findOne({ subdomain: subdomain.toLowerCase() });
  res.json({ success: true, data: { available: !exists } });
});

const Student = require('../models/Student');
const User = require('../models/User');
const ClassModel = require('../models/Class');
const { generateRegistrationNo } = require('../utils/helpers');

const programLevelToClassType = {
  'IGCSE O Level': 'O_LEVEL',
  'AS Level': 'AS_LEVEL',
  'A Level': 'A_LEVEL',
};

router.post('/students/register', async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ subdomain: 'demo' });
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Registration system is not configured' });
    }

    const { firstName, lastName, dob, gender, fatherName, fatherPhone, address, city, type, email, password } = req.body;

    if (!firstName || !lastName || !dob || !gender || !fatherName || !fatherPhone || !address) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    if (email && !password) {
      return res.status(400).json({ success: false, message: 'Password is required when email is provided' });
    }

    const registrationNo = generateRegistrationNo(type === 'ACADEMY' ? 'ACADEMY' : 'SCHOOL');

    const studentEmail = email || `${registrationNo.toLowerCase()}@lss.edu.pk`;
    const studentPassword = password || 'lss@' + registrationNo;

    const user = await User.create({
      tenant: tenant._id,
      name: `${firstName} ${lastName}`,
      email: studentEmail,
      password: studentPassword,
      phone: fatherPhone,
      role: 'STUDENT',
      status: 'INACTIVE',
    });

    // Resolve class from grade (School) or programLevel (Academy)
    let classId;
    if (type === 'ACADEMY') {
      const programLevel = req.body.programLevel || '';
      const classType = programLevelToClassType[programLevel];
      if (classType) {
        const cls = await ClassModel.findOne({ tenant: tenant._id, type: classType }).lean();
        if (cls) classId = cls._id;
      }
    } else {
      const grade = req.body.grade || '';
      if (grade) {
        const cls = await ClassModel.findOne({ tenant: tenant._id, name: grade, type: 'SCHOOL' }).lean();
        if (cls) classId = cls._id;
      }
    }

    const studentData = {
      tenant: tenant._id,
      user: user._id,
      registrationNo,
      firstName,
      lastName,
      dob: new Date(dob),
      gender: gender.toUpperCase(),
      fatherName,
      fatherPhone,
      fatherCnic: req.body.fatherCnic || '',
      fatherEmail: req.body.fatherEmail || '',
      fatherOccupation: req.body.fatherOccupation || '',
      motherName: req.body.motherName || '',
      motherPhone: req.body.motherPhone || '',
      address,
      city: city || '',
      previousSchool: req.body.previousSchool || '',
      medicalNotes: req.body.medicalNotes || '',
      bloodGroup: req.body.bloodGroup || '',
      bFormNo: req.body.bFormNo || '',
      type: type === 'ACADEMY' ? 'ACADEMY' : 'SCHOOL',
      status: 'INACTIVE',
    };

    if (classId) studentData.class = classId;
    if (type === 'ACADEMY') {
      studentData.academySeries = req.body.academySeries || 'MAY_JUNE';
    }

    const student = await Student.create(studentData);

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. You can login once admin approves your account.',
      data: { registrationNo, studentId: student._id, email: studentEmail },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required' });
  }
  try {
    const ContactMessage = require('../models/ContactMessage');
    await ContactMessage.create({ name, email, phone: phone || '', message });
    res.json({ success: true, message: 'Message received. We will contact you soon.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const JobApplication = require('../models/JobApplication');

router.get('/careers/positions', async (req, res) => {
  const positions = [
    { title: 'Cambridge IGCSE / O Level Teacher', type: 'ACADEMY', subjects: ['Business Studies', 'Economics', 'Accounting'] },
    { title: 'AS / A Level Teacher', type: 'ACADEMY', subjects: ['Business Studies', 'Economics', 'Accounting', 'Commerce'] },
    { title: 'Primary School Teacher (Playgroup - Class 5)', type: 'SCHOOL', subjects: ['English', 'Maths', 'Science'] },
    { title: 'Middle School Teacher (Class 6 - Pre O-Level)', type: 'SCHOOL', subjects: ['English', 'Maths', 'Science', 'Computer'] },
    { title: 'School Administrator', type: 'SCHOOL', subjects: [] },
    { title: 'Academy Coordinator', type: 'ACADEMY', subjects: [] },
  ];
  res.json({ success: true, data: positions });
});

router.post('/careers/apply', uploadDocument.single('cv'), async (req, res) => {
  const { name, email, phone, academyType, position, qualification, experience, coverLetter } = req.body;
  if (!name || !email || !phone || !academyType || !position) {
    return res.status(400).json({ success: false, message: 'Name, email, phone, institution type and position are required' });
  }
  try {
    let cvUrl;
    let cvPublicId;
    let cvName;
    if (req.file) {
      const folder = req.tenant ? `tenant_${req.tenant._id}` : 'lss/careers';
      const result = await uploadToCloudinary(req.file.buffer, folder, 'raw');
      cvUrl = result.secure_url;
      cvPublicId = result.public_id;
      cvName = req.file.originalname;
    }
    const Tenant = require('../models/Tenant');
    const tenant = await Tenant.findOne({ subdomain: 'demo' }).select('_id').lean();
    const application = await JobApplication.create({
      tenant: tenant ? tenant._id : undefined,
      name,
      email,
      phone,
      academyType,
      position,
      qualification: qualification || '',
      experience: experience || '',
      coverLetter: coverLetter || '',
      cvUrl,
      cvPublicId,
      cvName,
    });
    res.status(201).json({ success: true, message: 'Application submitted successfully. We will review your application and contact you soon.', data: { id: application._id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/blog', async (req, res) => {
  const posts = [
    { id: 1, slug: 'why-choose-igcse', title: 'Why Choose IGCSE for Your Child?', excerpt: 'IGCSE offers a globally recognized curriculum...', date: '2025-01-15' },
    { id: 2, slug: 'alevel-preparation-tips', title: 'A-Level Preparation Tips for Success', excerpt: 'Preparing for A-Levels requires strategy...', date: '2025-02-20' },
    { id: 3, slug: 'online-vs-inperson', title: 'Online vs In-Person Learning: What Works Best?', excerpt: 'Both modes have their advantages...', date: '2025-03-10' },
  ];
  res.json({ success: true, data: posts });
});

router.get('/blog/:slug', async (req, res) => {
  const posts = {
    'why-choose-igcse': { id: 1, slug: 'why-choose-igcse', title: 'Why Choose IGCSE for Your Child?', content: 'Full article content here...', date: '2025-01-15', author: 'LSS Admin' },
    'alevel-preparation-tips': { id: 2, slug: 'alevel-preparation-tips', title: 'A-Level Preparation Tips for Success', content: 'Full article content here...', date: '2025-02-20', author: 'LSS Admin' },
    'online-vs-inperson': { id: 3, slug: 'online-vs-inperson', title: 'Online vs In-Person Learning', content: 'Full article content here...', date: '2025-03-10', author: 'LSS Admin' },
  };
  const post = posts[req.params.slug];
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, data: post });
});

module.exports = router;
