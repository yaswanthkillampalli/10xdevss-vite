import { useState } from "react";
import "../../styles/portfolio/Experience.css";


const MOCK_EXPERIENCE = [
  {
    id: 1, company: "Google", role: "Software Engineering Intern", type: "internship",
    description: "Worked on the Chrome DevTools team, building performance profiling features. Contributed to open-source Chrome extensions and improved test coverage by 30%.",
    location: "Mountain View, CA", locationType: "onsite",
    startDate: "May 2023", endDate: "Aug 2023", isCurrent: false,
    skills: ["TypeScript", "C++", "Chrome APIs"],
  },
  {
    id: 2, company: "StartupXYZ", role: "Full Stack Developer", type: "part-time",
    description: "Building and maintaining the company's SaaS platform. Responsible for backend APIs and React frontend. Implemented real-time notifications using WebSockets.",
    location: "Remote", locationType: "remote",
    startDate: "Sep 2023", endDate: null, isCurrent: true,
    skills: ["React", "Node.js", "WebSockets", "MongoDB"],
  },
];

function Modal({ show, onClose }) {
  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "var(--bg)", borderRadius: "var(--radius-xl)", padding: 32, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>Add Experience</h2>
          <button onClick={onClose} className="btn btn-ghost">✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input className="form-input" placeholder="Google" />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <input className="form-input" placeholder="Software Engineer Intern" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" placeholder="What did you work on?" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input">
                <option>internship</option><option>full-time</option>
                <option>part-time</option><option>contract</option>
                <option>freelance</option><option>volunteer</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location Type</label>
              <select className="form-input">
                <option>onsite</option><option>remote</option><option>hybrid</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" placeholder="San Francisco, CA" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input type="date" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input type="date" className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Skills Used (comma separated)</label>
            <input className="form-input" placeholder="React, Node.js, TypeScript" />
          </div>
          <div className="form-group">
            <label className="form-label">Company Logo</label>
            <div style={{ border: "1.5px dashed var(--border)", borderRadius: "var(--radius-md)", padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Drop logo here or <span style={{ color: "var(--accent)", cursor: "pointer" }}>browse</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} className="btn btn-outline">Cancel</button>
            <button className="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const [experience, setExperience] = useState(MOCK_EXPERIENCE);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="container" style={{ maxWidth: 800 }}>

          <div className="section-header animate-in">
            <div>
              <h1 style={{ fontSize: 28, letterSpacing: "-0.02em" }}>Experience</h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Internships & work history</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">+ Add Experience</button>
          </div>

          {experience.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💼</div>
              <h3 style={{ fontFamily: "var(--font-display)" }}>No experience yet</h3>
              <p>Add your internships and work history.</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: 8 }}>Add Experience</button>
            </div>
          ) : (
            <div style={{ position: "relative" }} className="animate-in delay-1">
              {/* Timeline line */}
              <div style={{ position: "absolute", left: 23, top: 0, bottom: 0, width: 2, background: "var(--border)" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ display: "flex", gap: 24, paddingBottom: 32 }}>
                    {/* Timeline dot */}
                    <div style={{ flexShrink: 0, width: 48, display: "flex", justifyContent: "center" }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%", marginTop: 4,
                        background: exp.isCurrent ? "var(--accent)" : "var(--border)",
                        border: "3px solid var(--bg)",
                        boxShadow: exp.isCurrent ? "0 0 0 3px var(--red-muted)" : "none",
                        zIndex: 1,
                      }} />
                    </div>

                    {/* Card */}
                    <div className="card" style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                        <div>
                          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{exp.role}</h3>
                          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--accent)", marginTop: 2 }}>{exp.company}</p>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {exp.isCurrent && <span className="badge badge-red">Current</span>}
                          <span className="badge badge-gray">{exp.type}</span>
                          <span className="badge badge-gray">{exp.locationType}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                        {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate} · {exp.location}
                      </p>

                      <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.7 }}>{exp.description}</p>

                      <div className="tags" style={{ marginTop: 12 }}>
                        {exp.skills.map((s) => <span key={s} className="tag">{s}</span>)}
                      </div>

                      <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
                        <button className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 10px" }}>Edit</button>
                        <button onClick={() => setExperience(experience.filter((e) => e.id !== exp.id))} className="btn btn-danger" style={{ fontSize: 12, padding: "6px 10px" }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}