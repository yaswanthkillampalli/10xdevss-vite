import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  adminGetAllUsers,
  adminGetUserById,
  adminUpdateUserProfile,
  adminChangeUserPassword,
} from "../../authentication/api";
import "../../styles/Admin.css";

// ─── Edit Profile Modal ────────────────────────────────────────────────────
function EditProfileModal({ open, onClose, user, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    fullName: "",
    rollId: "",
    phone: "",
    role: "student",
    isActive: true,
  });

  useEffect(() => {
    if (open && user) {
      setFormData({
        fullName: user.fullName || "",
        rollId: user.rollId || "",
        phone: user.phone || "",
        role: user.role || "student",
        isActive: user.isActive !== false,
      });
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!open || !user) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <div className="admin-modal-header">
          <h2 className="admin-modal-title" id="edit-modal-title">
            Edit User Profile
          </h2>
          <button
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-body">
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="edit-fullName">
              Full Name
            </label>
            <input
              id="edit-fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="admin-input"
              placeholder="Full name"
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="edit-rollId">
                Roll ID
              </label>
              <input
                id="edit-rollId"
                type="text"
                name="rollId"
                value={formData.rollId}
                onChange={handleChange}
                className="admin-input"
                placeholder="Roll ID"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="edit-phone">
                Phone
              </label>
              <input
                id="edit-phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="admin-input"
                placeholder="Phone"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="edit-role">
                Role
              </label>
              <select
                id="edit-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label admin-checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active account
              </label>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Change Password Modal ─────────────────────────────────────────────────
function ChangePasswordModal({ open, onClose, user, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    onSave(formData);
    setFormData({ newPassword: "", confirmPassword: "" });
  };

  if (!open || !user) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwd-modal-title"
      >
        <div className="admin-modal-header">
          <h2 className="admin-modal-title" id="pwd-modal-title">
            Reset Password
          </h2>
          <button
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-body">
          <p className="admin-modal-subtitle">
            Setting new password for <strong>{user.fullName}</strong>
          </p>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="pwd-new">
              New Password
            </label>
            <input
              id="pwd-new"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="admin-input"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="pwd-confirm">
              Confirm Password
            </label>
            <input
              id="pwd-confirm"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="admin-input"
              placeholder="Confirm new password"
              required
            />
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Changing…" : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ──────────────────────────────────────────────────
export default function Admin() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminGetAllUsers({
        page: currentPage,
        limit,
        search: searchTerm,
      });
      setUsers(response.data?.users || []);
      setPagination(response.data?.pagination || {});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {}, 300);
  };

  const openEditProfile = async (user) => {
    try {
      const response = await adminGetUserById(user.id || user._id);
      setSelectedUser(response.data);
      setEditProfileOpen(true);
    } catch {
      toast.error("Failed to load user details.");
    }
  };

  const openChangePassword = async (user) => {
    try {
      const response = await adminGetUserById(user.id || user._id);
      setSelectedUser(response.data);
      setChangePasswordOpen(true);
    } catch {
      toast.error("Failed to load user details.");
    }
  };

  const handleSaveProfile = async (formData) => {
    try {
      setIsSaving(true);
      await adminUpdateUserProfile(selectedUser.id || selectedUser._id, formData);
      toast.success("Profile updated successfully.");
      setEditProfileOpen(false);
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (formData) => {
    try {
      setIsSaving(true);
      await adminChangeUserPassword(selectedUser.id || selectedUser._id, formData);
      toast.success("Password changed successfully.");
      setChangePasswordOpen(false);
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            Admin <span>Dashboard</span>
          </h1>
          <span className="admin-accent-bar" />
          <p className="admin-subtitle">Manage users, roles, and credentials</p>
        </div>
      </div>

      {/* Search */}
      <div className="admin-search-section">
        <div className="admin-search-input-wrapper">
          <svg
            className="admin-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, roll ID, or phone…"
            value={searchTerm}
            onChange={handleSearch}
            className="admin-search-input"
            aria-label="Search users"
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        {isLoading ? (
          <div className="admin-loading">Loading users</div>
        ) : users.length > 0 ? (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roll ID</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id || user._id} className="admin-table-row">
                    <td className="admin-cell admin-cell-name">{user.fullName}</td>
                    <td className="admin-cell">{user.emailId}</td>
                    <td className="admin-cell">{user.rollId}</td>
                    <td className="admin-cell">{user.phone}</td>
                    <td className="admin-cell">
                      <span className={`admin-badge admin-badge-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="admin-cell">
                      <span
                        className={`admin-badge ${
                          user.isActive
                            ? "admin-badge-active"
                            : "admin-badge-inactive"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="admin-cell admin-cell-actions">
                      <button
                        className="admin-btn admin-btn-sm admin-btn-primary"
                        onClick={() => openEditProfile(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                        onClick={() => openChangePassword(user)}
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="admin-pagination">
                <button
                  className="admin-pagination-btn"
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <span className="admin-pagination-info">
                  Page {currentPage} of {pagination.pages}
                </span>
                <button
                  className="admin-pagination-btn"
                  onClick={() =>
                    setCurrentPage(
                      Math.min(pagination.pages, currentPage + 1)
                    )
                  }
                  disabled={currentPage === pagination.pages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="admin-empty-state">
            No users found — try a different search.
          </div>
        )}
      </div>

      {/* Modals */}
      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={selectedUser}
        onSave={handleSaveProfile}
        isSaving={isSaving}
      />
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        user={selectedUser}
        onSave={handleChangePassword}
        isSaving={isSaving}
      />
    </div>
  );
}