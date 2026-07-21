const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const reportController = require('../controllers/report.controller');

router.use(protect);
router.use(authorize('ADMIN', 'SUB_ADMIN'));

router.get('/admissions', reportController.getAdmissionReport);
router.get('/attendance', reportController.getAttendanceReport);
router.get('/fees', reportController.getFeeReport);
router.get('/students', reportController.getStudentReport);
router.get('/teachers', reportController.getTeacherReport);
router.get('/dashboard', reportController.getDashboardData);

module.exports = router;
