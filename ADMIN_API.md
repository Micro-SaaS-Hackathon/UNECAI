# Sellora Admin API Documentation

## Jobs Management

### GET /api/admin/jobs
Get a list of jobs with optional filters.

```json
// Request Query Parameters
{
    "status": "queued|processing|completed|failed|cancelled",
    "dateRange": "today|yesterday|week|month",
    "userId": "user_id or email"
}

// Response 200 OK
{
    "success": true,
    "total": 150,
    "jobs": [
        {
            "job_id": "job_abc123",
            "user": {
                "id": "user_123",
                "email": "user@example.com"
            },
            "productName": "Velvet Serum",
            "brandName": "Luxe Beauty",
            "style": "Minimalist",
            "status": "completed",
            "submitted_at": "2024-01-15T10:30:45.123Z",
            "started_at": "2024-01-15T10:30:46.000Z",
            "completed_at": "2024-01-15T10:31:45.000Z",
            "time_taken": 59000,
            "credits_used": 1
        }
    ]
}
```

### GET /api/admin/jobs/:jobId/logs
Get detailed logs for a specific job.

```json
// Response 200 OK
{
    "success": true,
    "job_id": "job_abc123",
    "logs": [
        {
            "timestamp": "2024-01-15T10:30:45.123Z",
            "level": "info",
            "message": "Job received"
        },
        {
            "timestamp": "2024-01-15T10:30:46.000Z",
            "level": "info",
            "message": "Starting image processing"
        },
        {
            "timestamp": "2024-01-15T10:31:00.000Z",
            "level": "warn",
            "message": "High memory usage detected"
        },
        {
            "timestamp": "2024-01-15T10:31:45.000Z",
            "level": "info",
            "message": "Processing completed successfully"
        }
    ]
}
```

### POST /api/admin/jobs/:jobId/retry
Retry a failed job.

```json
// Response 200 OK
{
    "success": true,
    "job_id": "job_abc123",
    "status": "queued",
    "message": "Job queued for retry"
}

// Response 400 Bad Request
{
    "success": false,
    "error": "Job is not in failed state"
}
```

### POST /api/admin/jobs/:jobId/cancel
Cancel an active job.

```json
// Response 200 OK
{
    "success": true,
    "job_id": "job_abc123",
    "status": "cancelled",
    "message": "Job cancelled successfully"
}

// Response 400 Bad Request
{
    "success": false,
    "error": "Job is not active"
}
```

## Metrics

### GET /api/admin/metrics
Get real-time system metrics.

```json
// Response 200 OK
{
    "success": true,
    "metrics": {
        "queueLength": 5,
        "avgProcessingTime": 45000, // milliseconds
        "failuresPerHour": 2,
        "successRate": 98.5, // percentage
        "activeUsers": 25,
        "totalJobsToday": 150,
        "resourceUsage": {
            "cpu": 45, // percentage
            "memory": 75, // percentage
            "storage": 60 // percentage
        },
        "processingTimes": {
            "p50": 42000, // milliseconds
            "p95": 65000,
            "p99": 90000
        }
    }
}
```

## Mock Data Examples

### Sample Jobs
```javascript
const mockJobs = [
    {
        job_id: "job_abc123",
        user: {
            id: "user_123",
            email: "john@example.com"
        },
        productName: "Velvet Serum",
        brandName: "Luxe Beauty",
        style: "Minimalist",
        status: "completed",
        submitted_at: "2024-01-15T10:30:45.123Z",
        started_at: "2024-01-15T10:30:46.000Z",
        completed_at: "2024-01-15T10:31:45.000Z",
        time_taken: 59000,
        credits_used: 1
    },
    {
        job_id: "job_abc124",
        user: {
            id: "user_124",
            email: "sarah@example.com"
        },
        productName: "Glow Mask",
        brandName: "Pure Skin",
        style: "Natural",
        status: "processing",
        submitted_at: "2024-01-15T10:35:00.000Z",
        started_at: "2024-01-15T10:35:01.000Z",
        time_taken: null,
        credits_used: 1
    },
    {
        job_id: "job_abc125",
        user: {
            id: "user_125",
            email: "mike@example.com"
        },
        productName: "Hydrating Cream",
        brandName: "Aqua Fresh",
        style: "Studio",
        status: "failed",
        submitted_at: "2024-01-15T10:20:00.000Z",
        started_at: "2024-01-15T10:20:01.000Z",
        completed_at: "2024-01-15T10:20:30.000Z",
        time_taken: 29000,
        credits_used: 0,
        error: "Processing timeout"
    }
];
```

### Sample Logs
```javascript
const mockLogs = [
    {
        timestamp: "2024-01-15T10:30:45.123Z",
        level: "info",
        message: "Job received: job_abc123"
    },
    {
        timestamp: "2024-01-15T10:30:45.500Z",
        level: "info",
        message: "Validating input parameters"
    },
    {
        timestamp: "2024-01-15T10:30:46.000Z",
        level: "info",
        message: "Starting image processing\nStyle: Minimalist\nParameters: { contrast: -20, saturation: -15 }"
    },
    {
        timestamp: "2024-01-15T10:31:00.000Z",
        level: "warn",
        message: "High memory usage detected: 85%\nReducing batch size"
    },
    {
        timestamp: "2024-01-15T10:31:30.000Z",
        level: "info",
        message: "Applying final enhancements:\n- Color balance adjusted\n- Skin smoothing applied\n- Background cleaned"
    },
    {
        timestamp: "2024-01-15T10:31:45.000Z",
        level: "info",
        message: "Processing completed successfully\nOutput size: 2.4MB\nResolution: 2400x3200"
    }
];
```

### Sample Metrics
```javascript
const mockMetrics = {
    queueLength: 5,
    avgProcessingTime: 45000,
    failuresPerHour: 2,
    successRate: 98.5,
    activeUsers: 25,
    totalJobsToday: 150,
    resourceUsage: {
        cpu: 45,
        memory: 75,
        storage: 60
    },
    processingTimes: {
        p50: 42000,
        p95: 65000,
        p99: 90000
    },
    hourlyStats: {
        "00:00": { completed: 45, failed: 1 },
        "01:00": { completed: 38, failed: 0 },
        "02:00": { completed: 42, failed: 1 }
    }
};
```

## Implementation Notes

### Job Status Flow
```
queued -> processing -> completed/failed
         └-> cancelled
```

### Date Range Filter Logic
```javascript
const dateRanges = {
    today: {
        start: startOfDay(new Date()),
        end: endOfDay(new Date())
    },
    yesterday: {
        start: startOfDay(subDays(new Date(), 1)),
        end: endOfDay(subDays(new Date(), 1))
    },
    week: {
        start: startOfDay(subDays(new Date(), 7)),
        end: endOfDay(new Date())
    },
    month: {
        start: startOfDay(subDays(new Date(), 30)),
        end: endOfDay(new Date())
    }
};
```

### Metrics Calculation
```javascript
function calculateMetrics(jobs) {
    const now = new Date();
    const hourAgo = subHours(now, 1);
    const dayAgo = subDays(now, 1);

    const recentJobs = jobs.filter(job => 
        new Date(job.submitted_at) >= dayAgo
    );

    const failedLastHour = jobs.filter(job =>
        job.status === 'failed' &&
        new Date(job.completed_at) >= hourAgo
    ).length;

    const successRate = (
        recentJobs.filter(job => job.status === 'completed').length /
        recentJobs.length
    ) * 100;

    return {
        failuresPerHour: failedLastHour,
        successRate: Math.round(successRate * 10) / 10,
        // ... other calculations
    };
}
```
