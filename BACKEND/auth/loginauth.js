const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../emailService');
const db = require('../db');

router.get("/test", (req, res) => {
    res.json({
        message: "Login auth route is working!",
        timestamp: new Date().toISOString(),
        databaseStatus: db ? "Configured" : "Not configured"
    });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const sql = "SELECT * FROM anpanusers WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: "Database query failed" });
        }
        if (result.length === 0) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const user = result[0];
        return res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                email: user.email
            }
        });
    });
});

router.post("/forgot-password", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    db.query("SELECT * FROM anpanusers WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json({ error: "Database query failed" });
        if (result.length === 0) {
            return res.json({ success: true, message: "If this email exists in our system, you will receive password reset instructions shortly." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000);
        db.query("UPDATE anpanusers SET reset_token = ?, reset_expires = ? WHERE email = ?", [resetToken, resetExpires, email], async (updateError) => {
            if (updateError) return res.status(500).json({ error: "Failed to generate reset token" });
            const emailResult = await sendPasswordResetEmail(email, resetToken, result[0].fname);
            if (!emailResult.success) {
                db.query("UPDATE anpanusers SET reset_token = NULL, reset_expires = NULL WHERE email = ?", [email]);
                return res.status(500).json({ error: "Failed to send password reset email. Please try again later." });
            }
            return res.json({ success: true, message: "Password reset instructions have been sent to your email address.", emailSent: true });
        });
    });
});

module.exports = router;