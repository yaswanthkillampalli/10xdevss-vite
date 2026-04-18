import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import "../../styles/portfolio/Projects.css";
import ProjectCard from "../../components/projects/ProjectCard.jsx";
import { getDiscoverProjects } from "../../authentication/api";

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
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const formatMonthYear = (dateValue) => {
    if (!dateValue) return null;
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return String(dateValue);
    return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const response = await getDiscoverProjects({ limit: 100 });
        const list = response?.data || [];

        if (!isMounted) return;

        setProjects(
          list.map((item) => ({
            ...item,
            id: item.id || item._id,
            startDate: formatMonthYear(item.startDate),
            endDate: item.endDate ? formatMonthYear(item.endDate) : null,
          }))
        );
        setError("");
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError?.response?.data?.message || "Could not load projects.");
        setProjects([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter by status + search
  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const matchesStatus = filter === "all" || p.status === filter;
        const textQuery = search.toLowerCase().trim();
        const matchesSearch =
          textQuery === "" ||
          p.title?.toLowerCase().includes(textQuery) ||
          p.description?.toLowerCase().includes(textQuery) ||
          (p.techStack || []).some((t) => t.toLowerCase().includes(textQuery));

        return matchesStatus && matchesSearch;
      }),
    [projects, filter, search]
  );

  return (
    <>
      <div className="container-fluid">
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

        {error && (
          <div className="card" style={{ padding: 16, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Search bar */}
        <div
          className="project-searchbar"
          style={{
            marginBottom: 24,
          }}
        >
          <span className="project-search-icon">
            <Search size={15} strokeWidth={2} />
          </span>
          <input
            type="text"
            placeholder="Search projects by title, description, or tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="project-search-input"
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
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
        {isLoading ? (
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
              Loading projects...
            </h3>
          </div>
        ) : projects.length === 0 ? (
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
              No projects
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
              No projects found right now.
            </p>
          </div>
        ) : filtered.length === 0 ? (
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
              <ProjectCard key={p.id} project={p} isEdit={false} />
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