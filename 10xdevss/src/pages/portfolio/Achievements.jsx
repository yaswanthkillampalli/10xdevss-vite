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
import { toast } from 'react-toastify';
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

/* ─────────────────────────────────────────
   Skeleton sub-components
   ───────────────────────────────────────── */

/**
 * Sidebar filter skeleton – mirrors the real filters-card shape.
 */
function FilterSidebarSkeleton() {
  // Approximate label widths for each achievement type row
  const rowWidths = [50, 82, 78, 72, 68, 42];

  return (
    <div className="skeleton-ach-filter-card">
      {/* Header */}
      <div className="skeleton-ach-filter-header">
        <span className="skeleton skeleton-ach-filter-icon" />
        <span className="skeleton skeleton-ach-filter-title" />
      </div>

      {/* Type group */}
      <div className="skeleton-ach-filter-group">
        <span className="skeleton skeleton-ach-filter-section-label" />
        {rowWidths.map((w, i) => (
          <div key={i} className="skeleton-ach-filter-row">
            <span className="skeleton skeleton-ach-filter-checkbox" />
            <span
              className="skeleton"
              style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0 }}
            />
            <span className="skeleton" style={{ width: w, height: 13, borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Varied description-line widths so cards feel unique
const ACH_DESC_LAYOUTS = [
  ["100%", "82%"],
  ["100%", "90%", "68%"],
  ["100%", "76%"],
  ["100%", "88%", "60%"],
];

function AchievementCardSkeleton({ index = 0 }) {
  const descWidths = ACH_DESC_LAYOUTS[index % ACH_DESC_LAYOUTS.length];

  return (
    <div className="skeleton-ach-card">
      {/* Left icon column */}
      <span className="skeleton skeleton-ach-icon-col" />

      {/* Right body */}
      <div className="skeleton-ach-body">
        {/* Title row + badge */}
        <div className="skeleton-ach-top">
          <span className="skeleton skeleton-ach-title" />
          <span className="skeleton skeleton-ach-badge" />
        </div>

        {/* Org + date */}
        <div className="skeleton-ach-org-row">
          <span className="skeleton skeleton-ach-org" />
          <span className="skeleton skeleton-ach-date" />
        </div>

        {/* Description lines */}
        <div className="skeleton-ach-desc">
          {descWidths.map((w, i) => (
            <span
              key={i}
              className="skeleton skeleton-ach-desc-line"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AchievementsListSkeleton({ count = 5 }) {
  return (
    <div className="achievements-list">
      {Array.from({ length: count }, (_, i) => (
        <AchievementCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Achievements page
   ───────────────────────────────────────── */
export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [search, setSearch]             = useState("");
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState("");

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
            id:                  item.id || item._id,
            date:                formatMonthYear(item.date),
            title:               item.title               || "Untitled achievement",
            issuingOrganization: item.issuingOrganization || "Unknown organization",
            description:         item.description         || "",
            type:                item.type                || "other",
            url:                 item.url                 || null,
          }))
        );
        setError("");
      } catch (loadError) {
        if (!isMounted) return;
        const msg = loadError?.response?.data?.message || "Could not load achievements.";
        toast.error(msg);
        setAchievements([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAchievements();

    return () => { isMounted = false; };
  }, []);

  const toggleType = (type) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type); else next.add(type);
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
        const matchesType   = selectedTypes.size === 0 || selectedTypes.has(item.type);
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

      {/* ── Page header ── */}
      <div className="section-header animate-in achievements-page-header">
        <div>
          <h1 className="achievements-page-title">Achievements</h1>
          <p className="achievements-page-count">
            {isLoading ? (
              <span className="skeleton" style={{ display: "inline-block", width: 100, height: 12 }} />
            ) : (
              `${filteredAchievements.length} of ${achievements.length} results`
            )}
          </p>
        </div>

        {!isLoading && isFiltered && (
          <button type="button" className="achievements-clear-btn" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {/* Errors are shown via toast notifications (react-toastify) */}

      {/* ── Main layout: sidebar + content ── */}
      <div className="achievements-layout">

        {/* Sidebar */}
        <aside className="achievements-filters">
          {isLoading ? (
            <FilterSidebarSkeleton />
          ) : (
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
                      <input type="checkbox" checked={checked} onChange={() => toggleType(type)} />
                      <span className="filter-check__icon">
                        <Icon size={13} strokeWidth={2} />
                      </span>
                      <span className="filter-check__label">{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Content */}
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
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? "not-allowed" : "text" }}
            />
            {!isLoading && search && (
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
          {isLoading ? (
            <AchievementsListSkeleton count={5} />
          ) : achievements.length === 0 ? (
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
              <p className="empty-state__body">Try adjusting the filters or search term.</p>
              <button type="button" className="empty-state__reset" onClick={clearFilters}>
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