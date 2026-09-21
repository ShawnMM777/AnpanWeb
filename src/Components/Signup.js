import { useState } from 'react';
import mp4bgsignup from '../ASSETS/signbg.mp4';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    // Validate step 1 fields
    if (currentStep === 1) {
      if (!firstName || !lastName || !contact || !birthDate) {
        setMessage('Please fill in all required fields');
        setMessageType('error');
        return;
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      setMessage('');
    }
  };

  const handlePreviousStep = (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {setMessage('Please enter a valid email address');setMessageType('error');
    return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch("http://localhost:8081/BACKEND/auth/signupauth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fname: firstName,
          lname: lastName,
          email,
          password,
          pnumber: contact,
          bdate: birthDate,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Account created successfully! Please check your email for verification instructions.');
        setMessageType('success');
        setEmailSent(true);

        // Clear form data for security
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setContact('');
        setBirthDate('');
      } else {
        setMessage(data.error || "Signup failed. Please try again.");
        setMessageType('error');
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Network error. Please check your connection and try again.");
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    // If email was sent successfully, show confirmation
    if (emailSent) {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px', color: '#28a745' }}>
          </div>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>
            Registration Successful!
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px', fontSize: '14px' }}>
            We've sent a welcome email to your address. You can now log in to your account.
          </p>
          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate('/login')}
            style={{ marginBottom: '10px' }}
          >
            Go to Login
          </button>
          <button
            type="button"
            className="back-btn"
            onClick={() => {
              setEmailSent(false);
              setCurrentStep(1);
              setMessage('');
            }}
          >
            Register Another Account
          </button>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                required
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                required
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact">Contact Number</label>
              <input type="tel"id="contact"requiredplaceholder="09********"value={contact} onChange={(e) => setContact(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="birthdate">Birthdate</label>
              <input type="date"id="birthdate" required  value={birthDate}  onChange={(e) => setBirthDate(e.target.value)}/>
            </div>
            <div className="button-container">
              <button type="button"className="cssbuttons-io-button"onClick={handleNextStep} >
                Next
                <div className="icon">
                  <svg height="24"width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path>
                  </svg>
                </div>
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                required
                placeholder="youremail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                We'll send you a welcome email after registration
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                required
                placeholder="Enter your password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                Minimum 6 characters required
              </small>
            </div>
            <div className="form-buttons">
              <button
                type="button"
                className="back-btn"
                onClick={handlePreviousStep}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="signup-btn"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="signup-form-container">
      <video autoPlay loop muted className="background-video">
        <source src={mp4bgsignup} type="video/mp4" />
      </video>
      <div className="form-wrapper">
        <div className="form-content">
          <h2 className="form-title">SIGN UP</h2>

          {!emailSent && (
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          )}

          <form onSubmit={currentStep === 2 ? handleSubmit : handleNextStep}>
            {renderStepContent()}
          </form>

          {!emailSent && (
            <div className="form-footer">
              <a href="/login" className="login-link">
                Already have an account? Log in
              </a>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: messageType === 'success'
                ? 'rgba(40, 167, 69, 0.2)'
                : 'rgba(220, 53, 69, 0.2)',
              border: `1px solid ${messageType === 'success'
                ? 'rgba(40, 167, 69, 0.3)'
                : 'rgba(220, 53, 69, 0.3)'}`,
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;