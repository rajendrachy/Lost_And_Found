# Lost and Found Platform 🔍

> A community-powered **Lost & Found Platform** built to help people recover lost items through transparency, trust, and a secure verification workflow.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Architecture](#-project-architecture)
5. [Folder Structure](#-folder-structure)
6. [Database Schema](#-database-schema)
7. [API Reference](#-api-reference)
8. [Environment Variables](#-environment-variables)
9. [Installation & Setup](#-installation--setup)
10. [Running the Application](#-running-the-application)
11. [Deployment](#-deployment)
12. [Security & Privacy](#-security--privacy)
13. [Subscription Plans](#-subscription-plans)
14. [Reputation & Badge System](#-reputation--badge-system)
15. [Contributing](#-contributing)
16. [License](#-license)

---

## 🧭 Project Overview

**Sajha Khoj** is a full-stack, production-grade Lost and Found platform targeted at communities (particularly in Nepal). It solves a fundamental trust problem: *How can a finder know that a claimant is truly the owner?* The answer is the **Double-Handshake Verification** workflow — a two-step process where a claimant submits proof, the finder verifies it, and only then are contact details revealed.

The platform supports:
- Posting lost/found items with images
- Filtering and searching across categories, locations, and dates
- Claiming items with proof messages
- A secure finder-to-owner approval workflow
- A gamified reputation system (Hero Points + Badges)
- Admin controls for user management and content moderation
- Free and Premium subscription tiers

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🔍 **Intelligent Discovery** | Advanced multi-field filtering by type, category, location, and date with server-side pagination |
| 🤝 **Double-Handshake Verification** | Claimant submits proof → Finder approves → Owner confirms → Item resolved |
| 🧭 **Next Step Portal** | A floating action hub dynamically guiding users to their most urgent pending tasks |
| 🏆 **Reputation System** | Earn "Hero Points" for each resolved item and unlock tiered community badges |
| 📱 **Mobile-First UI** | Fully responsive, high-fidelity interface optimized for all screen sizes |
| 🔔 **Notifications** | In-app notifications for claims, approvals, and resolution events |
| 🛡️ **Admin Dashboard** | Manage users, moderate items, respond to plan upgrade requests, and view platform stats |
| 📊 **Analytics** | Visual charts (Recharts) for item trends and resolution statistics |
| 🔐 **Email Verification** | Account activation via tokenized email link using Nodemailer |
| 🔑 **Password Reset** | Secure forgot-password flow with time-limited reset tokens |
| 💎 **Subscription Plans** | Free tier (12 items/day) and Premium tier (unlimited) with admin approval |
| 🚦 **Rate Limiting** | Progressive, per-user rate limiting on authentication and item creation endpoints |
| 📸 **Cloud Media** | Images uploaded directly to Cloudinary with URL stored in the database |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 18.2.0 | Core UI library (component-based SPA) |
| **Vite** | 4.2.0 | Build tool and dev server (fast HMR) |
| **React Router DOM** | 6.10.0 | Client-side routing and navigation |
| **Framer Motion** | 10.12.4 | Smooth page transitions and micro-animations |
| **Lucide React** | 0.127.0 | Clean, consistent icon library |
| **Axios** | 1.3.4 | HTTP client for all API calls |
| **Recharts** | 3.8.1 | Composable charting library for analytics |
| **Tailwind CSS** | 4.2.4 | Utility-first CSS (used for specific layout utilities) |
| **PostCSS + Autoprefixer** | - | CSS processing and browser compatibility |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | 4.18.2 | Web framework for REST API |
| **Mongoose** | 7.0.3 | ODM for MongoDB — schema modeling and queries |
| **JSON Web Tokens (JWT)** | 9.0.0 | Stateless authentication and authorization |
| **bcryptjs** | 2.4.3 | Password hashing (salt rounds: 10) |
| **Multer** | 1.4.5 | `multipart/form-data` middleware for image uploads |
| **Cloudinary SDK** | 1.34.0 | Image upload and hosting |
| **Nodemailer** | 8.0.6 | Email delivery for verification and password reset |
| **express-rate-limit** | 8.4.1 | API rate limiting (general, auth, item-specific) |
| **express-validator** | 7.3.2 | Request body validation middleware |
| **Helmet** | 8.1.0 | Security HTTP headers |
| **CORS** | 2.8.6 | Cross-Origin Resource Sharing configuration |
| **Morgan** | 1.10.1 | HTTP request logging |
| **dotenv** | 16.0.3 | Environment variable management |
| **crypto** | 1.0.1 | Secure token generation for email/password reset |
| **nodemon** | 2.0.22 | Auto-restart dev server on file changes |

### Database & Cloud Services

| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Cloudinary** | Image storage and CDN delivery |

### Deployment

| Platform | Role |
|---|---|
| **Vercel** | Frontend deployment (`vercel.json` included) |
| **Render** | Backend deployment (Node.js service) |

---

## 🏗 Project Architecture

```
Client (React SPA)
      │
      │  HTTP Requests (Axios)
      ▼
Express REST API (Node.js)
      │
      ├── Middleware Layer
      │     ├── Helmet (Security Headers)
      │     ├── CORS (Origin Whitelist)
      │     ├── Rate Limiters (General / Auth / Item)
      │     ├── JWT Auth Guard (protect middleware)
      │     ├── Input Validators (express-validator)
      │     └── Multer (Image Upload Buffer)
      │
      ├── Routes → Controllers
      │     ├── /api/auth       → authController.js
      │     ├── /api/items      → itemController.js
      │     ├── /api/admin      → adminController.js
      │     ├── /api/notifications → notificationController.js
      │     └── /api/reports    → reportRoutes.js
      │
      └── Data Layer (Mongoose ODM)
            ├── User Model
            ├── Item Model
            ├── Notification Model
            └── Report Model
                    │
                    ▼
              MongoDB Atlas
```

---

## 📁 Folder Structure

```
Sajha_Khoj/
│
├── backend/
│   ├── controllers/
│   │   ├── adminController.js        # Admin user/item management, plan requests
│   │   ├── authController.js         # Register, login, profile, email verify, password reset
│   │   ├── itemController.js         # CRUD for items, claims, verify, confirm recovery
│   │   └── notificationController.js # Fetch and manage in-app notifications
│   │
│   ├── middleware/
│   │   ├── auth.js                   # JWT verification (protect), admin guard (isAdmin)
│   │   ├── upload.js                 # Multer + Cloudinary stream upload config
│   │   ├── itemValidation.js         # Validation rules for item creation and claims
│   │   └── validation.js             # Validation rules for auth (register, login, profile)
│   │
│   ├── models/
│   │   ├── User.js                   # User schema with badges, plans, limits, methods
│   │   ├── Item.js                   # Item schema with claims array and reward sub-doc
│   │   ├── Notification.js           # Notification schema
│   │   └── Report.js                 # User-submitted support reports
│   │
│   ├── routes/
│   │   ├── authRoutes.js             # Auth endpoints
│   │   ├── itemRoutes.js             # Item endpoints
│   │   ├── adminRoutes.js            # Admin-only endpoints
│   │   ├── notificationRoutes.js     # Notification endpoints
│   │   └── reportRoutes.js           # Report endpoints
│   │
│   ├── cleanupBadges.js              # Utility: remove orphan badge records
│   ├── syncBadges.js                 # Utility: recalculate and sync all user badges
│   ├── seed.js                       # Database seeder script
│   ├── index.js                      # App entry point — Express setup, DB connection
│   ├── .env.example                  # Environment variable template
│   └── package.json
│
└── frontend/
    ├── public/                        # Static assets
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx               # Landing page with hero, features, success stories
    │   │   ├── Explore.jsx            # Browse/filter all items (lost + found)
    │   │   ├── PostItem.jsx           # Form to post a lost or found item
    │   │   ├── ItemDetails.jsx        # Item detail view with claim workflow
    │   │   ├── Profile.jsx            # User profile, stats, badges, items, claims
    │   │   ├── Admin.jsx              # Admin dashboard with charts and management tools
    │   │   ├── Login.jsx              # Login form
    │   │   ├── Register.jsx           # Registration form
    │   │   ├── ForgotPassword.jsx     # Email-based password reset request
    │   │   ├── ResetPassword.jsx      # Token-gated new password form
    │   │   ├── VerifyEmail.jsx        # Email verification token handler
    │   │   ├── Plan.jsx               # Premium plan info and upgrade request
    │   │   ├── About.jsx              # About the platform
    │   │   ├── Safety.jsx             # Safety tips and guidelines
    │   │   ├── HelpCenter.jsx         # FAQ and support center
    │   │   └── WhyChoose.jsx          # Platform value proposition page
    │   │
    │   ├── components/
    │   │   ├── Navbar.jsx             # Top navigation bar with auth state
    │   │   ├── ItemCard.jsx           # Reusable card for item listings
    │   │   ├── NextStepPortal.jsx     # Floating action hub for pending tasks
    │   │   ├── NotificationPanel.jsx  # Slide-in notification panel
    │   │   └── SuccessStoryCard.jsx   # Card for displaying resolved item stories
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx        # Global auth state (user, login, logout, token)
    │   │
    │   ├── api.js                     # Axios instance with baseURL + auth interceptors
    │   ├── App.jsx                    # Root component: Router, AuthProvider, PrivateRoute
    │   ├── main.jsx                   # React DOM entry point
    │   └── index.css                  # Global styles and CSS design system
    │
    ├── index.html                     # HTML shell
    ├── vite.config.js                 # Vite configuration
    ├── tailwind.config.js             # Tailwind configuration
    ├── postcss.config.js              # PostCSS configuration
    ├── vercel.json                    # Vercel SPA routing fallback
    └── package.json
```

---

## 🗃 Database Schema

### User Model (`User.js`)

```javascript
{
  name:              String (required)
  email:             String (required, unique, lowercase)
  password:          String (hashed with bcryptjs, salt=10)
  phone:             String
  role:              Enum ['user', 'admin'] (default: 'user')
  avatar:            String (Cloudinary URL)
  rating:            Number (0–10)
  reputationPoints:  Number
  totalResolved:     Number
  badges:            [{ type, name, description, earnedAt }]
  currentStreak:     Number
  longestStreak:     Number
  totalItemsPosted:  Number
  totalClaimsSubmitted: Number
  isVerified:        Boolean (email verified)
  isApproved:        Boolean (admin-approved account)
  verificationToken: String
  resetToken:        String
  resetTokenExpiry:  Date
  plan:              Enum ['free', 'premium']
  planStartDate:     Date
  planEndDate:       Date
  itemsCreatedToday: Number
  itemsCreatedDate:  Date
  loginCount:        Number
  loginDate:         Date
  planRequest:       { status, message, requestedAt, adminResponse, respondedAt }
  timestamps:        createdAt, updatedAt
}
```

### Item Model (`Item.js`)

```javascript
{
  type:        Enum ['lost', 'found'] (required)
  title:       String (required)
  description: String (required)
  category:    String (required)
  location:    String (required)
  date:        Date (required)
  image:       String (Cloudinary URL)
  poster:      ObjectId → User (required)
  status:      Enum ['active', 'resolved'] (default: 'active')
  reward: {
    amount:    Number
    currency:  String (default: 'NPR')
    description: String
    claimed:   Boolean
    claimedBy: ObjectId → User
    claimedAt: Date
  }
  claims: [{
    user:      ObjectId → User
    message:   String
    phone:     String
    email:     String
    status:    Enum ['pending', 'approved', 'rejected']
    createdAt: Date
  }]
  returnedBy:       ObjectId → User
  confirmedByOwner: Boolean
  resolutionStory:  String
  timestamps:       createdAt, updatedAt
}
```

### Notification Model (`Notification.js`)

```javascript
{
  recipient:  ObjectId → User
  type:       String
  message:    String
  itemId:     ObjectId → Item
  isRead:     Boolean (default: false)
  timestamps: createdAt, updatedAt
}
```

### Report Model (`Report.js`)

```javascript
{
  subject:    String
  category:   String
  message:    String
  userId:     String
  status:     Enum ['pending', 'resolved'] (default: 'pending')
  timestamps: createdAt, updatedAt
}
```

---

## 📡 API Reference

> Base URL: `http://localhost:5000/api`

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user (triggers verification email) |
| `POST` | `/login` | ❌ | Login and receive a JWT token |
| `POST` | `/forgot-password` | ❌ | Send password reset email |
| `POST` | `/reset-password` | ❌ | Reset password with token |
| `GET` | `/verify/:token` | ❌ | Verify email address |
| `GET` | `/profile` | ✅ | Get current user's profile |
| `PUT` | `/profile` | ✅ | Update profile (name, phone, bio) |
| `PUT` | `/password` | ✅ | Change password |
| `POST` | `/avatar` | ✅ | Upload/update profile avatar (Cloudinary) |
| `POST` | `/sync-badges` | ✅ | Recalculate and award badges |
| `POST` | `/request-plan` | ✅ | Submit a premium plan upgrade request |
| `GET` | `/plan-status` | ✅ | Get current plan and request status |

### 📦 Item Routes — `/api/items`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Create a new lost/found item (with image upload) |
| `GET` | `/` | ❌ | Get all items (supports filtering and pagination) |
| `GET` | `/my` | ✅ | Get items posted by the current user |
| `GET` | `/my-claims` | ✅ | Get all claims submitted by the current user |
| `GET` | `/type/:type` | ❌ | Get items filtered by type (`lost` or `found`) |
| `GET` | `/:id` | ❌ | Get a single item by ID (populated) |
| `DELETE` | `/:id` | ✅ | Delete an item (owner or admin only) |
| `PATCH` | `/:id/status` | ✅ | Toggle item status (active/resolved) |
| `POST` | `/:id/claim` | ✅ | Submit a claim for an item |
| `POST` | `/:id/verify` | ✅ | Finder verifies/rejects a claim (approve/reject) |
| `POST` | `/:id/confirm-recovery` | ✅ | Owner confirms item was successfully recovered |

### 🛡 Admin Routes — `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/stats` | ✅ Admin | Platform-wide statistics |
| `GET` | `/users` | ✅ Admin | List all registered users |
| `POST` | `/users/:userId/approve` | ✅ Admin | Approve a pending user account |
| `DELETE` | `/users/:id` | ✅ Admin | Delete a user account |
| `GET` | `/items` | ✅ Admin | List all items |
| `DELETE` | `/items/:id` | ✅ Admin | Delete any item |
| `GET` | `/plan-requests` | ✅ Admin | List all premium plan upgrade requests |
| `POST` | `/plan-requests/:userId` | ✅ Admin | Approve or reject a plan request |

### 🔔 Notification Routes — `/api/notifications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | Get all notifications for the current user |
| `PATCH` | `/:id/read` | ✅ | Mark a notification as read |

### 📋 Report Routes — `/api/reports`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ❌ | Submit a new support report |
| `GET` | `/` | ❌ | Get all reports (admin use) |
| `PUT` | `/:id/status` | ❌ | Update report status |

---

## ⚙ Environment Variables

### Backend — `backend/.env`

Create this file based on `backend/.env.example`:

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (Image Hosting)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer — e.g., Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:5173
```

### Frontend — `frontend/.env`

Create this file based on `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note:** In production, change `VITE_API_BASE_URL` to your deployed backend URL (e.g., `https://your-backend.onrender.com/api`).

---

## 📥 Installation & Setup

### Prerequisites

Ensure the following are installed on your machine:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** v9+ (bundled with Node.js)
- **MongoDB Atlas** account — [Sign up free](https://www.mongodb.com/atlas)
- **Cloudinary** account — [Sign up free](https://cloudinary.com/)
- **Git** — [Download](https://git-scm.com/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/sajha-khoj.git
cd sajha-khoj
```

---

### Step 2: Backend Setup

```bash
# Navigate into the backend directory
cd backend

# Install all dependencies
npm install
```

Create the environment file:

```bash
# Copy the example env file (Linux/macOS)
cp .env.example .env

# Or on Windows
copy .env.example .env
```

Open `backend/.env` and fill in all required values:
- `MONGO_URI` — Your MongoDB Atlas connection string
- `JWT_SECRET` — A long, random secret string (min. 32 characters recommended)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — From your Cloudinary dashboard
- `EMAIL_USER`, `EMAIL_PASS` — Gmail SMTP credentials (enable App Passwords in your Google account)
- `FRONTEND_URL` — `http://localhost:5173` for local development

---

### Step 3: Frontend Setup

```bash
# From the project root, navigate to the frontend directory
cd ../frontend

# Install all dependencies
npm install
```

Create the environment file:

```bash
# Copy the example env file (Linux/macOS)
cp .env.example .env

# Or on Windows
copy .env.example .env
```

Open `frontend/.env` and set:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Step 4: Seed the Database (Optional)

To populate the database with sample data for testing:

```bash
cd backend
node seed.js
```

---

### Step 5: Sync Badges (Optional)

If you want to recalculate badges for all existing users:

```bash
cd backend
node syncBadges.js
```

---

## 🏃‍♂️ Running the Application

You need **two terminal windows** — one for the backend, one for the frontend.

### Terminal 1 — Start the Backend

```bash
cd backend
npm run dev
```

The backend will start on **`http://localhost:5000`**.
You should see:
```
MongoDB Connected
Server running on port 5000
```

### Terminal 2 — Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will start on **`http://localhost:5173`**.

Open your browser and navigate to `http://localhost:5173` to use the application.

---

## 🚀 Deployment

### Frontend — Vercel

The frontend includes a `vercel.json` file configured for React SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Steps:
1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Set the **root directory** to `frontend`.
4. Add the environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
5. Deploy.

### Backend — Render

Steps:
1. Go to [render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Set the **root directory** to `backend`.
4. Set the **build command**: `npm install`
5. Set the **start command**: `node index.js`
6. Add all environment variables from your `backend/.env`.
7. Deploy.

> **Important:** After deploying the backend, update the `CORS` allowed origins in `backend/index.js` with your live Vercel frontend URL. This is already pre-configured for `https://lost-and-found-five-silk.vercel.app` and `https://lost-and-found-elnn.onrender.com`.

---

## 🛡 Security & Privacy

| Measure | Implementation |
|---|---|
| **Password Hashing** | Passwords hashed with `bcryptjs` at 10 salt rounds before storage |
| **JWT Authentication** | Stateless bearer token auth; tokens validated on every protected request |
| **HTTP Security Headers** | Helmet middleware sets `X-Frame-Options`, `X-XSS-Protection`, CSP, and more |
| **Rate Limiting** | Three-tier rate limiting: General API (100/15min), Auth (50/15min), Items (20/hr) |
| **Progressive Auth Lock** | After repeated auth failures, account is temporarily locked for 5 minutes |
| **CORS Whitelist** | Only explicitly listed origins are allowed to make cross-origin requests |
| **Input Validation** | All request bodies validated with `express-validator` before controller logic |
| **Identity Protection** | Contact details (phone/email) only visible to item poster after claim is approved |
| **Environment Variables** | All secrets in `.env` files, never committed to version control |
| **Email Verification** | Accounts remain unverified until a tokenized link in the verification email is clicked |

---

## 💎 Subscription Plans

| Feature | Free Plan | Premium Plan |
|---|---|---|
| Items per day | Up to 12 | Unlimited (999) |
| Logins per day | Up to 12 | Unlimited |
| Claim items | ✅ | ✅ |
| Image uploads | ✅ | ✅ |
| Priority support | ❌ | ✅ |

**How to Upgrade:**
1. Log in and navigate to the **Plan** page (`/plan`).
2. Submit an upgrade request with a message.
3. An admin reviews and approves/rejects the request.
4. On approval, the `plan` field is set to `'premium'` with a `planEndDate`.

---

## 🏆 Reputation & Badge System

Users earn **Hero Points** each time an item is successfully resolved (confirmed by both finder and owner).

Badges are automatically awarded when `totalResolved` crosses a threshold:

| Badge Name | Tier | Resolved Items Required |
|---|---|---|
| First Find | 🥉 Bronze | 1 |
| Rising Hero | 🥉 Bronze | 5 |
| Community Helper | 🥈 Silver | 10 |
| Trusted Finder | 🥈 Silver | 25 |
| Hero Award | 🥇 Gold | 50 |
| Super Hero | 🥇 Gold | 100 |
| Legend | 💠 Platinum | 200 |
| Master | 💎 Diamond | 500 |

Badges are stored in the `badges` array on the `User` document and can be synced server-side by calling `POST /api/auth/sync-badges`.

---

## 🔄 The Double-Handshake Workflow

```
1. Finder posts a "Found" item
         │
2. Owner sees the item and submits a claim
   (includes description/proof message)
         │
3. Finder reviews the claim proof and APPROVES it
   → Claimant's contact details (phone/email) are revealed to the finder
         │
4. Finder contacts the owner and returns the item
         │
5. Owner confirms recovery on the platform
   → Item status → "Resolved"
   → Both users earn reputation points
   → Badges are recalculated
   → Resolution story is saved
```

---

## 📁 Key File Descriptions

| File | Description |
|---|---|
| `backend/index.js` | Express app setup: middleware, routes, DB connection, rate limiters |
| `backend/controllers/authController.js` | Register, login, email verify, password reset, plan management |
| `backend/controllers/itemController.js` | Item CRUD, claim submission, finder verification, owner confirmation |
| `backend/controllers/adminController.js` | Admin stats, user approval, plan request management |
| `backend/models/User.js` | User schema with badge logic, plan checks, and daily limits |
| `backend/models/Item.js` | Item schema with embedded claims and reward sub-documents |
| `backend/middleware/auth.js` | JWT verification middleware (`protect`, `isAdmin`) |
| `backend/middleware/upload.js` | Multer memory storage + Cloudinary upload stream |
| `frontend/src/context/AuthContext.jsx` | Global auth state with React Context API |
| `frontend/src/api.js` | Axios instance with base URL and Authorization header interceptor |
| `frontend/src/App.jsx` | Root component with routing and `PrivateRoute` guard |
| `frontend/src/pages/Admin.jsx` | Full admin dashboard with charts, user table, and plan management |
| `frontend/src/components/NextStepPortal.jsx` | Floating action hub for urgent pending tasks |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** with clear, well-commented code
4. **Test** your changes locally
5. **Commit**: `git commit -m "feat: add your feature description"`
6. **Push**: `git push origin feature/your-feature-name`
7. **Open a Pull Request** on GitHub with a clear description

### Commit Message Convention

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Formatting, no logic changes
- `refactor:` — Code refactoring
- `chore:` — Build process or dependency updates

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

For questions, issues, or suggestions, please open a [GitHub Issue](https://github.com/your-username/lost-and-found/issues) or use the in-app Help Center at `/help`.

---

<div align="center">
  <strong>Lost and Found Platform</strong> — <em>Bringing your lost items back home.</em> 🏠✨
</div>
