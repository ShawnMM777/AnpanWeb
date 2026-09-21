import React, { useState } from "react";
import mp4bglg from "../ASSETS/login.mp4";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // FIXED: Changed from /router to /login to match your backend route
      const response = await fetch("http://localhost:8081/BACKEND/auth/loginauth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Response body:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        alert("Server returned invalid response");
        return;
      }

      if (response.ok && data.success) {
        alert(`Login successful! Welcome ${data.user?.fname || 'User'}!`);
        navigate("/second");
      } else {
        alert(data?.error || "Login failed");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check if the backend server is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <video autoPlay loop muted className="background-video">
        <source src={mp4bglg} type="video/mp4" />
      </video>

      <div className="form-wrapper">
        <div className="form-content">
          <h2 className="form-title">Login</h2>

          {/* Form starts here */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="youremail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="home-btn"
            >
              HOME
            </button>
          </form>

          <div className="form-footer">
            <a href="/signup" className="signup-link">
              Don&apos;t have an account? Sign up
            </a>
          </div>
          <div className="form-footer">
            <a href="/forgotpassword" className="signup-link">Forgot Password</a>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;