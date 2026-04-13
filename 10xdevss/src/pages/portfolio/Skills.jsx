import { useMemo, useState } from "react";
import "../../styles/portfolio/Skills.css";

const CATEGORIES = [
  "all",
  "frontend",
  "backend",
  "database",
  "devops",
  "ai-ml",
  "tools",
  "language",
  "other",
];

const PROFICIENCY_COLORS = {
  beginner: { bg: "#F5F5F5", color: "#777777" },
  intermediate: { bg: "#EDF5FF", color: "#1A65C0" },
  advanced: { bg: "#FFF3E0", color: "#C06A00" },
  expert: { bg: "#FDEAEA", color: "#A11D2D" },
};

const MOCK_SKILLS = [
  { id: 1, name: "React", category: "frontend", proficiency: "expert" },
  { id: 2, name: "TypeScript", category: "frontend", proficiency: "advanced" },
  { id: 3, name: "Node.js", category: "backend", proficiency: "expert" },
  { id: 4, name: "Express", category: "backend", proficiency: "advanced" },
  { id: 5, name: "MongoDB", category: "database", proficiency: "advanced" },
  { id: 6, name: "PostgreSQL", category: "database", proficiency: "intermediate" },
  { id: 7, name: "Docker", category: "devops", proficiency: "intermediate" },
  { id: 8, name: "Python", category: "language", proficiency: "advanced" },
  { id: 9, name: "TensorFlow", category: "ai-ml", proficiency: "beginner" },
  { id: 10, name: "Redis", category: "backend", proficiency: "intermediate" },
  { id: 11, name: "Figma", category: "tools", proficiency: "intermediate" },
  { id: 12, name: "Kubernetes", category: "devops", proficiency: "beginner" },
];

const EMPTY_FORM = {
  name: "",
  category: "frontend",
  proficiency: "beginner",
};

function DeleteSkillModal({ open, onClose, onConfirm, skill }) {
  if (!open || !skill) return null;

  return (
    <div className="skills-modal-backdrop" onClick={onClose}>
      <div
        className="skills-modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Delete Skill"
      >
        <div className="skills-modal-header">
          <h3 className="skills-modal-title">Delete Skill</h3>
          <button type="button" className="skills-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="skills-modal-body">
          <p className="skills-delete-copy">
            Are you sure you want to delete <strong>{skill.name}</strong>?
          </p>
        </div>

        <div className="skills-modal-footer">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState(MOCK_SKILLS);
  const [activePanel, setActivePanel] = useState("view");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const filteredSkills = useMemo(() => {
    return selectedCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === selectedCategory);
  }, [skills, selectedCategory]);

  const groupedSkills = useMemo(() => {
    return CATEGORIES.filter((cat) => cat !== "all").reduce((acc, cat) => {
      const items = filteredSkills.filter((skill) => skill.category === cat);
      if (items.length > 0) acc[cat] = items;
      return acc;
    }, {});
  }, [filteredSkills]);

  const openViewPanel = () => {
    setActivePanel("view");
    setSelectedSkill(null);
    setFormData(EMPTY_FORM);
  };

  const openAddPanel = () => {
    setActivePanel("add");
    setSelectedSkill(null);
    setFormData(EMPTY_FORM);
  };

  const openEditPanel = (skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    });
    setActivePanel("edit");
  };

  const handleAddSkill = () => {
    const newSkill = {
      id: Date.now(),
      name: formData.name.trim(),
      category: formData.category,
      proficiency: formData.proficiency,
    };

    if (!newSkill.name) return;

    setSkills((prev) => [newSkill, ...prev]);
    setFormData(EMPTY_FORM);
    setActivePanel("view");
  };

  const handleEditSkill = () => {
    if (!selectedSkill || !formData.name.trim()) return;

    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === selectedSkill.id
          ? {
              ...skill,
              name: formData.name.trim(),
              category: formData.category,
              proficiency: formData.proficiency,
            }
          : skill
      )
    );

    setSelectedSkill(null);
    setFormData(EMPTY_FORM);
    setActivePanel("view");
  };

  const handleDeleteSkill = () => {
    if (!deleteTarget) return;

    setSkills((prev) => prev.filter((skill) => skill.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="container" style={{ maxWidth: "1180px" }}>
        <div className="skills-page-shell">
          <div className="skills-page-header">
            <div>
              <h1 className="skills-page-title">Skills</h1>
              <p className="skills-page-subtitle">
                {skills.length} skills across{" "}
                {CATEGORIES.filter((cat) => cat !== "all" && skills.some((s) => s.category === cat)).length} categories
              </p>
            </div>
          </div>

          <div className="skills-layout">
            <aside className="skills-sidebar">
              <div className="skills-sidebar-card">
                <h3 className="skills-sidebar-title">Actions</h3>

                <div className="skills-action-list">
                  <button
                    type="button"
                    className={`skills-action-btn ${activePanel === "view" ? "active" : ""}`}
                    onClick={openViewPanel}
                  >
                    View Skills
                  </button>

                  <button
                    type="button"
                    className={`skills-action-btn ${activePanel === "add" ? "active" : ""}`}
                    onClick={openAddPanel}
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </aside>

            <section className="skills-content">
              {activePanel === "view" && (
                <div className="skills-panel">
                  <div className="skills-panel-header">
                    <div>
                      <h2 className="skills-panel-title">All Skills</h2>
                      <p className="skills-panel-subtitle">
                        Browse skills by category and manage them card-wise.
                      </p>
                    </div>
                  </div>

                  <div className="skills-filter-row">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        className={`skills-filter-btn ${selectedCategory === category ? "active" : ""}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {Object.keys(groupedSkills).length > 0 ? (
                    <div className="skills-group-list">
                      {Object.entries(groupedSkills).map(([category, items]) => (
                        <div className="skills-group-block" key={category}>
                          <h3 className="skills-group-title">{category}</h3>

                          <div className="skills-card-grid">
                            {items.map((skill) => {
                              const proficiencyStyle = PROFICIENCY_COLORS[skill.proficiency];

                              return (
                                <article className="skill-card" key={skill.id}>
                                  <div className="skill-card-top">
                                    <div>
                                      <h4 className="skill-card-title">{skill.name}</h4>
                                      <p className="skill-card-category">{skill.category}</p>
                                    </div>

                                    <span
                                      className="skill-level-badge"
                                      style={{
                                        background: proficiencyStyle.bg,
                                        color: proficiencyStyle.color,
                                      }}
                                    >
                                      {skill.proficiency}
                                    </span>
                                  </div>

                                  <div className="skill-card-actions">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => openEditPanel(skill)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-danger"
                                      onClick={() => setDeleteTarget(skill)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="skills-empty-state">
                      <h3>No skills found</h3>
                      <p>Try another category or add a new skill.</p>
                    </div>
                  )}
                </div>
              )}

              {activePanel === "add" && (
                <div className="skills-panel">
                  <div className="skills-panel-header">
                    <div>
                      <h2 className="skills-panel-title">Add Skill</h2>
                      <p className="skills-panel-subtitle">
                        Create a new skill entry.
                      </p>
                    </div>
                  </div>

                  <div className="skills-form-grid">
                    <div className="form-group">
                      <label className="skills-label">Skill Name</label>
                      <input
                        className="skills-input"
                        placeholder="e.g. React, Python, Docker"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="skills-label">Category</label>
                      <select
                        className="skills-input"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        {CATEGORIES.filter((c) => c !== "all").map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="skills-label">Proficiency</label>
                      <select
                        className="skills-input"
                        value={formData.proficiency}
                        onChange={(e) =>
                          setFormData({ ...formData, proficiency: e.target.value })
                        }
                      >
                        <option value="beginner">beginner</option>
                        <option value="intermediate">intermediate</option>
                        <option value="advanced">advanced</option>
                        <option value="expert">expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="skills-form-actions">
                    <button type="button" className="btn btn-outline-dark" onClick={openViewPanel}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleAddSkill}>
                      Save Skill
                    </button>
                  </div>
                </div>
              )}

              {activePanel === "edit" && selectedSkill && (
                <div className="skills-panel">
                  <div className="skills-panel-header">
                    <div>
                      <h2 className="skills-panel-title">Edit Skill</h2>
                      <p className="skills-panel-subtitle">
                        Update the selected skill details.
                      </p>
                    </div>
                  </div>

                  <div className="skills-form-grid">
                    <div className="form-group">
                      <label className="skills-label">Skill Name</label>
                      <input
                        className="skills-input"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="skills-label">Category</label>
                      <select
                        className="skills-input"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        {CATEGORIES.filter((c) => c !== "all").map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="skills-label">Proficiency</label>
                      <select
                        className="skills-input"
                        value={formData.proficiency}
                        onChange={(e) =>
                          setFormData({ ...formData, proficiency: e.target.value })
                        }
                      >
                        <option value="beginner">beginner</option>
                        <option value="intermediate">intermediate</option>
                        <option value="advanced">advanced</option>
                        <option value="expert">expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="skills-form-actions">
                    <button type="button" className="btn btn-outline-dark" onClick={openViewPanel}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleEditSkill}>
                      Update Skill
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <DeleteSkillModal
        open={!!deleteTarget}
        skill={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteSkill}
      />
    </>
  );
}