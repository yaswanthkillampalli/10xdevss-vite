import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BookOpenText, FolderKanban, Trophy } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import { getPublicProfileByUserId } from "../../authentication/api";
import "../../styles/profile/PublicProfile.css";

const EMPTY_PROFILE = {
  name: "Unknown User",
  role: "student",
  headline: "",
  bio: "",
  location: "",
  avatar: null,
  socialLinks: {},
};

const EMPTY_SECTION_MESSAGE = "Public data for this section is not available yet.";

function SocialIcon({ type }) {
  const icons = {
    github:    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>,
    linkedin:  <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
    twitter:   <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>,
    portfolio: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[type]}
    </svg>
  );
}

function SectionEmptyState({ title, icon: Icon = Trophy }) {
  return (
    <div className="public-profile-empty-state">
      <div className="public-profile-empty-state__icon">
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <h3 className="public-profile-empty-state__title">{title}</h3>
      <p className="public-profile-empty-state__body">{EMPTY_SECTION_MESSAGE}</p>
    </div>
  );
}

const formatProfile = (profileResponse) => {
  const data = profileResponse?.data || {};
  const user = data.user || {};
  const profile = data.profile || {};
  const displayName = user.fullName || "Unknown User";

  return {
    name: displayName,
    role: user.role || "student",
    headline: profile.headline || "",
    bio: profile.bio || "",
    location: profile.location || "",
    avatar: profile.avatar || null,
    socialLinks: {
      github: profile.socialLinks?.github || null,
      linkedin: profile.socialLinks?.linkedin || null,
      twitter: profile.socialLinks?.twitter || null,
      portfolio: profile.socialLinks?.portfolio || null,
    },
  };
};

export default function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!userId) {
        if (isMounted) {
          setError("Profile user id is missing.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await getPublicProfileByUserId(userId);
        if (!isMounted) return;
        setProfile(formatProfile(response));
        setError("");
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError?.response?.data?.message || "Could not load profile.");
        setProfile(EMPTY_PROFILE);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const initials = useMemo(() => {
    return profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";
  }, [profile.name]);

  const socialEntries = useMemo(
    () => Object.entries(profile.socialLinks).filter(([, url]) => Boolean(url)),
    [profile.socialLinks]
  );

  return (
    <>
      <Navbar />
      <main>
        {isLoading && (
          <div className="container" style={{ paddingTop: 20 }}>
            <div className="card" style={{ padding: 16 }}>Loading public profile...</div>
          </div>
        )}

        {error && (
          <div className="container" style={{ paddingTop: 20 }}>
            <div className="card" style={{ padding: 16 }}>{error}</div>
          </div>
        )}

        {/* Hero banner */}
        <div style={{ background: "var(--accent)", padding: "48px 0 80px" }}>
          <div className="container">
            <div style={{ display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div className="avatar" style={{ width: 96, height: 96, fontSize: 32, border: "4px solid rgba(255,255,255,0.3)", overflow: "hidden" }}>
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  initials
                )}
              </div>
              <div style={{ color: "white" }}>
                <h1 style={{ fontSize: 36, letterSpacing: "-0.02em", color: "white" }}>{profile.name}</h1>
                <p style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
                  {profile.role}
                  {profile.role && profile.location ? " · " : ""}
                  {profile.location}
                </p>
                {profile.headline && (
                  <p style={{ fontSize: 15, opacity: 0.9, marginTop: 6, fontStyle: "italic" }}>{profile.headline}</p>
                )}
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  {socialEntries.map(([key, url]) => (
                    <a key={key} href={url} target="_blank" rel="noreferrer" style={{ color: "white", opacity: 0.8, transition: "opacity 0.2s" }}
                       onMouseEnter={(e) => e.target.style.opacity = 1}
                       onMouseLeave={(e) => e.target.style.opacity = 0.8}>
                      <SocialIcon type={key} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ marginTop: -40, paddingBottom: 80 }}>
          <div className="layout-sidebar">

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Bio */}
              <div className="card">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>About</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)" }}>{profile.bio || EMPTY_SECTION_MESSAGE}</p>
              </div>

              {/* Skills */}
              <div className="card">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 12 }}>Skills</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{EMPTY_SECTION_MESSAGE}</p>
              </div>

              {/* Certifications */}
              <div className="card">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 12 }}>Certifications</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{EMPTY_SECTION_MESSAGE}</p>
              </div>
            </div>

            {/* Main content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

              {/* Experience */}
              <div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>Experience</h2>
                <SectionEmptyState title="No public experience data" />
              </div>

              {/* Projects */}
              <div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>Projects</h2>
                <SectionEmptyState title="No public projects data" icon={FolderKanban} />
              </div>

              {/* Publications */}
              <div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>Publications</h2>
                <SectionEmptyState title="No public publications data" icon={BookOpenText} />
              </div>

              {/* Achievements */}
              <div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>Achievements</h2>
                <SectionEmptyState title="No public achievements data" />
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}