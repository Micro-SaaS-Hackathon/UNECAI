const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Serve static files from the src directory
app.use('/src', express.static('src'));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/enhance', require('./api/enhance'));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Set port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`
    🚀 Sellora server is running!
    
    Local: http://localhost:${PORT}
    
    Ready to enhance your product photos...
    `);
});