# Result Page - API Examples & Documentation

## 1. GET /api/result/:jobId - Load Result Data

### Request
```javascript
const response = await fetch(`/api/result/${jobId}`);
```

### Response (200 OK)
```json
{
    "success": true,
    "jobId": "job_1703123456789_abc123def",
    "productName": "Velvet Glow Serum",
    "brandName": "Luxe Beauty Co.",
    "style": "Minimalist",
    "intensity": 50,
    "crop": "auto",
    "originalUrl": "/api/images/original-1703123456789.jpg",
    "enhancedUrl": "/api/images/enhanced-1703123456789.jpg",
    "previewUrl": "/api/images/preview-1703123456789.jpg",
    "changelog": [
        "Color balance adjusted to +10",
        "Saturation enhanced by +5",
        "Skin smoothing applied at 0.3",
        "Contrast optimized to -15",
        "Sharpness increased to 0.8"
    ],
    "metadata": {
        "dimensions": "2048x2048",
        "format": "JPEG",
        "size": "2.4MB"
    }
}
```

### Response - Not Found (404)
```json
{
    "success": false,
    "message": "Result not found",
    "error": "Job ID does not exist"
}
```

## 2. POST /api/regenerate - Regenerate with New Parameters

### Request
```javascript
const payload = {
    "job_id": "job_1703123456789_abc123def",
    "strength": 75,
    "crop": "square"
};

const response = await fetch('/api/regenerate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
});
```

### Response (200 OK)
```json
{
    "success": true,
    "job_id": "job_1703123456789_abc123def",
    "result_url": "/api/images/enhanced-1703123456789-v2.jpg",
    "changelog": [
        "Enhancement strength increased to 75%",
        "Color balance adjusted to +15",
        "Saturation enhanced by +8",
        "Skin smoothing applied at 0.45",
        "Image cropped to square format"
    ]
}
```

### Response - Error (400 Bad Request)
```json
{
    "success": false,
    "message": "Invalid parameters",
    "error": "Strength must be between 0 and 100"
}
```

## 3. GET /api/download/:jobId - Download Result

### Request
```javascript
// Regular download
const response = await fetch(`/api/download/${jobId}`);

// Instagram-ready version
const response = await fetch(`/api/download/${jobId}?format=instagram`);
```

### Response Headers
```
Content-Type: image/jpeg
Content-Disposition: attachment; filename="enhanced-photo.jpg"
Content-Length: 2457600
```

### Error Response (402 Payment Required)
```json
{
    "success": false,
    "message": "Purchase required",
    "pricing": {
        "single": {
            "price": 2.99,
            "credits": 1
        },
        "bundle": {
            "price": 9.99,
            "credits": 10
        }
    }
}
```

## 4. POST /api/save - Save to User Account

### Request
```javascript
const payload = {
    "jobId": "job_1703123456789_abc123def",
    "name": "Product Photo 1",
    "style": "Minimalist"
};

const response = await fetch('/api/save', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
});
```

### Response (200 OK)
```json
{
    "success": true,
    "message": "Result saved to account",
    "savedId": "saved_1703123456789",
    "url": "/account/saved/1703123456789"
}
```

### Response - Unauthorized (401)
```json
{
    "success": false,
    "message": "Authentication required",
    "loginUrl": "/login"
}
```

## 5. GET /api/user/status - Check User Status

### Request
```javascript
const response = await fetch('/api/user/status');
```

### Response - Logged In (200 OK)
```json
{
    "success": true,
    "isLoggedIn": true,
    "user": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com",
        "credits": 5,
        "hasCredits": true,
        "subscription": {
            "plan": "pro",
            "status": "active"
        }
    }
}
```

### Response - Not Logged In (200 OK)
```json
{
    "success": true,
    "isLoggedIn": false,
    "hasCredits": false
}
```

## 6. Share Endpoints

### GET /share/:jobId - Public Share URL
```javascript
// Returns preview version with watermark for non-owners
const response = await fetch(`/share/${jobId}`);
```

### Response (200 OK)
```json
{
    "success": true,
    "jobId": "job_1703123456789_abc123def",
    "previewUrl": "/api/images/preview-1703123456789.jpg",
    "watermarked": true,
    "shareInfo": {
        "views": 45,
        "sharedBy": "John D.",
        "sharedAt": "2024-01-15T10:30:45.123Z"
    }
}
```

## 7. Changelog Format

The changelog array contains human-readable descriptions of the enhancements applied:

```javascript
const changelog = [
    "Color balance adjusted to +10",      // Format: "Parameter adjusted to value"
    "Saturation enhanced by +5",          // Format: "Parameter enhanced by value"
    "Skin smoothing applied at 0.3",      // Format: "Parameter applied at value"
    "Contrast optimized to -15",          // Format: "Parameter optimized to value"
    "Sharpness increased to 0.8",         // Format: "Parameter increased to value"
    "Image cropped to square format",      // Format: "Action description"
    "Enhancement strength set to 75%"      // Format: "Parameter set to value"
];
```

## 8. Error Handling

### Rate Limiting
```json
{
    "success": false,
    "message": "Too many regeneration requests",
    "retryAfter": 60,
    "error": "RATE_LIMIT_EXCEEDED"
}
```

### Processing Error
```json
{
    "success": false,
    "message": "Failed to process image",
    "error": "PROCESSING_ERROR",
    "details": "Invalid image format or corrupted file"
}
```

### Storage Error
```json
{
    "success": false,
    "message": "Failed to save result",
    "error": "STORAGE_ERROR",
    "details": "Insufficient storage space"
}
```

## 9. Best Practices

### Regeneration
1. **Debounce Requests**: Wait 500ms after slider changes before sending request
2. **Show Loading State**: Display regenerating indicator during processing
3. **Cache Results**: Store previous results to show while new ones process
4. **Handle Errors**: Show user-friendly error messages and retry options

### Downloads
1. **Check Credits**: Verify user has credits before initiating download
2. **Format Options**: Provide different format options (original, Instagram)
3. **Progress Indicator**: Show download progress for large files
4. **Error Recovery**: Provide retry mechanism for failed downloads

### Sharing
1. **Preview First**: Generate preview before sharing
2. **Platform Specific**: Optimize format for each platform (Instagram, email)
3. **Track Analytics**: Monitor share metrics for feature improvement
4. **Privacy Control**: Allow users to revoke shared links

## 10. Implementation Example

### Complete Regeneration Flow
```javascript
// Debounced regeneration handler
const debouncedRegenerate = debounce(async (value) => {
    setIsRegenerating(true);
    try {
        const response = await fetch('/api/regenerate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                job_id: jobId,
                strength: value,
                crop: selectedCrop
            })
        });

        if (!response.ok) {
            throw new Error('Regeneration failed');
        }

        const data = await response.json();
        
        // Update UI with new result
        setResultData(prev => ({
            ...prev,
            enhancedUrl: data.result_url,
            changelog: data.changelog
        }));
        
    } catch (error) {
        console.error('Regeneration error:', error);
        showError('Failed to regenerate. Please try again.');
    } finally {
        setIsRegenerating(false);
    }
}, 500);

// Usage
function handleStrengthChange(value) {
    setStrength(value);
    debouncedRegenerate(value);
}
```
