import { useEffect, useMemo, useState } from "react";
import "../styles/Dashboard.css";
import RecentProjects from "../components/dashboard/RecentProjects";
import RecentActivity from "../components/dashboard/RecentActivity";
import { getDashboardOverview } from "../authentication/api";

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "just now";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "just now";

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  return `${Math.floor(diffMs / day)}d ago`;
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const response = await getDashboardOverview({ limit: 5 });
        const data = response?.data || null;

        if (!isMounted) return;
        setDashboardData(data);
        setError("");
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError?.response?.data?.message || "Could not load dashboard data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const rawStats = dashboardData?.stats || {};
    return [
      { label: "Projects", value: String(rawStats.projects || 0), accent: true },
      { label: "Skills", value: String(rawStats.skills || 0), accent: false },
      { label: "Certifications", value: String(rawStats.certifications || 0), accent: false },
      { label: "Publications", value: String(rawStats.publications || 0), accent: true },
    ];
  }, [dashboardData]);

  const recentProjects = useMemo(
    () =>
      (dashboardData?.recentProjects || []).map((project) => ({
        title: project.title,
        owner: {
          id: project.owner?.id || null,
          name: project.owner?.name || "Unknown",
          avatar: project.owner?.avatar || "U",
          profileLink: project.owner?.profileLink || (project.owner?.id ? `/profile/${project.owner.id}` : null),
          role: project.owner?.role || "student", // Falls back to "student" if role not provided
        },
        stack: project.stack || [],
        status: project.status || "ongoing",
      })),
    [dashboardData]
  );

  const recentActivity = useMemo(
    () =>
      (dashboardData?.recentCertifications || []).map((certification) => ({
        user: {
          name: certification.owner?.name || "Unknown",
          avatar: certification.owner?.avatar || "U",
        },
        action: "Added certification",
        detail: certification.title,
        time: formatRelativeTime(certification.createdAt),
      })),
    [dashboardData]
  );

  const welcomeName = dashboardData?.user?.fullName || "User";

  return (
    <>
      <div className="container-fluid dashboard-page">
        {/* Header */}
        <div className="animate-in" style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                Welcome back,
              </p>
              <h1
                style={{
                  fontSize: 32,
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                }}
              >
                {welcomeName}
              </h1>
            </div>

            <a
              href={dashboardData?.user?.id ? `/profile/${dashboardData.user.id}` : "/profile"}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ gap: 8 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View Public Portfolio
            </a>
          </div>

          {/* Profile completion bar */}
          <div
            className="completion-card"
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--accent)",
                }}
              >
                Profile Completion
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                72%
              </span>
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: "72%" }} />
            </div>

            <p
              style={{
                fontSize: 12,
                color: "var(--accent)",
                marginTop: 8,
                opacity: 0.85,
              }}
            >
              Add a bio and 2 more projects to reach 100%
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="card" style={{ padding: 16, marginBottom: 20 }}>
            Loading dashboard...
          </div>
        )}

        {error && (
          <div className="card" style={{ padding: 16, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Stats row */}
        <div className="grid-4 animate-in delay-1" style={{ marginBottom: 40 }}>
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <span className={`stat-value ${s.accent ? "stat-accent" : ""}`}>
                {s.value}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Two-col layout */}
        <div className="dashboard-layout animate-in delay-2">
          {/* Recent projects */}
          <RecentProjects projects={recentProjects} />

          {/* Activity feed */}
          <RecentActivity activities={recentActivity} />
        </div>

        {/* Quick actions */}
        <div className="animate-in delay-3" style={{ marginTop: 40 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Quick Add
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              "Project",
              "Certification",
              "Experience",
              "Skill",
              "Publication",
              "Achievement",
            ].map((item) => (
              <a
                key={item}
                href={`/portfolio/${item.toLowerCase()}s/new`}
                className="btn btn-outline quick-add-btn"
              >
                <span className="quick-add-plus">+</span>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}