# PunarJal - Smart Wastewater Treatment System

A full-stack Next.js application for wastewater treatment simulation and monitoring with integrated backend API and JWT authentication. PunarJal transforms wastewater treatment from a costly necessity into a sustainable resource recovery system.

## 🌟 Features

- ✅ **Full-Stack Next.js** - Frontend and backend in one application
- ✅ **JWT Authentication** - Secure user authentication with HTTP-only cookies
- ✅ **MongoDB Integration** - Persistent data storage
- ✅ **Protected Routes** - Server-side route protection with middleware
- ✅ **Modern UI** - Built with Tailwind CSS and Shadcn UI
- ✅ **TypeScript** - Full type safety
- ✅ **One-Click Deploy** - Deploy to Vercel with one click

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas account
- npm or yarn package manager

### 1. Clone and Setup

```bash
# Navigate to the Next.js app directory
cd nextjs-app

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `nextjs-app` directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
MONGODB_URI=mongodb://localhost:27017/wastewater-treatment
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nextjs-app/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── signup/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── me/
│   │   │   └── verify/
│   │   └── health/            # Health check endpoint
│   ├── (pages)/               # Frontend pages
│   │   ├── simulation/
│   │   ├── dashboard/
│   │   ├── iot-sensors/
│   │   ├── reuse/
│   │   └── analytics/
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/                 # React components
│   ├── ui/                    # Shadcn UI components
│   ├── providers/             # Context providers
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── AuthModal.tsx
│   └── ...
├── contexts/                   # React contexts
│   └── AuthContext.tsx        # Authentication context
├── lib/                        # Utilities
│   ├── mongodb.ts             # MongoDB connection
│   ├── auth.ts                # Authentication helpers
│   └── utils.ts               # General utilities
├── models/                     # MongoDB models
│   └── User.ts                # User model
├── hooks/                      # Custom React hooks
├── public/                     # Static assets
│   ├── assets/                # Images, icons
│   └── ...
├── middleware.ts               # Next.js middleware (route protection)
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── package.json               # Dependencies
```

## 🔐 Authentication

### Sign Up

1. Click "START SIMULATION" on home page
2. Fill in organization details:
   - Organization Name
   - Organization Type (dropdown)
   - Location (Bangalore areas dropdown)
   - Email
   - Password
3. Automatic login after signup

### Sign In

1. Click "START SIMULATION"
2. Switch to "Sign In" mode
3. Enter email and password

### Protected Routes

These routes require authentication:

- `/simulation`
- `/dashboard`
- `/iot-sensors`
- `/reuse`
- `/analytics`

Unauthenticated users are automatically redirected to the home page.

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/signup`

Register new organization

**Request:**

```json
{
  "organizationName": "ABC Hospital",
  "organizationEmail": "admin@abchospital.com",
  "organizationType": "Hospital",
  "location": "Whitefield",
  "password": "securepass123"
}
```

**Response:**

```json
{
  "_id": "...",
  "organizationName": "ABC Hospital",
  "organizationEmail": "admin@abchospital.com",
  "organizationType": "Hospital",
  "location": "Whitefield",
  "token": "jwt_token..."
}
```

#### POST `/api/auth/login`

Login with credentials

#### POST `/api/auth/logout`

Logout and clear cookies

#### GET `/api/auth/me`

Get current user (requires auth)

#### GET `/api/auth/verify`

Verify token validity (requires auth)

### Health Check

#### GET `/api/health`

Server health check

## 🎨 Available Organization Types

- Hospital
- Hotel
- Restaurant
- Manufacturing Industry
- IT/Tech Company
- Educational Institution
- Shopping Mall
- Residential Complex
- Commercial Complex
- Food Processing Unit
- Pharmaceutical Company
- Textile Industry
- Other

## 📍 Available Locations (Bangalore)

Whitefield, Electronic City, Koramangala, Indiranagar, JP Nagar, Jayanagar, BTM Layout, HSR Layout, Marathahalli, Sarjapur Road, Hebbal, Yelahanka, Banashankari, Rajajinagar, Malleshwaram, Yeshwanthpur, Peenya, Bommanahalli, Mahadevapura, Dasarahalli, RR Nagar, Kengeri, Hennur, Bellandur, MG Road

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Import project on [Vercel](https://vercel.com):

   - Click "Import Project"
   - Select your repository
   - Vercel auto-detects Next.js

3. Add Environment Variables:

   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `JWT_EXPIRE` - Token expiration (7d)
   - `NEXT_PUBLIC_APP_URL` - Your deployment URL

4. Click "Deploy"

That's it! Your app is live! 🎉

### MongoDB Atlas (Production Database)

For production, use MongoDB Atlas instead of local MongoDB:

1. Create account at [mongodb.com](https://www.mongodb.com/)
2. Create a cluster (free tier available)
3. Get connection string
4. Add to Vercel environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wastewater?retryWrites=true&w=majority
   ```

### Alternative Deployment Options

- **Netlify**: Supports Next.js with serverless functions
- **Railway**: Easy deployment with MongoDB included
- **DigitalOcean App Platform**: Full-stack deployment
- **AWS Amplify**: Scalable cloud deployment

## 📝 Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **Framer Motion** - Animations
- **React Query** - Data fetching

### Backend

- **Next.js API Routes** - Serverless API
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🔧 Development

### Adding a New Page

1. Create file in `app/your-page/page.tsx`:

```tsx
export default function YourPage() {
  return <div>Your Page</div>;
}
```

2. Access at `/your-page`

### Adding a New API Route

1. Create file in `app/api/your-route/route.ts`:

```ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

2. Access at `/api/your-route`

### Adding Authentication to a Route

1. Add path to `middleware.ts`:

```ts
const protectedPaths = ["/simulation", "/your-new-protected-page"];
```

2. Update matcher in `middleware.ts`

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running locally
- Check connection string in `.env.local`
- For Atlas, whitelist your IP address

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Authentication Not Working

- Clear cookies and localStorage
- Check JWT_SECRET is set
- Verify token hasn't expired

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Tutorial](https://nextjs.org/learn)
- [Shadcn UI](https://ui.shadcn.com)
- [MongoDB with Next.js](https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- MongoDB for the database solution

---

**Made with ❤️ for sustainable water treatment**
