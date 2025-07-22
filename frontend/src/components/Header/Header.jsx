import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ isAuthenticated, handleLogout }) {
  const location = useLocation();

  // Ascunde Header-ul dacă suntem pe ruta LandingPage ("/")
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="app-header">
      <div className="logo">
      </div>
      <nav className="nav-links">
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
      <div className="auth-buttons">
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </header>
  );
}

export default Header;
