const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const communicationController = require('../controllers/communication.controller');

router.use(protect);

router.post('/sms/send', authorize('ADMIN', 'SUB_ADMIN'), communicationController.sendSms);
router.post('/sms/bulk', authorize('ADMIN', 'SUB_ADMIN'), communicationController.sendBulkSms);
router.get('/sms/templates', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER'), communicationController.getSmsTemplates);
router.get('/sms/logs', authorize('ADMIN', 'SUB_ADMIN'), communicationController.getSmsLogs);
router.get('/announcements', authorize('ADMIN', 'SUB_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), communicationController.getAnnouncements);
router.post('/announcements', authorize('ADMIN', 'SUB_ADMIN'), communicationController.createAnnouncement);
router.put('/announcements/:id', authorize('ADMIN', 'SUB_ADMIN'), communicationController.updateAnnouncement);
router.delete('/announcements/:id', authorize('ADMIN', 'SUB_ADMIN'), communicationController.deleteAnnouncement);

module.exports = router;
