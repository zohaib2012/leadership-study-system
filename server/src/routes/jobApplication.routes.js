const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const jobApplicationController = require('../controllers/jobApplication.controller');

router.use(protect);
router.use(authorize('ADMIN', 'SUB_ADMIN'));

router.get('/', jobApplicationController.getJobApplications);
router.get('/:id', jobApplicationController.getJobApplication);
router.get('/:id/cv', jobApplicationController.downloadCv);
router.put('/:id/status', jobApplicationController.updateApplicationStatus);
router.delete('/:id', jobApplicationController.deleteJobApplication);

module.exports = router;
