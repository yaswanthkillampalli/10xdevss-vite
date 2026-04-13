import "../../styles/profile/PublicProfile.css";

// Mock data — replace with API call using username from URL params
const PROFILE = {
  name: "John Doe",
  username: "johndoe",
  headline: "Full Stack Developer · Researcher · Open Source Enthusiast",
  bio: "Building scalable systems and exploring ML research. Currently pursuing my B.Tech in Computer Science while contributing to open-source projects and doing research in federated learning.",
  location: "Hyderabad, India",
  avatar: null,
  socialLinks: {
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe",
    portfolio: "https://johndoe.dev",
  },
};

const PROJECTS = [
  { title: "Portfolio CMS", techStack: ["React", "Node.js", "MongoDB"], status: "completed", githubUrl: "#", liveUrl: "#" },
  { title: "ML Dashboard",  techStack: ["Python", "FastAPI", "D3.js"],  status: "ongoing",   githubUrl: "#", liveUrl: null },
  { title: "Auth Microservice", techStack: ["Express", "JWT"],          status: "completed", githubUrl: "#", liveUrl: null },
];

const SKILLS = {
  frontend: ["React", "TypeScript", "D3.js"],
  backend:  ["Node.js", "Express", "FastAPI"],
  database: ["MongoDB", "PostgreSQL", "Redis"],
  devops:   ["Docker", "Kubernetes"],
};

const CERTS = [
  { title: "AWS Solutions Architect", org: "Amazon Web Services", date: "Mar 2024" },
  { title: "Google Professional Cloud Developer", org: "Google Cloud", date: "Jan 2024" },
];

const PUBS = [
  { title: "Federated Learning for Privacy-Preserving Healthcare Analytics", venue: "IEEE ICML 2023", citations: 14 },
];

const EXPERIENCE = [
  { company: "Google", role: "Software Engineering Intern", period: "May 2023 – Aug 2023", type: "internship" },
  { company: "StartupXYZ", role: "Full Stack Developer", period: "Sep 2023 – Present", type: "part-time" },
];

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

export default function PublicProfile() {
  return (
    <>
      <Navbar />
      <main>

        {/* Hero banner */}
        <div style={{ background: "var(--accent)", padding: "48px 0 80px" }}>
          <div className="container">
            <div style={{ display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div className="avatar" style={{ width: 96, height: 96, fontSize: 32, border: "4px solid rgba(255,255,255,0.3)" }}>
                {PROFILE.name.charAt(0)}
              </div>
              <div style={{ color: "white" }}>
                <h1 style={{ fontSize: 36, letterSpacing: "-0.02em", color: "white" }}>{PROFILE.name}</h1>
                <p style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>@{PROFILE.username} · {PROFILE.location}</p>
                <p style={{ fontSize: 15, opacity: 0.9, marginTop: 6, fontStyle: "italic" }}>{PROFILE.headline}</p>
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  {Object.entries(PROFILE.socialLinks).map(([key, url]) => (
                    <a key={key} href={url} target="_blank" style={{ color: "white", opacity: 0.8, transition: "opacity 0.2s" }}
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
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)" }}>{PROFILE.bio}</p>
              </div>

              {/* Skills */}
              <div className="card">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 12 }}>Skills</h3>
                {Object.entries(SKILLS).map(([cat, items]) => (
                  <div key={cat} style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, textTransform: "capitalize" }}>{cat}</p>
                    <div className="tags">
                      {items.map((s) => <span key={s} className="tag">{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div className="card">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 12 }}>Certifications</h3>
                {CERTS.map((c) => (
                  <div key={c.title} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{c.title}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.org} · {c.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

              {/* Experience */}
              <div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>Experience</h2>
                {EXPERIENCE.map((exp) => (
                  <div key={exp.company} className="card" style={{ marginBottom: 12, display: "flex", gap: 16 }}>
                    <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{exp.company.charAt(0)}</div>
                    <div>
                      <p style={{ fontWeight: 600 }}>{exp.role}</p>
                      <p style={{ fontSize: 13, color: "var(--accent)" }}>{exp.company}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{exp.period} · {exp.type}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>Projects</h2>
                <div className="grid-2">
                  {PROJECTS.map((p) => (
                    <div key={p.title} className="card">
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>{p.title}</h3>
                        <span className={`badge ${p.status === "ongoing" ? "badge-red" : "badge-gray"}`}>{p.status}</span>
                      </div>
                      <div className="tags" style={{ marginTop: 10 }}>
                        {p.techStack.map((t) => <span key={t} className="tag">{t}</span>)}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                        {p.githubUrl && <a href={p.githubUrl} className="btn btn-outline" style={{ fontSize: 12, padding: "5px 12px" }}>GitHub</a>}
                        {p.liveUrl && <a href={p.liveUrl} className="btn btn-outline" style={{ fontSize: 12, padding: "5px 12px" }}>Live ↗</a>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publications */}
              <div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>Publications</h2>
                {PUBS.map((pub) => (
                  <div key={pub.title} className="card">
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, lineHeight: 1.4 }}>{pub.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>{pub.venue} · {pub.citations} citations</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}