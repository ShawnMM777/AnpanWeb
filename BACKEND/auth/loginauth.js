const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../emailService'); // Adjust path as needed

let db;
try {
    db = require("../db");
    console.log('Database loaded in loginauth.js');
} catch (error) {
    console.error('Database not loaded in loginauth.js:', error.message);
}

router.get("/test", (res) => {
    console.log('Login auth test route hit');
    res.json({ message: "Login auth route is working!",timestamp: new Date().toISOString(), databaseStatus: db ? "Connected" : "Not connected" });
    req
});

router.post("/login", (req, res) => {
    console.log('\nLOGIN ATTEMPT RECEIVED');
    console.log('Request body:', req.body);
    const { email, password } = req.body;
    if (email , password) {
        console.log(' Missing email or password');
        return res.status(400).json({error: "Email and password are required",received: { email: email, password: password }});
    }
    if (!db) {
        console.log('Database not available');
        return res.status(500).json({error: "Database connection not available",details: "MySQL may not be running or db.js failed to load"});
    }
    console.log(`Attempting login for: ${email}`);
    const admin = "SELECT * FROM anpanadmin WHERE email = ? AND password = ?";
    const sql = "SELECT * FROM anpanusers WHERE email = ? AND password = ?";
    //DATABASE FOR USERS 
    db.query(sql, [email, password], (err, result) => {
    if (err) {console.error('❌ Database query error:');console.error('Code:', err.code);console.error('Message:', err.message);return res.status(500).json({error: "Database query failed",code: err.code,message: err.message});}
    console.log(`Query successful. Found ${result.length} matching users`);
    if (result.length > 0) {console.log('Login successful');const response = {success: true,message: "Login successful",user: {id: result[0].id,fname: result[0].fname,lname: result[0].lname,email: result[0].email}};console.log('Sending success response');res.json(response);} else {console.log('Invalid credentials');const response = {error: "Invalid email or password"};console.log('Sending error response');res.status(401).json(response);}});
    //DATABASE FOR ADMINS OR MERCHANTS
    //db.query(admin.[email, password], (err, result) = {
    //if (err) {console.error('Database Admin Query Are Error');console.error('Code:', err.code);console.error('Messsage:', err,message);return res.status(500).json({error: "Database query admin failed", code: err.code,message});} 
    //console.log(`Query Admin Sucessful. Found ${result.length} matching admin`);
    //if (result.length > 0 ) console.log('Login Success'); const response = {success: true,message: "Login Successful", user: {id: result[0].id.email}}})
});


router.post("/forgot-password", (req, res) => {
    console.log('\n FORGOT PASSWORD REQUEST');
    console.log('Request body:', req.body);

    const { email } = req.body;

    // Input validation
    if (!email) {
        console.log(' Missing email');
        return res.status(400).json({
            error: "Email is required"
        });
    }

    // Check if database is available
    if (!db) {
        console.log(' Database not available');
        return res.status(500).json({
            error: "Database connection not available"
        });
    }

    console.log(`Checking if user exists: ${email}`);

    // Check if user exists
    const checkUserSql = "SELECT * FROM anpanusers WHERE email = ?";

    db.query(checkUserSql, [email], async (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({
                error: "Database query failed",
                details: err.message
            });
        }

        if (result.length === 0) {
            console.log('User not found');
            // For security, we still send success message but don't reveal if email exists
            return res.json({
                success: true,
                message: "If this email exists in our system, you will receive password reset instructions shortly."
            });
        }

        console.log('User found, generating reset token');

        const user = result[0];

        // Generate secure reset token using crypto
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

        // Store reset token in database
        const updateTokenSql = "UPDATE anpanusers SET reset_token = ?, reset_expires = ? WHERE email = ?";

        db.query(updateTokenSql, [resetToken, resetExpires, email], async (err, updateResult) => {
            if (err) {
                console.error('Error storing reset token:', err);
                return res.status(500).json({
                    error: "Failed to generate reset token",
                    details: err.message
                });
            }

            if (updateResult.affectedRows === 0) {
                console.error('No rows updated');
                return res.status(500).json({
                    error: "Failed to update user record"
                });
            }

            console.log('Reset token stored in database');

            // Send password reset email
            console.log('Sending password reset email...');
            const emailResult = await sendPasswordResetEmail(email, resetToken, user.fname);

            if (emailResult.success) {
                console.log('Password reset email sent successfully');
                res.json({
                    success: true,
                    message: "Password reset instructions have been sent to your email address.",
                    emailSent: true
                });
            } else {
                console.error('Failed to send email:', emailResult.error);

                // Clean up the reset token since email failed
                db.query("UPDATE anpanusers SET reset_token = NULL, reset_expires = NULL WHERE email = ?", [email]);

                res.status(500).json({
                    error: "Failed to send password reset email. Please try again later.",
                    details: emailResult.error
                });
            }
        });
    });
});

// Reset password route
router.post("/reset-password", (req, res) => {
    console.log('\n PASSWORD RESET REQUEST');
    console.log('Request body (token hidden):', { ...req.body, token: '[HIDDEN]' });

    const { token, newPassword } = req.body;

    // Input validation
    if (!token || !newPassword) {
        console.log('Missing token or new password');
        return res.status(400).json({
            error: "Reset token and new password are required"
        });
    }

    if (newPassword.length < 6) {
        console.log('Password too short');
        return res.status(400).json({
            error: "Password must be at least 6 characters long"
        });
    }

    if (!db) {
        console.log('Database not available');
        return res.status(500).json({
            error: "Database connection not available"
        });
    }

    console.log('🔍 Validating reset token');

    // Find user with valid reset token (not expired)
    const findUserSql = "SELECT * FROM anpanusers WHERE reset_token = ? AND reset_expires > NOW()";

    db.query(findUserSql, [token], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({
                error: "Database query failed"
            });
        }

        if (result.length === 0) {
            console.log('Invalid or expired reset token');
            return res.status(400).json({
                error: "Invalid or expired reset token. Please request a new password reset."
            });
        }

        console.log('Valid token found, updating password');

        const user = result[0];

        // Update password and clear reset token
        const updatePasswordSql = "UPDATE anpanusers SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?";

        db.query(updatePasswordSql, [newPassword, user.id], (err, updateResult) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({
                    error: "Failed to update password"
                });
            }

            console.log('Password updated successfully');

            res.json({
                success: true,
                message: "Your password has been reset successfully. You can now log in with your new password."
            });
        });
    });
});

// Email verification status check route
router.get("/verify-token/:token", (req, res) => {
    const { token } = req.params;

    if (!db) {
        return res.status(500).json({
            error: "Database connection not available"
        });
    }

    const checkTokenSql = "SELECT email, reset_expires FROM anpanusers WHERE reset_token = ?";

    db.query(checkTokenSql, [token], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: "Database query failed"
            });
        }

        if (result.length === 0) {
            return res.status(400).json({
                valid: false,
                error: "Invalid reset token"
            });
        }

        const user = result[0];
        const now = new Date();
        const expiresAt = new Date(user.reset_expires);

        if (now > expiresAt) {
            return res.status(400).json({
                valid: false,
                error: "Reset token has expired"
            });
        }

        res.json({
            valid: true,
            email: user.email,
            expiresAt: expiresAt
        });
    });
});

console.log('loginauth.js module loaded with email functionality');

module.exports = router;
