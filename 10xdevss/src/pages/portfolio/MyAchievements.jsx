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
      "Selected as a GSoC contributor for open-source machine learning tooling.",
    issuingOrganization: "Google",
    date: "May 2023",
    type: "fellowship",
    url: "https://summerofcode.withgoogle.com",
  },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  issuingOrganization: "",
  date: "",
  type: "award",
  url: "",
};

function AchievementCard({ achievement, onEdit, onDelete }) {
  return (
    <div className="card animate-in achievement-card">
      <div className="achievement-card-top">
        <div className="achievement-icon-wrap">
          <span className="achievement-icon">{TYPE_ICONS[achievement.type]}</span>
        </div>

        <span className="badge badge-gray achievement-type-badge">{achievement.type}</span>
      </div>

      <div className="achievement-main">
        <h3 className="achievement-title">{achievement.title}</h3>
        <p className="achievement-org">{achievement.issuingOrganization}</p>
        <p className="achievement-date">{achievement.date}</p>
        <p className="achievement-description">{achievement.description}</p>
      </div>

      <div className="achievement-actions" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {achievement.url && (
          <a
            href={achievement.url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            style={{ fontSize: 12, padding: "6px 12px" }}
          >
            View
          </a>
        )}

        <button
          type="button"
          className="btn btn-outline"
          style={{ fontSize: 12, padding: "6px 12px" }}
          onClick={() => onEdit(achievement)}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn btn-danger"
          style={{ fontSize: 12, padding: "6px 12px" }}
          onClick={() => onDelete(achievement.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function MyAchievements() {
  const [achievements, setAchievements] = useState(MOCK_ACHIEVEMENTS);
  const [activePanel, setActivePanel] = useState("view");
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSelectedAchievement(null);
  };

  const openViewPanel = () => {
    resetForm();
    setActivePanel("view");
  };

  const openAddPanel = () => {
    resetForm();
    setActivePanel("add");
  };

  const openEditPanel = (achievement) => {
    setSelectedAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      issuingOrganization: achievement.issuingOrganization,
      date: achievement.date,
      type: achievement.type,
      url: achievement.url || "",
    });
    setActivePanel("edit");
  };

  const buildPayload = () => ({
    title: formData.title.trim(),
    description: formData.description.trim(),
    issuingOrganization: formData.issuingOrganization.trim(),
    date: formData.date.trim(),
    type: formData.type,
    url: formData.url.trim(),
  });

  const handleAddSave = () => {
    const payload = buildPayload();
    if (!payload.title) return;

    setAchievements((prev) => [{ id: Date.now(), ...payload }, ...prev]);
    openViewPanel();
  };

  const handleEditSave = () => {
    if (!selectedAchievement) return;
    const payload = buildPayload();
    if (!payload.title) return;

    setAchievements((prev) =>
      prev.map((item) =>
        item.id === selectedAchievement.id ? { ...item, ...payload } : item
      )
    );

    openViewPanel();
  };

  const handleDelete = (id) => {
    setAchievements((prev) => prev.filter((item) => item.id !== id));
    if (selectedAchievement?.id === id) {
      openViewPanel();
    }
  };

  return (
    <div className="container-fluid">
      <div className="cert-page-shell">
        <div className="cert-page-header">
          <div>
            <h1 className="cert-page-title">My Achievements</h1>
            <p className="cert-page-subtitle">Add, edit, and manage your achievements.</p>
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
                  View Achievements
                </button>
                <button
                  type="button"
                  className={`cert-action-btn ${activePanel === "add" ? "active" : ""}`}
                  onClick={openAddPanel}
                >
                  Add Achievement
                </button>
              </div>
            </div>
          </aside>

          <section className="cert-content">
            {activePanel === "view" && (
              <div className="cert-panel">
                <div className="cert-panel-header">
                  <div>
                    <h2 className="cert-panel-title">All Achievements</h2>
                    <p className="cert-panel-subtitle">Manage your achievement entries.</p>
                  </div>
                </div>

                {achievements.length > 0 ? (
                  <div className="achievements-list">
                    {achievements.map((item) => (
                      <AchievementCard
                        key={item.id}
                        achievement={item}
                        onEdit={openEditPanel}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="cert-empty-state">
                    <h3>No achievements found</h3>
                    <p>Click Add Achievement to create your first one.</p>
                  </div>
                )}
              </div>
            )}

            {(activePanel === "add" || activePanel === "edit") && (
              <div className="cert-panel">
                <div className="cert-panel-header">
                  <div>
                    <h2 className="cert-panel-title">
                      {activePanel === "add" ? "Add Achievement" : "Edit Achievement"}
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
                    className="cert-input"
                    placeholder="Issuing organization"
                    value={formData.issuingOrganization}
                    onChange={(e) =>
                      setFormData({ ...formData, issuingOrganization: e.target.value })
                    }
                  />

                  <select
                    className="cert-input"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="award">award</option>
                    <option value="scholarship">scholarship</option>
                    <option value="competition">competition</option>
                    <option value="recognition">recognition</option>
                    <option value="fellowship">fellowship</option>
                    <option value="other">other</option>
                  </select>

                  <input
                    className="cert-input"
                    placeholder="Date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />

                  <input
                    className="cert-input cert-input-full"
                    placeholder="Reference URL (optional)"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />

                  <textarea
                    className="cert-input cert-textarea cert-input-full"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
