import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <div className="logo">
              <h1>✨ Sellora</h1>
              <p>AI-Powered Photo Enhancement</p>
            </div>
            <nav className="nav">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/upload" className="nav-link">Upload</Link>
              <Link to="/gallery" className="nav-link">Gallery</Link>
            </nav>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 Sellora. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h2>Transform Your Photos with AI Magic</h2>
          <p>Upload your photos and watch them transform into stunning, professional-quality images with our advanced AI technology.</p>
          <div className="cta-buttons">
            <Link to="/upload" className="btn btn-primary">Start Enhancing</Link>
            <Link to="/gallery" className="btn btn-secondary">View Gallery</Link>
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

function Upload() {
  return (
    <section className="upload-section">
      <div className="container">
        <h2>Upload Your Photo</h2>
        <p>Coming soon...</p>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="gallery-section">
      <div className="container">
        <h2>Gallery</h2>
        <p>Coming soon...</p>
      </div>
    </section>
  );
}

export default App;