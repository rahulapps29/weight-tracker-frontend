import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaBars, FaTimes, FaPowerOff } from "react-icons/fa";

import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ add this line

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Get display name with proper fallbacks
  const getDisplayName = () => {
    if (!user) return "User";

    if (user.firstName || user.lastName) {
      return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    }

    if (user.fullName) return user.fullName;
    if (user.username) return user.username;
    if (user.email) return user.email.split("@")[0];

    return "User";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          Wellness Tracker
        </Link>
        <button
          className="mobile-menu-icon"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <span className="nav-user">Hi, {getDisplayName()}</span>
              </li>
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/weights"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  My Weights
                </Link>
              </li>

              <li className="nav-item">
                <button
                  className="nav-logout icon-only"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                    navigate("/");
                  }}
                  title="Logout"
                  aria-label="Logout"
                >
                  <FaPowerOff size={24} />
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/register"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
