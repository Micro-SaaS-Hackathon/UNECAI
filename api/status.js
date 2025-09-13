const express = require('express');
const router = express.Router();

// In-memory storage for system status (in production, use actual monitoring)
let systemStatus = {
    status: 'operational',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
        api: 'operational',
        processing: 'operational',
        storage: 'operational',
        ai: 'operational'
    },
    metrics: {
        totalRequests: 0,
        activeJobs: 0,
        completedJobs: 0,
        failedJobs: 0,
        averageProcessingTime: 0
    }
};

// GET /api/status - Get overall system status
router.get('/', (req, res) => {
    try {
        // Update uptime
        systemStatus.uptime = process.uptime();
        systemStatus.timestamp = new Date().toISOString();

        // Determine overall status based on services
        const serviceStatuses = Object.values(systemStatus.services);
        const hasIssues = serviceStatuses.some(status => status !== 'operational');
        
        systemStatus.status = hasIssues ? 'degraded' : 'operational';

        res.status(200).json({
            success: true,
            data: systemStatus
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get system status',
            error: error.message
        });
    }
});

// GET /api/status/health - Health check endpoint
router.get('/health', (req, res) => {
    try {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.version,
            platform: process.platform
        };

        res.status(200).json(health);

    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// GET /api/status/services - Get individual service status
router.get('/services', (req, res) => {
    try {
        const services = {
            api: {
                status: 'operational',
                responseTime: '< 100ms',
                lastCheck: new Date().toISOString()
            },
            processing: {
                status: 'operational',
                activeJobs: systemStatus.metrics.activeJobs,
                queueLength: 0,
                lastCheck: new Date().toISOString()
            },
            storage: {
                status: 'operational',
                availableSpace: '95%',
                lastCheck: new Date().toISOString()
            },
            ai: {
                status: 'operational',
                modelVersion: 'v1.2.0',
                lastCheck: new Date().toISOString()
            }
        };

        res.status(200).json({
            success: true,
            data: services
        });

    } catch (error) {
        console.error('Services status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get services status',
            error: error.message
        });
    }
});

// GET /api/status/metrics - Get system metrics
router.get('/metrics', (req, res) => {
    try {
        const metrics = {
            ...systemStatus.metrics,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage(),
            timestamp: new Date().toISOString()
        };

        res.status(200).json({
            success: true,
            data: metrics
        });

    } catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get metrics',
            error: error.message
        });
    }
});

// POST /api/status/update - Update system status (admin only)
router.post('/update', (req, res) => {
    try {
        const { service, status, message } = req.body;

        if (!service || !status) {
            return res.status(400).json({
                success: false,
                message: 'service and status are required'
            });
        }

        // Update service status
        if (systemStatus.services[service]) {
            systemStatus.services[service] = status;
            systemStatus.timestamp = new Date().toISOString();

            console.log(`Service ${service} status updated to ${status}: ${message || ''}`);

            res.status(200).json({
                success: true,
                message: `Service ${service} status updated to ${status}`,
                data: {
                    service: service,
                    status: status,
                    message: message,
                    timestamp: systemStatus.timestamp
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: `Unknown service: ${service}`
            });
        }

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update status',
            error: error.message
        });
    }
});

// Utility function to update metrics (called by other modules)
function updateMetrics(type, value) {
    switch (type) {
        case 'request':
            systemStatus.metrics.totalRequests += value || 1;
            break;
        case 'job_started':
            systemStatus.metrics.activeJobs += value || 1;
            break;
        case 'job_completed':
            systemStatus.metrics.activeJobs = Math.max(0, systemStatus.metrics.activeJobs - 1);
            systemStatus.metrics.completedJobs += value || 1;
            break;
        case 'job_failed':
            systemStatus.metrics.activeJobs = Math.max(0, systemStatus.metrics.activeJobs - 1);
            systemStatus.metrics.failedJobs += value || 1;
            break;
        case 'processing_time':
            // Update average processing time
            const currentAvg = systemStatus.metrics.averageProcessingTime;
            const totalJobs = systemStatus.metrics.completedJobs;
            systemStatus.metrics.averageProcessingTime = 
                ((currentAvg * (totalJobs - 1)) + value) / totalJobs;
            break;
    }
}

module.exports = { router, updateMetrics };
