const cloudinary = require('../config/cloudinary');

const uploadBuffer = (buffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const folder = req.tenant ? `tenant_${req.tenant._id}` : 'lss/uploads';
    const buffer = req.file.buffer || req.file.path;
    const result = req.file.buffer
      ? await uploadBuffer(req.file.buffer, folder)
      : await cloudinary.uploader.upload(req.file.path, { folder });

    res.status(201).json({
      success: true,
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        size: result.bytes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const folder = req.tenant ? `tenant_${req.tenant._id}` : 'lss/uploads';
    const uploadPromises = req.files.map((file) =>
      file.buffer
        ? uploadBuffer(file.buffer, folder)
        : cloudinary.uploader.upload(file.path, { folder })
    );

    const results = await Promise.all(uploadPromises);

    const files = results.map((result) => ({
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      size: result.bytes,
    }));

    res.status(201).json({ success: true, data: files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ success: false, message: 'publicId is required' });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({ success: true, data: { deleted: true } });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete file from Cloudinary',
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
