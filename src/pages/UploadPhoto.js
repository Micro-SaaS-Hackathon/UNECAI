import React, { useState, useRef, useEffect } from 'react';
import './UploadPhoto.css';

const UploadPhoto = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [productMeta, setProductMeta] = useState(null);
    const fileInputRef = useRef(null);

    // Load product metadata from localStorage on component mount
    useEffect(() => {
        const savedMeta = localStorage.getItem('glamgen:productMeta');
        if (savedMeta) {
            setProductMeta(JSON.parse(savedMeta));
        }
    }, []);

    // Image processing utilities
    const resizeImage = (file, maxDimension, quality = 0.8) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                let { width, height } = img;
                
                // Calculate new dimensions
                if (width > height) {
                    if (width > maxDimension) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    const compressImage = (file, maxSizeMB = 8) => {
        return new Promise((resolve) => {
            if (file.size <= maxSizeMB * 1024 * 1024) {
                resolve(file);
                return;
            }
            
            // Compress the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                let { width, height } = img;
                const maxDimension = 2048; // Max dimension for compression
                
                if (width > height) {
                    if (width > maxDimension) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Try different quality levels to get under size limit
                let quality = 0.9;
                const tryCompress = () => {
                    canvas.toBlob((blob) => {
                        if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.1) {
                            resolve(blob);
                        } else {
                            quality -= 0.1;
                            tryCompress();
                        }
                    }, 'image/jpeg', quality);
                };
                
                tryCompress();
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 8 * 1024 * 1024; // 8MB
        
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Please select a valid image file (JPG, JPEG, or PNG)');
        }
        
        if (file.size > maxSize) {
            throw new Error('File size must be less than 8MB');
        }
        
        return true;
    };

    const handleFileSelect = async (file) => {
        try {
            setUploadError(null);
            validateFile(file);
            
            setSelectedFile(file);
            
            // Create preview image (300px wide, low quality)
            const previewBlob = await resizeImage(file, 300, 0.6);
            const previewUrl = URL.createObjectURL(previewBlob);
            setPreviewImage(previewUrl);
            
            // Create original/compressed image for upload
            const compressedFile = await compressImage(file, 8);
            setOriginalImage(compressedFile);
            
        } catch (error) {
            setUploadError(error.message);
            console.error('File processing error:', error);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const uploadToServer = async () => {
        if (!originalImage || !productMeta) {
            setUploadError('Missing file or product information');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('productName', productMeta.productName);
            formData.append('brandName', productMeta.brandName);
            formData.append('file', originalImage, selectedFile.name);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Upload successful:', result);
            
            // Store job ID for next step
            localStorage.setItem('glamgen:uploadJob', JSON.stringify({
                jobId: result.job_id,
                thumbnailUrl: result.thumbnail_url,
                status: result.status,
                uploadedAt: new Date().toISOString()
            }));

            // Navigate to styles page
            window.location.href = '/styles';
            
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveFile = () => {
        // Clean up blob URLs
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        
        setSelectedFile(null);
        setPreviewImage(null);
        setOriginalImage(null);
        setUploadError(null);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="upload-photo-page">
            <div className="container">
                <div className="upload-header">
                    <h1>Upload Your Product Photo</h1>
                    <p className="upload-description">
                        Upload or drag your product photo to get started with AI enhancement
                    </p>
                </div>

                <div className="upload-section">
                    {!selectedFile ? (
                        <div
                            className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="upload-content">
                                <div className="upload-icon">📸</div>
                                <h3>Upload or drag your product photo</h3>
                                <p>Click to browse or drag and drop your image here</p>
                                <div className="upload-specs">
                                    <span>JPG, JPEG, PNG • Max 8MB</span>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleFileInputChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    ) : (
                        <div className="preview-section">
                            <div className="preview-container">
                                <img 
                                    src={previewImage} 
                                    alt="Product preview" 
                                    className="preview-image" 
                                />
                                <button
                                    className="remove-button"
                                    onClick={handleRemoveFile}
                                    title="Remove file"
                                    aria-label="Remove uploaded file"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="file-info">
                                <h3>Selected File</h3>
                                <div className="file-details">
                                    <p><strong>Name:</strong> {selectedFile.name}</p>
                                    <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
                                    <p><strong>Type:</strong> {selectedFile.type}</p>
                                    <p><strong>Preview:</strong> 300px (optimized)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {uploadError && (
                        <div className="error-message" role="alert">
                            <span className="error-icon">⚠️</span>
                            {uploadError}
                        </div>
                    )}

                    <div className="upload-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={handleRemoveFile}
                            disabled={!selectedFile || isUploading}
                        >
                            Clear
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={uploadToServer}
                            disabled={!selectedFile || !productMeta || isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Next'}
                        </button>
                    </div>
                </div>

                <div className="upload-tips">
                    <h3>Tips for Best Results</h3>
                    <ul>
                        <li>Use high-resolution images (at least 1000x1000px)</li>
                        <li>Ensure good lighting and clear focus</li>
                        <li>Include the full product in the frame</li>
                        <li>Use a clean, uncluttered background</li>
                        <li>Avoid heavily edited or filtered images</li>
                    </ul>
                </div>

                {productMeta && (
                    <div className="product-info">
                        <h4>Product Information</h4>
                        <p><strong>Product:</strong> {productMeta.productName}</p>
                        <p><strong>Brand:</strong> {productMeta.brandName}</p>
                        {productMeta.shortTagline && (
                            <p><strong>Tagline:</strong> {productMeta.shortTagline}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadPhoto;
