import { useState } from "react";
import "../../styles/settings/Settings.css";

const TABS = ["Profile", "Social Links", "Security", "Account"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <div className="container" style={{ maxWidth: 780 }}>

          <div className="animate-in" style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, letterSpacing: "-0.02em" }}>Settings</h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Manage your account and portfolio preferences</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32, alignItems: "start" }}>

            {/* Tab list */}
            <div className="card animate-in" style={{ padding: 8 }}>
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "10px 14px", borderRadius: "var(--radius-sm)",
                  fontSize: 14, fontWeight: activeTab === tab ? 500 : 400,
                  color: activeTab === tab ? "var(--accent)" : "var(--text-muted)",
                  background: activeTab === tab ? "var(--accent-bg)" : "transparent",
                  border: "none", cursor: "pointer", transition: "all var(--transition)",
                  marginBottom: 2,
                }}>{tab}</button>
              ))}
            </div>

            {/* Tab content */}
            <div className="animate-in delay-1">

              {activeTab === "Profile" && (
                <div className="card">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 24 }}>Profile Information</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Avatar upload */}
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 8 }}>
                      <div className="avatar" style={{ width: 72, height: 72, fontSize: 24 }}>JD</div>
                      <div>
                        <button className="btn btn-outline" style={{ fontSize: 13 }}>Upload Photo</button>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" defaultValue="John Doe" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Username</label>
                        <input className="form-input" defaultValue="johndoe" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" defaultValue="john@example.com" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Headline</label>
                      <input className="form-input" defaultValue="Full Stack Developer · Researcher" placeholder="e.g. Full Stack Developer at Google" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bio</label>
                      <textarea className="form-input" style={{ minHeight: 120 }} defaultValue="Building scalable systems and exploring ML research." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input className="form-input" defaultValue="Hyderabad, India" placeholder="City, Country" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" type="tel" placeholder="+91 99999 99999" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--bg-2)", borderRadius: "var(--radius-md)" }}>
                      <input type="checkbox" id="public" defaultChecked style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
                      <label htmlFor="public" style={{ fontSize: 14, cursor: "pointer" }}>
                        Make my portfolio public (visible to anyone with the link)
                      </label>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button onClick={handleSave} className="btn btn-primary">
                        {saved ? "✓ Saved!" : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Social Links" && (
                <div className="card">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 24 }}>Social Links</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { label: "GitHub", placeholder: "https://github.com/username", icon: "⌥" },
                      { label: "LinkedIn", placeholder: "https://linkedin.com/in/username", icon: "in" },
                      { label: "Twitter / X", placeholder: "https://twitter.com/username", icon: "𝕏" },
                      { label: "Portfolio Website", placeholder: "https://yoursite.com", icon: "🌐" },
                    ].map(({ label, placeholder, icon }) => (
                      <div key={label} className="form-group">
                        <label className="form-label">{label}</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{icon}</span>
                          <input className="form-input" placeholder={placeholder} style={{ paddingLeft: 36 }} />
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button onClick={handleSave} className="btn btn-primary">
                        {saved ? "✓ Saved!" : "Save Links"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Security" && (
                <div className="card">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 24 }}>Change Password</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input className="form-input" type="password" placeholder="Enter current password" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input className="form-input" type="password" placeholder="Min 6 characters, at least 1 number" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input className="form-input" type="password" placeholder="Repeat new password" />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button className="btn btn-primary">Update Password</button>
                    </div>
                  </div>

                  <div className="divider" style={{ margin: "28px 0" }} />

                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 16 }}>Active Sessions</h2>
                  <div style={{ padding: "14px 16px", background: "var(--bg-2)", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>Current Session</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Chrome on Windows · Hyderabad, India · Just now</p>
                    </div>
                    <span className="badge badge-green">Active</span>
                  </div>
                </div>
              )}

              {activeTab === "Account" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div className="card">
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 8 }}>Account Info</h2>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Your account details and plan.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[["Email", "john@example.com"], ["Member Since", "January 2024"], ["Role", "User"], ["Portfolio URL", "10xdevs.com/johndoe"]].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{k}</span>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="card" style={{ borderColor: "var(--red-muted)" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--accent)", marginBottom: 8 }}>Danger Zone</h2>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>These actions are irreversible. Please be certain.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "var(--bg-2)", borderRadius: "var(--radius-md)" }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500 }}>Deactivate Account</p>
                          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Hide your profile and pause your portfolio.</p>
                        </div>
                        <button className="btn btn-danger" style={{ flexShrink: 0 }}>Deactivate</button>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "var(--accent-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--red-muted)" }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--accent)" }}>Delete Account</p>
                          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Permanently delete all your data. Cannot be undone.</p>
                        </div>
                        <button className="btn btn-primary" style={{ flexShrink: 0, background: "var(--accent)" }}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
    </>
  );
}