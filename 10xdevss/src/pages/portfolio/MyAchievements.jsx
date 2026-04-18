import { useEffect, useRef, useState } from "react";
import "../../styles/portfolio/Achievements.css";
import AchievementCard from "../../components/achievements/AchievementCard.jsx";
import {
  createAchievement,
  deleteAchievement,
  getMyAchievements,
  updateAchievement,
} from "../../authentication/api";
import useImageKitUpload from "../../hooks/useImageKitUpload";

const EMPTY_FORM = {
  title: "",
  description: "",
  issuingOrganization: "",
  date: "",
  type: "award",
  url: "",
  image: null,
  imagePreview: null,
  imageCleared: false,
};

/* ─── Delete confirmation modal ─── */
function DeleteModal({ open, onClose, onConfirm, achievement }) {
  if (!open || !achievement) return null;
  return (
    <div className="ach-modal-backdrop" onClick={onClose}>
      <div
        className="ach-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="ach-modal-header">
          <h3 className="ach-modal-title">Delete Achievement</h3>
          <button type="button" className="ach-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ach-modal-body">
          <p className="ach-modal-copy">
            Are you sure you want to delete <strong>{achievement.title}</strong>?
          </p>
        </div>
        <div className="ach-modal-footer">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Achievement form modal ─── */
function AchievementFormModal({ open, onClose, onSave, formData, setFormData, mode, isSaving }) {
  const fileInputRef = useRef(null);

  if (!open) return null;

  const isAdd = mode === "add";

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
    setFormData((prev) => ({ ...prev, image: null, imagePreview: null, imageCleared: true }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="ach-modal-backdrop" onClick={onClose}>
      <div
        className="ach-modal ach-modal-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="ach-modal-header">
          <div>
            <h3 className="ach-modal-title">
              {isAdd ? "Add Achievement" : "Edit Achievement"}
            </h3>
            <p className="ach-modal-subtitle">
              {isAdd
                ? "Fill in the details to record a new achievement."
                : "Update the achievement details and save."}
            </p>
          </div>
          <button type="button" className="ach-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="ach-modal-body ach-modal-scroll">

          {/* Image upload zone */}
          <div className="ach-upload-section">
            <label className="ach-upload-label">Achievement Image / Badge</label>

            {formData.imagePreview ? (
              <div className="ach-image-preview-wrap">
                <img
                  src={formData.imagePreview}
                  alt="Achievement preview"
                  className="ach-image-preview"
                />
                <button type="button" className="ach-image-remove" onClick={clearImage}>
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div
                className="ach-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="ach-dropzone-icon">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    <path d="M17 3l2 2-2 2"/>
                  </svg>
                </div>
                <p className="ach-dropzone-primary">
                  Drag & drop or <span className="ach-dropzone-link">browse</span>
                </p>
                <p className="ach-dropzone-secondary">PNG, JPG, WEBP — max 5 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="ach-file-hidden"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="ach-form-grid">
            <div className="ach-field ach-field-full">
              <label className="ach-field-label">Title</label>
              <input
                className="ach-input"
                placeholder="e.g. Best Paper Award"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="ach-field">
              <label className="ach-field-label">Issuing Organization</label>
              <input
                className="ach-input"
                placeholder="e.g. IEEE"
                value={formData.issuingOrganization}
                onChange={(e) =>
                  setFormData({ ...formData, issuingOrganization: e.target.value })
                }
              />
            </div>

            <div className="ach-field">
              <label className="ach-field-label">Type</label>
              <select
                className="ach-input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="award">Award</option>
                <option value="scholarship">Scholarship</option>
                <option value="competition">Competition</option>
                <option value="recognition">Recognition</option>
                <option value="fellowship">Fellowship</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="ach-field">
              <label className="ach-field-label">Date</label>
              <input
                className="ach-input"
                placeholder="e.g. Oct 2023"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="ach-field">
              <label className="ach-field-label">Reference URL</label>
              <input
                className="ach-input"
                placeholder="https://... (optional)"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>

            <div className="ach-field ach-field-full">
              <label className="ach-field-label">Description</label>
              <textarea
                className="ach-input ach-textarea"
                placeholder="Brief description of the achievement..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ach-modal-footer">
          <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : isAdd ? "Add Achievement" : "Update Achievement"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function MyAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
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

  const normalizeAchievement = (item) => ({
    ...item,
    id: item.id || item._id,
    date: formatMonthYear(item.date),
    image: item.image || null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadAchievements = async () => {
      try {
        const response = await getMyAchievements();
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : [];
        if (!isMounted) return;
        setAchievements(list.map(normalizeAchievement));
        setMessage("");
      } catch (error) {
        if (!isMounted) return;
        setMessage(error?.response?.data?.message || "Could not load achievements.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAchievements();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSelectedAchievement(null);
  };

  const openAddModal = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const openEditModal = (achievement) => {
    setSelectedAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      issuingOrganization: achievement.issuingOrganization,
      date: achievement.date,
      type: achievement.type,
      url: achievement.url || "",
      image: null,
      imagePreview: achievement.image || null,
      imageCleared: false,
    });
    setEditModalOpen(true);
  };

  const buildPayload = () => ({
    title: formData.title.trim(),
    description: formData.description.trim(),
    issuingOrganization: formData.issuingOrganization.trim(),
    date: formData.date.trim(),
    type: formData.type,
    url: formData.url.trim(),
    image: formData.imagePreview || null,
  });

  const handleAddSave = () => {
    const save = async () => {
      const payload = buildPayload();
      if (!payload.title) return;

      try {
        setIsSaving(true);

        if (formData.image instanceof File) {
          const uploaded = await uploadFile(formData.image, {
            allowedType: "image",
            maxFileSizeMb: 5,
            uploadType: "achievements",
            fileName: `achievement-${Date.now()}`,
            tags: ["achievement", payload.type],
          });
          payload.image = uploaded?.cdnUrl || uploaded?.url || null;
        }

        const response = await createAchievement(payload);
        const created = response?.data;
        if (created) {
          setAchievements((prev) => [normalizeAchievement(created), ...prev]);
        }

        setMessage("Achievement added successfully.");
        resetForm();
        setAddModalOpen(false);
      } catch (error) {
        setMessage(error?.response?.data?.message || error?.message || "Could not create achievement.");
      } finally {
        setIsSaving(false);
      }
    };

    save();
  };

  const handleEditSave = () => {
    const save = async () => {
      if (!selectedAchievement) return;
      const payload = buildPayload();
      if (!payload.title) return;

      try {
        setIsSaving(true);

        if (formData.image instanceof File) {
          const uploaded = await uploadFile(formData.image, {
            allowedType: "image",
            maxFileSizeMb: 5,
            uploadType: "achievements",
            fileName: `achievement-${Date.now()}`,
            tags: ["achievement", payload.type],
          });
          payload.image = uploaded?.cdnUrl || uploaded?.url || null;
        } else if (formData.imageCleared) {
          payload.image = null;
        } else if (!payload.image && selectedAchievement.image) {
          payload.image = selectedAchievement.image;
        }

        const response = await updateAchievement(selectedAchievement.id, payload);
        const updated = response?.data;

        if (updated) {
          setAchievements((prev) =>
            prev.map((item) => (item.id === selectedAchievement.id ? normalizeAchievement(updated) : item))
          );
        }

        setMessage("Achievement updated successfully.");
        resetForm();
        setEditModalOpen(false);
      } catch (error) {
        setMessage(error?.response?.data?.message || error?.message || "Could not update achievement.");
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
        await deleteAchievement(deleteTarget.id);
        setAchievements((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setMessage("Achievement deleted successfully.");
      } catch (error) {
        setMessage(error?.response?.data?.message || "Could not delete achievement.");
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
              <h1 className="cert-page-title">My Achievements</h1>
              <p className="cert-page-subtitle">Add, edit, and manage your achievements.</p>
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
                    View Achievements
                  </button>
                  <button type="button" className="cert-action-btn" onClick={openAddModal}>
                    Add Achievement
                  </button>
                </div>
              </div>
            </aside>

            <section className="cert-content">
              <div className="cert-panel">
                <div className="cert-panel-header">
                  <div>
                    <h2 className="cert-panel-title">All Achievements</h2>
                    <p className="cert-panel-subtitle">Manage your achievement entries.</p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="cert-empty-state">
                    <p>Loading achievements...</p>
                  </div>
                ) : achievements.length > 0 ? (
                  <div className="achievements-list">
                    {achievements.map((item) => (
                      <AchievementCard
                        key={item.id}
                        achievement={item}
                        isEdit
                        onEdit={openEditModal}
                        onDelete={(id) =>
                          setDeleteTarget(achievements.find((a) => a.id === id))
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="cert-empty-state">
                    <h3>No achievements found</h3>
                    <p>You have no achievements yet. Click "Add Achievement" to create your first one.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <AchievementFormModal
        open={addModalOpen}
        onClose={() => { setAddModalOpen(false); resetForm(); }}
        onSave={handleAddSave}
        formData={formData}
        setFormData={setFormData}
        mode="add"
        isSaving={isSaving}
      />

      <AchievementFormModal
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
        achievement={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}