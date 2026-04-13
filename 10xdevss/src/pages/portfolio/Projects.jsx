import { useState } from "react";
import "../../styles/portfolio/Projects.css";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Portfolio CMS",
    description:
      "A full‑stack CMS for managing developer portfolios with real‑time preview and ImageKit integration.",
    techStack: ["React", "Node.js", "MongoDB", "ImageKit"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    status: "completed",
    startDate: "Jan 2024",
    endDate: "Mar 2024",
    isFeatured: true,
  },
  {
    id: 2,
    title: "ML Dashboard",
    description:
      "Interactive dashboard for visualizing machine learning model performance metrics and training logs.",
    techStack: ["Python", "FastAPI", "D3.js", "PostgreSQL"],
    githubUrl: "https://github.com",
    liveUrl: null,
    status: "ongoing",
    startDate: "Feb 2024",
    endDate: null,
    isFeatured: false,
  },
  {
    id: 3,
    title: "Auth Microservice",
    description:
      "JWT‑based authentication microservice with refresh token rotation and role‑based access control.",
    techStack: ["Express", "JWT", "Redis", "Docker"],
    githubUrl: "https://github.com",
    liveUrl: null,
    status: "completed",
    startDate: "Dec 2023",
    endDate: "Jan 2024",
    isFeatured: true,
  },
];

function ProjectCard({ project }) {
  return (
    <div
      className="card animate-in"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      {/* owner info near top */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 600,
            color: "white",
          }}
        >
          YV
        </div>
        <span>Submitted</span>
        <span style={{ fontWeight: 500, color: "var(--text-strong)" }}>
          by Yaswanth Vardhan
        </span>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-strong)",
              margin: 0,
            }}
          >
            {project.title}
          </h3>
          <span
            className={`badge ${
              project.status === "ongoing" ? "badge-accent" : "badge-muted"
            }`}
            style={{
              flexShrink: 0,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {project.status}
          </span>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 8,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {project.description}
        </p>
      </div>

      <div className="tags" style={{ margin: "8px 0" }}>
        {project.techStack.map((t) => (
          <span
            key={t}
            className="tag"
            style={{
              fontSize: 12,
              padding: "4px 10px",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
        {project.startDate} — {project.endDate || "Present"}
      </div>

      <div className="divider" style={{ margin: "8px 0" }} />

      <div
        style={{
          display: "flex",
          gap: 8,
        }}
      >
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            style={{ fontSize: 12, padding: "6px 12px" }}
          >
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            style={{ fontSize: 12, padding: "6px 12px" }}
          >
            Live ↗
          </a>
        )}
      </div>
    </div>
  );
}

// Keep this modal definition for now; you can reuse it in Profile later
function Modal({ show, onClose, title, children }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "var(--radius-xl)",
          padding: 28,
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          border: "1px solid var(--card-border)",
          zIndex: 1001,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              color: "var(--text-strong)",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: "4px 8px", fontSize: 18 }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects] = useState(MOCK_PROJECTS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal] = useState(false);

  // Filter by status + search
  const filtered = projects.filter((p) => {
    const matchesStatus =
      filter === "all" || p.status === filter;
    const textQuery = search.toLowerCase().trim();
    const matchesSearch =
      textQuery === "" ||
      p.title.toLowerCase().includes(textQuery) ||
      p.description.toLowerCase().includes(textQuery) ||
      p.techStack.some((t) => t.toLowerCase().includes(textQuery));

    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <div className="container">
        {/* Section header – no CTA button for this page */}
        <div className="section-header animate-in">
          <div>
            <h1
              style={{
                fontSize: 28,
                letterSpacing: "-0.02em",
                marginTop: 0,
              }}
            >
              Projects
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                margin: "6px 0 0",
              }}
            >
              {projects.length} projects total
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <input
            type="text"
            placeholder="Search projects by title, description, or tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="project-search-input"
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: 14,
            }}
          />
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
          className="animate-in delay-1"
        >
          {["all", "ongoing", "completed", "on-hold"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`project-filter-btn ${filter === f ? "is-active" : ""}`}
              style={{
                padding: "6px 16px",
                borderRadius: "100px",
                fontSize: 13,
                fontWeight: filter === f ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty state or grid */}
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ marginTop: 24 }}>
            <div
              className="empty-state-icon"
              style={{
                fontSize: 28,
                lineHeight: 1,
              }}
            >
              📁
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                margin: "12px 0 6px",
              }}
            >
              No projects match your search
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
              Try changing the filters or search term.
            </p>
          </div>
        ) : (
          <div
            className="grid-2 animate-in delay-2"
            style={{ marginTop: 8 }}
          >
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      {/* Reuse modal here for structure; not wired to any button yet */}
      <Modal
        show={showModal}
        onClose={() => {}}
        title="Add Project"
      >
        <div>
          <p>
            Add and edit projects are managed in the <strong>Profile</strong> section.
          </p>
        </div>
      </Modal>
    </>
  );
}