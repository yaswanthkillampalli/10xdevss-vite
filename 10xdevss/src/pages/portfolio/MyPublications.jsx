import { useEffect, useRef, useState } from "react";
import "../../styles/portfolio/Publications.css";
import { toast } from 'react-toastify';
import PublicationCard from "../../components/publications/PublicationCard.jsx";
import {
  createPublication,
  deletePublication,
  getMyPublications,
  updatePublication,
} from "../../authentication/api";
import useImageKitUpload from "../../hooks/useImageKitUpload";

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
  file: null,
  fileName: null,
};

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_EXT = [".pdf", ".doc", ".docx"];

function fileIcon(name) {
  if (!name) return null;
  const ext = name.split(".").pop().toLowerCase();
  if (ext === "pdf") return "PDF";
  if (ext === "doc" || ext === "docx") return "DOC";
  return "FILE";
}

/* ─── Delete confirmation modal ─── */
function DeleteModal({ open, onClose, onConfirm, publication }) {
  if (!open || !publication) return null;
  return (
    <div className="pub-modal-backdrop" onClick={onClose}>
      <div
        className="pub-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="pub-modal-header">
          <h3 className="pub-modal-title">Delete Publication</h3>
          <button type="button" className="pub-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="pub-modal-body">
          <p className="pub-modal-copy">
            Are you sure you want to delete <strong>{publication.title}</strong>?
          </p>
        </div>
        <div className="pub-modal-footer">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Publication form modal ─── */
function PublicationFormModal({ open, onClose, onSave, formData, setFormData, mode, isSaving }) {
  const fileInputRef = useRef(null);

  if (!open) return null;

  const isAdd = mode === "add";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, file, fileName: file.name }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !ACCEPTED_TYPES.includes(file.type)) return;
    setFormData((prev) => ({ ...prev, file, fileName: file.name }));
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, file: null, fileName: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const field = (label, key, inputProps = {}) => (
    <div className={`pub-field${inputProps.full ? " pub-field-full" : ""}`}>
      <label className="pub-field-label">{label}</label>
      <input
        className="pub-input"
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        placeholder={inputProps.placeholder || ""}
        type={inputProps.type || "text"}
        min={inputProps.min}
      />
    </div>
  );

  return (
    <div className="pub-modal-backdrop" onClick={onClose}>
      <div
        className="pub-modal pub-modal-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="pub-modal-header">
          <div>
            <h3 className="pub-modal-title">
              {isAdd ? "Add Publication" : "Edit Publication"}
            </h3>
            <p className="pub-modal-subtitle">
              {isAdd
                ? "Fill in the details and optionally attach a paper file."
                : "Update the publication details and save."}
            </p>
          </div>
          <button type="button" className="pub-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="pub-modal-body pub-modal-scroll">

          {/* File upload zone */}
          <div className="pub-upload-section">
            <label className="pub-upload-label">Paper File (PDF / DOCX)</label>

            {formData.fileName ? (
              <div className="pub-file-preview">
                <div className="pub-file-badge">{fileIcon(formData.fileName)}</div>
                <div className="pub-file-info">
                  <p className="pub-file-name">{formData.fileName}</p>
                  <p className="pub-file-hint">File attached successfully</p>
                </div>
                <button type="button" className="pub-file-remove" onClick={clearFile}>✕</button>
              </div>
            ) : (
              <div
                className="pub-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="pub-dropzone-icon">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <p className="pub-dropzone-primary">
                  Drag & drop or <span className="pub-dropzone-link">browse</span>
                </p>
                <p className="pub-dropzone-secondary">PDF, DOC, DOCX — max 20 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_EXT.join(",")}
                  className="pub-file-hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="pub-form-grid">
            <div className="pub-field pub-field-full">
              <label className="pub-field-label">Title</label>
              <input
                className="pub-input"
                placeholder="Full publication title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="pub-field pub-field-full">
              <label className="pub-field-label">Authors</label>
              <input
                className="pub-input"
                placeholder="John Doe, Jane Smith (comma separated)"
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
              />
            </div>

            <div className="pub-field">
              <label className="pub-field-label">Venue</label>
              <input
                className="pub-input"
                placeholder="e.g. IEEE ICML"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>

            <div className="pub-field">
              <label className="pub-field-label">Venue Type</label>
              <select
                className="pub-input"
                value={formData.venueType}
                onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
              >
                <option value="conference">Conference</option>
                <option value="journal">Journal</option>
                <option value="preprint">Preprint</option>
                <option value="workshop">Workshop</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="pub-field">
              <label className="pub-field-label">Published Date</label>
              <input
                className="pub-input"
                placeholder="e.g. Oct 2023"
                value={formData.publishedDate}
                onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
              />
            </div>

            <div className="pub-field">
              <label className="pub-field-label">Citation Count</label>
              <input
                className="pub-input"
                type="number"
                min="0"
                placeholder="0"
                value={formData.citationCount}
                onChange={(e) => setFormData({ ...formData, citationCount: e.target.value })}
              />
            </div>

            <div className="pub-field pub-field-full">
              <label className="pub-field-label">DOI</label>
              <input
                className="pub-input"
                placeholder="10.1109/EXAMPLE.2023.123456"
                value={formData.doi}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
              />
            </div>

            <div className="pub-field pub-field-full">
              <label className="pub-field-label">Tags</label>
              <input
                className="pub-input"
                placeholder="Federated Learning, Privacy, Healthcare (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div className="pub-field pub-field-full">
              <label className="pub-field-label">Abstract</label>
              <textarea
                className="pub-input pub-textarea"
                placeholder="Brief abstract of the publication..."
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pub-modal-footer">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : isAdd ? "Add Publication" : "Update Publication"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function MyPublications() {
  const [publications, setPublications] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { uploadFile } = useImageKitUpload();

  const formatMonthYear = (dateValue) => {
    if (!dateValue) return "";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return String(dateValue);
    return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const normalizePublication = (item) => {
    const formattedDate = formatMonthYear(item.publishedDate);
    return {
      ...item,
      id: item.id || item._id,
      authors: item.authors || [],
      tags: item.tags || [],
      publishedDate: formattedDate,
      publishedDateInput: formattedDate,
      fileName: item.fileName || null,
      fileUrl: item.fileUrl || null,
    };
  };

  useEffect(() => {
    let isMounted = true;

    const loadPublications = async () => {
      try {
        const response = await getMyPublications();
        const list = response?.data || [];
        if (!isMounted) return;
        setPublications(list.map(normalizePublication));
      } catch (error) {
        if (!isMounted) return;
        toast.error(error?.response?.data?.message || "Could not load publications.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPublications();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSelectedPublication(null);
  };

  const openAddModal = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const openEditModal = (publication) => {
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
      file: null,
      fileName: publication.fileName || null,
    });
    setEditModalOpen(true);
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
    tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    fileUrl: formData.fileUrl || null,
    fileName: formData.fileName,
  });

  const handleAddSave = () => {
    const save = async () => {
      const payload = buildPayload();
      if (!payload.title) return;

      try {
        setIsSaving(true);

        if (formData.file instanceof File) {
          const uploaded = await uploadFile(formData.file, {
            allowedType: "document",
            maxFileSizeMb: 20,
            uploadType: "publications",
            fileName: `publication-${Date.now()}`,
            tags: ["publication"],
          });
          payload.fileUrl = uploaded?.cdnUrl || uploaded?.url || null;
          payload.fileName = uploaded?.name || formData.fileName;
        }

        const response = await createPublication(payload);
        const created = response?.data;
        if (created) {
          setPublications((prev) => [normalizePublication(created), ...prev]);
        }

        toast.success("Publication added successfully.");
        resetForm();
        setAddModalOpen(false);
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message || "Could not create publication.");
      } finally {
        setIsSaving(false);
      }
    };

    save();
  };

  const handleEditSave = () => {
    const save = async () => {
      if (!selectedPublication) return;
      const payload = buildPayload();
      if (!payload.title) return;

      try {
        setIsSaving(true);

        if (formData.file instanceof File) {
          const uploaded = await uploadFile(formData.file, {
            allowedType: "document",
            maxFileSizeMb: 20,
            uploadType: "publications",
            fileName: `publication-${Date.now()}`,
            tags: ["publication"],
          });
          payload.fileUrl = uploaded?.cdnUrl || uploaded?.url || null;
          payload.fileName = uploaded?.name || formData.fileName;
        } else if (!payload.fileUrl && selectedPublication.fileUrl) {
          payload.fileUrl = selectedPublication.fileUrl;
          payload.fileName = selectedPublication.fileName;
        }

        const response = await updatePublication(selectedPublication.id, payload);
        const updated = response?.data;

        if (updated) {
          setPublications((prev) =>
            prev.map((item) => (item.id === selectedPublication.id ? normalizePublication(updated) : item))
          );
        }

        toast.success("Publication updated successfully.");
        resetForm();
        setEditModalOpen(false);
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message || "Could not update publication.");
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
        await deletePublication(deleteTarget.id);
        setPublications((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        toast.success("Publication deleted successfully.");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Could not delete publication.");
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
              <h1 className="cert-page-title">My Publications</h1>
              <p className="cert-page-subtitle">Add, update, and manage your publications.</p>
            </div>
          </div>

          {/* Notifications shown via toast (react-toastify) */}

          <div className="cert-layout">
            <aside className="cert-sidebar">
              <div className="cert-sidebar-card">
                <h3 className="cert-sidebar-title">Actions</h3>
                <div className="cert-action-list">
                  <button type="button" className="cert-action-btn active">
                    View Publications
                  </button>
                  <button type="button" className="cert-action-btn" onClick={openAddModal}>
                    Add Publication
                  </button>
                </div>
              </div>
            </aside>

            <section className="cert-content">
              <div className="cert-panel">
                <div className="cert-panel-header">
                  <div>
                    <h2 className="cert-panel-title">All Publications</h2>
                    <p className="cert-panel-subtitle">Manage your publication records.</p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="cert-empty-state">
                    <p>Loading publications...</p>
                  </div>
                ) : publications.length > 0 ? (
                  <div className="publications-list">
                    {publications.map((item) => (
                      <PublicationCard
                        key={item.id}
                        publication={item}
                        isEdit
                        onEdit={openEditModal}
                        onDelete={(id) =>
                          setDeleteTarget(publications.find((p) => p.id === id))
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="cert-empty-state">
                    <h3>No publications found</h3>
                    <p>Click "Add Publication" to create your first one.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <PublicationFormModal
        open={addModalOpen}
        onClose={() => { setAddModalOpen(false); resetForm(); }}
        onSave={handleAddSave}
        formData={formData}
        setFormData={setFormData}
        mode="add"
        isSaving={isSaving}
      />

      <PublicationFormModal
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
        publication={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}