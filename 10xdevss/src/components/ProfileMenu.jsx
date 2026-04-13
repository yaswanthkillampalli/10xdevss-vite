import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/ProfileMenu.css';

export default function ProfileMenu({ theme, toggleTheme, onLogout }) {
  return (
    <>
      <div className="dropdown">
        <button
          className="profile-dropdown-toggle"
          type="button"
          id="profileMenu"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <div className="portfolio-profile-circle" aria-label="Profile menu">
            <span className="fw-bold small">JD</span>
          </div>
        </button>

        <ul className="dropdown-menu dropdown-menu-end portfolio-dropdown-menu" aria-labelledby="profileMenu">
          <li>
            <button
              type="button"
              className="dropdown-item portfolio-dropdown-item"
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            </button>
          </li>

          <li><hr className="dropdown-divider" /></li>

          <li>
            <Link
              to="/portfolio/certifications"
              className="dropdown-item portfolio-dropdown-item"
            >
              Certifications
            </Link>
          </li>

          <li><hr className="dropdown-divider" /></li>

          <li>
            <Link
              to="/portfolio/experience"
              className="dropdown-item portfolio-dropdown-item"
            >
              Experience
            </Link>
          </li>

          <li><hr className="dropdown-divider" /></li>

          <li>
            <Link
              to="/portfolio/skills"
              className="dropdown-item portfolio-dropdown-item"
            >
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
      </div>
    </>
  );
}