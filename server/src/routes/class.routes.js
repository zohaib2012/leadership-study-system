const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const classController = require('../controllers/class.controller');

router.use(protect);
router.use(authorize('ADMIN', 'SUB_ADMIN'));

router.get('/', classController.getClasses);
router.post('/', classController.createClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);
router.get('/:classId/sections', classController.getSections);
router.post('/:classId/sections', classController.createSection);
router.put('/:classId/sections/:sectionId', classController.updateSection);
router.delete('/:classId/sections/:sectionId', classController.deleteSection);

module.exports = router;
