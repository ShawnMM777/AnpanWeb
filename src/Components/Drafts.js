import { useState } from "react";
import "./Drafts.css";

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  return (
    <div className="drafts-container">
      <h2 className="drafts-title">Your Drafts</h2>
      {drafts.length === 0 ? (
        <p className="empty-text">No places selected yet.</p>
      ) : (
        <div className="draft-list">
          {drafts.map((item, index) => (
            <div key={index} className="draft-card">
              <h3 className="draft-name">{item.name}</h3>
              <p className="draft-location">{item.location}</p>
              <p className="draft-date">Date: {item.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drafts;
