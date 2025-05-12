import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Home.css";
import fitnessHero from "../assets/fitness-hero.png";

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Welcome to <span className="highlight">TrackWellness</span>
          </h1>
          <p className="subtitle">
            Your personal companion to track, manage, and celebrate your fitness
            journey.
          </p>

          <div className="cta-buttons">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn secondary">
                  Login
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn primary">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="hero-image">
          <img src={fitnessHero} alt="Track Progress" />
        </div>
      </section>

      <section className="features">
        <h2>What You Can Do</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📊 Track Progress</h3>
            <p>
              Log your weight and view trends over time with beautiful graphs.
            </p>
          </div>
          <div className="feature-card">
            <h3>🎯 Set Goals</h3>
            <p>
              Define your ideal weight and stay focused with milestone tracking.
            </p>
          </div>
          <div className="feature-card">
            <h3>💡 Stay Motivated</h3>
            <p>
              Get insights, reminders, and motivational boosts as you progress.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
