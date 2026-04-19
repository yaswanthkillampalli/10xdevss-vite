import PropTypes from 'prop-types';

const getInitials = (name = 'Unknown') => {
  return String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';
};

function ProjectOwnerAvatar({ name, avatar }) {
  const isImage = Boolean(avatar) && /^https?:\/\//i.test(avatar);

  if (isImage) {
    return (
      <img
        src={avatar}
        alt={name}
        className="project-owner-avatar"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
          const fallback = event.currentTarget.parentElement.querySelector('.project-owner-avatar-fallback');
          if (fallback) fallback.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div className="project-owner-avatar project-owner-avatar-fallback">
      {getInitials(name)}
    </div>
  );
}

const RecentProjects = ({ projects = [], viewAllLink = "/projects" }) => {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Recent Projects</h2>
        <a
          href={viewAllLink}
          className="btn btn-ghost"
          style={{ fontSize: 13 }}
        >
          View all →
        </a>
      </div>

      <div className="projects-column">
        {projects.length === 0 ? (
          <div className="card" style={{ padding: "18px 20px" }}>
            <p className="recent-project-title" style={{ marginBottom: 6 }}>
              No recent projects
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
              Projects from other users will appear here.
            </p>
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.title}
              className="card recent-project-card"
              style={{
                padding: "18px 20px",
              }}
            >
              <div className="recent-project-top">
                <div className="project-owner-wrap">
                  <ProjectOwnerAvatar name={p.owner.name} avatar={p.owner.avatar} />
                  <div className="project-owner-meta">
                    <span className="project-owner-label">{p.owner.role}</span>
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
          ))
        )}
      </div>
    </div>
  );
};

RecentProjects.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      owner: PropTypes.shape({
        name: PropTypes.string.isRequired,
          avatar: PropTypes.string,
      }).isRequired,
      stack: PropTypes.arrayOf(PropTypes.string).isRequired,
      status: PropTypes.oneOf(['completed', 'ongoing', 'on-hold']).isRequired,
    })
  ),
  viewAllLink: PropTypes.string,
};

export default RecentProjects;
