import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  Presentation,
  FileText,
  Microscope,
  BadgeCheck,
} from "lucide-react";
import "../../styles/portfolio/Publications.css";
import PublicationCard from "../../components/publications/PublicationCard.jsx";

const VENUE_TYPE_CONFIG = {
  journal: { Icon: BookOpen, label: "Journal" },
  conference: { Icon: Presentation, label: "Conference" },
  preprint: { Icon: FileText, label: "Preprint" },
  workshop: { Icon: Microscope, label: "Workshop" },
  other: { Icon: BadgeCheck, label: "Other" },
};

const MOCK_PUBS = [
  {
    id: 1,
    title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
    abstract:
      "We present a novel federated learning framework designed for distributed healthcare environments, enabling collaborative model training without centralizing sensitive patient data.",
    authors: ["John Doe", "Jane Smith", "Bob Johnson"],
    venue: "IEEE International Conference on Machine Learning",
    venueType: "conference",
    publishedDate: "Oct 2023",
    doi: "10.1109/ICML.2023.123456",
    citationCount: 14,
    tags: ["Federated Learning", "Privacy", "Healthcare", "ML"],
  },
  {
    id: 2,
    title: "Efficient Transformer Architectures for Edge Computing",
    abstract:
      "This paper explores lightweight transformer architectures optimized for deployment on resource‑constrained edge devices with minimal accuracy trade‑offs.",
    authors: ["John Doe", "Alice Wang"],
    venue: "Nature Machine Intelligence",
    venueType: "journal",
    publishedDate: "Jan 2024",
    doi: "10.1038/s42256-024-00123",
    citationCount: 6,
    tags: ["Transformers", "Edge Computing", "Optimization"],
  },
];

// Extract all possible tags for filter checkboxes
const ALL_TAGS = [...new Set(MOCK_PUBS.flatMap((pub) => pub.tags))];

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
          <button onClick={onClose} className="btn btn-ghost">
            ✕
          </button>
        </div>
        <p>Add and edit publications are managed in the <strong>Profile → Publications</strong> section.</p>
      </div>
    </div>
  );
}

export default function Publications() {
  const [pubs] = useState(MOCK_PUBS); // only show "others" / public
  const [showModal] = useState(false); // keep as placeholder, no add button here
  const [search, setSearch] = useState("");

  // Filters
  const [selectedVenueTypes, setSelectedVenueTypes] = useState(new Set());
  const [selectedTags, setSelectedTags] = useState(new Set());

  const toggleVenueType = (type) => {
    const next = new Set(selectedVenueTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setSelectedVenueTypes(next);
  };

  const toggleTag = (tag) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setSelectedTags(next);
  };

  const clearFilters = () => {
    setSelectedVenueTypes(new Set());
    setSelectedTags(new Set());
    setSearch("");
  };

  const isFiltered =
    selectedVenueTypes.size > 0 || selectedTags.size > 0 || search.trim() !== "";

  const filteredPubs = useMemo(() => {
    let filtered = pubs;

    if (selectedVenueTypes.size > 0) {
      filtered = filtered.filter((pub) => selectedVenueTypes.has(pub.venueType));
    }

    if (selectedTags.size > 0) {
      filtered = filtered.filter((pub) => pub.tags.some((t) => selectedTags.has(t)));
    }

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
        <div className="section-header animate-in publications-page-header">
          <div>
            <h1 className="publications-page-title">Publications</h1>
            <p className="publications-page-count">
              {filteredPubs.length} of {pubs.length} results
            </p>
          </div>

          {isFiltered && (
            <button
              type="button"
              className="publications-clear-btn"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="publications-layout">
          <aside className="publications-filters">
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
                      className={`publications-filter-check${
                        checked ? " publications-filter-check--active" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleVenueType(type)}
                      />
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
                    <label
                      key={tag}
                      className={`filter-tag-chip ${selectedTags.has(tag) ? "active" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.has(tag)}
                        onChange={() => toggleTag(tag)}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

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
              />
              {search && (
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

            {filteredPubs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <h3 style={{ fontFamily: "var(--font-display)" }}>No publications match filters</h3>
                <p>Try changing the filters or search term.</p>
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

      {/* Modal framework for future use in Profile/Publications */}
      <Modal show={showModal} onClose={() => {}} />
    </>
  );
}