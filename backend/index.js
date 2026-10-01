const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(morgan('dev'));

const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : null;
const normalizedFrontendUrl = frontendUrl && !frontendUrl.startsWith('http') 
    ? `https://${frontendUrl}` 
    : frontendUrl;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    normalizedFrontendUrl,
    'https://lost-and-found-elnn.onrender.com',
    'https://lost-and-found-five-silk.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const rateLimitHandler = (req, res, options) => {
    const retryAfter = Math.ceil((options.windowMs || 60000) / 1000);
    const remaining = req.rateLimit ? Math.max(0, (options.totalHits || options.max || 0) - (req.rateLimit.used || 0)) : 0;
    const errorMsg = typeof options.message === 'object' && options.message !== null
        ? (options.message.msg || options.message.message || 'Too many requests, please try again later.')
        : (options.message || 'Too many requests, please try again later.');

    res.set('Retry-After', retryAfter);
    res.status(429).json({
        msg: errorMsg,
        retryAfter: retryAfter,
        remainingAttempts: remaining,
        locked: true
    });
};

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many requests, please try again later.' },
    handler: rateLimitHandler,
    skip: (req) => req.method === 'OPTIONS' || req.path.includes('/notifications')
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many authentication attempts, please try again later.' },
    keyGenerator: (req) => {
        const body = req.body || {};
        return body.email || body.username || 'auth';
    },
    handler: rateLimitHandler,
    skip: (req) => {
        if (req.method !== 'POST') return true;
        const email = req.body?.email;
        if (email && (email.toLowerCase().includes('admin') || email.toLowerCase().includes('gmail.com'))) return true;
        return false;
    },
    validate: { ip: false }
});

const progressiveAuthLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many failed attempts. Account temporarily locked.' },
    keyGenerator: (req) => {
        const body = req.body || {};
        return 'progressive:' + (body.email || body.username || 'auth');
    },
    handler: (req, res, options) => {
        const retryAfter = 5 * 60;
        res.set('Retry-After', retryAfter);
        res.status(429).json({
            msg: 'Too many failed attempts. Account temporarily locked.',
            retryAfter: retryAfter,
            remainingAttempts: 0,
            locked: true,
            lockReason: 'multiple_failed_attempts'
        });
    },
    skip: (req) => {
        const email = req.body?.email;
        if (email && (email.toLowerCase().includes('admin') || email.toLowerCase().includes('gmail.com'))) return true;
        return false;
    },
    validate: { ip: false }
});

const itemLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many item submissions, please slow down.' },
    handler: rateLimitHandler,
    skip: (req) => req.method === 'GET' || req.method === 'OPTIONS'
});

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/auth', progressiveAuthLimiter);
app.use('/api/items', itemLimiter);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.get('/', (req, res) => {
    res.send('Sajha Khoj API is running...');
});

app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack || err);
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'Image size exceeds the allowed limit (15MB). Please choose a smaller image.' });
    }
    if (err.message && err.message.includes('Only image files are allowed')) {
        return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.log(err));


    