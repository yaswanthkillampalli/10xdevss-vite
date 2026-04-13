import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import '../styles/components/Navbar.css';

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/portfolio/projects", label: "Projects" },
  { to: "/portfolio/publications", label: "Publications" },
  { to: "/portfolio/achievements", label: "Achievements" },
];

export default function Navbar() {
  const location = useLocation();
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

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <nav className={`navbar navbar-expand-lg sticky-top portfolio-navbar ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="container-xl px-3 px-lg-4">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <span className="portfolio-logo">L</span>
          <span className="portfolio-brand-text">My Portfolio</span>
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
          <ul className="navbar-nav mx-auto mb-3 mb-lg-0 gap-lg-2">
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

          <div className="d-flex align-items-center justify-content-lg-end">
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