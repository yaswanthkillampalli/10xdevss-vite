import { useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  Search,
  SearchX,
  SlidersHorizontal,
  BookOpen,
  Presentation,
  FileText,
  Microscope,
  BadgeCheck,
} from "lucide-react";
import "../../styles/portfolio/Publications.css";
import PublicationCard from "../../components/publications/PublicationCard.jsx";
import { getDiscoverPublications } from "../../authentication/api";

const VENUE_TYPE_CONFIG = {
  journal:    { Icon: BookOpen,     label: "Journal"    },
  conference: { Icon: Presentation, label: "Conference" },
  preprint:   { Icon: FileText,     label: "Preprint"   },
  workshop:   { Icon: Microscope,   label: "Workshop"   },
  other:      { Icon: BadgeCheck,   label: "Other"      },
};

// Modal can stay as scaffolding, but not wired here
function Modal({ show, onClose }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "var(--bg)",
          borderRadius: "var(--radius-xl)",
          padding: 32,
          width: "100%",
          maxWidth: 580,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>Add Publication</h2>
          <button onClick={onClose} className="btn btn-ghost">✕</button>
        </div>
        <p>
          Add and edit publications are managed in the{" "}
          <strong>Profile → Publications</strong> section.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Skeleton sub-components
   ───────────────────────────────────────── */

/**
 * Mimics the sticky filter sidebar while data loads.
 * Renders placeholder rows for each venue-type checkbox.
 */
function FilterSidebarSkeleton() {
  const rowWidths = [58, 80, 62, 70, 44]; // rough label widths per venue type

  return (
    <div className="skeleton-filter-card">
      {/* Header: icon + "Filters" */}
      <div className="skeleton-filter-header">
        <span className="skeleton skeleton-filter-icon" />
        <span className="skeleton skeleton-filter-title" />
      </div>

      {/* Venue type group */}
      <div className="skeleton-filter-group">
        <span className="skeleton skeleton-filter-section-label" />
        {rowWidths.map((w, i) => (
          <div key={i} className="skeleton-filter-row">
            <span className="skeleton skeleton-filter-checkbox" />
            <span className="skeleton skeleton-filter-row-icon" style={{ width: 16, height: 16, borderRadius: 4 }} />
            <span className="skeleton skeleton-filter-row-label" style={{ width: w }} />
          </div>
        ))}
      </div>

      {/* Tags group */}
      <div className="skeleton-filter-group" style={{ marginTop: 20 }}>
        <span className="skeleton skeleton-filter-section-label" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
          {[52, 68, 44, 60, 36, 56].map((w, i) => (
            <span
              key={i}
              className="skeleton"
              style={{ width: w, height: 28, borderRadius: 999 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Per-card tag widths so skeletons don't look identical
const PUB_TAG_LAYOUTS = [
  [52, 68, 44],
  [60, 48, 72],
  [44, 56],
  [70, 40, 58, 36],
];

function PublicationCardSkeleton({ index = 0 }) {
  const tagWidths = PUB_TAG_LAYOUTS[index % PUB_TAG_LAYOUTS.length];
  const authorWidths = [88, 72, 64][index % 3];

  return (
    <div className="skeleton-pub-card">
      {/* Top row: venue badge + date */}
      <div className="skeleton-pub-top">
        <span className="skeleton skeleton-pub-badge" />
        <span className="skeleton skeleton-pub-date" />
      </div>

      {/* Title */}
      <span className="skeleton skeleton-pub-title" />

      {/* Authors */}
      <div className="skeleton-pub-authors">
        <span className="skeleton skeleton-pub-author" style={{ width: authorWidths }} />
        <span className="skeleton skeleton-pub-author" style={{ width: 56 }} />
        <span className="skeleton skeleton-pub-author" style={{ width: 44 }} />
      </div>

      {/* Abstract lines */}
      <div className="skeleton-pub-abstract">
        <span className="skeleton skeleton-pub-abstract-line" style={{ width: "100%" }} />
        <span className="skeleton skeleton-pub-abstract-line" style={{ width: "88%" }} />
        <span className="skeleton skeleton-pub-abstract-line" style={{ width: "72%" }} />
      </div>

      {/* Tags */}
      <div className="skeleton-pub-tags">
        {tagWidths.map((w, i) => (
          <span key={i} className="skeleton skeleton-pub-tag" style={{ width: w }} />
        ))}
      </div>

      {/* Footer */}
      <div className="skeleton-pub-footer">
        <span className="skeleton skeleton-pub-doi" />
        <div className="skeleton-pub-actions">
          <span className="skeleton skeleton-pub-action" />
          <span className="skeleton skeleton-pub-action" style={{ width: 52 }} />
        </div>
      </div>
    </div>
  );
}

function PublicationsListSkeleton({ count = 4 }) {
  return (
    <div className="publications-list">
      {Array.from({ length: count }, (_, i) => (
        <PublicationCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Publications page
   ───────────────────────────────────────── */
export default function Publications() {
  const [pubs, setPubs]         = useState([]);
  const [showModal]             = useState(false);
  const [search, setSearch]     = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState("");

  const [selectedVenueTypes, setSelectedVenueTypes] = useState(new Set());
  const [selectedTags, setSelectedTags]             = useState(new Set());

  const ALL_TAGS = useMemo(
    () => [...new Set(pubs.flatMap((pub) => pub.tags || []))],
    [pubs]
  );

  const formatMonthYear = (dateValue) => {
    if (!dateValue) return "-";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return String(dateValue);
    return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  useEffect(() => {
    let isMounted = true;

    const loadPublications = async () => {
      try {
        const response = await getDiscoverPublications({ limit: 100 });
        const list = response?.data || [];
        if (!isMounted) return;

        setPubs(
          list.map((item) => ({
            ...item,
            id:            item.id || item._id,
            publishedDate: formatMonthYear(item.publishedDate),
            tags:          item.tags     || [],
            authors:       item.authors  || [],
            venueType:     item.venueType || "other",
            title:         item.title    || "Untitled publication",
            venue:         item.venue    || "Unknown venue",
            abstract:      item.abstract || "No abstract provided.",
            doi:           item.doi      || "",
            fileUrl:       item.fileUrl  || null,
            fileName:      item.fileName || null,
          }))
        );
        setError("");
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError?.response?.data?.message || "Could not load publications.");
        setPubs([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPublications();

    return () => { isMounted = false; };
  }, []);

  const toggleVenueType = (type) => {
    const next = new Set(selectedVenueTypes);
    if (next.has(type)) next.delete(type); else next.add(type);
    setSelectedVenueTypes(next);
  };

  const toggleTag = (tag) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) next.delete(tag); else next.add(tag);
    setSelectedTags(next);
  };

  const clearFilters = () => {
    setSelectedVenueTypes(new Set());
    setSelectedTags(new Set());
    setSearch("");
  };

  const isFiltered = selectedVenueTypes.size > 0 || selectedTags.size > 0 || search.trim() !== "";

  const filteredPubs = useMemo(() => {
    let filtered = pubs;
    if (selectedVenueTypes.size > 0)
      filtered = filtered.filter((pub) => selectedVenueTypes.has(pub.venueType));
    if (selectedTags.size > 0)
      filtered = filtered.filter((pub) => pub.tags.some((t) => selectedTags.has(t)));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (pub) =>
          pub.title.toLowerCase().includes(q) ||
          pub.authors.some((a) => a.toLowerCase().includes(q)) ||
          pub.venue.toLowerCase().includes(q) ||
          pub.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [pubs, search, selectedVenueTypes, selectedTags]);

  return (
    <>
      <div className="container-fluid">

        {/* ── Page header ── */}
        <div className="section-header animate-in publications-page-header">
          <div>
            <h1 className="publications-page-title">Publications</h1>
            <p className="publications-page-count">
              {isLoading ? (
                <span className="skeleton" style={{ display: "inline-block", width: 100, height: 12 }} />
              ) : (
                `${filteredPubs.length} of ${pubs.length} results`
              )}
            </p>
          </div>

          {!isLoading && isFiltered && (
            <button type="button" className="publications-clear-btn" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="card" style={{ padding: 16, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* ── Main layout: sidebar + content ── */}
        <div className="publications-layout">

          {/* Sidebar */}
          <aside className="publications-filters">
            {isLoading ? (
              <FilterSidebarSkeleton />
            ) : (
              <div className="publications-filters-card">
                <div className="publications-filters-header">
                  <SlidersHorizontal size={14} strokeWidth={2} />
                  <h3 className="publications-filters-title">Filters</h3>
                </div>

                <div className="publications-filter-group">
                  <div className="publications-filter-label">Venue Type</div>
                  {Object.keys(VENUE_TYPE_CONFIG).map((type) => {
                    const { Icon, label } = VENUE_TYPE_CONFIG[type];
                    const checked = selectedVenueTypes.has(type);
                    return (
                      <label
                        key={type}
                        className={`publications-filter-check${checked ? " publications-filter-check--active" : ""}`}
                      >
                        <input type="checkbox" checked={checked} onChange={() => toggleVenueType(type)} />
                        <span className="publications-filter-check__icon">
                          <Icon size={13} strokeWidth={2} />
                        </span>
                        <span className="publications-filter-check__label">{label}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="publications-filter-group">
                  <div className="publications-filter-label">Tags</div>
                  <div className="filter-tags">
                    {ALL_TAGS.map((tag) => (
                      <label key={tag} className={`filter-tag-chip ${selectedTags.has(tag) ? "active" : ""}`}>
                        <input type="checkbox" checked={selectedTags.has(tag)} onChange={() => toggleTag(tag)} />
                        <span>{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Content */}
          <section className="publications-content">
            <div className="publications-searchbar">
              <span className="publications-search-icon">
                <Search size={15} strokeWidth={2} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, author, venue, or tag..."
                className="publications-search-input"
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? "not-allowed" : "text" }}
              />
              {!isLoading && search && (
                <button
                  type="button"
                  className="publications-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {isLoading ? (
              <PublicationsListSkeleton count={4} />
            ) : pubs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">
                  <BookOpenText size={28} strokeWidth={1.4} />
                </div>
                <h3 className="empty-state__heading">No publications</h3>
                <p className="empty-state__body">No publications found right now.</p>
              </div>
            ) : filteredPubs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">
                  <SearchX size={28} strokeWidth={1.4} />
                </div>
                <h3 className="empty-state__heading">No publications match filters</h3>
                <p className="empty-state__body">Try changing the filters or search term.</p>
              </div>
            ) : (
              <div className="publications-list">
                {filteredPubs.map((pub, i) => (
                  <PublicationCard
                    key={pub.id}
                    publication={pub}
                    isEdit={false}
                    animationDelay={`${i * 0.08}s`}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <Modal show={showModal} onClose={() => {}} />
    </>
  );
}