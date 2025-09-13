# Sellora 🌟

Sellora is an AI-powered product photo enhancement platform that transforms ordinary product photos into professional, studio-quality images. Perfect for e-commerce businesses, marketers, and content creators who want to elevate their visual content without expensive photo shoots.

## ✨ Features

- **Smart Enhancement**: AI-powered photo processing with customizable styles
- **Instant Preview**: Real-time preview of enhancements before processing
- **Multiple Styles**: Choose from 10 professional presets (Delicate, Minimalist, Editorial, etc.)
- **Credit System**: Free trial credits + subscription options
- **Secure Storage**: Temporary image storage with privacy controls
- **Admin Dashboard**: Job monitoring and system metrics

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 5+
- Redis (for job queue)

### Environment Setup

Create a `.env` file in the root directory:

```env
# App
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/sellora

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_jwt_secret
MAGIC_LINK_SECRET=your_magic_link_secret

# Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=sellora-uploads
AWS_REGION=us-east-1

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sellora.git
cd sellora

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in with email/password
- `POST /api/auth/magic-link` - Request magic link

### Image Processing
- `POST /api/upload` - Upload product photo
- `POST /api/process` - Start enhancement job
- `GET /api/status/:jobId` - Check job status
- `POST /api/regenerate` - Re-run with new parameters

### Credits & Payments
- `GET /api/credits` - Get credit balance
- `POST /api/checkout` - Create checkout session
- `POST /api/consume-credit` - Use credit for processing

### Admin
- `GET /api/admin/jobs` - List processing jobs
- `GET /api/admin/metrics` - System metrics
- `POST /api/admin/jobs/:jobId/retry` - Retry failed job

## 📦 Deployment

### Production Setup

1. Configure environment variables
2. Set up MongoDB replica set
3. Configure Redis for production
4. Set up AWS S3 bucket
5. Configure Stripe webhooks

### Infrastructure Requirements

- Node.js hosting (e.g., AWS ECS, Google Cloud Run)
- MongoDB database (e.g., MongoDB Atlas)
- Redis instance (e.g., Redis Labs)
- S3-compatible storage
- CDN for processed images

## 🔄 Development History

### Push Log

1. **Initial Setup** (2024-01-15)
   - Project skeleton
   - Basic routing
   - Environment configuration

2. **Product Form** (2024-01-15)
   - Responsive form UI
   - Client-side validation
   - Local storage integration

3. **Upload Flow** (2024-01-15)
   - Drag-and-drop upload
   - Client-side image processing
   - Upload endpoint integration

4. **Style Selection** (2024-01-15)
   - Style presets implementation
   - Preview generation
   - Parameter customization

5. **Processing & Result** (2024-01-15)
   - Job status polling
   - Before/after comparison
   - Download functionality

6. **Auth & Credits** (2024-01-15)
   - User authentication
   - Credit system
   - Stripe integration

7. **Admin Dashboard** (2024-01-15)
   - Job management
   - System metrics
   - Admin controls

## 🤖 CursorAI Prompts

### ProductForm Component
```
Create a responsive "ProductForm" UI component for GlamGen:
Fields:
- productName (text, required, placeholder: "e.g. Velvet Glow Serum")
- brandName (text, required)
- shortTagline (optional)
- privacyConsent (checkbox: "I consent to temporary image storage for processing")
Behavior:
- On Next, validate required fields. If valid, persist data to local state and navigate to /upload.
- Output accessible labels, simple inline validation messages, and mobile-friendly layout.
- Provide a minimal export: HTML+CSS+vanilla JS (or React + Tailwind if available).
Also include the exact localStorage key name used to persist product metadata ("glamgen:productMeta").
```

### UploadPhoto Component
```
Create an "UploadPhoto" component with drag/drop + file-picker:
- Accept: jpg, jpeg, png. Max size 8 MB.
- Show immediate thumbnail preview (client-side) and a low-res quick-preview (create blob URL and render 300px wide).
- UI: "Upload or drag your product photo" + file name + size.
- On successful file selection, persist file to local state and show a Next button that navigates to /styles.
- Provide client-side resize to two versions:
  - previewImage: 800px max dimension, low quality (for fast upload/preview)
  - originalImage: keep source for full processing (or compress if >8 MB)
- Provide code for POST /api/upload that sends multipart/form-data with fields: productName, brandName, file.
```

### StylePicker Component
```
Create a "StylePicker" page component with predefined style chips and an "advanced slider" option:
Styles: Delicate, Minimalist, Maximalist, Editorial, Glossy, Natural, Cinematic, Studio Flatlay, High Detail, Soft Light.
For each style, include a JSON "preset" mapping to parameters:
{
  "contrast": number (-100..100),
  "saturation": number (-100..100),
  "sharpen": 0..1,
  "skinSoftness": 0..1,
  "crop": "auto" | "square" | "portrait",
  "retouchStrength": 0..1
}
Behavior:
- Choose style -> preview small quick filter applied to previewImage client-side (simulate)
- Allow "strength" slider 0–100 to control retouch intensity
- On Confirm, prepare payload for /api/process
```

### Processing Component
```
Create a "submit & processing" flow:
1) Client calls POST /api/process with JSON payload
2) Client immediately displays a Processing page with:
   - Low-res preview image (from upload)
   - Progress bar and moving dots
   - Estimated time (cap at 3 minutes)
   - "Cancel & Save for later" button
3) Poll /api/status?job_id every 3s with exponential backoff after 90s
4) When done -> replace preview with before/after slider and download button
Also provide fallback: if >180s show "still working — we'll email you"
```

### Result Component
```
Build a Result page:
- Show before/after slider (left = original, right = processed)
- Show small changelog describing the edits
- Controls: intensity slider (0-100), crop options, download button
- Show price/credit cost if paywall applies
- Provide share buttons (copy link, email, Instagram-ready)
```

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Built with [CursorAI](https://cursor.sh)
- UI components from [TailwindCSS](https://tailwindcss.com)
- Image processing powered by [Sharp](https://sharp.pixelplumbing.com)