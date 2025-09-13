import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
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
  );
}

export default Header;
