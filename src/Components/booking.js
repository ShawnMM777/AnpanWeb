
import { useState } from 'react'
import "./booking.css";
import { useNavigate } from 'react-router-dom';
import backgroundGif from "../ASSETS/Japanese-Festival.gif"

const placesData = [
  {
    id: 1,
    name: "Fushimi Inari Taisha",
    location: "Kyoto, Japan",
    image:
      "https://pohcdn.com/sites/default/files/styles/paragraph__text_with_image___twi_image/public/2022-08/fushimi-inari-taisha-shrine_optimized_0.jpg",
    description:
      "Famous for its thousands of vermilion torii gates, hiking trails, and beautiful shrines.",
    recommended:
      "Wear comfortable shoes and bring water. Recommended: Camera, light snacks.",
  },
  {
    id: 2,
    name: "Himeji Castle",
    location: "Himeji, Japan",
    image: "https://www.japan-guide.com/g21/3501_11.jpg",
    description:
      "A historic castle known as the White Heron Castle, considered Japan's finest surviving feudal castle.",
    recommended:
      "Best to bring sunscreen and a small umbrella. Recommended: Water, guidebook.",
  },
  {
    id: 3,
    name: "Mount Fuji",
    location: "Honshu, Japan",
    image:
      "https://travel.rakuten.com/contents/sites/contents/files/styles/max_1300x1300/public/2023-07/mt-fuji-guide_6.jpg?itok=y6_ShwTd",
    description:
      "Japan's tallest mountain, iconic for climbing, hiking trails, and breathtaking views.",
    recommended:
      "Wear hiking boots, carry snacks. Recommended: Camera, light jacket.",
  },
  {
    id: 4,
    name: "Universal Studios Japan",
    location: "Osaka, Japan",
    image:
      "https://images.squarespace-cdn.com/content/v1/57b72100e4fcb5e4aef2f4c4/abd2ae3c-bd00-4db3-87ad-6d7c49d94562/Universal-Studios-Japan-Entrance-Arch-by-Joshua-Meyer.jpeg",
    description:
      "Popular theme park with exciting rides, shows, and attractions for all ages.",
    recommended:
      "Bring a backpack for personal items. Recommended: Tickets, sunscreen.",
  },
  {
    id: 5,
    name: "Tokyo Tower",
    location: "Tokyo, Japan",
    image: "https://www.japan-guide.com/g18/3009_01.jpg",
    description:
      "A communications and observation tower in the heart of Tokyo, offering panoramic city views.",
    recommended:
      "Bring camera and comfortable walking shoes. Recommended: Snacks, binoculars.",
  },
  {
    id: 6,
    name: "Nara Park",
    location: "Nara, Japan",
    image:
      "https://thepartyingtraveler.com/wp-content/uploads/2023/11/IMG_5336.jpg",
    description:
      "Known for its free-roaming deer and beautiful temples, perfect for a peaceful day.",
    recommended:
      "Bring deer crackers and comfortable shoes. Recommended: Water, camera.",
  },
  {
    id: 7,
    name: "Osaka City",
    location: "Osaka, Japan",
    image:
      "https://photos.smugmug.com/Osaka/Osaka-Categories/i-J9MFjBv/0/L/Osaka_Districts-L.jpg",
    description:
      "A bustling urban center famous for food, shopping, and nightlife.",
    recommended:
      "Bring cash for street food and metro card. Recommended: Map, camera.",
  },
  {
    id: 8,
    name: "Nachi Waterfall",
    location: "Wakayama, Japan",
    image: "https://visitwakayama.jp/lsc/upfile/spot/0000/0491/491_1_l.jpg",
    description:
      "One of Japan's tallest waterfalls surrounded by lush nature and sacred temples.",
    recommended:
      "Wear hiking shoes, bring water. Recommended: Camera, light snacks.",
  },
];


const Booking = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [notes, setNotes] = useState({});

  const handleOpenDetails = (place) => setSelectedPlace(place);
  const handleCloseDetails = () => setSelectedPlace(null);

  const handleNotesChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleBooking = (place) => {
    alert(`You booked: ${place.name}`);
    handleCloseDetails();
    navigate('/payment'); 
    
  };

  return (
    <div className="booking-page">
      {/* 🎞 Full background GIF with overlay */}
      <div className="booking-background">
        <img src={backgroundGif} alt="background" />
        <div className="booking-overlay"></div>
      </div>

      {/* 🌸 Booking content */}
      <div className="booking-container">
        <h1 className="booking-title">ANPAN</h1>

        <div className="places-grid">
          {placesData.map((place) => (
            <div
              key={place.id}
              className="place-card"
              onClick={() => handleOpenDetails(place)}
            >
              <img src={place.image} alt={place.name} className="place-image" />
              <h3>{place.name}</h3>
              <p>{place.location}</p>
            </div>
          ))}
        </div>

        {selectedPlace && (
          <div className="modal-overlay">
            <div className="place-details">
              <button className="close-btn" onClick={handleCloseDetails}>
                ×
              </button>

              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="details-image"
              />
              <h2>{selectedPlace.name}</h2>
              <p>{selectedPlace.location}</p>
              <p>{selectedPlace.description}</p>

              <div className="recommended-section">
                <label>Recommended Foods & Things to Bring</label>
                <p className="recommended-text">
                  {selectedPlace.recommended}
                </p>
              </div>

              <div className="editable-section">
                <label>Notes / Things to Add</label>
                <textarea
                  placeholder="Add your personal notes here..."
                  value={notes[selectedPlace.id] || ""}
                  onChange={(e) =>
                    handleNotesChange(selectedPlace.id, e.target.value)
                  }
                />
              </div>

              <button
                className="booking-btn"
                onClick={() => handleBooking(selectedPlace)}
              >
                Book This Place
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking
