import { useState } from "react";
import "../../styles/portfolio/Publications.css";

const MOCK_PUBLICATIONS = [
  {
    id: 1,
    title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
    abstract:
      "A federated learning framework for distributed healthcare systems that preserves patient privacy while improving model quality.",
    authors: ["John Doe", "Jane Smith"],
    venue: "IEEE ICML",
    venueType: "conference",
    publishedDate: "Oct 2023",
    doi: "10.1109/ICML.2023.123456",
    citationCount: 14,
    tags: ["Federated Learning", "Privacy", "Healthcare"],
  },
  {
    id: 2,
    title: "Efficient Transformer Architectures for Edge Computing",
    abstract:
      "Lightweight transformer designs optimized for low-resource edge deployment.",
    authors: ["John Doe", "Alice Wang"],
    venue: "Nature Machine Intelligence",
    venueType: "journal",
    publishedDate: "Jan 2024",
    doi: "10.1038/s42256-024-00123",
    citationCount: 6,
    tags: ["Transformers", "Edge Computing"],
  },
];

const EMPTY_FORM = {
  title: "",
  abstract: "",
  authors: "",
  venue: "",
  venueType: "conference",
  publishedDate: "",
  doi: "",
  citationCount: "0",
  tags: "",
};

const VENUE_BADGE = {
  journal: "badge-green",
  conference: "badge-red",
  preprint: "badge-gray",
  workshop: "badge-gray",
  other: "badge-gray",
};

function PublicationCard({ publication, onEdit, onDelete }) {
  return (
    <div className="card animate-in">
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
            <span className={`badge ${VENUE_BADGE[publication.venueType] || "badge-gray"}`}>
              {publication.venueType}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {publication.publishedDate}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              · {publication.citationCount} citations
            </span>
          </div>

          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1.4 }}>
            {publication.title}
          </h3>

          <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500, marginTop: 4 }}>
            {publication.authors.join(", ")}
          </p>

          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {publication.venue}
          </p>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.7 }}>
        {publication.abstract}
      </p>

      <div className="tags" style={{ marginTop: 12 }}>
        {publication.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      {publication.doi && (
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>
          DOI: <span style={{ fontFamily: "monospace" }}>{publication.doi}</span>
        </p>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        {publication.doi && (
          <a
            href={`https://doi.org/${publication.doi}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            style={{ fontSize: 12, padding: "5px 12px" }}
          >
            View Paper
          </a>
        )}
        <button
          type="button"
          className="btn btn-outline"
          style={{ fontSize: 12, padding: "5px 12px" }}
          onClick={() => onEdit(publication)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger"
          style={{ fontSize: 12, padding: "5px 12px" }}
          onClick={() => onDelete(publication.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function MyPublications() {
  const [publications, setPublications] = useState(MOCK_PUBLICATIONS);
  const [activePanel, setActivePanel] = useState("view");
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSelectedPublication(null);
  };

  const openViewPanel = () => {
    resetForm();
    setActivePanel("view");
  };

  const openAddPanel = () => {
    resetForm();
    setActivePanel("add");
  };

  const openEditPanel = (publication) => {
    setSelectedPublication(publication);
    setFormData({
      title: publication.title,
      abstract: publication.abstract,
      authors: publication.authors.join(", "),
      venue: publication.venue,
      venueType: publication.venueType,
      publishedDate: publication.publishedDate,
      doi: publication.doi || "",
      citationCount: String(publication.citationCount || 0),
      tags: publication.tags.join(", "),
    });
    setActivePanel("edit");
  };

  const buildPayload = () => ({
    title: formData.title.trim(),
    abstract: formData.abstract.trim(),
    authors: formData.authors.split(",").map((a) => a.trim()).filter(Boolean),
    venue: formData.venue.trim(),
    venueType: formData.venueType,
    publishedDate: formData.publishedDate.trim(),
    doi: formData.doi.trim(),
    citationCount: Number(formData.citationCount || 0),
    tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
  });

  const handleAddSave = () => {
    const payload = buildPayload();
    if (!payload.title) return;

    setPublications((prev) => [{ id: Date.now(), ...payload }, ...prev]);
    openViewPanel();
  };

  const handleEditSave = () => {
    if (!selectedPublication) return;
    const payload = buildPayload();
    if (!payload.title) return;

    setPublications((prev) =>
      prev.map((item) =>
        item.id === selectedPublication.id ? { ...item, ...payload } : item
      )
    );

    openViewPanel();
  };

  const handleDelete = (id) => {
    setPublications((prev) => prev.filter((item) => item.id !== id));
    if (selectedPublication?.id === id) {
      openViewPanel();
    }
  };

  return (
    <div className="container" style={{ maxWidth: "1180px" }}>
      <div className="cert-page-shell">
        <div className="cert-page-header">
          <div>
            <h1 className="cert-page-title">My Publications</h1>
            <p className="cert-page-subtitle">Add, update, and manage your publications.</p>
          </div>
        </div>

        <div className="cert-layout">
          <aside className="cert-sidebar">
            <div className="cert-sidebar-card">
              <h3 className="cert-sidebar-title">Actions</h3>
              <div className="cert-action-list">
                <button
                  type="button"
                  className={`cert-action-btn ${activePanel === "view" ? "active" : ""}`}
                  onClick={openViewPanel}
                >
                  View Publications
                </button>
                <button
                  type="button"
                  className={`cert-action-btn ${activePanel === "add" ? "active" : ""}`}
                  onClick={openAddPanel}
                >
                  Add Publication
                </button>
              </div>
            </div>
          </aside>

          <section className="cert-content">
            {activePanel === "view" && (
              <div className="cert-panel">
                <div className="cert-panel-header">
                  <div>
                    <h2 className="cert-panel-title">All Publications</h2>
                    <p className="cert-panel-subtitle">Manage your publication records.</p>
                  </div>
                </div>

                {publications.length > 0 ? (
                  <div className="publications-list">
                    {publications.map((item) => (
                      <PublicationCard
                        key={item.id}
                        publication={item}
                        onEdit={openEditPanel}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="cert-empty-state">
                    <h3>No publications found</h3>
                    <p>Click Add Publication to create your first one.</p>
                  </div>
                )}
              </div>
            )}

            {(activePanel === "add" || activePanel === "edit") && (
              <div className="cert-panel">
                <div className="cert-panel-header">
                  <div>
                    <h2 className="cert-panel-title">
                      {activePanel === "add" ? "Add Publication" : "Edit Publication"}
                    </h2>
                  </div>
                </div>

                <div className="cert-form-grid">
                  <input
                    className="cert-input cert-input-full"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />

                  <input
                    className="cert-input cert-input-full"
                    placeholder="Authors (comma separated)"
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  />

                  <input
                    className="cert-input"
                    placeholder="Venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />

                  <select
                    className="cert-input"
                    value={formData.venueType}
                    onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                  >
                    <option value="conference">conference</option>
                    <option value="journal">journal</option>
                    <option value="preprint">preprint</option>
                    <option value="workshop">workshop</option>
                    <option value="other">other</option>
                  </select>

                  <input
                    className="cert-input"
                    placeholder="Published date"
                    value={formData.publishedDate}
                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                  />

                  <input
                    className="cert-input"
                    type="number"
                    min="0"
                    placeholder="Citations"
                    value={formData.citationCount}
                    onChange={(e) => setFormData({ ...formData, citationCount: e.target.value })}
                  />

                  <input
                    className="cert-input cert-input-full"
                    placeholder="DOI"
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  />

                  <input
                    className="cert-input cert-input-full"
                    placeholder="Tags (comma separated)"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />

                  <textarea
                    className="cert-input cert-textarea cert-input-full"
                    placeholder="Abstract"
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  />
                </div>

                <div className="cert-form-actions">
                  <button type="button" className="btn btn-outline-dark" onClick={openViewPanel}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={activePanel === "add" ? handleAddSave : handleEditSave}
                  >
                    {activePanel === "add" ? "Save" : "Update"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
