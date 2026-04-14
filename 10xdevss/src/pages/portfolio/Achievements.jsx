import { useState } from "react";
import {
  Trophy,
  GraduationCap,
  Medal,
  Star,
  Award,
  BadgeCheck,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import "../../styles/portfolio/Achievements.css";
import AchievementCard from "../../components/achievements/AchievementCard.jsx";

const FILTER_TYPE_CONFIG = {
  award:       { Icon: Trophy,        label: "Award"       },
  scholarship: { Icon: GraduationCap, label: "Scholarship" },
  competition: { Icon: Medal,         label: "Competition" },
  recognition: { Icon: Star,          label: "Recognition" },
  fellowship:  { Icon: Award,         label: "Fellowship"  },
  other:       { Icon: BadgeCheck,    label: "Other"       },
};

const MOCK_ACHIEVEMENTS = [
  {
    id: 1,
    title: "Best Paper Award",
    description: "Received Best Paper Award at IEEE ICML 2023 for federated learning research.",
    issuingOrganization: "IEEE",
    date: "Oct 2023",
    type: "award",
    url: "https://ieee.org",
  },
  {
    id: 2,
    title: "Google Summer of Code",
    description: "Selected as a GSoC contributor to work on open-source machine learning tooling.",
    issuingOrganization: "Google",
    date: "May 2023",
    type: "fellowship",
    url: "https://summerofcode.withgoogle.com",
  },
  {
    id: 3,
    title: "National Hackathon Runner-Up",
    description: "Secured 2nd place at Smart India Hackathon with a real-time flood prediction system.",
    issuingOrganization: "Government of India",
    date: "Dec 2022",
    type: "competition",
    url: null,
  },
  {
    id: 4,
    title: "Merit Scholarship",
    description: "Awarded academic merit scholarship for strong performance in computer science coursework.",
    issuingOrganization: "University Board",
    date: "Aug 2021",
    type: "scholarship",
    url: null,
  },
  {
    id: 5,
    title: "Outstanding Research Recognition",
    description: "Recognized for innovative applied AI research contribution in an academic showcase.",
    issuingOrganization: "Research Council",
    date: "Jan 2024",
    type: "recognition",
    url: null,
  },
];

const ACHIEVEMENT_TYPES = Object.keys(FILTER_TYPE_CONFIG);

export default function Achievements() {
  const [achievements] = useState(MOCK_ACHIEVEMENTS);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(new Set());

  const toggleType = (type) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setSelectedTypes(next);
  };

  const clearFilters = () => {
    setSelectedTypes(new Set());
    setSearch("");
  };

  const isFiltered = selectedTypes.size > 0 || search.trim() !== "";

  const filteredAchievements = achievements.filter((item) => {
    const query = search.trim().toLowerCase();
    const matchesType = selectedTypes.size === 0 || selectedTypes.has(item.type);
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
    <div className="container-fluid">
      {/* ── Page Header ── */}
      <div className="section-header animate-in achievements-page-header">
        <div>
          <h1 className="achievements-page-title">Achievements</h1>
          <p className="achievements-page-count">
            {filteredAchievements.length} of {achievements.length} results
          </p>
        </div>

        {isFiltered && (
          <button
            type="button"
            className="achievements-clear-btn"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="achievements-layout">
        {/* ── Left Filters ── */}
        <aside className="achievements-filters">
          <div className="filters-card">
            <div className="filters-card__header">
              <SlidersHorizontal size={14} strokeWidth={2} />
              <h3 className="filters-title">Filters</h3>
            </div>

            <div className="filter-group">
              <div className="filter-label">Type</div>

              {ACHIEVEMENT_TYPES.map((type) => {
                const { Icon, label } = FILTER_TYPE_CONFIG[type];
                const checked = selectedTypes.has(type);
                return (
                  <label
                    key={type}
                    className={`filter-check${checked ? " filter-check--active" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleType(type)}
                    />
                    <span className="filter-check__icon">
                      <Icon size={13} strokeWidth={2} />
                    </span>
                    <span className="filter-check__label">{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Right: Search + Results ── */}
        <section className="achievements-content">
          {/* Search */}
          <div className="achievements-searchbar">
            <span className="achievements-search-icon">
              <Search size={15} strokeWidth={2} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, organization, date, or keyword…"
              className="achievements-search-input"
            />
            {search && (
              <button
                type="button"
                className="achievements-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Results */}
          {filteredAchievements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <Trophy size={28} strokeWidth={1.4} />
              </div>
              <h3 className="empty-state__heading">No achievements found</h3>
              <p className="empty-state__body">
                Try adjusting the filters or search term.
              </p>
              <button
                type="button"
                className="empty-state__reset"
                onClick={clearFilters}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="achievements-list">
              {filteredAchievements.map((ach, i) => (
                <AchievementCard
                  key={ach.id}
                  achievement={ach}
                  animationDelay={`${i * 0.06}s`}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}