import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import Upload from './pages/Upload';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <Link to="/" className="logo">
              <h1>✨ Sellora</h1>
              <p>AI-Powered Photo Enhancement</p>
            </Link>
            <nav className="nav">
              <NavLink to="/" className="nav-link" end>Home</NavLink>
              <NavLink to="/upload" className="nav-link">Upload</NavLink>
              <NavLink to="/gallery" className="nav-link">Gallery</NavLink>
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
          <p>
            Upload your photos and watch them transform into stunning,
            professional-quality images with our advanced AI technology.
          </p>
          <div className="cta-buttons">
            <Link to="/upload" className="btn btn-primary">
              Start Enhancing
            </Link>
            <Link to="/gallery" className="btn btn-secondary">
              View Gallery
            </Link>
          </div>
        </div>
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