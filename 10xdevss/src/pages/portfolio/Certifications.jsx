import { useEffect, useRef, useState } from "react";
import "../../styles/portfolio/Certifications.css";
import {
  createCertification,
  deleteCertification,
  getMyCertifications,
  updateCertification,
} from "../../authentication/api";
import useImageKitUpload from "../../hooks/useImageKitUpload";

const EMPTY_FORM = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialId: "",
  url: "",
  skills: "",
  description: "",
  image: null,
  imagePreview: null,
};

/* ─── Delete confirmation modal ─── */
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
          <button type="button" className="cert-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cert-modal-body">
          <p className="cert-delete-copy">
            Are you sure you want to delete <strong>{certification.title}</strong>?
          </p>
        </div>
        <div className="cert-modal-footer">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add / Edit modal ─── */
function CertFormModal({ open, onClose, onSave, formData, setFormData, mode, isSaving }) {
  const fileInputRef = useRef(null);

  if (!open) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: file, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: file, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: null, imagePreview: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isAdd = mode === "add";

  return (
    <div className="cert-modal-backdrop" onClick={onClose}>
      <div
        className="cert-modal cert-modal-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isAdd ? "Add Certificate" : "Edit Certificate"}
      >
        {/* Header */}
        <div className="cert-modal-header">
          <div>
            <h3 className="cert-modal-title">{isAdd ? "Add Certificate" : "Edit Certificate"}</h3>
            <p className="cert-modal-subtitle">
              {isAdd ? "Fill in the details to add a new certification." : "Update the selected certification details."}
            </p>
          </div>
          <button type="button" className="cert-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="cert-modal-body cert-modal-scroll">

          {/* Image upload zone */}
          <div className="cert-upload-section">
            <label className="cert-upload-label">Certificate Image</label>

            {formData.imagePreview ? (
              <div className="cert-image-preview-wrap">
                <img src={formData.imagePreview} alt="Certificate preview" className="cert-image-preview" />
                <button type="button" className="cert-image-remove" onClick={clearImage}>✕ Remove</button>
              </div>
            ) : (
              <div
                className="cert-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="cert-dropzone-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="cert-dropzone-primary">Drag & drop or <span className="cert-dropzone-link">browse</span></p>
                <p className="cert-dropzone-secondary">PNG, JPG, WEBP - max 5 MB - ideal: 1600 x 1200 px (4:3)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="cert-file-hidden"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="cert-form-grid">
            <div className="cert-field">
              <label className="cert-field-label">Certificate Title</label>
              <input
                className="cert-input"
                placeholder="e.g. AWS Cloud Practitioner"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="cert-field">
              <label className="cert-field-label">Issuer</label>
              <input
                className="cert-input"
                placeholder="e.g. Amazon Web Services"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              />
            </div>

            <div className="cert-field">
              <label className="cert-field-label">Issue Date</label>
              <input
                className="cert-input"
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </div>

            <div className="cert-field">
              <label className="cert-field-label">Credential ID</label>
              <input
                className="cert-input"
                placeholder="e.g. AWS-CP-23891"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              />
            </div>

            <div className="cert-field cert-field-full">
              <label className="cert-field-label">Verification URL</label>
              <input
                className="cert-input"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>

            <div className="cert-field cert-field-full">
              <label className="cert-field-label">Skills</label>
              <input
                className="cert-input"
                placeholder="Cloud, AWS, Deployment (comma separated)"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>

            <div className="cert-field cert-field-full">
              <label className="cert-field-label">Description</label>
              <textarea
                className="cert-input cert-textarea"
                placeholder="Brief description of what this certification covers..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="cert-modal-footer">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : isAdd ? "Add Certificate" : "Update Certificate"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [activePanel, setActivePanel] = useState("view");
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { uploadFile } = useImageKitUpload();

  /* modal states */
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCertifications = async () => {
      try {
        const response = await getMyCertifications();
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : [];

        if (!isMounted) return;
        setCertifications(
          list.map((item) => ({
            ...item,
            id: item.id || item._id,
            issuer: item.issuingOrganization || "",
            url: item.credentialUrl || "",
            image: item.badgeImage || null,
            skills: Array.isArray(item.skills) ? item.skills : [],
            description: item.description || "",
            issueDate: item.issueDate ? String(item.issueDate).slice(0, 10) : "",
          }))
        );
        setMessage("");
      } catch (error) {
        if (!isMounted) return;
        setMessage(error?.response?.data?.message || "Could not load certifications.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCertifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSelectedCertification(null);
  };

  const openAddModal = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedCertification(item);
    setFormData({
      title: item.title,
      issuer: item.issuer,
      issueDate: item.issueDate,
      credentialId: item.credentialId,
      url: item.url,
      skills: item.skills.join(", "),
      description: item.description,
      image: null,
      imagePreview: item.image || null,
    });
    setEditModalOpen(true);
  };

  const handleAddSave = () => {
    const save = async () => {
      const title = formData.title.trim();
      const issuer = formData.issuer.trim();
      const issueDate = formData.issueDate.trim();
      if (!title || !issuer || !issueDate) return;

      const payload = {
        title,
        issuingOrganization: issuer,
        issueDate,
        credentialId: formData.credentialId.trim() || null,
        credentialUrl: formData.url.trim() || null,
      };

      try {
        setIsSaving(true);

        if (formData.image instanceof File) {
          const uploaded = await uploadFile(formData.image, {
            allowedType: "image",
            maxFileSizeMb: 5,
            uploadType: "certifications",
            fileName: `certification-${Date.now()}`,
            tags: ["certification"],
          });
          payload.badgeImage = uploaded?.cdnUrl || uploaded?.url || null;
        }

        const response = await createCertification(payload);
        const created = response?.data;

        if (created) {
          setCertifications((prev) => [
            {
              ...created,
              id: created.id || created._id,
              issuer: created.issuingOrganization || "",
              url: created.credentialUrl || "",
              image: created.badgeImage || null,
              skills: [],
              description: "",
              issueDate: created.issueDate ? String(created.issueDate).slice(0, 10) : "",
            },
            ...prev,
          ]);
        }

        setMessage("Certification added successfully.");
        resetForm();
        setAddModalOpen(false);
      } catch (error) {
        setMessage(error?.response?.data?.message || error?.message || "Could not create certification.");
      } finally {
        setIsSaving(false);
      }
    };

    save();
  };

  const handleEditSave = () => {
    const save = async () => {
      if (!selectedCertification) return;

      const title = formData.title.trim();
      const issuer = formData.issuer.trim();
      const issueDate = formData.issueDate.trim();
      if (!title || !issuer || !issueDate) return;

      const payload = {
        title,
        issuingOrganization: issuer,
        issueDate,
        credentialId: formData.credentialId.trim() || null,
        credentialUrl: formData.url.trim() || null,
      };

      try {
        setIsSaving(true);

        if (formData.image instanceof File) {
          const uploaded = await uploadFile(formData.image, {
            allowedType: "image",
            maxFileSizeMb: 5,
            uploadType: "certifications",
            fileName: `certification-${Date.now()}`,
            tags: ["certification"],
          });
          payload.badgeImage = uploaded?.cdnUrl || uploaded?.url || null;
        } else if (formData.imagePreview) {
          payload.badgeImage = formData.imagePreview;
        }

        const response = await updateCertification(selectedCertification.id, payload);
        const updated = response?.data;

        if (updated) {
          setCertifications((prev) =>
            prev.map((item) =>
              item.id === selectedCertification.id
                ? {
                    ...updated,
                    id: updated.id || updated._id,
                    issuer: updated.issuingOrganization || "",
                    url: updated.credentialUrl || "",
                    image: updated.badgeImage || null,
                    skills: Array.isArray(item.skills) ? item.skills : [],
                    description: item.description || "",
                    issueDate: updated.issueDate ? String(updated.issueDate).slice(0, 10) : "",
                  }
                : item
            )
          );
        }

        setMessage("Certification updated successfully.");
        resetForm();
        setEditModalOpen(false);
      } catch (error) {
        setMessage(error?.response?.data?.message || error?.message || "Could not update certification.");
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
        await deleteCertification(deleteTarget.id);
        setCertifications((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setMessage("Certification deleted successfully.");
      } catch (error) {
        setMessage(error?.response?.data?.message || "Could not delete certification.");
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
              <h1 className="cert-page-title">Certifications</h1>
              <p className="cert-page-subtitle">
                Add, view, edit, and manage your certifications in one place.
              </p>
            </div>
          </div>

          {message && (
            <div className="cert-empty-state" style={{ marginBottom: 12, padding: "0.9rem" }}>
              <p>{message}</p>
            </div>
          )}

          <div className="cert-layout">
            {/* Sidebar */}
            <aside className="cert-sidebar">
              <div className="cert-sidebar-card">
                <h3 className="cert-sidebar-title">Actions</h3>
                <div className="cert-action-list">
                  <button
                    type="button"
                    className={`cert-action-btn ${activePanel === "view" ? "active" : ""}`}
                    onClick={() => setActivePanel("view")}
                  >
                    View Certificates
                  </button>
                  <button
                    type="button"
                    className="cert-action-btn"
                    onClick={openAddModal}
                  >
                    Add Certificate
                  </button>
                </div>
              </div>
            </aside>

            {/* Content */}
            <section className="cert-content">
              <div className="cert-panel">
                <div className="cert-panel-header">
                  <div>
                    <h2 className="cert-panel-title">All Certifications</h2>
                    <p className="cert-panel-subtitle">
                      Review and manage your certifications card by card.
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="cert-empty-state">
                    <p>Loading certifications...</p>
                  </div>
                ) : certifications.length > 0 ? (
                  <div className="cert-card-grid">
                    {certifications.map((item) => (
                      <article className="cert-card" key={item.id}>
                        {item.image && (
                          <div className="cert-card-image-wrap">
                            <img src={item.image} alt={item.title} className="cert-card-image" />
                          </div>
                        )}

                        <div className="cert-card-top">
                          <div>
                            <h3 className="cert-card-title">{item.title}</h3>
                            <p className="cert-card-issuer">{item.issuer}</p>
                          </div>
                        </div>

                        <p className="cert-card-date">Issued: {item.issueDate}</p>
                        <p className="cert-card-id">Credential ID: {item.credentialId}</p>
                        <p className="cert-card-description">{item.description}</p>

                        <div className="cert-tags">
                          {item.skills.map((skill) => (
                            <span className="cert-tag" key={skill}>{skill}</span>
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
                            onClick={() => openEditModal(item)}
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
                    <p>Click "Add Certificate" to create your first one.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <CertFormModal
        open={addModalOpen}
        onClose={() => { setAddModalOpen(false); resetForm(); }}
        onSave={handleAddSave}
        formData={formData}
        setFormData={setFormData}
        mode="add"
        isSaving={isSaving}
      />

      {/* Edit Modal */}
      <CertFormModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); resetForm(); }}
        onSave={handleEditSave}
        formData={formData}
        setFormData={setFormData}
        mode="edit"
        isSaving={isSaving}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteTarget}
        certification={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}