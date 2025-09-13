import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Welcome to Sellora</h1>
                        <p className="hero-subtitle">
                            Transform your photos with AI-powered enhancement technology
                        </p>
                        <div className="hero-features">
                            <div className="feature">
                                <span className="feature-icon">✨</span>
                                <h3>AI Enhancement</h3>
                                <p>Advanced algorithms for stunning results</p>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">🎨</span>
                                <h3>Multiple Styles</h3>
                                <p>Choose from various glamour styles</p>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">⚡</span>
                                <h3>Fast Processing</h3>
                                <p>Quick turnaround times</p>
                            </div>
                        </div>
                        <button className="cta-button" onClick={() => window.location.href = '/upload'}>
                            Get Started
                        </button>
                    </div>
                    <div className="hero-image">
                        <div className="image-placeholder">
                            <span>📸</span>
                            <p>Your enhanced photos will appear here</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <div className="container">
                    <h2>How It Works</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Upload Photo</h3>
                            <p>Select or drag and drop your photo</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Choose Style</h3>
                            <p>Pick from our collection of glamour styles</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>AI Processing</h3>
                            <p>Our AI enhances your photo automatically</p>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <h3>Download Result</h3>
                            <p>Get your enhanced photo instantly</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
