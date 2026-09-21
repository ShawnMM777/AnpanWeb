import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./resetpassword.css";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [token, setToken] = useState("");
    const [tokenValid, setTokenValid] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

    // Password validation states
    const [passwordChecks, setPasswordChecks] = useState({
        minLength: false,
        hasNumber: false,
        hasSpecial: false,
        hasUpper: false,
        match: false
    });

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (resetToken) {
            setToken(resetToken);
            verifyToken(resetToken);
        } else {
            setMessage("No reset token provided. Please use the link from your email.");
            setMessageType("error");
            setTokenValid(false);
        }
    }, [searchParams]);

    // Verify token with backend
    const verifyToken = async (token) => {
        try {
            const response = await fetch(`http://localhost:8081/BACKEND/auth/loginauth/verify-token/${token}`);
            const data = await response.json();

            if (response.ok && data.valid) {
                setTokenValid(true);
                setUserEmail(data.email);
            } else {
                setTokenValid(false);
                setMessage(data.error || "Invalid or expired reset token");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Token verification error:", error);
            setTokenValid(false);
            setMessage("Unable to verify reset token. Please try again.");
            setMessageType("error");
        }
    };

    useEffect(() => {
        if (newPassword) {
            setPasswordChecks({
                minLength: newPassword.length >= 8,
                hasNumber: /\d/.test(newPassword),
                hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
                hasUpper: /[A-Z]/.test(newPassword),
                match: newPassword === confirmPassword && confirmPassword !== ""
            });
        } else {
            setPasswordChecks({
                minLength: false,
                hasNumber: false,
                hasSpecial: false,
                hasUpper: false,
                match: false
            });
        }
    }, [newPassword, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setMessageType("");

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            setMessageType("error");
            setLoading(false);
            return;
        }

        // Validate password strength
        const allChecksPass = Object.values(passwordChecks).every(check => check);
        if (!allChecksPass) {
            setMessage("Please ensure your password meets all the requirements");
            setMessageType("error");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/BACKEND/auth/loginauth/resetpassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage(data.message);
                setMessageType("success");
                setPasswordResetSuccess(true);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setMessage(data.error || "Failed to reset password");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Network error:", error);
            setMessage("Network error. Please check your connection and try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = (isValid) => {
        return isValid ? "#28a745" : "#dc3545";
    };

    // Loading state while verifying token
    if (tokenValid === null) {
        return (
            <div className="auth-form-container">
                <div className="form-wrapper">
                    <div className="form-content">
                        <div style={{ textAlign: "center", color: "white" }}>
                            <div style={{ fontSize: "24px", marginBottom: "20px" }}>
                                Verifying reset token...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (tokenValid === false) {
        return (
            <div className="auth-form-container">
                <div className="form-wrapper">
                    <div className="form-content">
                        <h2 className="form-title">Invalid Reset Link</h2>

                        <div style={{
                            textAlign: "center",
                            backgroundColor: "rgba(220, 53, 69, 0.2)",
                            border: "1px solid rgba(220, 53, 69, 0.3)",
                            borderRadius: "8px",
                            padding: "20px",
                            marginBottom: "20px"
                        }}>
                            <div style={{ fontSize: "48px", marginBottom: "15px" }}>⚠️</div>
                            <p style={{ color: "white", marginBottom: "15px" }}>
                                {message || "This password reset link is invalid or has expired."}
                            </p>
                            <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14px" }}>
                                Password reset links expire after 1 hour for security reasons.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="login-btn"
                            style={{ marginBottom: "10px" }}
                        >
                            Request New Reset Link
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="home-btn"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Success state after password reset
    if (passwordResetSuccess) {
        return (
            <div className="auth-form-container">
                <div className="form-wrapper">
                    <div className="form-content">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "48px", marginBottom: "20px", color: "#28a745" }}>
                                ✅
                            </div>

                            <h2 className="form-title">Password Reset Successful!</h2>

                            <p style={{
                                color: "rgba(255, 255, 255, 0.8)",
                                marginBottom: "20px",
                                fontSize: "16px"
                            }}>
                                Your password has been successfully reset. You will be redirected to the login page in a few seconds.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="login-btn"
                            >
                                Login Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-form-container">
            <div className="form-wrapper">
                <div className="form-content">
                    <h2 className="form-title">Set New Password</h2>

                    {userEmail && (
                        <p style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            textAlign: "center",
                            marginBottom: "20px",
                            fontSize: "14px"
                        }}>
                            Setting new password for: <strong>{userEmail}</strong>
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                required
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                required
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                   
                        {newPassword && (
                            <div style={{
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                padding: "15px",
                                marginBottom: "20px",
                                fontSize: "12px"
                            }}>
                                <div style={{ marginBottom: "10px", color: "white", fontWeight: "bold" }}>
                                    Password Requirements:
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                                    <div style={{ color: getPasswordStrengthColor(passwordChecks.minLength) }}>
                                        {passwordChecks.minLength ? "✓" : "✗"} At least 8 characters
                                    </div>
                                    <div style={{ color: getPasswordStrengthColor(passwordChecks.hasUpper) }}>
                                        {passwordChecks.hasUpper ? "✓" : "✗"} One uppercase letter
                                    </div>
                                    <div style={{ color: getPasswordStrengthColor(passwordChecks.hasNumber) }}>
                                        {passwordChecks.hasNumber ? "✓" : "✗"} One number
                                    </div>
                                    <div style={{ color: getPasswordStrengthColor(passwordChecks.hasSpecial) }}>
                                        {passwordChecks.hasSpecial ? "✓" : "✗"} One special character
                                    </div>
                                </div>
                                {confirmPassword && (
                                    <div style={{
                                        color: getPasswordStrengthColor(passwordChecks.match),
                                        marginTop: "5px"
                                    }}>
                                        {passwordChecks.match ? "✓" : "✗"} Passwords match
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading || !Object.values(passwordChecks).every(check => check)}
                        >
                            {loading ? "Resetting Password..." : "Reset Password"}
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
                            fontSize: "14px"
                        }}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;