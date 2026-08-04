const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const teacherController = require('../controllers/teacher.controller');

router.use(protect);

router.get('/', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT'), teacherController.getTeachers);
router.post('/', authorize('ADMIN', 'SUB_ADMIN'), teacherController.createTeacher);
router.get('/me/salary', authorize('TEACHER'), teacherController.getMySalary);
router.get('/my-slips', authorize('TEACHER'), teacherController.getMySlips);
router.get('/salary/slips', authorize('ADMIN', 'SUB_ADMIN'), teacherController.getSalarySlips);
router.get('/salary/slips/:id', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), teacherController.getSalarySlip);
router.patch('/salary/slips/:id', authorize('ADMIN', 'SUB_ADMIN'), teacherController.updateSalarySlip);
router.patch('/salary/slips/:id/pay', authorize('ADMIN', 'SUB_ADMIN'), teacherController.markSlipPaid);
router.patch('/salary/bulk-pay', authorize('ADMIN', 'SUB_ADMIN'), teacherController.bulkMarkPaid);
router.post('/salary/generate', authorize('ADMIN', 'SUB_ADMIN'), teacherController.generateSalarySlip);
router.post('/salary/bulk-generate', authorize('ADMIN', 'SUB_ADMIN'), teacherController.bulkGenerateSlips);
router.get('/my-classes', authorize('TEACHER'), teacherController.getMyClasses);
router.get('/:id', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT', 'TEACHER'), teacherController.getTeacher);
router.put('/:id', authorize('ADMIN', 'SUB_ADMIN'), teacherController.updateTeacher);
router.delete('/:id', authorize('ADMIN', 'SUB_ADMIN'), teacherController.deleteTeacher);
router.get('/:id/salary', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), teacherController.getTeacherSalary);

module.exports = router;
