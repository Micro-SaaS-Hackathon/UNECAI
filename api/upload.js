const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});

// POST /api/upload - Upload photo files with product metadata
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Extract product metadata from form data
        const { productName, brandName } = req.body;
        
        if (!productName || !brandName) {
            return res.status(400).json({
                success: false,
                message: 'Product name and brand name are required'
            });
        }

        // Generate unique job ID
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const fileInfo = {
            id: req.file.filename,
            jobId: jobId,
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            productName: productName,
            brandName: brandName,
            uploadedAt: new Date().toISOString()
        };

        // Create thumbnail URL (in production, generate actual thumbnail)
        const thumbnailUrl = `/api/thumbnail/${fileInfo.id}`;

        console.log('File uploaded successfully:', fileInfo);

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            job_id: jobId,
            thumbnail_url: thumbnailUrl,
            status: 'queued',
            data: {
                fileId: fileInfo.id,
                filename: fileInfo.filename,
                originalName: fileInfo.originalName,
                size: fileInfo.size,
                productName: fileInfo.productName,
                brandName: fileInfo.brandName,
                uploadedAt: fileInfo.uploadedAt
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
});

// POST /api/upload/multiple - Upload multiple files
router.post('/multiple', upload.array('photos', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedFiles = req.files.map(file => ({
            id: file.filename,
            originalName: file.originalname,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            uploadedAt: new Date().toISOString()
        }));

        console.log('Multiple files uploaded successfully:', uploadedFiles);

        res.status(200).json({
            success: true,
            message: `${uploadedFiles.length} files uploaded successfully`,
            data: {
                files: uploadedFiles,
                count: uploadedFiles.length
            }
        });

    } catch (error) {
        console.error('Multiple upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
});

// GET /api/upload/:fileId - Get file information
router.get('/:fileId', (req, res) => {
    try {
        const fileId = req.params.fileId;
        const filePath = path.join(__dirname, '../uploads', fileId);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const stats = fs.statSync(filePath);
        const fileInfo = {
            id: fileId,
            filename: fileId,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
        };

        res.status(200).json({
            success: true,
            data: fileInfo
        });

    } catch (error) {
        console.error('Get file info error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get file information',
            error: error.message
        });
    }
});

// DELETE /api/upload/:fileId - Delete uploaded file
router.delete('/:fileId', (req, res) => {
    try {
        const fileId = req.params.fileId;
        const filePath = path.join(__dirname, '../uploads', fileId);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        fs.unlinkSync(filePath);
        console.log('File deleted successfully:', fileId);

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });

    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
});

module.exports = router;
