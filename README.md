# Sellora 🌟

Presentation link: https://www.canva.com/design/DAGy26VsAOY/cfIEngq8QG1TjHLI9ub9mw/edit?utm_content=DAGy26VsAOY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

Sellora is an AI-powered product photo enhancement platform that transforms ordinary product photos into professional, studio-quality images. Perfect for e-commerce businesses, marketers, and content creators who want to elevate their visual content without expensive photo shoots.

## ✨ Features

- **Smart Enhancement**: AI-powered photo processing with customizable styles
- **Instant Preview**: Real-time preview of enhancements before processing
- **Multiple Styles**: Choose from 10 professional presets (Delicate, Minimalist, Editorial, etc.)
- **Credit System**: Free trial credits + subscription options
- **Secure Storage**: Temporary image storage with privacy controls
- **Admin Dashboard**: Job monitoring and system metrics

## 🚀 Getting Started

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
