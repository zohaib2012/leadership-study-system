const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const settingsController = require('../controllers/settings.controller');

router.use(protect);
router.use(authorize('ADMIN', 'SUB_ADMIN'));

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);
router.get('/users', settingsController.getUsers);
router.post('/users', settingsController.createUser);
router.put('/users/:id', settingsController.updateUser);
router.patch('/users/:id/deactivate', settingsController.deactivateUser);
router.get('/logs', settingsController.getActivityLogs);
router.post('/backup', settingsController.createBackup);

module.exports = router;
