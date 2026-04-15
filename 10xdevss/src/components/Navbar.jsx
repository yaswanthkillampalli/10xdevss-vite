import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { logoutUser } from '../authentication/auth';
import '../styles/components/Navbar.css';

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/publications", label: "Publications" },
  { to: "/achievements", label: "Achievements" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav
      className={`navbar navbar-expand-lg sticky-top portfolio-navbar ${
        theme === 'dark' ? 'navbar-dark' : 'navbar-light'
      }`}
    >
      <div className="container-fluid portfolio-navbar-container">
        <Link to="/" className="navbar-brand portfolio-brand d-flex align-items-center gap-2 m-0">
          <img
            src={theme === 'dark' ? '/10xdevs-white.png' : '/10xdevs-black.png'}
            alt="10x Devs"
            className="portfolio-logo-img"
          />
          
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav portfolio-nav-list mb-3 mb-lg-0">
            {NAV_LINKS.map((link) => (
              <li className="nav-item" key={link.to}>
                <Link
                  to={link.to}
                  className={`nav-link portfolio-nav-link ${isActive(link.to) ? 'active' : ''}`}
                  aria-current={isActive(link.to) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="portfolio-profile-wrap d-flex align-items-center">
            <ProfileMenu
              theme={theme}
              toggleTheme={toggleTheme}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}