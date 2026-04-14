import "../../styles/components/projects/ProjectCard.css";

export default function ProjectCard({
  project,
  isEdit = false,
  onEdit,
  onDelete,
}) {
  return (
    <div className="card animate-in project-card">
      <div className="project-card__submitted-row">
        <div className="project-card__avatar">
          YV
        </div>
        <span>Submitted</span>
        <span className="project-card__submitted-by">
          by Yaswanth Vardhan
        </span>
      </div>

      <div>
        <div className="project-card__header-row">
          <h3 className="project-card__title">
            {project.title}
          </h3>
          <span
            className={`badge ${
              project.status === "ongoing" ? "badge-accent" : "badge-muted"
            } project-card__status`}
          >
            {project.status}
          </span>
        </div>

        <p className="project-card__description">
          {project.description}
        </p>
      </div>

      <div className="tags project-card__tags">
        {project.techStack.map((t) => (
          <span
            key={t}
            className="tag project-card__tag"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="project-card__timeline">
        {project.startDate} - {project.endDate || "Present"}
      </div>

      <div className="divider project-card__divider" />

      <div className="project-card__actions">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline project-card__action-btn"
          >
            GitHub
          </a>
        )}

        {isEdit && (
          <button
            type="button"
            className="btn btn-outline project-card__action-btn"
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
            className="btn btn-outline project-card__action-btn"
          >
            Live
          </a>
        )}

        {isEdit && (
          <button
            type="button"
            className="btn btn-danger project-card__action-btn"
            onClick={() => onDelete?.(project.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
