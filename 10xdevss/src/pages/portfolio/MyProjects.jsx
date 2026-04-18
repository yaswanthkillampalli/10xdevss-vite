import { useEffect, useState } from "react";
import "../../styles/portfolio/Projects.css";
import ProjectCard from "../../components/projects/ProjectCard.jsx";
import {
  createProject,
  deleteProject,
  getMyProjects,
  updateProject,
} from "../../authentication/api";

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

/* ─── Delete confirmation modal ─── */
function DeleteModal({ open, onClose, onConfirm, project }) {
  if (!open || !project) return null;
  return (
    <div className="proj-modal-backdrop" onClick={onClose}>
      <div
        className="proj-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="proj-modal-header">
          <h3 className="proj-modal-title">Delete Project</h3>
          <button type="button" className="proj-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="proj-modal-body">
          <p className="proj-modal-copy">
            Are you sure you want to delete <strong>{project.title}</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="proj-modal-footer">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add / Edit modal ─── */
function ProjectFormModal({ open, onClose, onSave, formData, setFormData, mode, isSaving }) {
  if (!open) return null;

  const isAdd = mode === "add";

  const field = (label, key, props = {}) => (
    <div className={`proj-field${props.full ? " proj-field-full" : ""}`}>
      <label className="proj-field-label">{label}</label>
      <input
        className="cert-input"
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        {...props}
        full={undefined}
      />
    </div>
  );

  return (
    <div className="proj-modal-backdrop" onClick={onClose}>
      <div
        className="proj-modal proj-modal-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="proj-modal-header">
          <div>
            <h3 className="proj-modal-title">
              {isAdd ? "Add Project" : "Edit Project"}
            </h3>
            <p className="proj-modal-subtitle">
              {isAdd
                ? "Fill in the project details to add it to your portfolio."
                : "Update your project details and save changes."}
            </p>
          </div>
          <button type="button" className="proj-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="proj-modal-body proj-modal-scroll">
          <div className="proj-form-grid">

            {field("Project Title", "title", { placeholder: "e.g. Portfolio CMS", full: true })}

            <div className="proj-field">
              <label className="proj-field-label">Status</label>
              <select
                className="cert-input"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            {field("Start Date", "startDate", { placeholder: "e.g. Jan 2024" })}
            {field("End Date", "endDate", { placeholder: "e.g. Mar 2024 (optional)" })}
            {field("GitHub URL", "githubUrl", { placeholder: "https://github.com/...", full: true })}
            {field("Live URL", "liveUrl", { placeholder: "https://yourproject.com (optional)", full: true })}
            {field("Tech Stack", "techStack", { placeholder: "React, Node.js, MongoDB (comma separated)", full: true })}

            <div className="proj-field proj-field-full">
              <label className="proj-field-label">Description</label>
              <textarea
                className="cert-input cert-textarea"
                placeholder="Brief description of the project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="proj-modal-footer">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : isAdd ? "Add Project" : "Update Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const formatMonthYear = (dateValue) => {
    if (!dateValue) return "";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return String(dateValue);
    return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const normalizeProject = (item) => ({
    ...item,
    id: item.id || item._id,
    startDate: formatMonthYear(item.startDate),
    endDate: item.endDate ? formatMonthYear(item.endDate) : null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const response = await getMyProjects();
        const list = response?.data || [];
        if (!isMounted) return;
        setProjects(list.map(normalizeProject));
        setMessage("");
      } catch (error) {
        if (!isMounted) return;
        setMessage(error?.response?.data?.message || "Could not load your projects.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSelectedProject(null);
  };

  const openAddModal = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const openEditModal = (project) => {
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
    setEditModalOpen(true);
  };

  const buildPayload = () => ({
    title: formData.title.trim(),
    description: formData.description.trim(),
    techStack: formData.techStack.split(",").map((s) => s.trim()).filter(Boolean),
    githubUrl: formData.githubUrl.trim() || null,
    liveUrl: formData.liveUrl.trim() || null,
    status: formData.status,
    startDate: formData.startDate.trim(),
    endDate: formData.endDate.trim() || null,
  });

  const handleAddSave = () => {
    const save = async () => {
      const payload = buildPayload();
      if (!payload.title) return;
      try {
        setIsSaving(true);
        const response = await createProject(payload);
        const created = response?.data;
        if (created) {
          setProjects((prev) => [normalizeProject(created), ...prev]);
        }
        setMessage("Project added successfully.");
        resetForm();
        setAddModalOpen(false);
      } catch (error) {
        setMessage(error?.response?.data?.message || "Could not create project.");
      } finally {
        setIsSaving(false);
      }
    };

    save();
  };

  const handleEditSave = () => {
    const save = async () => {
      if (!selectedProject) return;
      const payload = buildPayload();
      if (!payload.title) return;

      try {
        setIsSaving(true);
        const response = await updateProject(selectedProject.id, payload);
        const updated = response?.data;

        if (updated) {
          setProjects((prev) =>
            prev.map((p) => (p.id === selectedProject.id ? normalizeProject(updated) : p))
          );
        }

        setMessage("Project updated successfully.");
        resetForm();
        setEditModalOpen(false);
      } catch (error) {
        setMessage(error?.response?.data?.message || "Could not update project.");
      } finally {
        setIsSaving(false);
      }
    };

    save();
  };

  const handleDelete = () => {
    const remove = async () => {
      if (!deleteTarget) return;
      try {
        await deleteProject(deleteTarget.id);
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setMessage("Project deleted successfully.");
      } catch (error) {
        setMessage(error?.response?.data?.message || "Could not delete project.");
      } finally {
        setDeleteTarget(null);
      }
    };

    remove();
  };

  return (
    <>
      <div className="container-fluid">
        <div className="cert-page-shell">
          <div className="cert-page-header">
            <div>
              <h1 className="cert-page-title">My Projects</h1>
              <p className="cert-page-subtitle">Create and manage your portfolio projects.</p>
            </div>
          </div>

          {message && (
            <div className="cert-empty-state" style={{ marginBottom: 12, padding: "0.9rem" }}>
              <p>{message}</p>
            </div>
          )}

          <div className="cert-layout">
            <aside className="cert-sidebar">
              <div className="cert-sidebar-card">
                <h3 className="cert-sidebar-title">Actions</h3>
                <div className="cert-action-list">
                  <button type="button" className="cert-action-btn active">
                    View Projects
                  </button>
                  <button type="button" className="cert-action-btn" onClick={openAddModal}>
                    Add Project
                  </button>
                </div>
              </div>
            </aside>

            <section className="cert-content">
              <div className="cert-panel">
                <div className="cert-panel-header">
                  <div>
                    <h2 className="cert-panel-title">All Projects</h2>
                    <p className="cert-panel-subtitle">
                      Manage your project cards and edit details anytime.
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="cert-empty-state">
                    <p>Loading projects...</p>
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid-2" style={{ marginTop: 8 }}>
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        isEdit
                        onEdit={openEditModal}
                        onDelete={(id) =>
                          setDeleteTarget(projects.find((p) => p.id === id))
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="cert-empty-state">
                    <h3>No projects found</h3>
                    <p>Click "Add Project" to create your first one.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <ProjectFormModal
        open={addModalOpen}
        onClose={() => { setAddModalOpen(false); resetForm(); }}
        onSave={handleAddSave}
        formData={formData}
        setFormData={setFormData}
        mode="add"
        isSaving={isSaving}
      />

      <ProjectFormModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); resetForm(); }}
        onSave={handleEditSave}
        formData={formData}
        setFormData={setFormData}
        mode="edit"
        isSaving={isSaving}
      />

      <DeleteModal
        open={!!deleteTarget}
        project={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}