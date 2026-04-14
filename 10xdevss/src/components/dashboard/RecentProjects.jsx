import PropTypes from 'prop-types';

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
        {projects.map((p) => (
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
  );
};

RecentProjects.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      owner: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired,
      stack: PropTypes.arrayOf(PropTypes.string).isRequired,
      status: PropTypes.oneOf(['completed', 'ongoing', 'pending']).isRequired,
    })
  ),
  viewAllLink: PropTypes.string,
};

export default RecentProjects;
