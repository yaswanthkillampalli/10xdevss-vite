import { Link } from "react-router-dom";
import "../../styles/components/projects/ProjectCard.css";

const getInitials = (name = "Community Member") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "CM";

function OwnerAvatar({ name, avatar, profileLink }) {
  const isImage = Boolean(avatar) && /^https?:\/\//i.test(avatar);
  const avatarContent = isImage ? (
    <img
      src={avatar}
      alt={name}
      className="project-card__avatar-image"
      onError={(event) => {
        event.currentTarget.style.display = "none";
        const fallback = event.currentTarget.parentElement.querySelector(
          ".project-card__avatar-fallback"
        );
        if (fallback) fallback.style.display = "flex";
      }}
    />
  ) : null;

  const fallbackContent = (
    <div className="project-card__avatar project-card__avatar-fallback">
      {getInitials(name)}
    </div>
  );

  const avatarNode = isImage ? (
    <div className="project-card__avatar">
      {avatarContent}
      <div className="project-card__avatar project-card__avatar-fallback" style={{ display: "none" }}>
        {getInitials(name)}
      </div>
    </div>
  ) : (
    fallbackContent
  );

  if (!profileLink) return avatarNode;

  return (
    <Link to={profileLink} className="project-card__profile-link" aria-label={`View ${name}'s public profile`}>
      {avatarNode}
    </Link>
  );
}

export default function ProjectCard({
  project,
  isEdit = false,
  onEdit,
  onDelete,
}) {
  const ownerName = project?.owner?.name || "Community Member";
  const ownerAvatar = project?.owner?.avatar || "CM";
  const ownerProfileLink = project?.owner?.profileLink || null;

  return (
    <div className="card animate-in project-card">
      <div className="project-card__submitted-row">
        <OwnerAvatar name={ownerName} avatar={ownerAvatar} profileLink={ownerProfileLink} />
        <span>Submitted</span>
        <span className="project-card__submitted-by">
          {ownerProfileLink ? (
            <Link to={ownerProfileLink} className="project-card__submitted-by-link">
              by {ownerName}
            </Link>
          ) : (
            `by ${ownerName}`
          )}
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
