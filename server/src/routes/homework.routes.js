const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const homeworkController = require('../controllers/homework.controller');

router.use(protect);

router.get('/', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), homeworkController.getHomework);
router.post('/', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), homeworkController.createHomework);
router.get('/student', authorize('STUDENT'), homeworkController.getStudentHomework);
router.get('/:id', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER', 'STUDENT'), homeworkController.getHomeworkById);
router.put('/:id', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), homeworkController.updateHomework);
router.delete('/:id', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), homeworkController.deleteHomework);
router.post('/:id/submit', authorize('STUDENT'), homeworkController.submitHomework);
router.get('/:id/submissions', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), homeworkController.getSubmissions);
router.put('/submissions/:id/review', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), homeworkController.reviewSubmission);

module.exports = router;
