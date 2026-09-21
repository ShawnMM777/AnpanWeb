import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./second.css";
import seondbg from "../ASSETS/second.mp4";
import routesIcon from "../ASSETS/routes.png";
import bookingIcon from "../ASSETS/booking.png";
import accountIcon from "../ASSETS/accounts.png";
import logoutIcon from "../ASSETS/logout.png";
import newsIcon from "../ASSETS/news.png";

const placesData = [
  { name: "Fushimi Inari Taisha", image: "https://pohcdn.com/sites/default/files/styles/paragraph__text_with_image___twi_image/public/2022-08/fushimi-inari-taisha-shrine_optimized_0.jpg" },
  { name: "Himeji Castle", image: "https://www.japan-guide.com/g21/3501_11.jpg" },
  { name: "Mount Fuji", image: "https://travel.rakuten.com/contents/sites/contents/files/styles/max_1300x1300/public/2023-07/mt-fuji-guide_6.jpg?itok=y6_ShwTd" },
  { name: "Universal Studios Japan", image: "https://images.squarespace-cdn.com/content/v1/57b72100e4fcb5e4aef2f4c4/abd2ae3c-bd00-4db3-87ad-6d7c49d94562/Universal-Studios-Japan-Entrance-Arch-by-Joshua-Meyer.jpeg" },
  { name: "Tokyo Tower", image: "https://www.japan-guide.com/g18/3009_01.jpg" },
  { name: "Nara Park", image: "https://thepartyingtraveler.com/wp-content/uploads/2023/11/IMG_5336.jpg" },
  { name: "Osaka City", image: "https://photos.smugmug.com/Osaka/Osaka-Categories/i-J9MFjBv/0/L/Osaka_Districts-L.jpg" },
  { name: "Nachi Waterfall", image: "https://visitwakayama.jp/lsc/upfile/spot/0000/0491/491_1_l.jpg" },
];

const Second = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentPlace, setCurrentPlace] = useState(0);
  const [fade, setFade] = useState(true); // for fade animation

  const handleRoutesClick = () => navigate('/MapRouter');
  const handleBookingClick = () => navigate('/Drafts');
  const handleAccountClick = () => navigate('/account');
  const handleNewsClick = () => navigate('/news');

  const logoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/Login');
  };
  const cancelLogout = () => setShowLogoutModal(false);

  const prevPlace = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentPlace(prev => prev === 0 ? placesData.length - 1 : prev - 1);
      setFade(true);
    }, 300); // match fade duration
  };

  const nextPlace = () => {
  setFade(false); // start fade-out
  setTimeout(() => {
    setCurrentPlace(prev => {
      let next;
      do {
        next = Math.floor(Math.random() * placesData.length);
      } while (next === prev);
      return next;
    });
    setFade(true); // fade-in after image changes
  }, 500); // match with CSS transition duration
};

  // Auto-rotate randomly every 5 seconds
  useEffect(() => {
  const interval = setInterval(() => {
    setFade(false); // start fade-out
    setTimeout(() => {
      setCurrentPlace(prev => {
        let next;
        do {
          next = Math.floor(Math.random() * placesData.length);
        } while (next === prev);
        return next;
      });
      setFade(true); // fade-in after image changes
    }, 500); // same as CSS transition duration
  }, 5000); // change every 5 seconds

  return () => clearInterval(interval);
}, []);

  return (
    <div className="second-container">
      <video className="secondbg" autoPlay loop muted playsInline>
        <source src={seondbg} type="video/mp4" />
      </video>

      <div className="main-layout">
        <div className="places-preview">
          <div className={`featured-place ${fade ? 'fade-in' : 'fade-out'}`}>
            <img
              src={placesData[currentPlace].image}
              alt={placesData[currentPlace].name}
            />
            <span>{placesData[currentPlace].name}</span>
            <button className="place-arrow left" onClick={prevPlace}>‹</button>
            <button className="place-arrow right" onClick={nextPlace}>›</button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="right-buttons">
          <button className="nav-button logout-btn" onClick={logoutClick}>
            <div className="button-icon"><img src={logoutIcon} alt="Logout" /></div>
            <span className="button-label">LOG OUT</span>
          </button>
          <button className="nav-button routes-btn" onClick={handleRoutesClick}>
            <div className="button-icon"><img src={routesIcon} alt="Routes" /></div>
            <span className="button-label">Routes</span>
          </button>
          <button className="nav-button booking-btn" onClick={handleBookingClick}>
            <div className="button-icon"><img src={bookingIcon} alt="Booking" /></div>
            <span className="button-label">BOOKING</span>
          </button>
          <button className="nav-button account-btn" onClick={handleAccountClick}>
            <div className="button-icon"><img src={accountIcon} alt="Profile" /></div>
            <span className="button-label">PROFILE</span>
          </button>
          <button className="nav-button news-btn" onClick={handleNewsClick}>
            <div className="button-icon"><img src={newsIcon} alt="News" /></div>
            <span className="button-label">News In Japan</span>
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button className="modal-btn confirm-btn" onClick={confirmLogout}>Yes</button>
              <button className="modal-btn cancel-btn" onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Second;