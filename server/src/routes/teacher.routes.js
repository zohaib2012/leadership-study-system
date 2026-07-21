const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const teacherController = require('../controllers/teacher.controller');

router.use(protect);

router.get('/', authorize('ADMIN', 'SUB_ADMIN'), teacherController.getTeachers);
router.post('/', authorize('ADMIN', 'SUB_ADMIN'), teacherController.createTeacher);
router.get('/:id', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), teacherController.getTeacher);
router.put('/:id', authorize('ADMIN', 'SUB_ADMIN'), teacherController.updateTeacher);
router.delete('/:id', authorize('ADMIN', 'SUB_ADMIN'), teacherController.deleteTeacher);
router.get('/:id/salary', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), teacherController.getTeacherSalary);
router.post('/salary/generate', authorize('ADMIN', 'SUB_ADMIN'), teacherController.generateSalarySlip);

module.exports = router;
