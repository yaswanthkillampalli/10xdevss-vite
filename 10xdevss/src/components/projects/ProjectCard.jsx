export default function ProjectCard({
  project,
  isEdit = false,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="card animate-in"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
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
        {project.startDate} - {project.endDate || "Present"}
      </div>

      <div className="divider" style={{ margin: "8px 0" }} />

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
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

        {isEdit && (
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: 12, padding: "6px 12px" }}
            onClick={() => onEdit?.(project)}
          >
            Edit
          </button>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            style={{ fontSize: 12, padding: "6px 12px" }}
          >
            Live
          </a>
        )}

        {isEdit && (
          <button
            type="button"
            className="btn btn-danger"
            style={{ fontSize: 12, padding: "6px 12px" }}
            onClick={() => onDelete?.(project.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
