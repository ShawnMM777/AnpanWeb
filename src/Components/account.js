import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./account.css";
import profileBg from "../ASSETS/profile.png"; 

const Account = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+63 912 345 6789",
    country: "Philippines",
    bio: "Traveler. Dreamer. Food Explorer.",
    profilePic: "https://cdn-icons-png.flaticon.com/512/149/149071.png",


  });

  const [bookings, setBookings] = useState([]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };
  const handleBack = () => navigate("/Second");
  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="account-container"
      style={{
        backgroundImage: `url(${profileBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="account-card">
        <h1 className="account-title">My Profile</h1>

        <div className="profile-pic-container">
          <img src={profile.profilePic} alt="Profile" className="profile-pic" />
          {isEditing && (
            <label className="upload-label">
              Change Photo
              <input type="file" accept="image/*" onChange={handleProfilePicChange} className="file-input" />
            </label>
          )}
        </div>

        <div className="info-section">
          <label>Full Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} disabled={!isEditing} />

          <label>Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} disabled={!isEditing} />

          <label>Phone Number</label>
<input
  type="tel"
  name="phone"
  value={profile.phone}
  onChange={(e) => {
    
    const value = e.target.value.replace(/[^\d+\-() ]/g, "");
    setProfile({ ...profile, phone: value });
  }}
  disabled={!isEditing}
/>


          <label>Country</label>
          <select name="country" value={profile.country} onChange={handleChange} disabled={!isEditing}>
            <option>Philippines</option>
            <option>Japan</option>
            <option>South Korea</option>
            <option>Thailand</option>
            <option>USA</option>
            <option>Canada</option>
          </select>

          <label>Bio</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} disabled={!isEditing} />
        </div>

        <div className="bookings-section">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <p>No schedule yet.</p>
          ) : (
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id}>
                  <span className="booking-ticket">{booking.ticket}</span>
                  <span className="booking-date">{booking.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="button-group">
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
          )}
          <button className="back-btn" onClick={handleBack}>← Back</button>
        </div>
      </div>
    </div>
  );
};

export default Account;