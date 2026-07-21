const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const studentController = require('../controllers/student.controller');

router.use(protect);

router.get('/', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), studentController.getStudents);
router.post('/', authorize('ADMIN', 'SUB_ADMIN'), studentController.createStudent);
router.post('/import', authorize('ADMIN', 'SUB_ADMIN'), studentController.bulkImport);
router.patch('/promote', authorize('ADMIN', 'SUB_ADMIN'), studentController.promoteStudents);
router.get('/export', authorize('ADMIN', 'SUB_ADMIN'), studentController.exportStudents);
router.get('/:id', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), studentController.getStudent);
router.put('/:id', authorize('ADMIN', 'SUB_ADMIN'), studentController.updateStudent);
router.delete('/:id', authorize('ADMIN', 'SUB_ADMIN'), studentController.deleteStudent);
router.get('/:id/fees', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT', 'STUDENT', 'PARENT'), studentController.getStudentFees);
router.get('/:id/attendance', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), studentController.getStudentAttendance);
router.get('/:id/id-card', authorize('ADMIN', 'SUB_ADMIN'), studentController.generateIdCard);

module.exports = router;
