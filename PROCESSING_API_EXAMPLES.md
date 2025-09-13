# Processing Flow - API Examples & Code

## 1. POST /api/process - Submit Processing Job

### Request
```javascript
const payload = {
    "job_id": "job_1703123456789_abc123def", // optional
    "productName": "Velvet Glow Serum",
    "brandName": "Luxe Beauty Co.",
    "style": "Minimalist",
    "styleParams": {
        "contrast": -30,
        "saturation": -25,
        "sharpen": 0.2,
        "skinSoftness": 0.9,
        "crop": "auto",
        "retouchStrength": 0.2
    },
    "image_ref": "photo-1703123456789-123456789.jpg"
};

const response = await fetch('/api/process', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
});
```

### Response (200 OK)
```json
{
    "success": true,
    "job_id": "job_1703123456789_abc123def",
    "estimated_seconds": 40,
    "status": "queued",
    "message": "Processing job started successfully"
}
```

### Response (400 Bad Request)
```json
{
    "success": false,
    "message": "Missing required fields",
    "error": "productName and brandName are required"
}
```

## 2. GET /api/status - Poll Job Status

### Request
```javascript
const response = await fetch(`/api/status?job_id=${jobId}`);
```

### Response - Processing (200 OK)
```json
{
    "success": true,
    "job_id": "job_1703123456789_abc123def",
    "status": "processing",
    "progress": 65,
    "note": "Applying style enhancements..."
}
```

### Response - Completed (200 OK)
```json
{
    "success": true,
    "job_id": "job_1703123456789_abc123def",
    "status": "done",
    "progress": 100,
    "result_url": "/api/download/enhanced-1703123456789.jpg",
    "note": "Enhancement complete!"
}
```

### Response - Failed (200 OK)
```json
{
    "success": true,
    "job_id": "job_1703123456789_abc123def",
    "status": "failed",
    "progress": 0,
    "note": "Image processing failed: Invalid file format"
}
```

### Response - Not Found (404)
```json
{
    "success": false,
    "message": "Job not found",
    "error": "Job ID does not exist"
}
```

## 3. JavaScript Polling Implementation

### Complete Polling Logic with Exponential Backoff
```javascript
class JobPoller {
    constructor(jobId, onUpdate, onComplete, onError) {
        this.jobId = jobId;
        this.onUpdate = onUpdate;
        this.onComplete = onComplete;
        this.onError = onError;
        this.pollCount = 0;
        this.startTime = Date.now();
        this.isPolling = false;
        this.pollInterval = null;
    }

    start() {
        this.isPolling = true;
        this.poll();
    }

    stop() {
        this.isPolling = false;
        if (this.pollInterval) {
            clearTimeout(this.pollInterval);
        }
    }

    async poll() {
        if (!this.isPolling) return;

        try {
            const response = await fetch(`/api/status?job_id=${this.jobId}`);
            
            if (!response.ok) {
                throw new Error(`Status check failed: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Update UI with current status
            this.onUpdate(data);

            if (data.status === 'done') {
                this.onComplete(data);
                this.stop();
            } else if (data.status === 'failed') {
                this.onError(data);
                this.stop();
            } else if (data.status === 'processing') {
                // Continue polling with exponential backoff
                this.pollCount++;
                const baseDelay = 3000; // 3 seconds
                const maxDelay = 30000; // 30 seconds
                const delay = Math.min(baseDelay * Math.pow(1.5, this.pollCount), maxDelay);
                
                // Check if we've been polling for more than 90 seconds
                const elapsed = (Date.now() - this.startTime) / 1000;
                if (elapsed > 90) {
                    // Use exponential backoff
                    this.pollInterval = setTimeout(() => this.poll(), delay);
                } else {
                    // Use normal 3-second interval
                    this.pollInterval = setTimeout(() => this.poll(), baseDelay);
                }
            }
        } catch (error) {
            console.error('Polling error:', error);
            // Retry after 5 seconds on error
            this.pollInterval = setTimeout(() => this.poll(), 5000);
        }
    }
}

// Usage Example
const poller = new JobPoller(
    'job_1703123456789_abc123def',
    (data) => {
        // Update progress bar, status text, etc.
        console.log('Status update:', data);
        updateProgressBar(data.progress);
        updateStatusText(data.note);
    },
    (data) => {
        // Handle completion
        console.log('Job completed:', data);
        showBeforeAfterSlider(data.result_url);
    },
    (data) => {
        // Handle error
        console.error('Job failed:', data);
        showErrorMessage(data.note);
    }
);

poller.start();
```

### Simple Polling Function
```javascript
async function pollJobStatus(jobId, onUpdate, onComplete, onError) {
    let pollCount = 0;
    const startTime = Date.now();
    
    const poll = async () => {
        try {
            const response = await fetch(`/api/status?job_id=${jobId}`);
            const data = await response.json();
            
            onUpdate(data);
            
            if (data.status === 'done') {
                onComplete(data);
                return;
            } else if (data.status === 'failed') {
                onError(data);
                return;
            } else if (data.status === 'processing') {
                pollCount++;
                const baseDelay = 3000;
                const maxDelay = 30000;
                const delay = Math.min(baseDelay * Math.pow(1.5, pollCount), maxDelay);
                
                const elapsed = (Date.now() - startTime) / 1000;
                if (elapsed > 90) {
                    setTimeout(poll, delay);
                } else {
                    setTimeout(poll, baseDelay);
                }
            }
        } catch (error) {
            console.error('Polling error:', error);
            setTimeout(poll, 5000);
        }
    };
    
    poll();
}
```

## 4. Fallback Logic for Long-Running Jobs

### Email Notification API
```javascript
// POST /api/notify - Save email for long-running jobs
const notifyResponse = await fetch('/api/notify', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        jobId: 'job_1703123456789_abc123def',
        email: 'user@example.com',
        type: 'long_running_job'
    })
});
```

### Fallback UI Logic
```javascript
const handleLongRunningJob = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    
    if (elapsed > 180) { // 3 minutes
        setShowEmailForm(true);
        setStatusMessage('Still working — we\'ll email you when it\'s ready');
    }
};

const handleEmailSubmit = async (email) => {
    try {
        await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobId,
                email,
                type: 'long_running_job'
            })
        });
        
        alert('We\'ll email you when your photo is ready!');
        setShowEmailForm(false);
    } catch (error) {
        console.error('Email submission error:', error);
        alert('Failed to save email. Please try again.');
    }
};
```

## 5. Before/After Slider Implementation

### HTML Structure
```html
<div className="before-after-slider">
    <div className="slider-container">
        <img src={beforeImage} alt="Before" className="before-image" />
        <img 
            src={afterImage} 
            alt="After" 
            className="after-image"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        />
        <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(e.target.value)}
            className="slider-control"
        />
        <div className="slider-labels">
            <span className="before-label">Before</span>
            <span className="after-label">After</span>
        </div>
    </div>
</div>
```

### CSS for Slider
```css
.before-after-slider {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: 15px;
}

.slider-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.before-image,
.after-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.after-image {
    z-index: 2;
}

.slider-control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 3;
}
```

## 6. Complete Processing Flow Example

### React Component Integration
```javascript
const ProcessingPage = () => {
    const [jobId, setJobId] = useState(null);
    const [status, setStatus] = useState('processing');
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState(null);
    const [showEmailForm, setShowEmailForm] = useState(false);
    
    useEffect(() => {
        // Load job ID from localStorage
        const savedJob = localStorage.getItem('glamgen:processingJob');
        if (savedJob) {
            const job = JSON.parse(savedJob);
            setJobId(job.jobId);
        }
    }, []);
    
    useEffect(() => {
        if (jobId) {
            const poller = new JobPoller(
                jobId,
                (data) => {
                    setStatus(data.status);
                    setProgress(data.progress);
                    if (data.result_url) {
                        setResultUrl(data.result_url);
                    }
                },
                (data) => {
                    setStatus('done');
                    setProgress(100);
                    setResultUrl(data.result_url);
                },
                (data) => {
                    setStatus('failed');
                    console.error('Processing failed:', data.note);
                }
            );
            
            poller.start();
            
            return () => poller.stop();
        }
    }, [jobId]);
    
    return (
        <div className="processing-page">
            {/* Progress UI */}
            <div className="progress-section">
                <div className="progress-circle">
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar">
                    <div style={{ width: `${progress}%` }} />
                </div>
            </div>
            
            {/* Email form for long-running jobs */}
            {showEmailForm && (
                <EmailForm onSubmit={handleEmailSubmit} />
            )}
            
            {/* Before/after slider when complete */}
            {status === 'done' && resultUrl && (
                <BeforeAfterSlider 
                    beforeImage={uploadJob.thumbnailUrl}
                    afterImage={resultUrl}
                />
            )}
        </div>
    );
};
```

## 7. Error Handling & Edge Cases

### Network Error Handling
```javascript
const pollWithRetry = async (jobId, maxRetries = 5) => {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            const response = await fetch(`/api/status?job_id=${jobId}`);
            return await response.json();
        } catch (error) {
            retries++;
            if (retries >= maxRetries) {
                throw new Error('Max retries exceeded');
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
    }
};
```

### Timeout Handling
```javascript
const pollWithTimeout = async (jobId, timeoutMs = 300000) => { // 5 minutes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const response = await fetch(`/api/status?job_id=${jobId}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
};
```

## 8. Performance Optimizations

### Debounced Polling
```javascript
const debouncedPoll = debounce(async (jobId) => {
    const data = await fetch(`/api/status?job_id=${jobId}`);
    return data.json();
}, 1000);

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

### Memory Management
```javascript
useEffect(() => {
    return () => {
        // Cleanup polling on unmount
        if (pollInterval) {
            clearInterval(pollInterval);
        }
        if (timeout) {
            clearTimeout(timeout);
        }
    };
}, []);
```
