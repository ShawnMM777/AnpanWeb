const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
    return nodemailer.createTransport({ // FIXED: was createTransporter, now createTransport
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
        }
    });
};

// Alternative configuration for other SMTP services
const createCustomTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const sendPasswordResetEmail = async (email, resetToken, userFirstName) => {
    try {
        console.log('🔧 EMAIL DEBUG:');
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
        console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0); // FIXED: now shows actual length

        console.log('nodemailer type:', typeof nodemailer);
        console.log('createTransport type:', typeof nodemailer.createTransport);

        const transporter = nodemailer.createTransport({ // FIXED: createTransport not createTransporter
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Test the connection first
        console.log('Testing SMTP connection...');
        await transporter.verify();
        console.log('SMTP connection verified');

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3002'}/resetpassword?token=${resetToken}`;
        console.log('Reset URL:', resetUrl);

        const mailOptions = {
            from: {
                name: 'Anpan Service',
                address: process.env.EMAIL_USER || 'your-email@gmail.com'
            },
            to: email,
            subject: 'Password Reset Request - Anpan Service',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            line-height: 1.6; 
                            color: #333;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 20px;
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 0 auto; 
                            background-color: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .reset-button {
                            display: inline-block;
                            background-color: #007bff;
                            color: white;
                            padding: 12px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
                        }
                        .reset-button:hover {
                            background-color: #0056b3;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eee;
                            font-size: 14px;
                            color: #666;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border: 1px solid #ffeeba;
                            color: #856404;
                            padding: 15px;
                            border-radius: 5px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Request</h1>
                        </div>
                        
                        <p>Hello ${userFirstName || 'User'},</p>
                        
                        <p>We received a request to reset the password for your Anpan Service account associated with this email address.</p>
                        
                        <p>If you made this request, please click the button below to reset your password:</p>
                        
                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="reset-button">Reset My Password</a>
                        </div>
                        
                        
                        <div class="warning">
                            <strong>Security Notice:</strong>
                            <ul>
                                <li>This link will expire in 1 hour for security reasons</li>
                                <li>If you didn't request this password reset, please ignore this email</li>
                                <li>Your password will remain unchanged unless you click the link above</li>
                            </ul>
                        </div>
                        
                        <div class="footer">
                            <p>This is an automated message from AnPan Project. Please do not reply to this email.</p>
                            <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Password Reset Request - AnPan Project
                
                Hello ${userFirstName || 'User'},
                
                We received a request to reset the password for your AnPan Project account.
                
                Please visit the following link to reset your password:
                ${resetUrl}
                
                This link will expire in 1 hour for security reasons.
                
                If you didn't request this password reset, please ignore this email.
                Your password will remain unchanged.
                
                This is an automated message from AnPan Project.
            `
        };

        console.log('Sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error: error.message };
    }
};

// Send email verification for new registrations
const sendWelcomeEmail = async (email, userFirstName) => {
    try {
        const transporter = nodemailer.createTransport({ // FIXED: Direct call instead of createTransporter()
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: {
                name: 'ANPAN',
                address: process.env.EMAIL_USER || 'your-email@gmail.com'
            },
            to: email,
            subject: 'Welcome to ANPAN SERVICE !',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #007bff;">⛩️Welcome to Anpan Japan⛩️</h1>
                    <p>Hello ${userFirstName},</p>
                    <p>Thank you for Sign For Anpan Book Website😊Your account has been successfully created.</p>
                    <p>You can now log in and start using our services.</p>
                    <p>If you have any questions, feel free to contact our support team.</p>
                    <p>Best regards,<br>The Anpan Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendWelcomeEmail
};