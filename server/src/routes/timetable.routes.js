const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const timetableController = require('../controllers/timetable.controller');

router.use(protect);

router.get('/', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER', 'STUDENT'), timetableController.getTimetable);
router.post('/', authorize('ADMIN', 'SUB_ADMIN'), timetableController.createSlot);
router.put('/:id', authorize('ADMIN', 'SUB_ADMIN'), timetableController.updateSlot);
router.delete('/:id', authorize('ADMIN', 'SUB_ADMIN'), timetableController.deleteSlot);

module.exports = router;
