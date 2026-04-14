import { useState } from "react";
import "../../styles/portfolio/Certifications.css";

const MOCK_CERTIFICATIONS = [
  {
    id: 1,
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    issueDate: "2024-02-14",
    credentialId: "AWS-CP-23891",
    url: "https://aws.amazon.com/certification/",
    skills: ["Cloud", "AWS", "Deployment"],
    description: "Foundational certification covering AWS cloud concepts and services.",
  },
  {
    id: 2,
    title: "Google Data Analytics",
    issuer: "Google",
    issueDate: "2023-11-20",
    credentialId: "GDA-98211",
    url: "https://grow.google/certificates/",
    skills: ["Analytics", "SQL", "Visualization"],
    description: "Professional certificate focused on analytics workflow and reporting.",
  },
  {
    id: 3,
    title: "Meta Front-End Developer",
    issuer: "Meta",
    issueDate: "2023-08-10",
    credentialId: "META-FE-55771",
    url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    skills: ["React", "JavaScript", "CSS"],
    description: "Front-end certification with React, responsive UI, and accessibility basics.",
  },
];

const EMPTY_FORM = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialId: "",
  url: "",
  skills: "",
  description: "",
};

function DeleteModal({ open, onClose, onConfirm, certification }) {
  if (!open || !certification) return null;

  return (
    <div className="cert-modal-backdrop" onClick={onClose}>
      <div
        className="cert-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Delete Certificate"
      >
        <div className="cert-modal-header">
          <h3 className="cert-modal-title">Delete Certificate</h3>
          <button type="button" className="cert-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cert-modal-body">
          <p className="cert-delete-copy">
            Are you sure you want to delete <strong>{certification.title}</strong>?
          </p>
        </div>

        <div className="cert-modal-footer">
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

export default function Certifications() {
  const [certifications, setCertifications] = useState(MOCK_CERTIFICATIONS);
  const [activePanel, setActivePanel] = useState("view");
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSelectedCertification(null);
  };

  const openAddPanel = () => {
    resetForm();
    setActivePanel("add");
  };

  const openViewPanel = () => {
    setSelectedCertification(null);
    setActivePanel("view");
  };

  const openEditPanel = (item) => {
    setSelectedCertification(item);
    setFormData({
      title: item.title,
      issuer: item.issuer,
      issueDate: item.issueDate,
      credentialId: item.credentialId,
      url: item.url,
      skills: item.skills.join(", "),
      description: item.description,
    });
    setActivePanel("edit");
  };

  const handleAddSave = () => {
    const newItem = {
      id: Date.now(),
      title: formData.title,
      issuer: formData.issuer,
      issueDate: formData.issueDate,
      credentialId: formData.credentialId,
      url: formData.url,
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      description: formData.description,
    };

    setCertifications((prev) => [newItem, ...prev]);
    resetForm();
    setActivePanel("view");
  };

  const handleEditSave = () => {
    setCertifications((prev) =>
      prev.map((item) =>
        item.id === selectedCertification.id
          ? {
              ...item,
              title: formData.title,
              issuer: formData.issuer,
              issueDate: formData.issueDate,
              credentialId: formData.credentialId,
              url: formData.url,
              skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
              description: formData.description,
            }
          : item
      )
    );

    resetForm();
    setActivePanel("view");
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCertifications((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
    setActivePanel("view");
  };

  return (
    <>
      <div className="container-fluid" >
        <div className="cert-page-shell">
          <div className="cert-page-header">
            <div>
              <h1 className="cert-page-title">Certifications</h1>
              <p className="cert-page-subtitle">
                Add, view, edit, and manage your certifications in one place.
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
                    View Certificates
                  </button>

                  <button
                    type="button"
                    className={`cert-action-btn ${activePanel === "add" ? "active" : ""}`}
                    onClick={openAddPanel}
                  >
                    Add Certificate
                  </button>
                </div>
              </div>
            </aside>

            <section className="cert-content">
              {activePanel === "view" && (
                <div className="cert-panel">
                  <div className="cert-panel-header">
                    <div>
                      <h2 className="cert-panel-title">All Certifications</h2>
                      <p className="cert-panel-subtitle">
                        Review and manage your certifications card by card.
                      </p>
                    </div>
                  </div>

                  {certifications.length > 0 ? (
                    <div className="cert-card-grid">
                      {certifications.map((item) => (
                        <article className="cert-card" key={item.id}>
                          <div className="cert-card-top">
                            <div>
                              <h3 className="cert-card-title">{item.title}</h3>
                              <p className="cert-card-issuer">{item.issuer}</p>
                            </div>
                          </div>

                          <p className="cert-card-date">
                            Issued: {item.issueDate}
                          </p>

                          <p className="cert-card-id">
                            Credential ID: {item.credentialId}
                          </p>

                          <p className="cert-card-description">{item.description}</p>

                          <div className="cert-tags">
                            {item.skills.map((skill) => (
                              <span className="cert-tag" key={skill}>
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="cert-card-actions">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-dark"
                            >
                              Verify
                            </a>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => openEditPanel(item)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => setDeleteTarget(item)}
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="cert-empty-state">
                      <h3>No certifications found</h3>
                      <p>Click “Add Certificate” to create your first one.</p>
                    </div>
                  )}
                </div>
              )}

              {activePanel === "add" && (
                <div className="cert-panel">
                  <div className="cert-panel-header">
                    <div>
                      <h2 className="cert-panel-title">Add Certificate</h2>
                      <p className="cert-panel-subtitle">
                        Fill in the details to create a new certification.
                      </p>
                    </div>
                  </div>

                  <div className="cert-form-grid">
                    <input
                      className="cert-input"
                      placeholder="Certificate title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <input
                      className="cert-input"
                      placeholder="Issuer"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    />
                    <input
                      className="cert-input"
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    />
                    <input
                      className="cert-input"
                      placeholder="Credential ID"
                      value={formData.credentialId}
                      onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    />
                    <input
                      className="cert-input cert-input-full"
                      placeholder="Verification URL"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                    <input
                      className="cert-input cert-input-full"
                      placeholder="Skills (comma separated)"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
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
                    <button type="button" className="btn btn-danger" onClick={handleAddSave}>
                      Save
                    </button>
                  </div>
                </div>
              )}

              {activePanel === "edit" && selectedCertification && (
                <div className="cert-panel">
                  <div className="cert-panel-header">
                    <div>
                      <h2 className="cert-panel-title">Edit Certificate</h2>
                      <p className="cert-panel-subtitle">
                        Update the selected certification details.
                      </p>
                    </div>
                  </div>

                  <div className="cert-form-grid">
                    <input
                      className="cert-input"
                      placeholder="Certificate title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <input
                      className="cert-input"
                      placeholder="Issuer"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    />
                    <input
                      className="cert-input"
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    />
                    <input
                      className="cert-input"
                      placeholder="Credential ID"
                      value={formData.credentialId}
                      onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    />
                    <input
                      className="cert-input cert-input-full"
                      placeholder="Verification URL"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                    <input
                      className="cert-input cert-input-full"
                      placeholder="Skills (comma separated)"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    />
                    <textarea
                      className="cert-input cert-textarea cert-input-full"
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    <button type="button" className="btn btn-danger" onClick={handleEditSave}>
                      Update
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <DeleteModal
        open={!!deleteTarget}
        certification={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}