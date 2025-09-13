const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Function to convert file to base64
function fileToBase64(filePath) {
  try {
    const fileData = fs.readFileSync(filePath);
    return fileData.toString('base64');
  } catch (error) {
    console.error('Error converting file to base64:', error);
    throw error;
  }
}

// POST /api/enhance - Enhance photo with selected style
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { productName, brandName, style, description } = req.body;

    if (!productName || !brandName || !style) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Convert image to base64
    const base64Image = fileToBase64(req.file.path);
    console.log('Image converted to base64, length:', base64Image.length);

    // API endpoint
    const apiUrl = new URL('https://7dblgaas.rpcld.co/webhook/genfoto12');
    console.log('Sending request to:', apiUrl.toString());

    // Prepare request data
    const requestBody = {
      image_data: base64Image,
      style_name: style,
      product_info: {
        name: productName,
        brand: brandName,
        description: description || ''
      }
    };

    // Send request to API
    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const apiResponse = await response.json();
    console.log('API Response:', apiResponse);

    // Return response to client
    res.status(200).json({
      success: true,
      message: 'Image processed successfully',
      data: {
        originalImage: `data:${req.file.mimetype};base64,${base64Image}`,
        apiResponse,
        requestData: {
          style,
          productName,
          brandName,
          description
        }
      }
    });

  } catch (error) {
    console.error('Enhancement error:', error);
    res.status(500).json({
      success: false,
      message: 'Enhancement failed',
      error: error.message
    });
  }
});

module.exports = router;