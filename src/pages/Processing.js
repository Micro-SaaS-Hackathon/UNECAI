import React, { useState, useEffect } from 'react';
import './Processing.css';

const Processing = () => {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const processingSteps = [
        { id: 1, name: 'Uploading Image', description: 'Preparing your photo for processing' },
        { id: 2, name: 'Analyzing Image', description: 'AI is analyzing facial features and composition' },
        { id: 3, name: 'Applying Style', description: 'Enhancing your photo with selected style' },
        { id: 4, name: 'Fine-tuning', description: 'Making final adjustments for perfect results' },
        { id: 5, name: 'Generating Result', description: 'Creating your enhanced photo' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setIsComplete(true);
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                const nextStep = Math.floor((progress / 100) * processingSteps.length);
                return Math.min(nextStep, processingSteps.length - 1);
            });
        }, 200);

        return () => clearInterval(stepInterval);
    }, [progress, processingSteps.length]);

    const handleViewResult = () => {
        // TODO: Navigate to result page
        console.log('Navigate to result page');
        alert('Result page will be implemented!');
    };

    const handleProcessAnother = () => {
        // TODO: Navigate back to upload page
        console.log('Process another photo');
        window.location.href = '/upload';
    };

    return (
        <div className="processing-page">
            <div className="container">
                <div className="processing-content">
                    <div className="processing-header">
                        <h1>Enhancing Your Photo</h1>
                        <p className="processing-subtitle">
                            Our AI is working its magic on your image
                        </p>
                    </div>

                    <div className="progress-section">
                        <div className="progress-circle">
                            <div className="progress-ring">
                                <svg className="progress-ring-svg" width="200" height="200">
                                    <circle
                                        className="progress-ring-circle"
                                        stroke="#667eea"
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
                                </div>
                            </div>
                        </div>

                        <div className="processing-steps">
                            {processingSteps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={`processing-step ${
                                        index <= currentStep ? 'active' : ''
                                    } ${index < currentStep ? 'completed' : ''}`}
                                >
                                    <div className="step-indicator">
                                        {index < currentStep ? (
                                            <span className="checkmark">✓</span>
                                        ) : (
                                            <span className="step-number">{step.id}</span>
                                        )}
                                    </div>
                                    <div className="step-content">
                                        <h4>{step.name}</h4>
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isComplete ? (
                        <div className="completion-section">
                            <div className="success-animation">
                                <span className="success-icon">✨</span>
                            </div>
                            <h2>Enhancement Complete!</h2>
                            <p>Your photo has been successfully enhanced and is ready to view.</p>
                            <div className="completion-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleViewResult}
                                >
                                    View Result
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleProcessAnother}
                                >
                                    Process Another Photo
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="processing-info">
                            <p className="processing-tip">
                                💡 <strong>Tip:</strong> Processing typically takes 30-60 seconds depending on image complexity.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Processing;
