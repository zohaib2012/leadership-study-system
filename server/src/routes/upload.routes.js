const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { uploadImage, uploadDocument } = require('../middleware/upload.middleware');
const uploadController = require('../controllers/upload.controller');

router.use(protect);

router.post('/image', uploadImage.single('file'), uploadController.uploadFile);
router.post('/document', uploadDocument.single('file'), uploadController.uploadFile);
router.post('/multiple', uploadImage.array('files', 10), uploadController.uploadMultiple);
router.delete('/:publicId', uploadController.deleteFile);

module.exports = router;
