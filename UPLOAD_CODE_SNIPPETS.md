# UploadPhoto Component - Code Snippets

## Client-Side Upload Code

### React Component Upload Function
```javascript
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
```

### Vanilla JavaScript Upload Function
```javascript
async function uploadToServer() {
    const fileInput = document.getElementById('fileInput');
    const productName = document.getElementById('productName').value;
    const brandName = document.getElementById('brandName').value;
    
    if (!fileInput.files[0] || !productName || !brandName) {
        showError('Missing file or product information');
        return;
    }

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('brandName', brandName);
    formData.append('file', fileInput.files[0]);

    try {
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
        showError(error.message);
    }
}
```

## Server-Side Upload Endpoint

### Express.js Route Handler
```javascript
// POST /api/upload - Upload photo files with product metadata
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Extract product metadata from form data
        const { productName, brandName } = req.body;
        
        if (!productName || !brandName) {
            return res.status(400).json({
                success: false,
                message: 'Product name and brand name are required'
            });
        }

        // Generate unique job ID
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const fileInfo = {
            id: req.file.filename,
            jobId: jobId,
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            productName: productName,
            brandName: brandName,
            uploadedAt: new Date().toISOString()
        };

        // Create thumbnail URL (in production, generate actual thumbnail)
        const thumbnailUrl = `/api/thumbnail/${fileInfo.id}`;

        console.log('File uploaded successfully:', fileInfo);

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            job_id: jobId,
            thumbnail_url: thumbnailUrl,
            status: 'queued',
            data: {
                fileId: fileInfo.id,
                filename: fileInfo.filename,
                originalName: fileInfo.originalName,
                size: fileInfo.size,
                productName: fileInfo.productName,
                brandName: fileInfo.brandName,
                uploadedAt: fileInfo.uploadedAt
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
});
```

## Expected Server Response JSON

### Success Response (200 OK)
```json
{
    "success": true,
    "message": "File uploaded successfully",
    "job_id": "job_1703123456789_abc123def",
    "thumbnail_url": "/api/thumbnail/photo-1703123456789-123456789.jpg",
    "status": "queued",
    "data": {
        "fileId": "photo-1703123456789-123456789.jpg",
        "filename": "photo-1703123456789-123456789.jpg",
        "originalName": "product-photo.jpg",
        "size": 2048576,
        "productName": "Velvet Glow Serum",
        "brandName": "Luxe Beauty Co.",
        "uploadedAt": "2024-01-15T10:30:45.123Z"
    }
}
```

### Error Response (400 Bad Request)
```json
{
    "success": false,
    "message": "No file uploaded"
}
```

### Error Response (500 Internal Server Error)
```json
{
    "success": false,
    "message": "Upload failed",
    "error": "File processing error details"
}
```

## Client-Side Image Processing

### Image Resize Function
```javascript
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
```

### Image Compression Function
```javascript
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
```

## File Validation

### Client-Side Validation
```javascript
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
```

## Usage Example

### Complete Upload Flow
```javascript
// 1. User selects file
const handleFileSelect = async (file) => {
    try {
        validateFile(file);
        
        // Create preview (300px wide, low quality)
        const previewBlob = await resizeImage(file, 300, 0.6);
        const previewUrl = URL.createObjectURL(previewBlob);
        setPreviewImage(previewUrl);
        
        // Create compressed version for upload
        const compressedFile = await compressImage(file, 8);
        setOriginalImage(compressedFile);
        
    } catch (error) {
        setUploadError(error.message);
    }
};

// 2. User clicks upload
const handleUpload = async () => {
    const formData = new FormData();
    formData.append('productName', productMeta.productName);
    formData.append('brandName', productMeta.brandName);
    formData.append('file', originalImage, selectedFile.name);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    
    if (result.success) {
        // Store job info and navigate
        localStorage.setItem('glamgen:uploadJob', JSON.stringify({
            jobId: result.job_id,
            thumbnailUrl: result.thumbnail_url,
            status: result.status
        }));
        
        window.location.href = '/styles';
    }
};
```
