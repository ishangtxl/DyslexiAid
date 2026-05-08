const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load env variables FIRST, before requiring routes
dotenv.config({ path: __dirname + '/.env' });

// NOW require routes after env is loaded
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

const parseAllowedOrigins = () => (
  process.env.CORS_ORIGINS || ''
).split(',').map(origin => origin.trim()).filter(Boolean);

const allowedOrigins = parseAllowedOrigins();

// CORS is permissive only when no explicit allowlist is configured outside
// production. Set CORS_ORIGINS to a comma-separated list before enabling
// credentialed production auth.
app.use(cors({
  origin: allowedOrigins.length > 0
    ? allowedOrigins
    : process.env.NODE_ENV === 'production' ? false : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: process.env.CORS_CREDENTIALS === 'true'
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.API_RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

// Body parsing middleware with explicit size limits for image/audio-adjacent APIs
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '8mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Routes
app.use('/api', apiLimiter, apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.status ? 'Bad Request' : 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(allowedOrigins.length > 0
    ? `CORS enabled for configured origins: ${allowedOrigins.join(', ')}`
    : `CORS ${process.env.NODE_ENV === 'production' ? 'disabled without CORS_ORIGINS' : 'enabled for development origins'}`);
});
