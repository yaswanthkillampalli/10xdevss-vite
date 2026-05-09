import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import "../../styles/portfolio/Experience.css";
import {
  createExperience,
  deleteExperience,
  getMyExperience,
  updateExperience,
} from "../../authentication/api";


const EMPTY_FORM = {
  company: "",
  role: "",
  description: "",
  type: "internship",
  locationType: "onsite",
  location: "",
  startDate: "",
  endDate: "",
  skills: "",
  isCurrent: false,
};

function Modal({ show, onClose, onSave, mode, formData, setFormData, isSaving }) {
  if (!show) return null;
  const isEdit = mode === "edit";

  const setValue = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "var(--bg)", borderRadius: "var(--radius-xl)", padding: 32, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>{isEdit ? "Edit Experience" : "Add Experience"}</h2>
          <button onClick={onClose} className="btn btn-ghost">✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input className="form-input" placeholder="Google" value={formData.company} onChange={(e) => setValue("company", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <input className="form-input" placeholder="Software Engineer Intern" value={formData.role} onChange={(e) => setValue("role", e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" placeholder="What did you work on?" value={formData.description} onChange={(e) => setValue("description", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" value={formData.type} onChange={(e) => setValue("type", e.target.value)}>
                <option>internship</option><option>full-time</option>
                <option>part-time</option><option>contract</option>
                <option>freelance</option><option>volunteer</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location Type</label>
              <select className="form-input" value={formData.locationType} onChange={(e) => setValue("locationType", e.target.value)}>
                <option>onsite</option><option>remote</option><option>hybrid</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" placeholder="San Francisco, CA" value={formData.location} onChange={(e) => setValue("location", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input type="date" className="form-input" value={formData.startDate} onChange={(e) => setValue("startDate", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input type="date" className="form-input" value={formData.endDate} onChange={(e) => setValue("endDate", e.target.value)} disabled={formData.isCurrent} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              id="isCurrent"
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) => setValue("isCurrent", e.target.checked)}
            />
            <label htmlFor="isCurrent" style={{ fontSize: 13 }}>I currently work here</label>
          </div>
          <div className="form-group">
            <label className="form-label">Skills Used (comma separated)</label>
            <input className="form-input" placeholder="React, Node.js, TypeScript" value={formData.skills} onChange={(e) => setValue("skills", e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} className="btn btn-outline">Cancel</button>
            <button className="btn btn-primary" onClick={onSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const formatMonthYear = (dateValue) => {
    if (!dateValue) return null;
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return String(dateValue);
    return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const toDateInput = (dateValue) => {
    if (!dateValue) return "";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString().slice(0, 10);
  };

  const normalizeItem = (item) => ({
    ...item,
    id: item.id || item._id,
    startDate: formatMonthYear(item.startDate),
    endDate: item.endDate ? formatMonthYear(item.endDate) : null,
    skills: item.skills || [],
  });

  const mapToPayload = () => ({
    company: formData.company.trim(),
    role: formData.role.trim(),
    description: formData.description.trim(),
    type: formData.type,
    locationType: formData.locationType,
    location: formData.location.trim(),
    startDate: formData.startDate,
    endDate: formData.isCurrent ? null : formData.endDate || null,
    isCurrent: formData.isCurrent,
    skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
  });

  useEffect(() => {
    let isMounted = true;

    const loadExperience = async () => {
      try {
        const response = await getMyExperience();
        const list = response?.data || [];
        if (!isMounted) return;
        setExperience(list.map(normalizeItem));
      } catch (error) {
        if (!isMounted) return;
        toast.error(error?.response?.data?.message || "Could not load experience records.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadExperience();

    return () => {
      isMounted = false;
    };
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedItem(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setFormData({
      company: item.company || "",
      role: item.role || "",
      description: item.description || "",
      type: item.type || "internship",
      locationType: item.locationType || "onsite",
      location: item.location || "",
      startDate: toDateInput(item.startDate),
      endDate: toDateInput(item.endDate),
      isCurrent: Boolean(item.isCurrent),
      skills: (item.skills || []).join(", "),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteExperience(id);
      setExperience((prev) => prev.filter((item) => item.id !== id));
      toast.success("Experience deleted successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not delete experience.");
    }
  };

  const handleSave = async () => {
    const payload = mapToPayload();
    if (!payload.company || !payload.role || !payload.startDate) {
      toast.error("Company, role and start date are required.");
      return;
    }

    try {
      setIsSaving(true);
        if (modalMode === "edit" && selectedItem) {
        const response = await updateExperience(selectedItem.id, payload);
        const updated = response?.data;
        if (updated) {
          setExperience((prev) =>
            prev.map((item) => (item.id === selectedItem.id ? normalizeItem(updated) : item))
          );
        }
        toast.success("Experience updated successfully.");
      } else {
        const response = await createExperience(payload);
        const created = response?.data;
        if (created) {
          setExperience((prev) => [normalizeItem(created), ...prev]);
        }
        toast.success("Experience added successfully.");
      }
      setShowModal(false);
      setSelectedItem(null);
      setFormData(EMPTY_FORM);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not save experience.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="container" style={{ maxWidth: 800 }}>

          <div className="section-header animate-in">
            <div>
              <h1 style={{ fontSize: 28, letterSpacing: "-0.02em" }}>Experience</h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Internships & work history</p>
            </div>
            <button onClick={openAddModal} className="btn btn-primary">+ Add Experience</button>
          </div>

          {/* Notifications shown via toast (react-toastify) */}

          {isLoading && (
            <div className="card" style={{ marginBottom: 12, padding: 12 }}>
              Loading experience...
            </div>
          )}

          {experience.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💼</div>
              <h3 style={{ fontFamily: "var(--font-display)" }}>No experience yet</h3>
              <p>Add your internships and work history.</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: 8 }}>Add Experience</button>
            </div>
          ) : (
            <div style={{ position: "relative" }} className="animate-in delay-1">
              {/* Timeline line */}
              <div style={{ position: "absolute", left: 23, top: 0, bottom: 0, width: 2, background: "var(--border)" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ display: "flex", gap: 24, paddingBottom: 32 }}>
                    {/* Timeline dot */}
                    <div style={{ flexShrink: 0, width: 48, display: "flex", justifyContent: "center" }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%", marginTop: 4,
                        background: exp.isCurrent ? "var(--accent)" : "var(--border)",
                        border: "3px solid var(--bg)",
                        boxShadow: exp.isCurrent ? "0 0 0 3px var(--red-muted)" : "none",
                        zIndex: 1,
                      }} />
                    </div>

                    {/* Card */}
                    <div className="card" style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                        <div>
                          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{exp.role}</h3>
                          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--accent)", marginTop: 2 }}>{exp.company}</p>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {exp.isCurrent && <span className="badge badge-red">Current</span>}
                          <span className="badge badge-gray">{exp.type}</span>
                          <span className="badge badge-gray">{exp.locationType}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                        {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate} · {exp.location}
                      </p>

                      <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.7 }}>{exp.description}</p>

                      <div className="tags" style={{ marginTop: 12 }}>
                        {exp.skills.map((s) => <span key={s} className="tag">{s}</span>)}
                      </div>

                      <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
                        <button className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 10px" }} onClick={() => openEditModal(exp)}>Edit</button>
                        <button onClick={() => handleDelete(exp.id)} className="btn btn-danger" style={{ fontSize: 12, padding: "6px 10px" }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        mode={modalMode}
        formData={formData}
        setFormData={setFormData}
        isSaving={isSaving}
      />
    </>
  );
}