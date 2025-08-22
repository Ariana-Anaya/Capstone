import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <NavLink to="/" className="logo">
          <span className="logo-icon">🎧</span>
          SongScribe
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className="nav-link">Mixes</NavLink>
          </li>
        </ul>
        <ul className="nav-links">
          <li>
            <NavLink to="/reviews/browse" className="nav-link">Reviews</NavLink>
          </li>
        </ul>
        

        <div className="auth-section">
          {sessionUser ? (
            <div className="user-info">
              <span className="welcome-message">
                Hey, {sessionUser.user?.username}
              </span>
              <ProfileButton />
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/login" className="auth-button login-btn">
                Log In
              </NavLink>
              <NavLink to="/signup" className="auth-button signup-btn">
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
