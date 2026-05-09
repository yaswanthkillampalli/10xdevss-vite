import { useEffect, useMemo, useState } from "react";
import { FolderKanban, Search, SearchX } from "lucide-react";
import "../../styles/portfolio/Projects.css";
import { toast } from 'react-toastify';
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

/* ─────────────────────────────────────────
   Project card skeleton
   ───────────────────────────────────────── */

// Each skeleton card gets a slightly varied tag layout so they don't look identical.
const TAG_LAYOUTS = [
  [52, 68, 44],
  [60, 80],
  [44, 56, 72, 36],
  [70, 48, 60],
  [50, 66],
  [42, 74, 50, 44],
];

function ProjectCardSkeleton({ index = 0 }) {
  const tagWidths = TAG_LAYOUTS[index % TAG_LAYOUTS.length];

  return (
    <div className="skeleton-proj-card">
      {/* Title */}
      <span className="skeleton skeleton-proj-title" />

      {/* Description lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="skeleton skeleton-proj-desc-1" />
        <span className="skeleton skeleton-proj-desc-2" />
      </div>

      {/* Tech-stack tags */}
      <div className="skeleton-proj-tags">
        {tagWidths.map((w, i) => (
          <span key={i} className="skeleton skeleton-proj-tag" style={{ width: w }} />
        ))}
      </div>

      {/* Footer: owner + status badge */}
      <div className="skeleton-proj-footer">
        <div className="skeleton-proj-avatar-row">
          <span className="skeleton skeleton-proj-avatar" />
          <span className="skeleton skeleton-proj-owner-name" />
        </div>
        <span className="skeleton skeleton-proj-badge" />
      </div>
    </div>
  );
}

function ProjectsGridSkeleton({ count = 6 }) {
  return (
    <div className="grid-2 animate-in delay-2" style={{ marginTop: 8 }}>
      {Array.from({ length: count }, (_, i) => (
        <ProjectCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Projects page
   ───────────────────────────────────────── */
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [showModal]             = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState("");

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
            id:        item.id || item._id,
            startDate: formatMonthYear(item.startDate),
            endDate:   item.endDate ? formatMonthYear(item.endDate) : null,
          }))
        );
        setError("");
      } catch (loadError) {
        if (!isMounted) return;
        const msg = loadError?.response?.data?.message || "Could not load projects.";
        toast.error(msg);
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

        {/* ── Section header ── */}
        <div className="section-header animate-in">
          <div>
            <h1 style={{ fontSize: 28, letterSpacing: "-0.02em", marginTop: 0 }}>
              Projects
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "6px 0 0" }}>
              {isLoading ? (
                <span className="skeleton" style={{ display: "inline-block", width: 110, height: 13 }} />
              ) : (
                `${projects.length} projects total`
              )}
            </p>
          </div>
        </div>

        {/* Errors are shown via toast notifications (react-toastify) */}

        {/* ── Search bar ── */}
        <div className="project-searchbar" style={{ marginBottom: 24 }}>
          <span className="project-search-icon">
            <Search size={15} strokeWidth={2} />
          </span>
          <input
            type="text"
            placeholder="Search projects by title, description, or tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="project-search-input"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: 14,
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? "not-allowed" : "text",
            }}
          />
        </div>

        {/* ── Filters ── */}
        <div
          style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}
          className="animate-in delay-1"
        >
          {["all", "ongoing", "completed", "on-hold"].map((f) => (
            <button
              key={f}
              onClick={() => !isLoading && setFilter(f)}
              className={`project-filter-btn ${filter === f ? "is-active" : ""}`}
              disabled={isLoading}
              style={{
                padding: "6px 16px",
                borderRadius: "100px",
                fontSize: 13,
                fontWeight: filter === f ? 600 : 400,
                cursor: isLoading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Content area ── */}
        {isLoading ? (
          <ProjectsGridSkeleton count={6} />
        ) : projects.length === 0 ? (
          <div className="empty-state" style={{ marginTop: 24 }}>
            <div className="empty-state__icon">
              <FolderKanban size={28} strokeWidth={1.4} />
            </div>
            <h3 className="empty-state__heading">No projects</h3>
            <p className="empty-state__body">No projects found right now.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ marginTop: 24 }}>
            <div className="empty-state__icon">
              <SearchX size={28} strokeWidth={1.4} />
            </div>
            <h3 className="empty-state__heading">No projects match your search</h3>
            <p className="empty-state__body">Try changing the filters or search term.</p>
          </div>
        ) : (
          <div className="grid-2 animate-in delay-2" style={{ marginTop: 8 }}>
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} isEdit={false} />
            ))}
          </div>
        )}

      </div>

      {/* Modal stub – wired in Profile */}
      <Modal show={showModal} onClose={() => {}} title="Add Project">
        <div>
          <p>
            Add and edit projects are managed in the <strong>Profile</strong> section.
          </p>
        </div>
      </Modal>
    </>
  );
}