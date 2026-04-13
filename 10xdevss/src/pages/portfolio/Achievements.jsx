import { useState } from "react";
import "../../styles/portfolio/Achievements.css";

const TYPE_ICONS = {
  award: "🏆",
  scholarship: "🎓",
  competition: "🥇",
  recognition: "⭐",
  fellowship: "🎖️",
  other: "🏅",
};

const MOCK_ACHIEVEMENTS = [
  {
    id: 1,
    title: "Best Paper Award",
    description:
      "Received Best Paper Award at IEEE ICML 2023 for federated learning research.",
    issuingOrganization: "IEEE",
    date: "Oct 2023",
    type: "award",
    url: "https://ieee.org",
  },
  {
    id: 2,
    title: "Google Summer of Code",
    description:
      "Selected as a GSoC contributor to work on open-source machine learning tooling.",
    issuingOrganization: "Google",
    date: "May 2023",
    type: "fellowship",
    url: "https://summerofcode.withgoogle.com",
  },
  {
    id: 3,
    title: "National Hackathon Runner-Up",
    description:
      "Secured 2nd place at Smart India Hackathon with a real-time flood prediction system.",
    issuingOrganization: "Government of India",
    date: "Dec 2022",
    type: "competition",
    url: null,
  },
  {
    id: 4,
    title: "Merit Scholarship",
    description:
      "Awarded academic merit scholarship for strong performance in computer science coursework.",
    issuingOrganization: "University Board",
    date: "Aug 2021",
    type: "scholarship",
    url: null,
  },
  {
    id: 5,
    title: "Outstanding Research Recognition",
    description:
      "Recognized for innovative applied AI research contribution in an academic showcase.",
    issuingOrganization: "Research Council",
    date: "Jan 2024",
    type: "recognition",
    url: null,
  },
];

const ACHIEVEMENT_TYPES = [
  "award",
  "scholarship",
  "competition",
  "recognition",
  "fellowship",
  "other",
];

export default function Achievements() {
  const [achievements] = useState(MOCK_ACHIEVEMENTS);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(new Set());

  const toggleType = (type) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    setSelectedTypes(next);
  };

  const filteredAchievements = achievements.filter((item) => {
    const query = search.trim().toLowerCase();

    const matchesType =
      selectedTypes.size === 0 || selectedTypes.has(item.type);

    const matchesSearch =
      query === "" ||
      item.title.toLowerCase().includes(query) ||
      item.issuingOrganization.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query);

    return matchesType && matchesSearch;
  });

  return (
    <>
      <div className="container" style={{ maxWidth: 1200 }}>
        <div className="section-header animate-in">
          <div>
            <h1 style={{ fontSize: 24, letterSpacing: "-0.02em", marginBottom: 4 }}>
              Achievements
            </h1>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              {filteredAchievements.length} results
            </p>
          </div>
        </div>

        <div className="achievements-layout">
        {/* Left Filters */}
        <aside className="achievements-filters">
          <div className="filters-card">
            <h3 className="filters-title">Filters</h3>

            <div className="filter-group">
              <div className="filter-label">Type</div>

              {ACHIEVEMENT_TYPES.map((type) => (
                <label key={type} className="filter-check">
                  <input
                    type="checkbox"
                    checked={selectedTypes.has(type)}
                    onChange={() => toggleType(type)}
                  />
                  <span>
                    {TYPE_ICONS[type]}{" "}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Search + Results */}
        <section className="achievements-content">
          <div className="achievements-searchbar">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, organization, date, or keyword..."
              className="achievements-search-input"
            />
          </div>

          {filteredAchievements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏆</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>
                No achievements found
              </h3>
              <p style={{ fontSize: 13, margin: 0 }}>
                Try changing the filters or search term.
              </p>
            </div>
          ) : (
            <div className="achievements-list">
              {filteredAchievements.map((ach, i) => (
                <div
                  key={ach.id}
                  className="card animate-in achievement-card"
                  style={{
                    animationDelay: `${i * 0.06}s`,
                  }}
                >
                  <div className="achievement-card-top">
                    <div className="achievement-icon-wrap">
                      <span className="achievement-icon">
                        {TYPE_ICONS[ach.type]}
                      </span>
                    </div>

                    <span className="badge badge-gray achievement-type-badge">
                      {ach.type}
                    </span>
                  </div>

                  <div className="achievement-main">
                    <h3 className="achievement-title">{ach.title}</h3>

                    <p className="achievement-org">{ach.issuingOrganization}</p>

                    <p className="achievement-date">{ach.date}</p>

                    <p className="achievement-description">{ach.description}</p>
                  </div>

                  {ach.url && (
                    <div className="achievement-actions">
                      <a
                        href={ach.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                        style={{
                          fontSize: 12,
                          padding: "6px 12px",
                        }}
                      >
                        View ↗
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        </div>
      </div>
    </>
  );
}