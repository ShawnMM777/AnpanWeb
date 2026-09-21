import React, { useState } from "react";
import './forgotpass.css';
import { useNavigate } from "react-router-dom";
import bgimage from '../ASSETS/fg.jpg';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setMessageType("");

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email address.");
            setMessageType("error");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/BACKEND/auth/loginauth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage(data.message);
                setMessageType("success");
                setEmailSent(true);

                // Clear the email field for security
                setEmail("");
            } else {
                setMessage(data.error || "Failed to send reset instructions");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Network error:", error);
            setMessage("Network error. Please check your internet connection and try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = () => {
        setEmailSent(false);
        setMessage("");
        setMessageType("");
    };

    return (
        <div className="auth-form-container forgotpassword">
            <img src={bgimage} alt="Background" className="background-image" />
            <div className="form-wrapper">
                <div className="form-content">
                    <h2 className="form-title">Reset Your Password</h2>

                    {!emailSent ? (
                        <>
                            <p style={{
                                color: "rgba(255, 255, 255, 0.8)",
                                textAlign: "center",
                                marginBottom: "20px",
                                fontSize: "14px"
                            }}>
                                Enter your email address and we'll send you instructions to reset your password.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        placeholder="Enter your registered email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <button type="submit" className="login-btn" disabled={loading}>
                                    {loading ? (
                                        <span>
                                            <span style={{ marginRight: "10px" }}>📧</span>
                                            Sending Reset Email...
                                        </span>
                                    ) : (
                                        "Send Reset Instructions"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="home-btn"
                                    disabled={loading}
                                >
                                    Back to Login
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                fontSize: "48px",
                                marginBottom: "20px",
                                color: "rgba(255, 255, 255, 0.9)"
                            }}>
                                📧
                            </div>

                            <h3 style={{
                                color: "white",
                                marginBottom: "15px",
                                fontSize: "18px"
                            }}>
                                Check Your Email
                            </h3>

                            <p style={{
                                color: "rgba(255, 255, 255, 0.8)",
                                marginBottom: "20px",
                                fontSize: "14px",
                                lineHeight: "1.6"
                            }}>
                                We've sent password reset instructions to your email address.
                                Please check your inbox and follow the instructions to reset your password.
                            </p>

                            <div style={{
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                padding: "15px",
                                borderRadius: "8px",
                                marginBottom: "20px",
                                fontSize: "13px",
                                color: "rgba(255, 255, 255, 0.7)"
                            }}>
                                <strong>Don't see the email?</strong>
                                <ul style={{ textAlign: "left", marginTop: "8px", paddingLeft: "20px" }}>
                                    <li>Check your spam/junk folder</li>
                                    <li>Make sure you entered the correct email address</li>
                                    <li>Wait a few minutes for the email to arrive</li>
                                </ul>
                            </div>

                            <button
                                type="button"
                                onClick={handleResendEmail}
                                className="login-btn"
                                style={{ marginBottom: "10px" }}
                            >
                                Try Different Email
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="home-btn"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                    {message && (
                        <div style={{
                            marginTop: "20px",
                            padding: "15px",
                            backgroundColor: messageType === "success"
                                ? "rgba(40, 167, 69, 0.2)"
                                : "rgba(220, 53, 69, 0.2)",
                            border: `1px solid ${messageType === "success"
                                ? "rgba(40, 167, 69, 0.3)"
                                : "rgba(220, 53, 69, 0.3)"}`,
                            borderRadius: "8px",
                            color: "white",
                            textAlign: "center",
                            fontSize: "14px",
                            lineHeight: "1.5"
                        }}>
                            <div style={{ marginBottom: "5px" }}>
                                {messageType === "success" ? "Done" : "Wrong"}
                            </div>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;