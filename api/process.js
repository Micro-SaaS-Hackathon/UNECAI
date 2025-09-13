const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// In-memory storage for processing jobs (in production, use Redis or database)
const processingJobs = new Map();

// POST /api/process - Process uploaded photos with selected style
router.post('/', async (req, res) => {
    try {
        const { fileId, style, options = {} } = req.body;

        if (!fileId || !style) {
            return res.status(400).json({
                success: false,
                message: 'fileId and style are required'
            });
        }

        // Validate file exists
        const filePath = path.join(__dirname, '../uploads', fileId);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Generate unique job ID
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create processing job
        const job = {
            id: jobId,
            fileId: fileId,
            style: style,
            options: options,
            status: 'queued',
            progress: 0,
            createdAt: new Date().toISOString(),
            startedAt: null,
            completedAt: null,
            result: null,
            error: null
        };

        processingJobs.set(jobId, job);

        console.log('Processing job created:', job);

        // Start processing asynchronously
        processImage(jobId);

        res.status(202).json({
            success: true,
            message: 'Processing started',
            data: {
                jobId: jobId,
                status: 'queued',
                estimatedTime: '30-60 seconds'
            }
        });

    } catch (error) {
        console.error('Process error:', error);
        res.status(500).json({
            success: false,
            message: 'Processing failed to start',
            error: error.message
        });
    }
});

// Simulate image processing (replace with actual AI processing)
async function processImage(jobId) {
    const job = processingJobs.get(jobId);
    if (!job) return;

    try {
        // Update job status
        job.status = 'processing';
        job.startedAt = new Date().toISOString();
        job.progress = 0;

        // Simulate processing steps
        const steps = [
            { name: 'Analyzing image', duration: 5000, progress: 20 },
            { name: 'Applying style', duration: 8000, progress: 50 },
            { name: 'Enhancing features', duration: 6000, progress: 80 },
            { name: 'Finalizing result', duration: 2000, progress: 100 }
        ];

        for (const step of steps) {
            console.log(`Job ${jobId}: ${step.name}`);
            job.progress = step.progress;
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, step.duration));
        }

        // Generate mock result
        const result = {
            originalFile: job.fileId,
            enhancedFile: `enhanced_${job.fileId}`,
            style: job.style,
            processingTime: Date.now() - new Date(job.startedAt).getTime(),
            enhancements: [
                'Skin smoothing applied',
                'Eye enhancement completed',
                'Color correction optimized',
                'Lighting improved',
                'Style effects added'
            ],
            downloadUrl: `/api/download/${job.id}`,
            previewUrl: `/api/preview/${job.id}`
        };

        // Update job with result
        job.status = 'completed';
        job.completedAt = new Date().toISOString();
        job.progress = 100;
        job.result = result;

        console.log(`Job ${jobId} completed successfully`);

    } catch (error) {
        console.error(`Job ${jobId} failed:`, error);
        job.status = 'failed';
        job.completedAt = new Date().toISOString();
        job.error = error.message;
    }
}

// GET /api/process/:jobId - Get processing job status
router.get('/:jobId', (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = processingJobs.get(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                jobId: job.id,
                status: job.status,
                progress: job.progress,
                style: job.style,
                createdAt: job.createdAt,
                startedAt: job.startedAt,
                completedAt: job.completedAt,
                result: job.result,
                error: job.error
            }
        });

    } catch (error) {
        console.error('Get job status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get job status',
            error: error.message
        });
    }
});

// GET /api/process - Get all processing jobs (for admin/debugging)
router.get('/', (req, res) => {
    try {
        const jobs = Array.from(processingJobs.values()).map(job => ({
            jobId: job.id,
            status: job.status,
            progress: job.progress,
            style: job.style,
            createdAt: job.createdAt,
            completedAt: job.completedAt
        }));

        res.status(200).json({
            success: true,
            data: {
                jobs: jobs,
                total: jobs.length,
                active: jobs.filter(job => job.status === 'processing').length,
                completed: jobs.filter(job => job.status === 'completed').length,
                failed: jobs.filter(job => job.status === 'failed').length
            }
        });

    } catch (error) {
        console.error('Get all jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get jobs',
            error: error.message
        });
    }
});

// DELETE /api/process/:jobId - Cancel/delete processing job
router.delete('/:jobId', (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = processingJobs.get(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.status === 'processing') {
            // In a real implementation, you would cancel the actual processing
            job.status = 'cancelled';
            job.completedAt = new Date().toISOString();
        }

        processingJobs.delete(jobId);
        console.log(`Job ${jobId} deleted`);

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });

    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete job',
            error: error.message
        });
    }
});

module.exports = router;
