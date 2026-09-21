require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server requests and local development without an Origin header.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Make the shared MySQL pool available to routes that use req.pool.
app.use((req, res, next) => {
  req.pool = db;
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Payment server is running' });
});

app.get('/test', (req, res) => {
  res.json({
    message: 'Backend server is running!',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/payments', require('./routes/payments'));
app.use('/BACKEND/auth/signupauth', require('./auth/signupauth'));
app.use('/BACKEND/auth/loginauth', require('./auth/loginauth'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Vercel imports this module; local development starts it below.
if (require.main === module) {
  const port = Number(process.env.PORT) || 8081;
  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}

module.exports = app;
