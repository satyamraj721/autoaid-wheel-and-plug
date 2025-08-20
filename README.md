# AUTOAID 360 🚗⚡

> **AI-Ready Roadside Assistance & EV Mobility Platform**  
> On-demand repairs, battery delivery, EV charging, accident protection, and 24/7 emergency help.

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Powered by Node.js](https://img.shields.io/badge/Powered%20by-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://mongodb.com/)
[![UI: Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

## 🌟 Features

### 🚨 **Emergency Services**
- **24/7 Roadside Assistance** - Towing, flat tire repair, jump start, lockout help
- **GPS Tracking** - Real-time location sharing and technician tracking
- **One-Click Emergency** - Instant access to help when you need it most

### ⚡ **EV Mobility Solutions**
- **Mobile EV Charging** - Emergency charging delivered to your location
- **Battery Delivery** - Replacement battery installation service
- **EV Diagnostics** - Specialized electric vehicle troubleshooting
- **Charging Station Locator** - Find nearby charging infrastructure

### 🔧 **Mobile Repair Services**
- **On-Site Diagnostics** - Professional vehicle inspection and repair
- **Preventive Maintenance** - Oil changes, brake inspection, and more
- **Parts Delivery** - Genuine parts sourced and delivered to your location

### 🛡️ **Accident Protection**
- **Immediate Response** - Comprehensive accident scene management
- **Insurance Coordination** - Seamless claims processing assistance
- **Legal Support** - Professional guidance through the process

### 👥 **Multi-Role Platform**
- **Customer Dashboard** - Book services, track requests, manage account
- **Mechanic Portal** - Job management, route optimization, earnings tracking
- **Admin Panel** - Platform management, analytics, user administration

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB** (Atlas or local)
- **Git**

### 1. Clone & Setup
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd autoaid360

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### 2. Database Setup
```bash
# Using MongoDB Atlas (Recommended)
# 1. Create account at https://cloud.mongodb.com
# 2. Create new cluster
# 3. Copy connection string to MONGO_URI in .env

# Using Local MongoDB
# Install MongoDB locally or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Start Development
```bash
# Development with hot reload
npm run dev

# Frontend only (if backend is separate)
npm run dev:client

# Backend only
npm run dev:server

# Production build
npm run build
npm start
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🏗️ Project Structure

```
autoaid360/
├── 📁 src/                     # Frontend React application
│   ├── 📁 assets/              # Static assets and branding
│   │   └── 📁 brand/           # Logo files and brand guidelines
│   ├── 📁 components/          # Reusable UI components
│   │   └── 📁 ui/              # shadcn/ui components
│   ├── 📁 pages/               # Application pages/routes
│   ├── 📁 context/             # React context providers
│   ├── 📁 api/                 # API client and endpoints
│   └── 📁 lib/                 # Utility functions
├── 📁 server/                  # Backend Node.js application
│   ├── 📁 controllers/         # Route controllers
│   ├── 📁 models/              # MongoDB models
│   ├── 📁 routes/              # API route definitions
│   ├── 📁 middleware/          # Express middleware
│   ├── 📁 utils/               # Backend utilities
│   └── 📁 seeder/              # Database seeding
├── 📁 public/                  # Public static files
├── 📄 .env.example             # Environment template
└── 📄 README.md                # This file
```

## 🎨 Brand Assets

### Color Palette
- **Trust Blue**: `#007BFF` - Primary brand color for reliability
- **EV Green**: `#00C897` - Secondary color for eco-friendly focus
- **Emergency Red**: `#DC2626` - For urgent actions and alerts
- **Warning Amber**: `#F59E0B` - For cautions and warnings

### Logos & Assets
- **Primary Logo**: `src/assets/brand/autoaid360_logo.png` (1024x1024)
- **Horizontal Logo**: `src/assets/brand/logo-horizontal.png` 
- **Monochrome**: `src/assets/brand/logo-monochrome.png`
- **Favicon**: `src/assets/brand/favicon-32x32.png`

See `src/assets/brand/README.md` for complete brand guidelines.

## 🔧 API Documentation

### Authentication Endpoints
```http
POST /api/auth/signup       # Create new account
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/users/me          # Get current user profile
```

### Service Management
```http
GET    /api/services        # List all services
GET    /api/services/:id    # Get service details
POST   /api/services        # Create service (admin)
PUT    /api/services/:id    # Update service (admin)
DELETE /api/services/:id    # Delete service (admin)
```

### Booking System
```http
POST   /api/bookings        # Create new booking
GET    /api/bookings        # Get user bookings
GET    /api/bookings/mechanic # Get mechanic assignments
GET    /api/bookings/admin  # Get all bookings (admin)
PATCH  /api/bookings/:id/status # Update booking status
```

### Health Check
```http
GET /api/health             # API health status
```

## 🧪 Testing with Postman

### Quick Test Collection

**1. Health Check**
```http
GET http://localhost:5000/api/health
```

**2. User Signup**
```http
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**3. User Login**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**4. Get Profile (requires token)**
```http
GET http://localhost:5000/api/users/me
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**5. Book Service**
```http
POST http://localhost:5000/api/bookings
Authorization: Bearer <YOUR_JWT_TOKEN>
Content-Type: application/json

{
  "serviceId": "64a1b2c3d4e5f6789012345",
  "scheduledAt": "2024-12-25T10:00:00Z",
  "location": "123 Main St, City, State"
}
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
# Connect to Vercel
npm i -g vercel
vercel login
vercel

# Set environment variables in Vercel dashboard:
# VITE_API_URL = https://your-backend.onrender.com
```

### Backend Deployment (Render)
```bash
# 1. Create new Web Service on Render
# 2. Connect your GitHub repository
# 3. Set build command: npm install
# 4. Set start command: npm start
# 5. Add environment variables:
#    - MONGO_URI
#    - JWT_SECRET
#    - PORT=10000
#    - NODE_ENV=production
```

### Alternative: Railway
```bash
# Deploy to Railway
npm i -g @railway/cli
railway login
railway deploy
```

### Docker Deployment (Optional)
```bash
# Build and run with Docker
docker build -t autoaid360 .
docker run -p 3000:3000 --env-file .env autoaid360
```

## 🛠️ Development

### Available Scripts
```bash
# Development
npm run dev              # Start full-stack development
npm run dev:client       # Frontend only
npm run dev:server       # Backend only

# Building
npm run build           # Build for production
npm run build:client    # Build frontend only

# Testing
npm test                # Run test suite
npm run test:watch      # Run tests in watch mode

# Database
npm run seed            # Seed database with sample data
npm run db:reset        # Reset database

# Linting & Formatting
npm run lint            # Check code quality
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
```

### Demo Accounts
For testing, use these demo accounts:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Customer** | `customer@demo.com` | `demo123` | Book services, track requests |
| **Mechanic** | `mechanic@demo.com` | `demo123` | Manage assigned jobs |
| **Admin** | `admin@demo.com` | `demo123` | Full platform management |

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **Input Validation** - Comprehensive data validation
- **CORS Protection** - Configurable cross-origin requests
- **Rate Limiting** - API abuse prevention
- **Helmet.js** - Security headers
- **Data Sanitization** - XSS and injection protection

## 📱 Mobile Responsiveness

- **Mobile-First Design** - Optimized for all screen sizes
- **Touch-Friendly UI** - Large tap targets and gestures
- **Progressive Web App** - Installable with offline capabilities
- **GPS Integration** - Location-based services
- **Push Notifications** - Real-time updates and alerts

## 🧩 Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Server state management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for auth
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Emergency Services**: 1-800-AUTOAID
- **Technical Support**: help@autoaid360.com
- **Documentation**: [docs.autoaid360.com](https://docs.autoaid360.com)
- **Community**: [Discord](https://discord.gg/autoaid360)

## 🗺️ Roadmap

- [ ] **AI Integration** - Smart diagnostics and predictive maintenance
- [ ] **IoT Sensors** - Vehicle health monitoring
- [ ] **AR Support** - Augmented reality repair guidance
- [ ] **Blockchain** - Decentralized service verification
- [ ] **API Ecosystem** - Third-party integrations
- [ ] **Mobile Apps** - Native iOS and Android applications

---

**Built with ❤️ for the automotive community**  
*Making roadside assistance more accessible, reliable, and intelligent.*