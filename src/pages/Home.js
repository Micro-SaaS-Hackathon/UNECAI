import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h2>Transform Your Photos with AI Magic</h2>
          <p>Upload your photos and watch them transform into stunning, professional-quality images with our advanced AI technology.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/upload')}>
              Start Enhancing
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/gallery')}>
              View Gallery
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            <span>📸</span>
            <p>Your enhanced photos will appear here</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;