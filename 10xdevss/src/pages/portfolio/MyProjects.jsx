import { useState } from "react";
import "../../styles/portfolio/Projects.css";
import ProjectCard from "../../components/projects/ProjectCard.jsx";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Portfolio CMS",
    description:
      "A full-stack CMS for managing developer portfolios with real-time preview and ImageKit integration.",
    techStack: ["React", "Node.js", "MongoDB", "ImageKit"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    status: "completed",
    startDate: "Jan 2024",
    endDate: "Mar 2024",
  },
  {
    id: 2,
    title: "ML Dashboard",
    description:
      "Interactive dashboard for visualizing machine learning model performance metrics and training logs.",
    techStack: ["Python", "FastAPI", "D3.js", "PostgreSQL"],
    githubUrl: "https://github.com",
    liveUrl: null,
    status: "ongoing",
    startDate: "Feb 2024",
    endDate: null,
  },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  techStack: "",
  githubUrl: "",
  liveUrl: "",
  status: "ongoing",
  startDate: "",
  endDate: "",
};

export default function MyProjects() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [activePanel, setActivePanel] = useState("view");
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSelectedProject(null);
  };

  const openAddPanel = () => {
    resetForm();
    setActivePanel("add");
  };

  const openViewPanel = () => {
    resetForm();
    setActivePanel("view");
  };

  const openEditPanel = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      status: project.status,
      startDate: project.startDate || "",
      endDate: project.endDate || "",
    });
    setActivePanel("edit");
  };

  const buildProjectPayload = () => ({
    title: formData.title.trim(),
    description: formData.description.trim(),
    techStack: formData.techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    githubUrl: formData.githubUrl.trim() || null,
    liveUrl: formData.liveUrl.trim() || null,
    status: formData.status,
    startDate: formData.startDate.trim(),
    endDate: formData.endDate.trim() || null,
  });

  const handleAddSave = () => {
    const payload = buildProjectPayload();
    if (!payload.title) return;

    const newProject = {
      id: Date.now(),
      ...payload,
    };

    setProjects((prev) => [newProject, ...prev]);
    openViewPanel();
  };

  const handleEditSave = () => {
    if (!selectedProject) return;

    const payload = buildProjectPayload();
    if (!payload.title) return;

    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProject.id ? { ...project, ...payload } : project
      )
    );

    openViewPanel();
  };

  const handleDelete = (id) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
    if (selectedProject?.id === id) {
      openViewPanel();
    }
  };

  return (
    <div className="container-fluid">
      <div className="cert-page-shell">
        <div className="cert-page-header">
          <div>
            <h1 className="cert-page-title">My Projects</h1>
            <p className="cert-page-subtitle">
              Create and manage your portfolio projects.
            </p>
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
                  View Projects
                </button>

                <button
                  type="button"
                  className={`cert-action-btn ${activePanel === "add" ? "active" : ""}`}
                  onClick={openAddPanel}
                >
                  Add Project
                </button>
              </div>
            </div>
          </aside>

          <section className="cert-content">
            {activePanel === "view" && (
              <div className="cert-panel">
                <div className="cert-panel-header">
                  <div>
                    <h2 className="cert-panel-title">All Projects</h2>
                    <p className="cert-panel-subtitle">
                      Manage your project cards and edit details anytime.
                    </p>
                  </div>
                </div>

                {projects.length > 0 ? (
                  <div className="grid-2" style={{ marginTop: 8 }}>
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        isEdit
                        onEdit={openEditPanel}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="cert-empty-state">
                    <h3>No projects found</h3>
                    <p>Click Add Project to create your first project.</p>
                  </div>
                )}
              </div>
            )}

            {(activePanel === "add" || activePanel === "edit") && (
              <div className="cert-panel">
                <div className="cert-panel-header">
                  <div>
                    <h2 className="cert-panel-title">
                      {activePanel === "add" ? "Add Project" : "Edit Project"}
                    </h2>
                    <p className="cert-panel-subtitle">
                      {activePanel === "add"
                        ? "Fill project details to add it to your portfolio."
                        : "Update your project details and save changes."}
                    </p>
                  </div>
                </div>

                <div className="cert-form-grid">
                  <input
                    className="cert-input"
                    placeholder="Project title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />

                  <select
                    className="cert-input"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ongoing">ongoing</option>
                    <option value="completed">completed</option>
                    <option value="on-hold">on-hold</option>
                  </select>

                  <input
                    className="cert-input"
                    placeholder="Start date (e.g. Jan 2024)"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />

                  <input
                    className="cert-input"
                    placeholder="End date (optional)"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />

                  <input
                    className="cert-input cert-input-full"
                    placeholder="GitHub URL"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  />

                  <input
                    className="cert-input cert-input-full"
                    placeholder="Live URL (optional)"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  />

                  <input
                    className="cert-input cert-input-full"
                    placeholder="Tech stack (comma separated)"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  />

                  <textarea
                    className="cert-input cert-textarea cert-input-full"
                    placeholder="Project description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="cert-form-actions">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={openViewPanel}
                  >
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
