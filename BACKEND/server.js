require('dotenv').config();
const express = require("express");
const cors = require("cors"); 
const paypal = require ('paypal-rest-sdk');
const bodyParser = require('body-parser');
const axios = require('axios');
const { redirect } = require('react-router-dom');

const app = express();
const PORT = 8081;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//payment
const paymentRoutes = require('./routes/payments');
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Payment server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
})


app.use(cors({
  origin: ['http://localhost:3003', 'http://localhost:3000', 'http://localhost:3002', 'http://192.168.56.1:3000'], // Added 3002
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log(`\n ${new Date().toISOString()}`);
  console.log(` ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

app.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({
    message: 'Backend server is running!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});
try {
  const signupRoute = require("./auth/signupauth");
  app.use("/BACKEND/auth/signupauth", signupRoute);
  console.log('Signup routes loaded');
} catch (error) {
  console.error('Error loading signup routes:', error.message);
}

try {
  const loginRoute = require("./auth/loginauth");
  app.use("/BACKEND/auth/loginauth", loginRoute);
  console.log('Login routes loaded');
} catch (error) {
  console.error('Error loading login routes:', error.message);
}

app.use((req, res, next) => { const originalJson = res.json;res.json = function (data) {console.log('Sending response:', data);console.log('Status:', res.statusCode);return originalJson.call(this, data); }; next() });

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Test: http://localhost:8081/test');
  console.log('Auth: http://localhost:8081/BACKEND/auth/loginauth/test');
  console.log('================================\n');
});

process.on('SIGINT', () => {
  console.log('\nServer shutting down...');
  process.exit(0);
});