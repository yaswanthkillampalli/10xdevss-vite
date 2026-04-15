import { Link } from "react-router-dom";
import { ArrowLeft, Home, LogIn, Compass } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import "../styles/NotFound.css";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="nf-page">
        {/* Background grid lines */}
        <div className="nf-grid-bg" aria-hidden="true" />

        <div className="nf-content">
          {/* Left: giant 404 */}
          <div className="nf-glitch-block" aria-hidden="true">
            <span className="nf-code" data-text="404">404</span>
            <span className="nf-code nf-code--ghost" aria-hidden="true">404</span>
          </div>

          {/* Right: message + actions */}
          <div className="nf-body">
            <div className="nf-eyebrow">
              <Compass size={14} strokeWidth={2} />
              Error 404
            </div>

            <h1 className="nf-heading">
              Lost in<br />
              <em>the void</em>
            </h1>

            <p className="nf-text">
              This page doesn't exist — it may have been moved,
              deleted, or never existed in the first place.
            </p>

            <div className="nf-divider" />

            <div className="nf-actions">
              <Link to="/" className="nf-btn nf-btn--primary">
                <Home size={15} strokeWidth={2} />
                Go to Dashboard
              </Link>
              <Link to="/login" className="nf-btn nf-btn--ghost">
                <LogIn size={15} strokeWidth={2} />
                Sign In
              </Link>
            </div>

            <Link to="#" onClick={() => history.back()} className="nf-back-link">
              <ArrowLeft size={13} strokeWidth={2} />
              Go back
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}