import { useEffect, useMemo, useState } from "react";
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
import { getDiscoverAchievements } from "../../authentication/api";

const FILTER_TYPE_CONFIG = {
  award:       { Icon: Trophy,        label: "Award"       },
  scholarship: { Icon: GraduationCap, label: "Scholarship" },
  competition: { Icon: Medal,         label: "Competition" },
  recognition: { Icon: Star,          label: "Recognition" },
  fellowship:  { Icon: Award,         label: "Fellowship"  },
  other:       { Icon: BadgeCheck,    label: "Other"       },
};

const ACHIEVEMENT_TYPES = Object.keys(FILTER_TYPE_CONFIG);

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const formatMonthYear = (dateValue) => {
    if (!dateValue) return "-";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return String(dateValue);
    return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  useEffect(() => {
    let isMounted = true;

    const loadAchievements = async () => {
      try {
        const response = await getDiscoverAchievements({ limit: 100 });
        const list = response?.data || [];

        if (!isMounted) return;

        setAchievements(
          list.map((item) => ({
            ...item,
            id: item.id || item._id,
            date: formatMonthYear(item.date),
            title: item.title || "Untitled achievement",
            issuingOrganization: item.issuingOrganization || "Unknown organization",
            description: item.description || "",
            type: item.type || "other",
            url: item.url || null,
          }))
        );
        setError("");
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError?.response?.data?.message || "Could not load achievements.");
        setAchievements([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAchievements();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const filteredAchievements = useMemo(
    () =>
      achievements.filter((item) => {
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
      }),
    [achievements, search, selectedTypes]
  );

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

      {isLoading && (
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          Loading achievements...
        </div>
      )}

      {error && (
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          {error}
        </div>
      )}

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
          {!isLoading && achievements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <Trophy size={28} strokeWidth={1.4} />
              </div>
              <h3 className="empty-state__heading">No achievements</h3>
              <p className="empty-state__body">No achievements found right now.</p>
            </div>
          ) : filteredAchievements.length === 0 ? (
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