const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// POST /api/process - Process an uploaded image
router.post('/', async (req, res) => {
    try {
        const { fileId } = req.body;
        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }

        const inputPath = path.join(__dirname, '../uploads', fileId);
        const outputPath = path.join(__dirname, '../uploads', `processed_${fileId}`);

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({
                success: false,
                message: 'Input file not found'
            });
        }

        // Get enhancement options
        const removeBackground = req.body.removeBackground === 'true';
        const adjustLighting = req.body.adjustLighting === 'true';
        const enhanceColors = req.body.enhanceColors === 'true';

        // Start with the base image
        let imageProcess = sharp(inputPath);

        // Apply enhancements based on options
        if (removeBackground) {
            // In a real app, you'd use a more sophisticated background removal
            // For now, we'll just add a white background
            imageProcess = imageProcess.flatten({ background: { r: 255, g: 255, b: 255 } });
        }

        // Resize while maintaining aspect ratio
        imageProcess = imageProcess.resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true
        });

        if (adjustLighting) {
            imageProcess = imageProcess
                .modulate({
                    brightness: 1.1,
                    contrast: 1.1
                })
                .gamma(0.9);
        }

        if (enhanceColors) {
            imageProcess = imageProcess
                .modulate({
                    saturation: 1.2
                })
                .sharpen()
                .tint({ r: 255, g: 252, b: 250 }); // Slight warm tint
        }

        // Save the processed image
        await imageProcess.toFile(outputPath);

        res.status(200).json({
            success: true,
            message: 'Image processed successfully',
            data: {
                processedFileId: `processed_${fileId}`,
                url: `/uploads/processed_${fileId}`
            }
        });

    } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Processing failed',
            error: error.message
        });
    }
});

module.exports = router;