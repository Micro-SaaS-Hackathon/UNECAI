import React, { useState, useEffect, useRef } from 'react';
import './Result.css';

const Result = () => {
    const [resultData, setResultData] = useState(null);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [intensity, setIntensity] = useState(50);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [user, setUser] = useState(null);
    const [shareUrl, setShareUrl] = useState('');
    const [selectedCrop, setSelectedCrop] = useState('auto');
    const [showCropOptions, setShowCropOptions] = useState(false);
    const [changelog, setChangelog] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const sliderRef = useRef(null);
    const shareUrlRef = useRef(null);

    // Load result data and user info on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load job info from localStorage
                const jobData = localStorage.getItem('glamgen:processingJob');
                if (!jobData) {
                    throw new Error('No processing job found');
                }

                const { jobId } = JSON.parse(jobData);
                
                // Fetch result data
                const response = await fetch(`/api/result/${jobId}`);
                if (!response.ok) {
                    throw new Error('Failed to load result');
                }

                const data = await response.json();
                setResultData(data);
                setChangelog(data.changelog || []);
                setIntensity(data.intensity || 50);
                setSelectedCrop(data.crop || 'auto');
                
                // Generate share URL
                setShareUrl(`${window.location.origin}/share/${jobId}`);
                
                // Check user status
                const userResponse = await fetch('/api/user/status');
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                    setShowPaywall(!userData.hasCredits);
                } else {
                    setShowPaywall(true);
                }
            } catch (error) {
                console.error('Error loading result:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleIntensityChange = async (value) => {
        setIntensity(value);
        
        // Debounce regeneration
        if (window.regenerateTimeout) {
            clearTimeout(window.regenerateTimeout);
        }
        
        window.regenerateTimeout = setTimeout(() => {
            handleRegenerate(value);
        }, 500);
    };

    const handleRegenerate = async (strength = intensity) => {
        if (isRegenerating) return;
        
        setIsRegenerating(true);
        try {
            const response = await fetch('/api/regenerate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    job_id: resultData.jobId,
                    strength,
                    crop: selectedCrop
                })
            });

            if (!response.ok) {
                throw new Error('Regeneration failed');
            }

            const data = await response.json();
            setResultData(prev => ({
                ...prev,
                enhancedUrl: data.result_url,
                changelog: data.changelog
            }));
            setChangelog(data.changelog);
            
        } catch (error) {
            console.error('Regeneration error:', error);
            alert('Failed to regenerate image. Please try again.');
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleDownload = async () => {
        if (showPaywall) {
            handlePurchase();
            return;
        }

        setIsDownloading(true);
        try {
            const response = await fetch(`/api/download/${resultData.jobId}`);
            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `enhanced-${resultData.productName || 'photo'}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download image. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async (platform) => {
        if (isSharing) return;
        
        setIsSharing(true);
        try {
            switch (platform) {
                case 'copy':
                    await navigator.clipboard.writeText(shareUrl);
                    alert('Link copied to clipboard!');
                    break;
                    
                case 'email':
                    const subject = encodeURIComponent('Check out my enhanced photo!');
                    const body = encodeURIComponent(`I enhanced this photo using Sellora: ${shareUrl}`);
                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    break;
                    
                case 'instagram':
                    // Download Instagram-ready version
                    const response = await fetch(`/api/download/${resultData.jobId}?format=instagram`);
                    if (!response.ok) throw new Error('Failed to prepare Instagram version');
                    
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'instagram-ready.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    
                    alert('Image downloaded in Instagram format! Open Instagram and select this image to share.');
                    break;
            }
        } catch (error) {
            console.error('Share error:', error);
            alert('Failed to share. Please try again.');
        } finally {
            setIsSharing(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            alert('Please log in to save this result');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jobId: resultData.jobId,
                    name: resultData.productName,
                    style: resultData.style
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save result');
            }

            alert('Result saved to your account!');
            
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save result. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePurchase = () => {
        // Redirect to pricing page or show modal
        window.location.href = '/pricing';
    };

    if (isLoading) {
        return <div className="loading">Loading result...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="result-page">
            <div className="container">
                <div className="result-header">
                    <h1>Your Enhanced Photo</h1>
                    <p className="result-subtitle">
                        Enhanced with <strong>{resultData.style}</strong> style
                    </p>
                </div>

                <div className="result-content">
                    {/* Before/After Slider */}
                    <div className="before-after-section">
                        <div className="before-after-slider">
                            <div className="slider-container">
                                <img 
                                    src={resultData.originalUrl} 
                                    alt="Original" 
                                    className="before-image"
                                />
                                <img 
                                    src={showPaywall ? resultData.previewUrl : resultData.enhancedUrl} 
                                    alt="Enhanced" 
                                    className="after-image"
                                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                />
                                {showPaywall && (
                                    <div className="watermark">
                                        Preview Version
                                    </div>
                                )}
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={sliderPosition}
                                    onChange={(e) => setSliderPosition(e.target.value)}
                                    className="slider-control"
                                    ref={sliderRef}
                                />
                                <div className="slider-labels">
                                    <span className="before-label">Original</span>
                                    <span className="after-label">Enhanced</span>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="image-controls">
                            <div className="control-group">
                                <label>Enhancement Strength</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={intensity}
                                    onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                                    className="intensity-slider"
                                    disabled={isRegenerating || showPaywall}
                                />
                                <div className="slider-labels">
                                    <span>Subtle</span>
                                    <span className="value">{intensity}%</span>
                                    <span>Intense</span>
                                </div>
                            </div>

                            <div className="control-group">
                                <label>Crop Options</label>
                                <div className="crop-buttons">
                                    <button
                                        className={`crop-btn ${selectedCrop === 'auto' ? 'active' : ''}`}
                                        onClick={() => setSelectedCrop('auto')}
                                        disabled={isRegenerating || showPaywall}
                                    >
                                        Auto
                                    </button>
                                    <button
                                        className={`crop-btn ${selectedCrop === 'square' ? 'active' : ''}`}
                                        onClick={() => setSelectedCrop('square')}
                                        disabled={isRegenerating || showPaywall}
                                    >
                                        Square
                                    </button>
                                    <button
                                        className={`crop-btn ${selectedCrop === 'portrait' ? 'active' : ''}`}
                                        onClick={() => setSelectedCrop('portrait')}
                                        disabled={isRegenerating || showPaywall}
                                    >
                                        Portrait
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Changelog */}
                    <div className="changelog-section">
                        <h3>Enhancement Details</h3>
                        <div className="changelog">
                            {changelog.map((change, index) => (
                                <div key={index} className="change-item">
                                    <span className="change-icon">✓</span>
                                    <span className="change-text">{change}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="action-section">
                        <div className="primary-actions">
                            <button
                                className="btn btn-primary"
                                onClick={handleDownload}
                                disabled={isDownloading || isRegenerating}
                            >
                                {showPaywall ? 'Purchase to Download' : (isDownloading ? 'Downloading...' : 'Download Full Resolution')}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleRegenerate()}
                                disabled={isRegenerating || showPaywall}
                            >
                                {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                            </button>
                        </div>

                        <div className="share-actions">
                            <button
                                className="btn btn-outline"
                                onClick={() => handleShare('copy')}
                                disabled={isSharing}
                            >
                                Copy Link
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => handleShare('email')}
                                disabled={isSharing}
                            >
                                Email
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => handleShare('instagram')}
                                disabled={isSharing}
                            >
                                Instagram
                            </button>
                            {user && (
                                <button
                                    className="btn btn-outline"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save to Account'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Paywall */}
                    {showPaywall && (
                        <div className="paywall-section">
                            <div className="paywall-content">
                                <h3>Get Full Access</h3>
                                <p>Download high-resolution photos and unlock all features</p>
                                <div className="price-options">
                                    <div className="price-option">
                                        <span className="price">$2.99</span>
                                        <span className="description">Single Download</span>
                                    </div>
                                    <div className="price-option recommended">
                                        <span className="price">$9.99</span>
                                        <span className="description">10 Downloads</span>
                                        <span className="badge">Best Value</span>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary btn-large"
                                    onClick={handlePurchase}
                                >
                                    Purchase Now
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Result;
