const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
fs.ensureDirSync(uploadsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types
    cb(null, true);
  }
});

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user._id
    });

    await file.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        filename: file.filename,
        originalName: file.originalName,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: file.uploadedAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if database save fails
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({ error: 'Server error during file upload' });
  }
});

// Get user's files
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', trash = 'false' } = req.query;
    const skip = (page - 1) * limit;

    let query = { uploadedBy: req.user._id };

    // Filter by trash status
    if (trash === 'true') {
      query.deleted = true;
    } else {
      query.deleted = { $ne: true };
    }

    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    const files = await File.find(query)
      .sort({ uploadedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-_id filename originalName mimetype size uploadedAt deleted deletedAt');

    const total = await File.countDocuments(query);

    res.json({
      files,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalFiles: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Server error while fetching files' });
  }
});

// Download file
router.get('/download/:filename', async (req, res) => {
  try {
    const file = await File.findOne({ 
      filename: req.params.filename, 
      uploadedBy: req.user._id 
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(uploadsDir, file.filename);
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(filePath, file.originalName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Server error during file download' });
  }
});

// Move file to trash (soft delete)
router.delete('/delete/:filename', async (req, res) => {
  try {
    const file = await File.findOne({
      filename: req.params.filename,
      uploadedBy: req.user._id,
      deleted: { $ne: true }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Soft delete - mark as deleted
    file.deleted = true;
    file.deletedAt = new Date();
    await file.save();

    res.json({ message: 'File moved to trash successfully' });
  } catch (error) {
    console.error('Soft delete error:', error);
    res.status(500).json({ error: 'Server error during file deletion' });
  }
});

// Restore file from trash
router.post('/restore/:filename', async (req, res) => {
  try {
    const file = await File.findOne({
      filename: req.params.filename,
      uploadedBy: req.user._id,
      deleted: true
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found in trash' });
    }

    // Restore file - unmark as deleted
    file.deleted = false;
    file.deletedAt = null;
    await file.save();

    res.json({ message: 'File restored successfully' });
  } catch (error) {
    console.error('Restore error:', error);
    res.status(500).json({ error: 'Server error during file restoration' });
  }
});

// Permanently delete file
router.delete('/permanent/:filename', async (req, res) => {
  try {
    const file = await File.findOne({
      filename: req.params.filename,
      uploadedBy: req.user._id
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(uploadsDir, file.filename);

    // Delete file from disk
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error('Error deleting file from disk:', unlinkError);
    }

    // Delete file record from database
    await File.findByIdAndDelete(file._id);

    res.json({ message: 'File permanently deleted successfully' });
  } catch (error) {
    console.error('Permanent delete error:', error);
    res.status(500).json({ error: 'Server error during permanent file deletion' });
  }
});

// Get file info
router.get('/info/:filename', async (req, res) => {
  try {
    const file = await File.findOne({ 
      filename: req.params.filename, 
      uploadedBy: req.user._id 
    }).select('-_id filename originalName mimetype size uploadedAt');

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ file });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({ error: 'Server error while fetching file info' });
  }
});

module.exports = router;
