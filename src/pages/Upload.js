import React, { useState, useRef } from 'react';

// Function to convert File to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data:image/xxx;base64, prefix
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

const STYLES = [
  { id: 'minimal', name: 'Minimal', description: 'Clean, simple, and modern aesthetic' },
  { id: 'maximalist', name: 'Maximalist', description: 'Bold, vibrant, and expressive design' },
  { id: 'luxury', name: 'Luxury', description: 'Elegant, premium, and sophisticated look' },
  { id: 'delicate', name: 'Delicate', description: 'Soft, gentle, and refined appearance' },
  { id: 'vintage', name: 'Vintage', description: 'Classic, nostalgic, timeless feel' },
  { id: 'futuristic', name: 'Futuristic', description: 'Modern, innovative, cutting-edge style' },
  { id: 'natural', name: 'Natural', description: 'Organic, earthy, authentic presentation' },
  { id: 'artistic', name: 'Artistic', description: 'Creative, unique, expressive interpretation' }
];

function Upload() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brandName: '',
    productName: '',
    description: '',
    photo: null,
    style: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
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
  };

  const handleStyleSelect = (styleId) => {
    setFormData(prev => ({
      ...prev,
      style: styleId
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.brandName || !formData.productName) {
        alert('Please fill in the required fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.photo) {
        alert('Please upload a photo');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleGenerate = async () => {
    if (!formData.style) {
      alert('Please select a style');
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage('Preparing image...');

      // Convert image to base64
      console.log('Converting image to base64...');
      const base64Image = await fileToBase64(formData.photo);
      console.log('Image converted successfully, length:', base64Image.length);

      // Prepare request data
      const requestData = {
        image: base64Image,
        style: formData.style,
        productName: formData.productName,
        brandName: formData.brandName,
        description: formData.description || ''
      };

      console.log('Sending request to API...', {
        url: 'https://7dblgaas.rpcld.co/webhook/genfoto12',
        style: requestData.style,
        productName: requestData.productName,
        brandName: requestData.brandName
      });

      setLoadingMessage('Enhancing photo...');

      const response = await fetch('https://7dblgaas.rpcld.co/webhook/genfoto12', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Enhancement failed: ${response.statusText}`);
      }

      const apiResponse = await response.json();
      console.log('API Response:', apiResponse);

      // If we received a base64 image back, convert it for display
      const displayImage = apiResponse.image 
        ? `data:image/jpeg;base64,${apiResponse.image}`
        : URL.createObjectURL(formData.photo);

      setResult({
        enhancedImage: displayImage,
        originalImage: URL.createObjectURL(formData.photo),
        apiResponse,
        requestData: {
          style: formData.style,
          productName: formData.productName,
          brandName: formData.brandName,
          description: formData.description
        }
      });

      setStep(4);
    } catch (error) {
      console.error('Error details:', error);
      alert(`Enhancement failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>{loadingMessage}</p>
        <p className="loading-subtext">This may take 2-3 minutes</p>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="container">
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-text">Details</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-text">Upload</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-text">Style</div>
          </div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-text">Result</div>
          </div>
        </div>

        <div className="step-content">
          {step === 1 && (
            <div className="form-step">
              <h2>Product Details</h2>
              <div className="form-group">
                <label htmlFor="brandName">Brand Name *</label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  placeholder="Enter your brand name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="productName">Product Name *</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter your product name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add any additional details about your product"
                  rows="3"
                />
              </div>
              <div className="step-buttons">
                <button className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="upload-step">
              <h2>Upload Photo</h2>
              <div
                className={`upload-area ${formData.photo ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileSelect(file);
                }}
              >
                {formData.photo ? (
                  <div className="file-preview">
                    <img
                      src={URL.createObjectURL(formData.photo)}
                      alt="Preview"
                    />
                    <p>{formData.photo.name}</p>
                  </div>
                ) : (
                  <div className="upload-content">
                    <span className="upload-icon">📸</span>
                    <p>Drag and drop your photo here or click to browse</p>
                    <p className="upload-info">Supports: JPG, PNG (Max 10MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
              <div className="step-buttons">
                <button className="btn btn-secondary" onClick={handleBack}>
                  Back
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleNext}
                  disabled={!formData.photo}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="style-step">
              <h2>Choose Style</h2>
              <div className="style-grid">
                {STYLES.map(style => (
                  <div
                    key={style.id}
                    className={`style-card ${formData.style === style.id ? 'selected' : ''}`}
                    onClick={() => handleStyleSelect(style.id)}
                  >
                    <h4>{style.name}</h4>
                    <p>{style.description}</p>
                  </div>
                ))}
              </div>
              <div className="step-buttons">
                <button className="btn btn-secondary" onClick={handleBack}>
                  Back
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleGenerate}
                  disabled={!formData.style}
                >
                  Generate
                </button>
              </div>
            </div>
          )}

          {step === 4 && result && (
            <div className="result-step">
              <h2>Enhanced Result</h2>
              <div className="result-content">
                <div className="image-comparison">
                  <div className="original-image">
                    <h3>Original</h3>
                    <img src={result.originalImage} alt="Original" />
                  </div>
                  <div className="enhanced-image">
                    <h3>Enhanced</h3>
                    <img src={result.enhancedImage} alt="Enhanced" />
                  </div>
                </div>
                <div className="result-details">
                  <h3>{formData.productName}</h3>
                  <p className="brand">{formData.brandName}</p>
                  {formData.description && (
                    <p className="description">{formData.description}</p>
                  )}
                  <p className="style">Style: {STYLES.find(s => s.id === formData.style)?.name}</p>
                </div>
              </div>
              <div className="step-buttons">
                <button className="btn btn-primary" onClick={() => setStep(1)}>
                  Enhance Another Photo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;