import React, { useState, useEffect, useRef } from 'react';
import './StylePicker.css';

const StylePicker = () => {
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [strength, setStrength] = useState(50);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [customParams, setCustomParams] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadJob, setUploadJob] = useState(null);
    const [productMeta, setProductMeta] = useState(null);
    const canvasRef = useRef(null);

    // Style presets with JSON parameters
    const stylePresets = {
        'Delicate': {
            contrast: -20,
            saturation: -15,
            sharpen: 0.3,
            skinSoftness: 0.8,
            crop: 'auto',
            retouchStrength: 0.6
        },
        'Minimalist': {
            contrast: -30,
            saturation: -25,
            sharpen: 0.2,
            skinSoftness: 0.9,
            crop: 'auto',
            retouchStrength: 0.4
        },
        'Maximalist': {
            contrast: 40,
            saturation: 35,
            sharpen: 0.7,
            skinSoftness: 0.3,
            crop: 'auto',
            retouchStrength: 0.9
        },
        'Editorial': {
            contrast: 25,
            saturation: 20,
            sharpen: 0.8,
            skinSoftness: 0.5,
            crop: 'portrait',
            retouchStrength: 0.7
        },
        'Glossy': {
            contrast: 15,
            saturation: 30,
            sharpen: 0.6,
            skinSoftness: 0.4,
            crop: 'auto',
            retouchStrength: 0.8
        },
        'Natural': {
            contrast: -10,
            saturation: -5,
            sharpen: 0.4,
            skinSoftness: 0.7,
            crop: 'auto',
            retouchStrength: 0.5
        },
        'Cinematic': {
            contrast: 35,
            saturation: 15,
            sharpen: 0.9,
            skinSoftness: 0.6,
            crop: 'auto',
            retouchStrength: 0.8
        },
        'Studio Flatlay': {
            contrast: 20,
            saturation: 25,
            sharpen: 0.5,
            skinSoftness: 0.2,
            crop: 'square',
            retouchStrength: 0.6
        },
        'High Detail': {
            contrast: 30,
            saturation: 20,
            sharpen: 1.0,
            skinSoftness: 0.1,
            crop: 'auto',
            retouchStrength: 0.9
        },
        'Soft Light': {
            contrast: -25,
            saturation: -20,
            sharpen: 0.2,
            skinSoftness: 0.9,
            crop: 'auto',
            retouchStrength: 0.3
        }
    };

    const styles = [
        { id: 'Delicate', name: 'Delicate', description: 'Soft, gentle enhancement', preview: '🌸' },
        { id: 'Minimalist', name: 'Minimalist', description: 'Clean, understated look', preview: '⚪' },
        { id: 'Maximalist', name: 'Maximalist', description: 'Bold, dramatic styling', preview: '🎭' },
        { id: 'Editorial', name: 'Editorial', description: 'High-fashion magazine style', preview: '📰' },
        { id: 'Glossy', name: 'Glossy', description: 'Shiny, polished finish', preview: '✨' },
        { id: 'Natural', name: 'Natural', description: 'Authentic, unprocessed look', preview: '🌿' },
        { id: 'Cinematic', name: 'Cinematic', description: 'Movie-quality dramatic effect', preview: '🎬' },
        { id: 'Studio Flatlay', name: 'Studio Flatlay', description: 'Professional product photography', preview: '📐' },
        { id: 'High Detail', name: 'High Detail', description: 'Sharp, detailed enhancement', preview: '🔍' },
        { id: 'Soft Light', name: 'Soft Light', description: 'Gentle, diffused lighting', preview: '💡' }
    ];

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedJob = localStorage.getItem('glamgen:uploadJob');
        const savedMeta = localStorage.getItem('glamgen:productMeta');
        
        if (savedJob) {
            setUploadJob(JSON.parse(savedJob));
        }
        if (savedMeta) {
            setProductMeta(JSON.parse(savedMeta));
        }
    }, []);

    // Initialize custom params when style is selected
    useEffect(() => {
        if (selectedStyle && stylePresets[selectedStyle]) {
            setCustomParams(stylePresets[selectedStyle]);
        }
    }, [selectedStyle]);

    // Apply preview filter to image
    const applyPreviewFilter = (imageUrl, styleParams, strengthValue) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Draw original image
                ctx.drawImage(img, 0, 0);
                
                // Apply filters based on style parameters
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Apply contrast
                const contrastFactor = (styleParams.contrast + 100) / 100;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.max(0, Math.min(255, (data[i] - 128) * contrastFactor + 128));
                    data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] - 128) * contrastFactor + 128));
                    data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] - 128) * contrastFactor + 128));
                }
                
                // Apply saturation
                const saturationFactor = (styleParams.saturation + 100) / 100;
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    data[i] = Math.max(0, Math.min(255, gray + (data[i] - gray) * saturationFactor));
                    data[i + 1] = Math.max(0, Math.min(255, gray + (data[i + 1] - gray) * saturationFactor));
                    data[i + 2] = Math.max(0, Math.min(255, gray + (data[i + 2] - gray) * saturationFactor));
                }
                
                // Apply strength multiplier
                const strengthMultiplier = strengthValue / 100;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.max(0, Math.min(255, data[i] * strengthMultiplier + 128 * (1 - strengthMultiplier)));
                    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * strengthMultiplier + 128 * (1 - strengthMultiplier)));
                    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * strengthMultiplier + 128 * (1 - strengthMultiplier)));
                }
                
                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL());
            };
            
            img.src = imageUrl;
        });
    };

    const handleStyleSelect = async (styleId) => {
        setSelectedStyle(styleId);
        
        // Apply preview filter if we have an image
        if (uploadJob?.thumbnailUrl) {
            try {
                const filteredImage = await applyPreviewFilter(
                    uploadJob.thumbnailUrl, 
                    stylePresets[styleId], 
                    strength
                );
                setPreviewImage(filteredImage);
            } catch (error) {
                console.error('Preview filter error:', error);
            }
        }
    };

    const handleStrengthChange = async (value) => {
        setStrength(value);
        
        // Update preview if style is selected
        if (selectedStyle && uploadJob?.thumbnailUrl) {
            try {
                const filteredImage = await applyPreviewFilter(
                    uploadJob.thumbnailUrl, 
                    stylePresets[selectedStyle], 
                    value
                );
                setPreviewImage(filteredImage);
            } catch (error) {
                console.error('Preview filter error:', error);
            }
        }
    };

    const handleCustomParamChange = (param, value) => {
        setCustomParams(prev => ({
            ...prev,
            [param]: value
        }));
    };

    const handleConfirm = async () => {
        if (!selectedStyle || !uploadJob || !productMeta) {
            alert('Missing required information');
            return;
        }

        setIsProcessing(true);

        try {
            const payload = {
                job_id: uploadJob.jobId,
                productName: productMeta.productName,
                brandName: productMeta.brandName,
                style: selectedStyle,
                styleParams: {
                    ...customParams,
                    retouchStrength: customParams.retouchStrength * (strength / 100)
                },
                originalFileReference: uploadJob.jobId
            };

            const response = await fetch('/api/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Processing failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Processing started:', result);
            
            // Store processing job info
            localStorage.setItem('glamgen:processingJob', JSON.stringify({
                jobId: result.jobId,
                style: selectedStyle,
                status: result.status,
                startedAt: new Date().toISOString()
            }));

            // Navigate to processing page
            window.location.href = '/processing';
            
        } catch (error) {
            console.error('Processing error:', error);
            alert('Failed to start processing. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="style-picker-page">
            <div className="container">
                <div className="style-header">
                    <h1>Choose Your Style</h1>
                    <p className="style-description">
                        Select the enhancement style that best fits your vision
                    </p>
                </div>

                {/* Preview Section */}
                {uploadJob?.thumbnailUrl && (
                    <div className="preview-section">
                        <h3>Preview</h3>
                        <div className="preview-container">
                            <div className="preview-image">
                                <img 
                                    src={previewImage || uploadJob.thumbnailUrl} 
                                    alt="Style preview" 
                                    className="preview-img"
                                />
                            </div>
                            <div className="preview-info">
                                <p><strong>Style:</strong> {selectedStyle || 'None selected'}</p>
                                <p><strong>Strength:</strong> {strength}%</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Style Chips */}
                <div className="styles-section">
                    <h3>Style Presets</h3>
                    <div className="styles-grid">
                        {styles.map((style) => (
                            <div
                                key={style.id}
                                className={`style-chip ${selectedStyle === style.id ? 'selected' : ''}`}
                                onClick={() => handleStyleSelect(style.id)}
                            >
                                <span className="style-icon">{style.preview}</span>
                                <span className="style-name">{style.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Strength Slider */}
                {selectedStyle && (
                    <div className="strength-section">
                        <h3>Enhancement Strength</h3>
                        <div className="slider-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={strength}
                                onChange={(e) => handleStrengthChange(parseInt(e.target.value))}
                                className="strength-slider"
                            />
                            <div className="slider-labels">
                                <span>Subtle</span>
                                <span className="strength-value">{strength}%</span>
                                <span>Intense</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Advanced Options */}
                <div className="advanced-section">
                    <button
                        className="advanced-toggle"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        {showAdvanced ? '▼' : '▶'} Advanced Options
                    </button>
                    
                    {showAdvanced && selectedStyle && (
                        <div className="advanced-controls">
                            <h4>Fine-tune Parameters</h4>
                            <div className="param-grid">
                                <div className="param-group">
                                    <label>Contrast: {customParams.contrast || 0}</label>
                                    <input
                                        type="range"
                                        min="-100"
                                        max="100"
                                        value={customParams.contrast || 0}
                                        onChange={(e) => handleCustomParamChange('contrast', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="param-group">
                                    <label>Saturation: {customParams.saturation || 0}</label>
                                    <input
                                        type="range"
                                        min="-100"
                                        max="100"
                                        value={customParams.saturation || 0}
                                        onChange={(e) => handleCustomParamChange('saturation', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="param-group">
                                    <label>Sharpen: {(customParams.sharpen || 0).toFixed(1)}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={customParams.sharpen || 0}
                                        onChange={(e) => handleCustomParamChange('sharpen', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="param-group">
                                    <label>Skin Softness: {(customParams.skinSoftness || 0).toFixed(1)}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={customParams.skinSoftness || 0}
                                        onChange={(e) => handleCustomParamChange('skinSoftness', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="param-group">
                                    <label>Crop</label>
                                    <select
                                        value={customParams.crop || 'auto'}
                                        onChange={(e) => handleCustomParamChange('crop', e.target.value)}
                                    >
                                        <option value="auto">Auto</option>
                                        <option value="square">Square</option>
                                        <option value="portrait">Portrait</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="style-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => window.history.back()}
                    >
                        Back
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        disabled={!selectedStyle || isProcessing}
                    >
                        {isProcessing ? 'Processing...' : `Confirm ${selectedStyle || 'Style'}`}
                    </button>
                </div>

                {/* Hidden canvas for image processing */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
        </div>
    );
};

export default StylePicker;
