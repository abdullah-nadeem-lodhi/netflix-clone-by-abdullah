# Netflix Clone

A full-featured Netflix clone built with the MERN stack (MongoDB, Express.js, React.js, Next.js, Node.js) and Stripe for payment processing.

## Features

### Core Functionality
- **User Authentication**: Registration, login, logout with JWT tokens
- **Content Management**: Browse, search, and filter movies and TV shows
- **Video Streaming**: Custom video player with controls
- **Subscription System**: Three-tier subscription plans with Stripe integration
- **User Profiles**: Personalized recommendations, watchlist, and viewing history
- **Admin Dashboard**: Content and user management (admin only)

### Technical Features
- **Modern Stack**: MongoDB, Express.js, React.js, Next.js, Node.js
- **Payment Integration**: Stripe for secure payment processing
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: React Query for data fetching and caching
- **Security**: JWT authentication, input validation, rate limiting
- **Performance**: Optimized images, lazy loading, caching strategies

## Project Structure

```
netflix-clone-by-abdullah/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # CSS/styling
│   │   └── store/          # State management
│   ├── public/
│   └── package.json
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   └── package.json
├── shared/                  # Shared types and utilities
├── package.json            # Root package.json
└── README.md
```

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Stripe** - Payment processing
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Frontend
- **Next.js** - React framework
- **React.js** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Zustand** - State management
- **Axios** - HTTP client

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB 4.4+
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd netflix-clone-by-abdullah
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**

**Backend (.env)**
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env` with your configuration:
- MongoDB connection string
- JWT secrets
- Stripe keys

**Frontend (.env.local)**
```bash
cp frontend/.env.local.example frontend/.env.local
```
Edit `frontend/.env.local` with your configuration:
- API URL
- Stripe publishable key

4. **Start the development servers**
```bash
npm run dev
```
This will start both the backend (port 3001) and frontend (port 3000) servers.

## API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Content
- `GET /api/content` - Get content catalog
- `GET /api/content/featured` - Get featured content
- `GET /api/content/:id` - Get content details
- `GET /api/content/search` - Search content

### Subscriptions
- `GET /api/subscriptions/plans` - Get subscription plans
- `POST /api/subscriptions/create-checkout-session` - Create checkout
- `GET /api/subscriptions/current` - Get user subscription

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/watchlist` - Get watchlist
- `POST /api/users/watchlist/:contentId` - Add to watchlist
- `GET /api/users/history` - Get watch history

## Subscription Plans

### Basic - $8.99/month
- SD Quality (480p)
- Single Screen
- Limited Catalog

### Standard - $13.99/month (Most Popular)
- HD Quality (1080p)
- 2 Screens
- Full Catalog
- Downloads

### Premium - $17.99/month
- 4K+HDR Quality
- 4 Screens
- Full Catalog
- Downloads
- Offline Viewing

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- SQL injection prevention
- XSS protection

## License

This project is for educational purposes only. All content and trademarks belong to their respective owners.
