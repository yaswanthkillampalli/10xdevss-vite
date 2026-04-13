import React, { useState, useMemo } from "react";
import "../../styles/portfolio/Publications.css";

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

const VENUE_BADGE = {
  journal: "badge-green",
  conference: "badge-red",
  preprint: "badge-gray",
  workshop: "badge-gray",
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
      <div className="container" style={{ maxWidth: 1200 }}>
        <div className="section-header animate-in">
          <div>
            <h1 style={{ fontSize: 28, letterSpacing: "-0.02em" }}>
              Publications
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginTop: 4,
              }}
            >
              Research papers & academic work
            </p>
          </div>
        </div>

        <div className="publications-layout">
          <aside className="publications-filters">
            <div className="filters-card">
              <h3 className="filters-title">Filters</h3>

              <div className="filter-group">
                <div className="filter-label">Venue Type</div>
                {["journal", "conference", "preprint", "workshop", "other"].map((type) => (
                  <label key={type} className="filter-check">
                    <input
                      type="checkbox"
                      checked={selectedVenueTypes.has(type)}
                      onChange={() => toggleVenueType(type)}
                    />
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <div className="filter-label">Tags</div>
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
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, author, venue, or tag..."
                className="publications-search-input"
              />
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
                  <div
                    key={pub.id}
                    className="card animate-in"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            marginBottom: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            className={`badge ${
                              VENUE_BADGE[pub.venueType] || "badge-gray"
                            }`}
                          >
                            {pub.venueType}
                          </span>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                            {pub.publishedDate}
                          </span>
                          {pub.citationCount > 0 && (
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                              · {pub.citationCount} citations
                            </span>
                          )}
                        </div>

                        <h3
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 17,
                            fontWeight: 700,
                            lineHeight: 1.4,
                          }}
                        >
                          {pub.title}
                        </h3>

                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--accent)",
                            fontWeight: 500,
                            marginTop: 4,
                          }}
                        >
                          {pub.authors.join(", ")}
                        </p>

                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                          {pub.venue}
                        </p>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        marginTop: 12,
                        lineHeight: 1.7,
                      }}
                    >
                      {pub.abstract}
                    </p>

                    <div className="tags" style={{ marginTop: 12 }}>
                      {pub.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>

                    {pub.doi && (
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>
                        DOI:{" "}
                        <span style={{ fontFamily: "monospace" }}>{pub.doi}</span>
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline"
                          style={{ fontSize: 12, padding: "5px 12px" }}
                        >
                          View Paper ↗
                        </a>
                      )}
                    </div>
                  </div>
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