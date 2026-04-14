import PropTypes from 'prop-types';

const RecentActivity = ({ activities = [] }) => {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Recent Activity</h2>
      </div>

      <div className="card activity-card" style={{ padding: 0, overflow: "hidden" }}>
        {activities.map((item, i) => (
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
  );
};

RecentActivity.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired,
      action: PropTypes.string.isRequired,
      detail: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ),
};

export default RecentActivity;
