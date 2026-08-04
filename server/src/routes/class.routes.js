const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const classController = require('../controllers/class.controller');

router.use(protect);
router.use(authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT'));

router.get('/', classController.getClasses);
router.get('/:classId/sections', classController.getSections);

router.post('/', authorize('ADMIN', 'SUB_ADMIN'), classController.createClass);
router.put('/:id', authorize('ADMIN', 'SUB_ADMIN'), classController.updateClass);
router.delete('/:id', authorize('ADMIN', 'SUB_ADMIN'), classController.deleteClass);
router.post('/:classId/sections', authorize('ADMIN', 'SUB_ADMIN'), classController.createSection);
router.put('/:classId/sections/:sectionId', authorize('ADMIN', 'SUB_ADMIN'), classController.updateSection);
router.delete('/:classId/sections/:sectionId', authorize('ADMIN', 'SUB_ADMIN'), classController.deleteSection);

module.exports = router;
