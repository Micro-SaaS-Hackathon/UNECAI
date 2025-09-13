# Sellora

A modern AI-powered photo styling and glamour enhancement platform that transforms ordinary photos into stunning, professional-looking images.

## Features

- **Photo Upload**: Easy drag-and-drop photo upload interface
- **Style Selection**: Multiple glamour styles and filters to choose from
- **AI Processing**: Advanced AI algorithms for photo enhancement
- **Real-time Processing**: Live status updates during image processing
- **Result Gallery**: Beautiful display of enhanced photos
- **Product Integration**: Seamless integration with product showcase

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js with Express
- File Upload: Multer middleware
- Image Processing: Sharp or similar
- AI Integration: Ready for AI service integration

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Sellora
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm test` - Run tests

## Project Structure

```
Sellora/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Home.js
│   │   ├── ProductForm.js
│   │   ├── UploadPhoto.js
│   │   ├── StylePicker.js
│   │   ├── Processing.js
│   │   └── Result.js
│   └── styles/
│       └── main.css
├── api/
│   ├── upload.js
│   ├── process.js
│   └── status.js
├── uploads/
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

- `POST /api/upload` - Upload photo files
- `POST /api/process` - Process uploaded photos with selected style
- `GET /api/status/:id` - Check processing status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
