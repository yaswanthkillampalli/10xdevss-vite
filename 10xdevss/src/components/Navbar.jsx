import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { getMyProfile, getMyUser, logoutUser } from '../authentication/api';
import '../styles/components/Navbar.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  getStoredProfileSnapshot,
  subscribeToProfileSnapshot,
  writeProfileSnapshot,
} from '../utils/profileSync';

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/publications", label: "Publications" },
  { to: "/achievements", label: "Achievements" },
];

const THEME_STORAGE_KEY = '10xdevss-theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const normalizeProfileData = (userResponse, profileResponse, fallbackProfile = {}) => {
  const user = userResponse?.data?.data || userResponse?.data || {};
  const profile = profileResponse?.data?.data || profileResponse?.data || {};

  return {
    fullName: user.fullName || fallbackProfile.fullName || '',
    avatar: profile.avatar || fallbackProfile.avatar || '',
    headline: profile.headline || fallbackProfile.headline || '',
    location: profile.location || fallbackProfile.location || '',
    username: profile.username || user.username || fallbackProfile.username || '',
  };
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getInitialTheme);
  const [profileSnapshot, setProfileSnapshot] = useState(() => getStoredProfileSnapshot());
  
  // State to control when the animation is visible
  const [showThemeAnimation, setShowThemeAnimation] = useState(false);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    setProfileSnapshot(getStoredProfileSnapshot());
    return subscribeToProfileSnapshot((nextProfile) => {
      if (!nextProfile) return;
      setProfileSnapshot(nextProfile);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadNavbarProfile = async () => {
      try {
        const [userResult, profileResult] = await Promise.allSettled([
          getMyUser(),
          getMyProfile(),
        ]);

        if (!isMounted) return;

        const nextProfile = normalizeProfileData(
          userResult.status === 'fulfilled' ? userResult.value : null,
          profileResult.status === 'fulfilled' ? profileResult.value : null,
          getStoredProfileSnapshot() || {}
        );

        setProfileSnapshot(nextProfile);
        writeProfileSnapshot(nextProfile);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Could not load navbar profile:', error);
        }
      }
    };

    loadNavbarProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const toggleTheme = () => {
    // 1. Show the animation overlay
    setShowThemeAnimation(true);
    
    // 2. Switch the actual theme
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

    // 3. Hide the animation after it finishes. 
    // Adjust this time to match the length of your Lottie animation!
    setTimeout(() => {
      setShowThemeAnimation(false);
    }, 2500); 
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
    <>
      {/* --- THE 3-LAYER FULL-SCREEN ANIMATION OVERLAY --- */}
      {showThemeAnimation && (
        <div className="theme-overlay-wrapper">
          
          {/* LAYER 3: Bottom - Static Theme Background */}
          <div 
            className={`theme-layer-3 ${theme === 'dark' ? 'bg-dark-layer' : 'bg-light-layer'}`} 
          />

          {/* LAYER 2: Middle - The Lottie Animation */}
          <div className="theme-layer-2">
            <DotLottieReact
              src={theme === 'dark' ? '/animations/dark-theme-loader.json' : '/animations/light-theme-loader.json'}
              autoplay
              className="theme-transition-lottie"
            />
          </div>

          {/* LAYER 1: Top - The Animating Curtain */}
          <div 
            className={`theme-layer-1 ${theme === 'dark' ? 'bg-light-layer' : 'bg-dark-layer'}`} 
          />

        </div>
      )}

      {/* --- ORIGINAL NAVBAR CODE --- */}
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
            className="navbar-toggler ms-auto me-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="d-flex d-lg-none align-items-center">
            <ProfileMenu
              theme={theme}
              toggleTheme={toggleTheme}
              onLogout={handleLogout}
              profileAvatar={profileSnapshot?.avatar || ''}
              profileName={profileSnapshot?.fullName || ''}
              profileHeadline={profileSnapshot?.headline || ''}
              profileLocation={profileSnapshot?.location || ''}
            />
          </div>

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

            <div className="portfolio-profile-wrap d-none d-lg-flex align-items-center">
              <ProfileMenu
                theme={theme}
                toggleTheme={toggleTheme}
                onLogout={handleLogout}
                profileAvatar={profileSnapshot?.avatar || ''}
                profileName={profileSnapshot?.fullName || ''}
                profileHeadline={profileSnapshot?.headline || ''}
                profileLocation={profileSnapshot?.location || ''}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}