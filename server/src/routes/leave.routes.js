const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const leaveController = require('../controllers/leave.controller');

router.use(protect);

router.get('/', authorize('ADMIN', 'SUB_ADMIN'), leaveController.getLeaves);
router.post('/', authorize('STUDENT', 'TEACHER'), leaveController.createLeave);
router.put('/:id/approve', authorize('ADMIN', 'SUB_ADMIN'), leaveController.approveLeave);
router.put('/:id/reject', authorize('ADMIN', 'SUB_ADMIN'), leaveController.rejectLeave);
router.get('/my', authorize('STUDENT', 'TEACHER'), leaveController.getMyLeaves);

module.exports = router;
