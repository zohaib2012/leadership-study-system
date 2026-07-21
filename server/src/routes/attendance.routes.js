const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const attendanceController = require('../controllers/attendance.controller');

router.use(protect);

router.post('/mark', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), attendanceController.markAttendance);
router.get('/daily', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), attendanceController.getDailyAttendance);
router.get('/monthly', authorize('ADMIN', 'SUB_ADMIN'), attendanceController.getMonthlyReport);
router.get('/stats', authorize('ADMIN', 'SUB_ADMIN'), attendanceController.getAttendanceStats);
router.get('/student/:id', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), attendanceController.getStudentAttendance);
router.post('/teacher', authorize('ADMIN', 'SUB_ADMIN'), attendanceController.markTeacherAttendance);
router.get('/teacher-report', authorize('ADMIN', 'SUB_ADMIN'), attendanceController.getTeacherAttendanceReport);

module.exports = router;
