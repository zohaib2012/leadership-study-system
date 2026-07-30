const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const subjectController = require('../controllers/subject.controller');

router.use(protect);

router.get('/', authorize('ADMIN', 'SUB_ADMIN', 'STUDENT'), subjectController.getSubjects);
router.post('/', subjectController.createSubject);
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);
router.post('/assign', subjectController.assignSubject);
router.post('/unassign', subjectController.unassignSubject);

module.exports = router;
