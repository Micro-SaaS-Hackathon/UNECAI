import React, { useState, useRef } from 'react';
import StylePicker from '../components/StylePicker';

function Upload() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: '',
    brandName: '',
    style: '',
    photo: null
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (file) => {
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
    setStep(3);
  };

  const handleStyleSelect = (styleId) => {
    setFormData(prev => ({
      ...prev,
      style: styleId
    }));
    handleSubmit();
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.productName || !formData.brandName) {
        alert('Please fill in all fields');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const uploadData = new FormData();
      uploadData.append('file', formData.photo);
      uploadData.append('productName', formData.productName);
      uploadData.append('brandName', formData.brandName);
      uploadData.append('style', formData.style);

      const response = await fetch('/api/enhance', {
        method: 'POST',
        body: uploadData
      });

      if (!response.ok) {
        throw new Error(`Enhancement failed: ${response.statusText}`);
      }

      const result = await response.json();
      setResult(result.data);
      setStep(4);
    } catch (error) {
      console.error('Enhancement error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Enhancing your photo...</p>
      </div>
    );
  }

  return (
    <section className="upload-section">
      <div className="container">
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Details</div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Upload</div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Style</div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>4. Result</div>
        </div>

        {step === 1 && (
          <div className="form-step">
            <h2>Product Details</h2>
            <div className="form-group">
              <label htmlFor="brandName">Brand Name</label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                value={formData.brandName}
                onChange={handleInputChange}
                placeholder="Enter brand name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>
            <button className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="upload-step">
            <h2>Upload Photo</h2>
            <div
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileSelect(file);
              }}
            >
              <div className="upload-content">
                <span className="upload-icon">📸</span>
                <p>Drag and drop your product photo here or click to browse</p>
                <p className="upload-info">Supports: JPG, PNG (Max 10MB)</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="style-step">
            <h2>Choose Style</h2>
            <StylePicker
              selectedStyle={formData.style}
              onStyleSelect={handleStyleSelect}
            />
          </div>
        )}

        {step === 4 && result && (
          <div className="result-step">
            <h2>Enhanced Photo</h2>
            <img
              src={result.imageUrl}
              alt="Enhanced product"
              className="result-image"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Upload;
