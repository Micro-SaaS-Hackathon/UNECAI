import React, { useState } from 'react';
import './Result.css';

const Result = () => {
    const [selectedTab, setSelectedTab] = useState('enhanced');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    // Mock data - in real app, this would come from props or API
    const resultData = {
        original: '/api/placeholder/original.jpg',
        enhanced: '/api/placeholder/enhanced.jpg',
        style: 'Glamorous',
        processingTime: '45 seconds',
        enhancements: [
            'Skin smoothing applied',
            'Eye enhancement completed',
            'Color correction optimized',
            'Lighting improved',
            'Makeup effects added'
        ]
    };

    const handleDownload = async (type) => {
        setIsDownloading(true);
        // TODO: Implement actual download functionality
        console.log(`Downloading ${type} image`);
        setTimeout(() => {
            setIsDownloading(false);
            alert(`${type} image downloaded! (This is a placeholder)`);
        }, 2000);
    };

    const handleShare = async () => {
        setIsSharing(true);
        // TODO: Implement actual sharing functionality
        console.log('Sharing result');
        setTimeout(() => {
            setIsSharing(false);
            alert('Share functionality will be implemented!');
        }, 1000);
    };

    const handleProcessAnother = () => {
        // TODO: Navigate to upload page
        window.location.href = '/upload';
    };

    const handleEditStyle = () => {
        // TODO: Navigate back to style picker
        window.location.href = '/style-picker';
    };

    return (
        <div className="result-page">
            <div className="container">
                <div className="result-header">
                    <h1>Enhancement Complete!</h1>
                    <p className="result-subtitle">
                        Your photo has been transformed with the <strong>{resultData.style}</strong> style
                    </p>
                </div>

                <div className="result-content">
                    <div className="image-comparison">
                        <div className="image-tabs">
                            <button
                                className={`tab-button ${selectedTab === 'original' ? 'active' : ''}`}
                                onClick={() => setSelectedTab('original')}
                            >
                                Original
                            </button>
                            <button
                                className={`tab-button ${selectedTab === 'enhanced' ? 'active' : ''}`}
                                onClick={() => setSelectedTab('enhanced')}
                            >
                                Enhanced
                            </button>
                        </div>

                        <div className="image-container">
                            {selectedTab === 'original' ? (
                                <div className="image-placeholder original">
                                    <span>📷</span>
                                    <p>Original Photo</p>
                                </div>
                            ) : (
                                <div className="image-placeholder enhanced">
                                    <span>✨</span>
                                    <p>Enhanced Photo</p>
                                </div>
                            )}
                        </div>

                        <div className="image-actions">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleDownload(selectedTab)}
                                disabled={isDownloading}
                            >
                                {isDownloading ? 'Downloading...' : `Download ${selectedTab}`}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={handleShare}
                                disabled={isSharing}
                            >
                                {isSharing ? 'Sharing...' : 'Share'}
                            </button>
                        </div>
                    </div>

                    <div className="result-details">
                        <div className="details-card">
                            <h3>Enhancement Details</h3>
                            <div className="detail-item">
                                <span className="detail-label">Style Applied:</span>
                                <span className="detail-value">{resultData.style}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Processing Time:</span>
                                <span className="detail-value">{resultData.processingTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Enhancements:</span>
                                <ul className="enhancement-list">
                                    {resultData.enhancements.map((enhancement, index) => (
                                        <li key={index}>{enhancement}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="action-card">
                            <h3>What's Next?</h3>
                            <div className="action-buttons">
                                <button
                                    className="btn btn-outline"
                                    onClick={handleEditStyle}
                                >
                                    Try Different Style
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={handleProcessAnother}
                                >
                                    Process Another Photo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="result-footer">
                    <div className="satisfaction-prompt">
                        <h4>How was your experience?</h4>
                        <div className="rating-buttons">
                            <button className="rating-btn">😞</button>
                            <button className="rating-btn">😐</button>
                            <button className="rating-btn">😊</button>
                            <button className="rating-btn">😍</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
