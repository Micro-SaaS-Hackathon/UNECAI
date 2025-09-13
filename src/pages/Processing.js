import React, { useState, useEffect, useRef } from 'react';
import './Processing.css';

const Processing = () => {
    const [jobId, setJobId] = useState(null);
    const [status, setStatus] = useState('processing');
    const [progress, setProgress] = useState(0);
    const [estimatedSeconds, setEstimatedSeconds] = useState(60);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [resultUrl, setResultUrl] = useState(null);
    const [note, setNote] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [processingJob, setProcessingJob] = useState(null);
    const [uploadJob, setUploadJob] = useState(null);
    const [productMeta, setProductMeta] = useState(null);
    const [beforeAfterSlider, setBeforeAfterSlider] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(50);
    
    const pollingIntervalRef = useRef(null);
    const timeoutRef = useRef(null);
    const startTimeRef = useRef(null);
    const pollCountRef = useRef(0);

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedProcessingJob = localStorage.getItem('glamgen:processingJob');
        const savedUploadJob = localStorage.getItem('glamgen:uploadJob');
        const savedMeta = localStorage.getItem('glamgen:productMeta');
        
        if (savedProcessingJob) {
            const job = JSON.parse(savedProcessingJob);
            setProcessingJob(job);
            setJobId(job.jobId);
        }
        if (savedUploadJob) {
            setUploadJob(JSON.parse(savedUploadJob));
        }
        if (savedMeta) {
            setProductMeta(JSON.parse(savedMeta));
        }
    }, []);

    // Start polling when component mounts
    useEffect(() => {
        if (jobId) {
            startPolling();
            startTimeRef.current = Date.now();
        }
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [jobId]);

    // Update time remaining
    useEffect(() => {
        if (status === 'processing' && !isComplete) {
            const interval = setInterval(() => {
                setTimeRemaining(prev => {
                    const newTime = Math.max(0, prev - 1);
                    if (newTime === 0 && !isComplete) {
                        // Check if we've exceeded 3 minutes
                        const elapsed = (Date.now() - startTimeRef.current) / 1000;
                        if (elapsed > 180) {
                            setShowEmailForm(true);
                        }
                    }
                    return newTime;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [status, isComplete]);

    const startPolling = () => {
        pollCountRef.current = 0;
        pollStatus();
    };

    const pollStatus = async () => {
        try {
            const response = await fetch(`/api/status?job_id=${jobId}`);
            if (!response.ok) {
                throw new Error(`Status check failed: ${response.statusText}`);
            }

            const data = await response.json();
            setStatus(data.status);
            setProgress(data.progress || 0);
            setNote(data.note || '');

            if (data.result_url) {
                setResultUrl(data.result_url);
            }

            if (data.status === 'done') {
                setIsComplete(true);
                setBeforeAfterSlider(true);
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                }
            } else if (data.status === 'failed') {
                setIsFailed(true);
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                }
            } else if (data.status === 'processing') {
                // Continue polling with exponential backoff
                pollCountRef.current++;
                const baseDelay = 3000; // 3 seconds
                const maxDelay = 30000; // 30 seconds
                const delay = Math.min(baseDelay * Math.pow(1.5, pollCountRef.current), maxDelay);
                
                // Check if we've been polling for more than 90 seconds
                const elapsed = (Date.now() - startTimeRef.current) / 1000;
                if (elapsed > 90) {
                    // Use exponential backoff
                    pollingIntervalRef.current = setTimeout(pollStatus, delay);
                } else {
                    // Use normal 3-second interval
                    pollingIntervalRef.current = setTimeout(pollStatus, baseDelay);
                }
            }
        } catch (error) {
            console.error('Polling error:', error);
            // Retry after 5 seconds on error
            pollingIntervalRef.current = setTimeout(pollStatus, 5000);
        }
    };

    const handleCancelAndSave = () => {
        if (window.confirm('Are you sure you want to cancel? Your job will be saved and you can return later.')) {
            // Save current state
            localStorage.setItem('glamgen:cancelledJob', JSON.stringify({
                jobId,
                status,
                progress,
                cancelledAt: new Date().toISOString()
            }));
            
            // Navigate back to home
            window.location.href = '/';
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jobId,
                    email,
                    type: 'long_running_job'
                })
            });

            if (response.ok) {
                alert('We\'ll email you when your photo is ready!');
                setShowEmailForm(false);
            } else {
                throw new Error('Failed to save email');
            }
        } catch (error) {
            console.error('Email submission error:', error);
            alert('Failed to save email. Please try again.');
        }
    };

    const handleDownload = () => {
        if (resultUrl) {
            const link = document.createElement('a');
            link.href = resultUrl;
            link.download = `enhanced-${productMeta?.productName || 'photo'}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleProcessAnother = () => {
        // Clear all job data
        localStorage.removeItem('glamgen:processingJob');
        localStorage.removeItem('glamgen:uploadJob');
        localStorage.removeItem('glamgen:productMeta');
        
        // Navigate to upload page
        window.location.href = '/upload';
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    const getProgressMessage = () => {
        if (isComplete) return 'Enhancement complete!';
        if (isFailed) return 'Processing failed. Please try again.';
        if (showEmailForm) return 'Still working — we\'ll email you when it\'s ready';
        return 'Sellora is professionally enhancing your photo — this can take up to 3 minutes.';
    };

    return (
        <div className="processing-page">
            <div className="container">
                <div className="processing-content">
                    <div className="processing-header">
                        <h1>Enhancing Your Photo</h1>
                        <p className="processing-subtitle">
                            {getProgressMessage()}
                        </p>
                    </div>

                    {/* Preview Image */}
                    {uploadJob?.thumbnailUrl && (
                        <div className="preview-section">
                            <div className="preview-container">
                                {beforeAfterSlider && resultUrl ? (
                                    <div className="before-after-slider">
                                        <div className="slider-container">
                                            <img 
                                                src={uploadJob.thumbnailUrl} 
                                                alt="Before" 
                                                className="before-image"
                                            />
                                            <img 
                                                src={resultUrl} 
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
                                ) : (
                                    <img 
                                        src={uploadJob.thumbnailUrl} 
                                        alt="Processing preview" 
                                        className="preview-image"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Progress Section */}
                    <div className="progress-section">
                        <div className="progress-circle">
                            <div className="progress-ring">
                                <svg className="progress-ring-svg" width="200" height="200">
                                    <circle
                                        className="progress-ring-circle"
                                        stroke={isFailed ? "#e74c3c" : "#667eea"}
                                        strokeWidth="8"
                                        fill="transparent"
                                        r="90"
                                        cx="100"
                                        cy="100"
                                        style={{
                                            strokeDasharray: `${2 * Math.PI * 90}`,
                                            strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`
                                        }}
                                    />
                                </svg>
                                <div className="progress-text">
                                    <span className="progress-percentage">{Math.round(progress)}%</span>
                                    {!isComplete && !isFailed && (
                                        <span className="time-remaining">
                                            {formatTime(timeRemaining)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="progress-bar-container">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="progress-dots">
                                <span className={`dot ${progress > 0 ? 'active' : ''}`} />
                                <span className={`dot ${progress > 25 ? 'active' : ''}`} />
                                <span className={`dot ${progress > 50 ? 'active' : ''}`} />
                                <span className={`dot ${progress > 75 ? 'active' : ''}`} />
                                <span className={`dot ${progress > 90 ? 'active' : ''}`} />
                            </div>
                        </div>

                        {note && (
                            <div className="status-note">
                                <span className="note-icon">ℹ️</span>
                                {note}
                            </div>
                        )}
                    </div>

                    {/* Email Form for Long-Running Jobs */}
                    {showEmailForm && (
                        <div className="email-form-section">
                            <h3>Still Working...</h3>
                            <p>Your photo is taking longer than expected. Enter your email and we'll notify you when it's ready!</p>
                            <form onSubmit={handleEmailSubmit} className="email-form">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="email-input"
                                />
                                <button type="submit" className="btn btn-primary">
                                    Notify Me
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="processing-actions">
                        {isComplete ? (
                            <div className="completion-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleDownload}
                                >
                                    Download Result
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleProcessAnother}
                                >
                                    Process Another Photo
                                </button>
                            </div>
                        ) : isFailed ? (
                            <div className="error-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleProcessAnother}
                                >
                                    Try Again
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => window.location.href = '/'}
                                >
                                    Go Home
                                </button>
                            </div>
                        ) : (
                            <button
                                className="btn btn-secondary"
                                onClick={handleCancelAndSave}
                            >
                                Cancel & Save for Later
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Processing;
