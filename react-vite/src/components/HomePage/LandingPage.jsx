import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const sampleMixes = [
    { id: 1, name: "Club Bangerz", username: "Bobbie", coverUrl: "https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg" },
    { id: 2, name: "Killer Drum Fills", username: "Sam", coverUrl: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg" },
    { id: 3, name: "Late Night Chill", username: "Jordan", coverUrl: "https://images.pexels.com/photos/1600909/pexels-photo-1600909.jpeg" },
  ];

  const sampleReviews = [
    { 
      id: 1, 
      song: { title: "Sad Disco", artist: "flipturn", imageUrl: "https://f4.bcbits.com/img/a1152060589_16.jpg" }, 
      rating: 5, 
      user: { username: "Ariana" },
      text: "Absolutely love the vibe of this track! It gets me every time." 
    },
    { 
      id: 2, 
      song: { title: "A Bar Song (Tipsy)", artist: "Shaboozey", imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/26/Shaboozey_-_A_Bar_Song_%28Tipsy%29.png" }, 
      rating: 2, 
      user: { username: "Sam" },
      text: "Pretty fun to listen to, if you dont have ears." 
    },
    { 
      id: 3, 
      song: { title: "The New Abnormal", artist: "The Strokes", imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f8/The_Strokes_-_The_New_Abnormal.png" }, 
      rating: 4, 
      user: { username: "Jordan" },
      text: "Solid track with a cool retro feel. Definitely recommend." 
    },
  ];

  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1>🎧 SongScribe</h1>
        <p>Your music diary. Review songs, make mixes, and connect with friends.</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/signup")}>
            Sign Up Free
          </button>
          <button className="btn-secondary" onClick={() => navigate("/mixes/browse")}>
            Browse Mixes
          </button>
        </div>
      </section>

      <section className="features-section">
        <h2>What You Can Do</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span>⭐</span>
            <h3>Write Reviews</h3>
            <p>Capture your thoughts on songs and albums.</p>
          </div>
          <div className="feature-card">
            <span>🎶</span>
            <h3>Create Mixes</h3>
            <p>Build themed playlists full of personality.</p>
          </div>
          <div className="feature-card">
            <span>💬</span>
            <h3>React</h3>
            <p>Like, love, or laugh at your friends’ reviews.</p>
          </div>
          <div className="feature-card">
            <span>👥</span>
            <h3>Follow Friends</h3>
            <p>Stay updated on what your friends are listening to.</p>
          </div>
        </div>
      </section>

      <section className="community-preview">
        <h2>Community Mixes</h2>
        <div className="mix-preview-grid">
          {sampleMixes.map((mix) => (
            <div key={mix.id} className="mix-card">
              <img src={mix.coverUrl} alt={mix.name} className="mix-preview-image" />
              <h3>{mix.name}</h3>
              <p>{mix.username}</p>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => navigate("/mixes/browse")}>
          See More Mixes
        </button>
      </section>

      <section className="reviews-preview">
        <h2>Recent Reviews</h2>
        <div className="reviews-preview-grid">
          {sampleReviews.map((review) => (
            <div key={review.id} className="review-card">
              <img src={review.song.imageUrl} alt={review.song.title} className="review-image" />
              <div className="review-info">
                <h4>{review.song.title}</h4>
                <p>{review.song.artist}</p>
                <p>★ {review.rating} / 5</p>
                <p>{review.text}</p>
                <p className="review-username">by {review.user.username}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => navigate("/reviews/browse")}>
    See More Reviews
  </button>
      </section>

      <section className="cta-section">
        <h2>Ready to start sharing your music story?</h2>
        <button className="btn-primary" onClick={() => navigate("/signup")}>
          Create Your Free Account
        </button>
      </section>
    </div>
  );
}

export default LandingPage;
