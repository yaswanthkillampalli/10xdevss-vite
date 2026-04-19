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

function ActivityAvatar({ name, avatar }) {
  const isImage = Boolean(avatar) && /^https?:\/\//i.test(avatar);

  if (isImage) {
    return (
      <img
        src={avatar}
        alt={name}
        className="activity-avatar"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
          const fallback = event.currentTarget.parentElement.querySelector('.activity-avatar-fallback');
          if (fallback) fallback.style.display = 'flex';
        }}
      />
    );
  }

  return <div className="activity-avatar activity-avatar-fallback">{getInitials(name)}</div>;
}

const RecentActivity = ({ activities = [] }) => {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Recent Activity</h2>
      </div>

      <div className="card activity-card" style={{ padding: 0, overflow: "hidden" }}>
        {activities.length === 0 ? (
          <div className="activity-row">
            <div style={{ flex: 1 }}>
              <strong
                style={{
                  fontSize: 13,
                  color: "var(--text-strong)",
                }}
              >
                No recent activity
              </strong>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  margin: "6px 0 0",
                }}
              >
                Recent certifications from other users will appear here.
              </p>
            </div>
          </div>
        ) : (
          activities.map((item, i) => (
            <div
              key={i}
              className="activity-row"
              style={{
                borderBottom:
                  i < activities.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <ActivityAvatar name={item.user.name} avatar={item.user.avatar} />

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
          ))
        )}
      </div>
    </div>
  );
};

RecentActivity.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }).isRequired,
      action: PropTypes.string.isRequired,
      detail: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ),
};

export default RecentActivity;
