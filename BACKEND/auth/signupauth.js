const express = require("express");
const router = express.Router();
const { sendWelcomeEmail } = require('../emailService'); // Import email service

// Load database with error handling
let db;
try {
  db = require("../db");
  console.log('Database loaded in signupauth.js');
} catch (error) {
  console.error(' Database not loaded in signupauth.js:', error.message);
}

// Test route
router.get("/test", (req, res) => {
  console.log('Signup auth test route hit');
  res.json({
    message: "Signup auth route is working!",
    timestamp: new Date().toISOString(),
    databaseStatus: db ? "Connected" : "Not connected"
  });
});

// Signup route with email verification
router.post("/signup", (req, res) => {
  console.log('\nSIGNUP ATTEMPT RECEIVED');
  console.log('Request body:', req.body);

  const { fname, lname, email, password, pnumber, bdate } = req.body;

  // Check if database is available
  if (!db) {
    console.log('Database not available');
    return res.status(500).json({
      error: "Database connection not available"
    });
  }

  // Input validation - check for required fields
  if (!fname || !lname || !email || !password) {
    console.log('Missing required fields');
    return res.status(400).json({
      error: "First name, last name, email, and password are required",
      received: {
        fname: !!fname,
        lname: !!lname,
        email: !!email,
        password: !!password
      }
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('Invalid email format');
    return res.status(400).json({
      error: "Please provide a valid email address"
    });
  }

  // Password validation
  if (password.length < 6) {
    console.log('Password too short');
    return res.status(400).json({
      error: "Password must be at least 6 characters long"
    });
  }

  console.log(`🔍 Attempting signup for: ${email}`);

  // First check if user already exists
  const checkUserSql = "SELECT * FROM anpanusers WHERE email = ?";

  db.query(checkUserSql, [email], async (err, result) => {
    if (err) {
      console.error('Database query error (check user):', err);
      return res.status(500).json({
        error: "Database query failed",
        details: err.message
      });
    }

    if (result.length > 0) {
      console.log('User already exists');
      return res.status(400).json({
        error: "An account with this email address already exists. Please use a different email or try logging in."
      });
    }

    console.log('Email is available, creating user...');

    // Insert new user into the correct table (anpanusers)
    const insertSql = "INSERT INTO anpanusers (fname, lname, email, password, pnumber, bdate) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(insertSql, [fname, lname, email, password, pnumber || null, bdate || null], async (err, insertResult) => {
      if (err) {
        console.error('Insert error:', err);
        console.error('SQL Error:', err.sqlMessage);
        return res.status(500).json({
          error: "Failed to create user account",
          details: err.sqlMessage
        });
      }

      console.log('User created successfully');

      // Send welcome email
      console.log('Sending welcome email...');
      const emailResult = await sendWelcomeEmail(email, fname);

      const response = {
        success: true,
        message: emailResult.success
          ? "Account created successfully! A welcome email has been sent to your address."
          : "Account created successfully! However, we couldn't send a welcome email.",
        userId: insertResult.insertId,
        user: {
          fname: fname,
          lname: lname,
          email: email
        },
        emailSent: emailResult.success
      };

      if (!emailResult.success) {
        console.error('Welcome email failed:', emailResult.error);
        response.emailError = emailResult.error;
      } else {
        console.log('Welcome email sent successfully');
      }

      console.log('Sending success response');
      res.json(response);
    });
  });
});

// Email verification route (if you want to add email verification later)
router.post("/verify-email", (req, res) => {
  const { token } = req.body;

  if (!db) {
    return res.status(500).json({
      error: "Database connection not available"
    });
  }

  // This would be used if you implement email verification tokens
  // For now, it's just a placeholder
  res.json({
    success: true,
    message: "Email verification not implemented yet"
  });
});

console.log('signupauth.js module loaded with email functionality');

module.exports = router;