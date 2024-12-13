import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to the Interactive Platform</h1>
        <p>Combine gaming and music on one platform!</p>
        <button className="cta-button" onClick={() => navigate("/register")}>
          Get Started
        </button>
      </section>

      <section className="features-section">
        <div className="card" onClick={() => navigate("/tournaments")}>
          <h2>Tournaments</h2>
          <h4>Join and organize exciting gaming tournaments!</h4>
        </div>
        <div className="card" onClick={() => navigate("/sessions")}>
          <h2>Sessions</h2>
          <h4>Collaborate with players and musicians in live sessions.</h4>
        </div>
        <div className="card" onClick={() => navigate("/music")}>
          <h2>Music</h2>
          <h4>Share and explore the best tracks from musicians.</h4>
        </div>
      </section>

      <section className="about-section">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>🎮 Engage in thrilling tournaments</li>
          <li>🎵 Connect with talented musicians</li>
          <li>🤝 Build an amazing community</li>
        </ul>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <blockquote>
          "This platform helped me find players and musicians to collaborate with! Highly recommend!" - <strong>MaxymS</strong>
        </blockquote>
      </section>
    </div>
  );
};

export default Home;