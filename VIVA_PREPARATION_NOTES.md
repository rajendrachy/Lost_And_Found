# 🎓 Lost and Found Platform (Sajha Khoj) — Full-Stack Project Viva & Interview Preparation Notes

> **A Comprehensive, Step-by-Step Defense Guide for Technical Viva, Oral Examination, and Project Presentation.**

---

## 📌 Table of Contents

1. [Project Overview & 60-Second Elevator Pitch](#1-project-overview--60-second-elevator-pitch)
2. [The Problem Statement & Solution](#2-the-problem-statement--solution)
3. [System Architecture & Technology Stack](#3-system-architecture--technology-stack)
4. [Core Innovation: Double-Handshake Verification Workflow](#4-core-innovation-double-handshake-verification-workflow)
5. [Database Schema & Data Models](#5-database-schema--data-models)
6. [Gamification & Reputation Engine (Hero Points & Badges)](#6-gamification--reputation-engine-hero-points--badges)
7. [Security, Authentication & Rate Limiting](#7-security-authentication--rate-limiting)
8. [Frontend & Backend Code Architecture](#8-frontend--backend-code-architecture)
9. [Master Viva Questions & Model Answers (35+ Categorized Q&A)](#9-master-viva-questions--model-answers-35-categorized-qa)
10. [Examiner Trap Questions & Winning Answers](#10-examiner-trap-questions--winning-answers)
11. [Step-by-Step Live Demo Presentation Checklist](#11-step-by-step-live-demo-presentation-checklist)
12. [Last-Minute Revision Cheat Sheet](#12-last-minute-revision-cheat-sheet)

---

## 1. Project Overview & 60-Second Elevator Pitch

### 🎯 How to introduce the project when the examiner asks: *"Tell me about your project."*

> *"Respected examiner, our project is the **Lost and Found Platform (Sajha Khoj)**, a production-grade full-stack community web application built using the **MERN Stack (MongoDB, Express, React, Node.js)** with Vite, Cloudinary, and Nodemailer.*
>
> *Traditional avenues like Facebook groups, messaging channels, or notice boards suffer from unorganized data, spam, privacy leaks, and most critically, **false claiming of valuable items**.*
>
> *The **Lost and Found Platform (Sajha Khoj)** solves this fundamental trust issue through our **Double-Handshake Verification Workflow**: claimants must submit private proof of ownership, finders verify and approve the claim, and only then are contact details exchanged securely. When the owner physically receives the item, they confirm recovery, marking the listing resolved.*
>
> *Finders are rewarded with **Hero Points and tiered reputation badges**, encouraging community goodwill. The platform also features an **intelligent Next Step Portal**, multi-parameter filtering, daily quota rate-limiting, and an **Admin Moderation Dashboard**."*

---

## 2. The Problem Statement & Solution

### ❌ The Real-World Problem:
- **No Centralized Platform:** Lost items are scattered across social media, campus groups, or physical desks.
- **Mistrust & Scams:** Anyone can view a public post and claim an item falsely.
- **Privacy Invasion:** Users are forced to post their phone numbers and emails publicly.
- **Lack of Motivation:** Finders have no incentive or recognition to report found items.

### ✅ Lost and Found Platform (Sajha Khoj)'s Solution:
- **Centralized & Filterable Discovery:** Search by lost/found status, category, location, and date with server-side pagination.
- **Private Proof Submission:** Claimants privately describe non-public identifiers (lock screen, serial number, scratches, invoice).
- **Protected Contact Details:** Phone and email remain hidden until the finder approves the claim.
- **Gamified Community Spirit:** Hero Points and Badge milestones (Bronze to Diamond) incentivize honest returns.
- **Safety Guidelines & Reports:** In-app safety center and administrative moderation.

---

## 3. System Architecture & Technology Stack

```
                     ┌─────────────────────────────────────────┐
                     │          React 18.2 SPA (Vite)          │
                     │  - React Router DOM v6  - Framer Motion │
                     │  - Tailwind CSS         - Recharts      │
                     │  - Axios with Auth Interceptors         │
                     └────────────────────┬────────────────────┘
                                          │ HTTP / REST APIs
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │       Node.js + Express.js Server       │
                     │  - Helmet (HTTP Security Headers)       │
                     │  - CORS (Origin Protection)             │
                     │  - Express-Rate-Limit (DDoS Prevention) │
                     │  - JWT Middleware (protect / isAdmin)   │
                     │  - Input Validation (express-validator) │
                     └──────┬─────────────┬─────────────┬──────┘
                            │             │             │
              Mongoose ODM  │             │ Stream      │ SMTP
                            ▼             ▼             ▼
                     ┌────────────┐ ┌────────────┐ ┌────────────┐
                     │  MongoDB   │ │ Cloudinary │ │ Nodemailer │
                     │   Atlas    │ │  CDN Media │ │   Email    │
                     └────────────┘ └────────────┘ └────────────┘
```

### 🛠️ Complete Tech Stack Table:

| Layer | Technology | Version | Reason for Choice & Purpose |
|---|---|---|---|
| **Frontend UI** | **React.js** | 18.2.0 | Component-driven Single Page App (SPA), Virtual DOM reconciliation for high rendering performance. |
| **Build Tool** | **Vite** | 4.2.0 | Native ES modules development server with near-instant Hot Module Replacement (HMR) and fast build output. |
| **Client Routing** | **React Router DOM** | 6.10.0 | Client-side routing with nested `PrivateRoute` guards for authentication and admin role enforcement. |
| **State Management** | **Context API** | - | `AuthContext.jsx` provides global auth state (user profile, token, login/logout handlers). |
| **Styling** | **Tailwind CSS** | 4.2.4 | Utility-first CSS for responsive, modern UI design. |
| **Animations** | **Framer Motion** | 10.12.4 | Declarative page transitions and interactive micro-animations. |
| **HTTP Client** | **Axios** | 1.3.4 | Promise-based HTTP client with request interceptors attaching JWT Bearer tokens. |
| **Visual Analytics** | **Recharts** | 3.8.1 | Composable SVG charting library for admin trend visualization. |
| **Backend Runtime** | **Node.js** | 18+ | High-performance, event-driven, non-blocking asynchronous JavaScript runtime. |
| **Web Framework** | **Express.js** | 4.18.2 | Minimalist RESTful API framework following the MVC pattern. |
| **Database & ODM** | **MongoDB Atlas & Mongoose** | 7.0.3 | Flexible JSON document model with embedded subdocuments for claims and schema-level validation. |
| **Authentication** | **JWT (jsonwebtoken)** | 9.0.0 | Stateless, signed authorization tokens passed via Bearer headers. |
| **Password Hashing** | **bcryptjs** | 2.4.3 | Salted one-way cryptographic hashing (10 salt rounds) in pre-save hooks. |
| **File Uploads** | **Multer + Cloudinary** | 1.4.5 | In-memory upload buffer directly streamed to Cloudinary CDN; database stores only secure URLs. |
| **Email Delivery** | **Nodemailer** | 8.0.6 | Automated SMTP delivery of email verification links and password reset tokens. |
| **Security & Headers**| **Helmet & CORS** | - | Hardens HTTP headers and enforces strict cross-origin resource sharing policies. |
| **Rate Limiting** | **express-rate-limit** | 8.4.1 | Throttles rapid auth attempts and spam item creation. |

---

## 4. Core Innovation: Double-Handshake Verification Workflow

The Double-Handshake mechanism is the core feature separating Sajha Khoj from basic CRUD applications.

```
 [User A: Finder]                                         [User B: Claimant / Owner]
        │                                                              │
        │ 1. Posts "Found Item" (Image, Location, Reward)              │
        ├──────────────────────────────────────────────────────────────┤
        │                                                              │
        │                                      2. Submits Claim        │
        │                                         - Private Proof Msg  │
        │                                         - Contact Details    │
        │                                                              │
        │ 3. Reviews Claims & Clicks "Approve"                         │
        │    - Selected claim status -> 'approved'                     │
        │    - Other pending claims -> 'rejected'                      │
        │    - Item status remains active during meetup                │
        ├──────────────────────────────────────────────────────────────┤
        │                                                              │
        │ 4. Mutual Contact Exchange & Safe Meetup in Public Area      │
        │                                                              │
        │                                      5. Clicks "Confirm Recovery"
        │                                         - Item status -> 'resolved'
        │                                         - Handshake finalized
        ├──────────────────────────────────────────────────────────────┤
        │                                                              │
        │ 6. Gamification Triggered                                    │
        │    - Finder receives +500 Hero Points                        │
        │    - checkAndAwardBadges() awards badges (Bronze to Diamond) │
        │    - In-app notification sent                                │
        ▼                                                              ▼
```

### 📋 Step-by-Step Breakdown:
1. **Posting:** The finder creates a post (`/api/items`). Free users are checked against a daily quota (12 items/day).
2. **Claim Submission:** The claimant submits proof (`/api/items/:id/claim`). Only claimants can claim; posters cannot claim their own items.
3. **Finder Approval:** In `verifyClaim`, the finder validates the proof. The selected claim becomes `approved`, and all other pending claims are automatically marked `rejected`.
4. **Coordination:** Phone numbers and email addresses are revealed only to the approved claimant and finder.
5. **Recovery Confirmation:** The owner calls `/api/items/:id/confirm-recovery`. The item status updates to `resolved`.
6. **Reputation Award:** Finder receives **+500 Hero Points**, reputation rating recalculates, and new badges are awarded automatically.

---

## 5. Database Schema & Data Models

### 👤 1. User Model (`User.js`)
- **Credentials & Auth:**
  - `name`: String (Required, trimmed)
  - `email`: String (Required, Unique, Lowercase)
  - `password`: String (Hashed with bcryptjs, 10 rounds)
  - `phone`: String
  - `role`: Enum `['user', 'admin']` (Default: `'user'`)
  - `isVerified`: Boolean (Default: `false` — activated via email token)
  - `isApproved`: Boolean (Default: `false` — admin approval)
  - `verificationToken`: String
  - `resetToken`: String & `resetTokenExpiry`: Date
- **Gamification:**
  - `rating`: Number (0–10)
  - `reputationPoints`: Number (Default: `0`)
  - `totalResolved`: Number (Default: `0`)
  - `badges`: Array of Subdocuments `[{ type, name, description, earnedAt }]`
  - `currentStreak` & `longestStreak`: Number
- **Quota & Plan:**
  - `plan`: Enum `['free', 'premium']` (Default: `'free'`)
  - `itemsCreatedToday`: Number (Resets daily at midnight)
  - `itemsCreatedDate` & `dailyItemResetAt`: Date
  - `planRequest`: Subdocument `{ status: 'none'|'pending'|'approved'|'rejected', message, requestedAt, adminResponse, respondedAt }`

### 📦 2. Item Model (`Item.js`)
- **Metadata:**
  - `type`: Enum `['lost', 'found']` (Required)
  - `title`, `description`, `category`, `location`: String (Required)
  - `date`: Date (Required)
  - `image`: String (Cloudinary CDN URL)
  - `poster`: ObjectId (Ref -> `User`, Required)
  - `status`: Enum `['active', 'resolved']` (Default: `'active'`)
- **Embedded Claims Array (`claims`):**
  - `user`: ObjectId (Ref -> `User`)
  - `message`: String (Proof of ownership)
  - `phone`: String & `email`: String
  - `status`: Enum `['pending', 'approved', 'rejected']` (Default: `'pending'`)
  - `createdAt`: Date
- **Resolution & Reward:**
  - `reward`: Subdocument `{ amount, currency: 'NPR', description, claimed, claimedBy, claimedAt }`
  - `returnedBy`: ObjectId (Ref -> `User`)
  - `confirmedByOwner`: Boolean (Default: `false`)
  - `resolutionStory`: String

### 🔔 3. Notification & Report Models
- **`Notification.js`:** `recipient` (Ref User), `sender` (Ref User), `item` (Ref Item), `type` (`'claim' | 'approval' | 'reward' | 'badge' | 'handshake'`), `message`, `isRead` (Boolean).
- **`Report.js`:** `subject`, `category`, `message`, `userId`, `status` (`'pending' | 'resolved'`).

---

## 6. Gamification & Reputation Engine (Hero Points & Badges)

### 🏅 Badge Milestone Tiers:

| Badge Name | Tier | Threshold (Resolved Items) | Description |
|---|---|---|---|
| **First Find** | Bronze | **1 item** | Resolved your first item in the community! |
| **Rising Hero** | Bronze | **5 items** | Consistently helping community members. |
| **Community Helper** | Silver | **10 items** | Double-digit verified item recoveries. |
| **Trusted Finder** | Silver | **25 items** | High-trust verified finder across the city. |
| **Hero Award** | Gold | **50 items** | Core community pillar. |
| **Super Hero** | Gold | **100 items** | Centurion resolver with master-level trust. |
| **Legend** | Platinum | **200 items** | Hall-of-Fame platform contributor. |
| **Master** | Diamond | **500 items** | Supreme platform master. |

### ⚡ Point Scoring System:
- **Manual status toggle:** `+100 Hero Points`
- **Double-Handshake confirmed recovery:** `+500 Hero Points`
- **Trust Rating Formula:** `rating = Math.min(10, Math.floor(user.totalResolved / 1))`

---

## 7. Security, Authentication & Rate Limiting

1. **Password Security:** Salted one-way hashing with `bcryptjs` (10 rounds). Plaintext passwords are never stored.
2. **Stateless JWT Authorization:** Tokens contain `{ id, role }` signed by `JWT_SECRET`. Expiry is checked on every request via `auth.protect` middleware.
3. **Sensitive Contact Shielding:** Claimant and finder contact details are hidden until explicit claim verification.
4. **Rate Limiting:**
   - Auth endpoints are protected with `express-rate-limit` to prevent credential stuffing.
   - Item creation is guarded by a daily quota check in `user.canCreateItem()` (Free: 12 posts/day; Premium: Unlimited).
5. **HTTP Headers & CORS:** Protected against XSS, MIME sniffing, and clickjacking using `Helmet`, with strict allowed origin lists via `CORS`.
6. **Input Validation:** Request bodies are sanitized and checked using `express-validator`.

---

## 8. Frontend & Backend Code Architecture

### 📁 Frontend Key Structure:
- `src/context/AuthContext.jsx`: Global provider holding `user`, `token`, `login()`, and `logout()`.
- `src/api.js`: Axios instance configured with `baseURL` and an interceptor that dynamically reads the JWT token from `localStorage` and appends `Authorization: Bearer <token>`.
- `src/components/NextStepPortal.jsx`: A floating smart task manager guiding users to approve claims or confirm returns.
- `src/pages/Admin.jsx`: Admin dashboard with Recharts visual charts, user ban/approval controls, item moderation, and plan upgrade request approvals.

### 📁 Backend Key Structure:
- `middleware/auth.js`: Exports `protect` (verifies JWT) and `isAdmin` (validates admin role).
- `middleware/upload.js`: Configures `Multer` with memory storage and helper function `uploadToCloudinary` for streaming image buffers.
- `controllers/itemController.js`: Handles `createItem`, `getItems`, `submitClaim`, `verifyClaim`, and `confirmRecovery`.

---

## 9. Master Viva Questions & Model Answers (35+ Categorized Q&A)

### 🌟 Category A: Project Concept & Real-World Impact

#### Q1: What inspired you to build the Lost and Found Platform (Sajha Khoj)?
> **Answer:** Physical lost-and-found desks are localized and ineffective, while social media posts get buried by algorithms and expose owners to scammers. The Lost and Found Platform (Sajha Khoj) provides a centralized, secure digital platform with private proof-based verification to connect finders and owners transparently.

#### Q2: What does "Sajha Khoj" mean?
> **Answer:** In Nepali, "Sajha" means *Shared/Community* and "Khoj" means *Search* (साझा खोज). It signifies collaborative community effort in recovering lost items.

#### Q3: What is your project's unique selling proposition (USP)?
> **Answer:** Our **Double-Handshake Verification Workflow** combined with **Gamified Reputation (Hero Points & Badges)**. Unlike standard classifieds, an item cannot be claimed without proof verification, and contact details are kept private until verified.

---

### ⚛️ Category B: Frontend & React Architecture

#### Q4: Why did you choose React over vanilla HTML/JavaScript or Angular/Vue?
> **Answer:** React's component-based architecture makes code modular and reusable. Its Virtual DOM diffing algorithm provides optimal performance for dynamic UI updates, and its vast ecosystem supports rich libraries like Framer Motion, Recharts, and Lucide React.

#### Q5: Why did you use Vite instead of Create React App (CRA)?
> **Answer:** CRA uses Webpack, which bundles the entire application before serving, resulting in slow startup and slow hot-reloading as the project grows. Vite uses native ES modules during development, providing instantaneous cold server starts and sub-second Hot Module Replacement (HMR).

#### Q6: How does `AuthContext.jsx` manage user authentication state?
> **Answer:** `AuthContext` uses React Context API. It stores the `user` object and JWT `token`. When a user logs in, `localStorage.setItem('token', token)` is called and the user state is updated, automatically triggering re-renders across all consumer components without prop-drilling.

#### Q7: What is an Axios Interceptor and why did you use it?
> **Answer:** An interceptor acts like middleware for HTTP requests. In `src/api.js`, our request interceptor reads the JWT from `localStorage` and adds `config.headers.Authorization = 'Bearer ' + token` to every outgoing API call automatically.

#### Q8: How does client-side routing work in your app?
> **Answer:** We use `react-router-dom` v6. Routes are configured in `App.jsx`. We implemented custom `PrivateRoute` wrappers that inspect authentication and user role, redirecting unauthenticated users to `/login` or non-admin users away from `/admin`.

---

### 🚀 Category C: Backend & Node.js / Express

#### Q9: Why Node.js and Express for the REST API?
> **Answer:** Node.js operates on an asynchronous, event-driven, single-threaded event loop with non-blocking I/O, which is ideal for I/O-heavy REST APIs. Express is lightweight, flexible, and provides robust middleware pipelining.

#### Q10: Explain the MVC pattern as used in your backend.
> **Answer:**
> - **Model:** Mongoose schemas in `backend/models/` defining database structure and validation.
> - **View:** Decoupled React Single Page Application consuming JSON APIs.
> - **Controller:** Functions in `backend/controllers/` containing core business logic.
> - **Routes:** Endpoints in `backend/routes/` routing requests to middleware and controllers.

#### Q11: What is Express Middleware? Name the middlewares in your project.
> **Answer:** Middleware functions have access to `req`, `res`, and `next()`. In our project:
> 1. `protect`: Verifies JWT authenticity.
> 2. `isAdmin`: Restricts route to admin users.
> 3. `upload.single('image')`: Multer file parser.
> 4. `express-validator`: Sanitizes and validates request payloads.
> 5. `express-rate-limit`: Throttles excessive requests.
> 6. `helmet` & `cors`: Security headers and cross-origin access rules.

#### Q12: How do you handle image uploads without running out of server disk space?
> **Answer:** We use Multer's `memoryStorage()`, keeping the file temporarily in RAM as a buffer. We stream this buffer directly to Cloudinary using `cloudinary.uploader.upload_stream`. No files are saved to the backend disk, keeping the server completely stateless.

---

### 🍃 Category D: Database & MongoDB

#### Q13: Why did you choose MongoDB (NoSQL) over PostgreSQL/MySQL (SQL)?
> **Answer:** Lost-and-found items have flexible structures (e.g. optional rewards, dynamic proof claims arrays). MongoDB's document model stores nested objects and arrays naturally, eliminating complex multi-table SQL joins and allowing horizontal scalability.

#### Q14: Why are claims embedded in the Item document rather than stored in a separate collection?
> **Answer:** A claim only exists in the context of an item, and an item usually receives a small number of claims (1–10). Embedding claims as a subdocument array allows atomic updates with `item.claims.push()`, enables single-query retrieval, and improves read latency.

#### Q15: What is Mongoose `.populate()` and where is it used?
> **Answer:** `.populate()` performs reference resolution similar to a SQL JOIN. It replaces referenced ObjectIDs with data from the referenced document. For example, `Item.find().populate('poster', 'name email phone')` populates the user's name, email, and phone into the item object.

#### Q16: How are passwords hashed in the database?
> **Answer:** In `User.js`, a Mongoose `pre('save')` hook executes before writing to the database:
> ```javascript
> userSchema.pre('save', async function(next) {
>     if (!this.isModified('password')) return next();
>     this.password = await bcrypt.hash(this.password, 10);
>     next();
> });
> ```
> This ensures passwords are salted and hashed automatically.

---

### 🛡️ Category E: Security & System Logic

#### Q17: How does JWT authentication work step-by-step?
> **Answer:**
> 1. User submits email/password to `/api/auth/login`.
> 2. Backend verifies bcrypt password hash.
> 3. Backend creates a token signed with `JWT_SECRET` containing `{ id, role }`.
> 4. Frontend saves token in `localStorage` and attaches it to request headers (`Authorization: Bearer <token>`).
> 5. Backend `protect` middleware decodes token with `jwt.verify()` and attaches user data to `req.user`.

#### Q18: How do you prevent a user from claiming their own item?
> **Answer:** In `itemController.js` under `submitClaim`:
> ```javascript
> if (item.poster.toString() === req.user.id) {
>     return res.status(400).json({ msg: 'You cannot claim your own item.' });
> }
> ```

#### Q19: What happens if an already resolved item receives a claim?
> **Answer:** The controller checks `if (item.status === 'resolved')` and returns an HTTP 400 Bad Request error stating that resolved items cannot be claimed.

#### Q20: How are competing claims handled when one claim is approved?
> **Answer:** In `verifyClaim`, when one claim ID is approved:
> ```javascript
> claim.status = 'approved';
> item.status = 'resolved';
> item.claims.forEach(c => {
>     if (c._id.toString() !== claimId && c.status === 'pending') {
>         c.status = 'rejected';
>     }
> });
> ```
> All other pending claims are automatically marked `rejected`.

#### Q21: How is the Free vs. Premium daily limit enforced?
> **Answer:** `User.js` defines helper method `canCreateItem()`. Free users have a maximum limit of 12 items per day, resetting at midnight. If `itemsCreatedToday >= 12`, the API returns HTTP 429 Too Many Requests with an upgrade prompt to visit `/plan`.

---

## 10. Examiner Trap Questions & Winning Answers

| Trap Question | What the Examiner is Testing | Winning Answer Strategy |
|---|---|---|
| *"Is storing JWT in localStorage vulnerable to XSS?"* | Deep knowledge of web security. | *"Yes, localStorage is vulnerable to XSS if malicious scripts execute. We mitigate this by sanitizing inputs with express-validator and setting strict CSP headers with Helmet. For enterprise applications, storing tokens in `httpOnly SameSite` cookies is the recommended next step."* |
| *"Why didn't you use WebSockets for notifications?"* | Architectural decision-making. | *"For our current application scale, database-backed REST notifications with polling keep the backend stateless, simple, and horizontally scalable. WebSockets via Socket.io are planned for our next version to support real-time chat."* |
| *"What happens if MongoDB goes down?"* | High-availability awareness. | *"MongoDB Atlas provides a managed multi-node replica set with automated failover. If the primary node fails, a secondary node is elected automatically within seconds without data loss."* |

---

## 11. Step-by-Step Live Demo Presentation Checklist

Follow this sequence during your live presentation for maximum impact:

1. **Step 1: User Registration & Email Link:** Show registration form with validation and email verification flow.
2. **Step 2: Post a Found Item (Finder Account):** Upload a picture, fill in title, category, location, date, and set an optional reward.
3. **Step 3: Explore & Filter:** Demonstrate multi-criteria search (filter by category, location, and type).
4. **Step 4: Submit a Claim (Claimant Account):** Log in with a second account and submit a claim with specific proof details.
5. **Step 5: Finder Verification:** Log back into finder account, open dashboard, inspect private proof, and click **Approve Claim**. Show competing claims getting rejected.
6. **Step 6: Owner Confirms Recovery:** Switch to claimant account, click **Confirm Recovery**. Show status changing to **Resolved**.
7. **Step 7: Gamification & Badges:** Open finder profile to show **+500 Hero Points** and newly unlocked badges.
8. **Step 8: Admin Dashboard:** Log in with admin credentials, display Recharts analytics, user management, and plan upgrade requests.

---

## 12. Last-Minute Revision Cheat Sheet

### 🔢 Standard HTTP Status Codes Used:
- `200 OK`: Successful GET / PUT / PATCH / DELETE.
- `201 Created`: Successfully created Item or User.
- `400 Bad Request`: Validation error or duplicate claim attempt.
- `401 Unauthorized`: Missing or invalid JWT token.
- `403 Forbidden`: Authenticated user lacks permission (non-admin accessing admin route).
- `404 Not Found`: Item or user not found.
- `429 Too Many Requests`: Rate limit or daily post limit reached.
- `500 Internal Server Error`: Server/database error.

### 🔑 Key Terminology:
- **Double-Handshake:** Two-party verification (Finder verifies proof $\rightarrow$ Owner confirms receipt).
- **Hero Points:** Gamification points earned by returning items (+500 on handshake).
- **Stateless Authentication:** Server does not store session IDs in memory; validity is cryptographically verified from the JWT token.
- **Virtual DOM:** In-memory representation of real DOM used by React for fast diffing and selective re-rendering.
- **Memory Storage:** Storing file buffers in RAM temporarily before piping to Cloudinary CDN.

---

### 🚀 Future Enhancements (To mention when asked about future scope):
1. **AI Image Matching:** Automatic image similarity comparison (using OpenCV / CLIP embeddings) between lost and found items.
2. **Real-Time In-App Chat:** End-to-end encrypted messaging via Socket.io between finder and claimant.
3. **Interactive Map / Geofencing:** Google Maps or Leaflet integration showing lost/found clusters and radius alerts.
4. **Mobile App:** React Native cross-platform mobile application.

---

*Best of luck with your Project Viva! Speak clearly, explain the 'why' behind each decision, and highlight your Double-Handshake Verification workflow.* 🎯
