# Sajha Khoj (साझा खोज) 🔍

**Sajha Khoj** is a professional, high-fidelity Lost and Found platform designed to help communities recover lost items through transparency, trust, and secure verification. Built with the MERN stack, it features a modern, mobile-first design and a robust "Double-Handshake" recovery workflow.

---

## 🚀 Key Features

- **Intelligent Discovery**: Advanced filtering and search logic in a production-grade database.
- **Double-Handshake Verification**: A secure process where finders verify owners' proof before revealing identity.
- **Next Step Portal**: A dynamic action hub that guides users through their most urgent tasks.
- **Reputation System**: Earn "Hero Points" and unlock community badges by helping others.
- **Mobile-First Experience**: Fully responsive, high-fidelity UI optimized for all devices.
- **Real-Time Notifications**: Stay updated on claims, approvals, and community activity.

---

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Framer Motion, Lucide React, Tailwind CSS (optional/utils).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas).
- **Media**: Cloudinary (Image hosting).
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs.

---

## 📥 Installation & Setup

### Prerequisites
- Node.js installed on your machine.
- MongoDB Atlas account or local MongoDB instance.
- Cloudinary account for image uploads.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sajha-khoj.git
cd sajha-khoj
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` folder based on `.env.example`.
- Add your `MONGO_URI`, `JWT_SECRET`, and Cloudinary credentials.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
- Create a `.env` file in the `frontend` folder based on `.env.example`.
- Ensure `VITE_API_BASE_URL` points to your backend (default: `http://localhost:5000/api`).

---

## 🏃‍♂️ Running the Application

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🛡 Security & Privacy
- **Environment Variables**: Sensitive data is protected via `.env` files and ignored by Git.
- **Identity Protection**: Contact details are only shared *after* the finder approves the owner's proof.
- **Password Hashing**: User passwords are encrypted using `bcryptjs`.

---

## 📄 License
This project is licensed under the MIT License.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

**Sajha Khoj** - *Bringing your lost items back home.* 🏠✨
