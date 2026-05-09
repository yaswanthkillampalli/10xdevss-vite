import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import '../styles/components/ProfileMenu.css';

export default function ProfileMenu({
  theme,
  toggleTheme,
  onLogout,
  profileAvatar,
  profileName,
  profileHeadline,
  profileLocation,
}) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const initials = (profileName || 'JD')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dropdown">
      {/* ── Profile trigger button with IG story ring ── */}
      <button
        className="profile-dropdown-toggle"
        type="button"
        id="profileMenu"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Open profile menu"
      >
        <div className="portfolio-profile-circle">
          <img
            src={profileAvatar || '/profile-pic.jpg'}
            alt="Profile"
            className="portfolio-profile-image"
            onError={(e) => {
              /* Graceful fallback to initials if image fails */
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement.querySelector(
                '.portfolio-profile-initials'
              );
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Fallback initials — hidden by default */}
          <span className="portfolio-profile-initials" style={{ display: 'none' }}>
            {initials}
          </span>
        </div>
      </button>

      {/* ── Dropdown menu ── */}
      <ul
        className="dropdown-menu dropdown-menu-end portfolio-dropdown-menu"
        aria-labelledby="profileMenu"
      >
        {/* Header with mini avatar + name */}
        <li>
          <div className="portfolio-dropdown-header">
            <div className="portfolio-dropdown-avatar">
              <img src={profileAvatar || '/profile-pic.jpg'} alt="Profile" />
            </div>
            <div className="portfolio-dropdown-info">
              <div className="portfolio-dropdown-name">{profileName || 'John Doe'}</div>
              <div className="portfolio-dropdown-role">{profileHeadline || 'Full-Stack Developer'}</div>
              <div className="portfolio-dropdown-location">{profileLocation || 'Hyderabad, India'}</div>
            </div>
          </div>
        </li>

        {/* Theme toggle */}
        <li>
          <button
            type="button"
            className="dropdown-item portfolio-dropdown-item theme-toggle-item"
            onClick={toggleTheme}
          >
            {theme === 'light' ? '☀ Switch to Dark' : '☽ Switch to Light'}
          </button>
        </li>

        <li><hr className="dropdown-divider" /></li>

        <li>
          <Link to="/profile" className="dropdown-item portfolio-dropdown-item">
            Profile
          </Link>
        </li>        

        <li><hr className="dropdown-divider" /></li>

        <li>
          <button
            type="button"
            className="dropdown-item portfolio-dropdown-item"
            onClick={() => setShowChangePassword(true)}
          >
            Change Password
          </button>
        </li>

        <li><hr className="dropdown-divider" /></li>

        <li>
          <Link to="/portfolio/projects" className="dropdown-item portfolio-dropdown-item">
            My Projects
          </Link>
        </li>

        <li><hr className="dropdown-divider" /></li>

        <li>
          <Link to="/portfolio/certifications" className="dropdown-item portfolio-dropdown-item">
            My Certifications
          </Link>
        </li>

        <li><hr className="dropdown-divider" /></li>

        <li>
          <Link to="/portfolio/publications" className="dropdown-item portfolio-dropdown-item">
            My Publications
          </Link>
        </li>

        <li><hr className="dropdown-divider" /></li>

        <li>
          <Link to="/portfolio/achievements" className="dropdown-item portfolio-dropdown-item">
            My Achievements
          </Link>
        </li>

        <li><hr className="dropdown-divider" /></li>

        <li>
          <Link to="/portfolio/experience" className="dropdown-item portfolio-dropdown-item">
            Experience
          </Link>
        </li>

        <li><hr className="dropdown-divider" /></li>

        <li>
          <Link to="/portfolio/skills" className="dropdown-item portfolio-dropdown-item">
            Edit Skills
          </Link>
        </li>

        <li><hr className="dropdown-divider" /></li>

        <li>
          <button
            type="button"
            className="dropdown-item portfolio-dropdown-item logout-item"
            onClick={onLogout}
          >
            Logout
          </button>
        </li>
      </ul>
      {showChangePassword && (
        <ChangePassword
          onClose={() => setShowChangePassword(false)}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            setTimeout(() => setSuccessMessage(''), 3000);
          }}
        />
      )}
      {successMessage && (
        <div className="dropdown-success-toast">{successMessage}</div>
      )}
    </div>
  );
}