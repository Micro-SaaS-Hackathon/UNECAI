import React, { useState } from 'react';
import './StylePicker.css';

const StylePicker = () => {
    const [selectedStyle, setSelectedStyle] = useState(null);

    const styles = [
        {
            id: 'elegant',
            name: 'Elegant',
            description: 'Sophisticated and refined enhancement',
            preview: '👑',
            features: ['Smooth skin', 'Enhanced eyes', 'Subtle makeup', 'Professional look']
        },
        {
            id: 'glamorous',
            name: 'Glamorous',
            description: 'Bold and dramatic styling',
            preview: '✨',
            features: ['Bold makeup', 'Enhanced features', 'Dramatic lighting', 'Red carpet ready']
        },
        {
            id: 'natural',
            name: 'Natural',
            description: 'Subtle and authentic enhancement',
            preview: '🌿',
            features: ['Minimal editing', 'Natural colors', 'Authentic look', 'Soft enhancement']
        },
        {
            id: 'vintage',
            name: 'Vintage',
            description: 'Classic retro styling',
            preview: '📸',
            features: ['Retro colors', 'Classic poses', 'Nostalgic feel', 'Timeless beauty']
        },
        {
            id: 'artistic',
            name: 'Artistic',
            description: 'Creative and unique effects',
            preview: '🎨',
            features: ['Creative filters', 'Unique effects', 'Artistic interpretation', 'Creative freedom']
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Business and corporate ready',
            preview: '💼',
            features: ['Clean look', 'Professional attire', 'Corporate style', 'Business ready']
        }
    ];

    const handleStyleSelect = (styleId) => {
        setSelectedStyle(styleId);
    };

    const handleContinue = () => {
        if (selectedStyle) {
            console.log('Selected style:', selectedStyle);
            // TODO: Navigate to processing page
            alert(`Style "${selectedStyle}" selected! Processing will begin...`);
        }
    };

    return (
        <div className="style-picker-page">
            <div className="container">
                <h1>Choose Your Style</h1>
                <p className="page-description">
                    Select the enhancement style that best fits your vision
                </p>

                <div className="styles-grid">
                    {styles.map((style) => (
                        <div
                            key={style.id}
                            className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
                            onClick={() => handleStyleSelect(style.id)}
                        >
                            <div className="style-preview">
                                <span className="preview-icon">{style.preview}</span>
                            </div>
                            <div className="style-content">
                                <h3>{style.name}</h3>
                                <p className="style-description">{style.description}</p>
                                <ul className="style-features">
                                    {style.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="selection-indicator">
                                {selectedStyle === style.id && <span>✓</span>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="style-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => window.history.back()}
                    >
                        Back
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleContinue}
                        disabled={!selectedStyle}
                    >
                        Continue with {selectedStyle || 'Style'}
                    </button>
                </div>

                {selectedStyle && (
                    <div className="selected-style-info">
                        <h3>Selected Style: {styles.find(s => s.id === selectedStyle)?.name}</h3>
                        <p>{styles.find(s => s.id === selectedStyle)?.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StylePicker;
