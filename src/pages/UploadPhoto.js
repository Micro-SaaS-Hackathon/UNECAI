import React, { useState, useRef } from 'react';
import './UploadPhoto.css';

const UploadPhoto = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
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
        handleFileSelect(file);
    };

    const handleUpload = () => {
        if (selectedFile) {
            // TODO: Implement actual upload logic
            console.log('Uploading file:', selectedFile.name);
            alert('File upload functionality will be implemented!');
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="upload-photo-page">
            <div className="container">
                <h1>Upload Your Photo</h1>
                <p className="page-description">
                    Select a photo to enhance with our AI technology
                </p>

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
                                <div className="upload-icon">📁</div>
                                <h3>Drop your photo here</h3>
                                <p>or click to browse files</p>
                                <div className="supported-formats">
                                    <span>Supported: JPG, PNG, WEBP</span>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileInputChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    ) : (
                        <div className="preview-section">
                            <div className="preview-container">
                                <img src={preview} alt="Preview" className="preview-image" />
                                <button
                                    className="remove-button"
                                    onClick={handleRemoveFile}
                                    title="Remove file"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="file-info">
                                <h3>Selected File</h3>
                                <p><strong>Name:</strong> {selectedFile.name}</p>
                                <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                <p><strong>Type:</strong> {selectedFile.type}</p>
                            </div>
                        </div>
                    )}

                    <div className="upload-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={handleRemoveFile}
                            disabled={!selectedFile}
                        >
                            Clear
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleUpload}
                            disabled={!selectedFile}
                        >
                            Upload & Continue
                        </button>
                    </div>
                </div>

                <div className="upload-tips">
                    <h3>Tips for Best Results</h3>
                    <ul>
                        <li>Use high-resolution images (at least 1000x1000px)</li>
                        <li>Ensure good lighting in your photos</li>
                        <li>Clear, well-focused images work best</li>
                        <li>Avoid heavily edited or filtered images</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UploadPhoto;
