import "../styles/Dashboard.css";

const stats = [
  { label: "Projects", value: "12", accent: true },
  { label: "Skills", value: "24", accent: false },
  { label: "Certifications", value: "8", accent: false },
  { label: "Publications", value: "3", accent: true },
];

const recentProjects = [
  {
    title: "Portfolio CMS",
    owner: { name: "John Doe", avatar: "JD" },
    stack: ["React", "Node.js", "MongoDB"],
    status: "completed",
  },
  {
    title: "ML Dashboard",
    owner: { name: "Sarah Kim", avatar: "SK" },
    stack: ["Python", "FastAPI", "D3.js"],
    status: "ongoing",
  },
  {
    title: "Auth Microservice",
    owner: { name: "Alex Ray", avatar: "AR" },
    stack: ["Express", "JWT", "Redis"],
    status: "completed",
  },
];

const recentActivity = [
  {
    user: { name: "John Doe", avatar: "JD" },
    action: "Added certification",
    detail: "AWS Solutions Architect",
    time: "2h ago",
  },
  {
    user: { name: "John Doe", avatar: "JD" },
    action: "Updated project",
    detail: "Portfolio CMS",
    time: "5h ago",
  },
  {
    user: { name: "Team Bot", avatar: "TB" },
    action: "New project created",
    detail: "ML Dashboard",
    time: "1d ago",
  },
  {
    user: { name: "John Doe", avatar: "JD" },
    action: "Added publication",
    detail: "Federated Learning Survey",
    time: "2d ago",
  },
  {
    user: { name: "John Doe", avatar: "JD" },
    action: "New skill added",
    detail: "Kubernetes",
    time: "2d ago",
  },
];

export default function Dashboard() {
  return (
    <>
      <div className="container dashboard-page">
        {/* Header */}
        <div className="animate-in" style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                Welcome back,
              </p>
              <h1
                style={{
                  fontSize: 32,
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                }}
              >
                John Doe
              </h1>
            </div>

            <a
              href="/profile/johndoe"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ gap: 8 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View Public Portfolio
            </a>
          </div>

          {/* Profile completion bar */}
          <div
            className="completion-card"
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--accent)",
                }}
              >
                Profile Completion
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                72%
              </span>
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: "72%" }} />
            </div>

            <p
              style={{
                fontSize: 12,
                color: "var(--accent)",
                marginTop: 8,
                opacity: 0.85,
              }}
            >
              Add a bio and 2 more projects to reach 100%
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid-4 animate-in delay-1" style={{ marginBottom: 40 }}>
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <span className={`stat-value ${s.accent ? "stat-accent" : ""}`}>
                {s.value}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Two-col layout */}
        <div className="dashboard-layout animate-in delay-2">
          {/* Recent projects */}
          <div>
            <div className="section-header">
              <h2 className="section-title">Recent Projects</h2>
              <a
                href="/portfolio/projects"
                className="btn btn-ghost"
                style={{ fontSize: 13 }}
              >
                View all →
              </a>
            </div>

            <div className="projects-column">
              {recentProjects.map((p) => (
                <div
                  key={p.title}
                  className="card recent-project-card"
                  style={{
                    padding: "18px 20px",
                  }}
                >
                  <div className="recent-project-top">
                    <div className="project-owner-wrap">
                      <div className="project-owner-avatar">{p.owner.avatar}</div>
                      <div className="project-owner-meta">
                        <span className="project-owner-label">Owner</span>
                        <span className="project-owner-name">{p.owner.name}</span>
                      </div>
                    </div>

                    <span
                      className={`badge ${
                        p.status === "ongoing" ? "badge-accent" : "badge-muted"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <p className="recent-project-title">{p.title}</p>

                  <div className="tags project-tags-row">
                    {p.stack.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div>
            <div className="section-header">
              <h2 className="section-title">Recent Activity</h2>
            </div>

            <div className="card activity-card" style={{ padding: 0, overflow: "hidden" }}>
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="activity-row"
                  style={{
                    borderBottom:
                      i < recentActivity.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <div className="activity-avatar">{item.user.avatar}</div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 6,
                        marginBottom: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: 13,
                          color: "var(--text-strong)",
                        }}
                      >
                        {item.user.name}
                      </strong>
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        {item.action}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        margin: 0,
                      }}
                    >
                      {item.detail}
                    </p>
                  </div>

                  <span className="activity-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="animate-in delay-3" style={{ marginTop: 40 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Quick Add
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              "Project",
              "Certification",
              "Experience",
              "Skill",
              "Publication",
              "Achievement",
            ].map((item) => (
              <a
                key={item}
                href={`/portfolio/${item.toLowerCase()}s/new`}
                className="btn btn-outline quick-add-btn"
              >
                <span className="quick-add-plus">+</span>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}