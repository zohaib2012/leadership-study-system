const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

router.use(protect);

router.get('/admin', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT'), dashboardController.getAdminDashboard);
router.get('/teacher', authorize('TEACHER'), dashboardController.getTeacherDashboard);
router.get('/student', authorize('STUDENT'), dashboardController.getStudentDashboard);
router.get('/parent', authorize('PARENT'), dashboardController.getParentDashboard);

module.exports = router;
