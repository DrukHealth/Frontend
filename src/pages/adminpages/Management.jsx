import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Shield, User, Menu } from "lucide-react";
import "./css/management.css";

export default function Management() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [superAdminExists, setSuperAdminExists] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin"
  });

  // ===============================
  // 🚀 DEPLOYED BACKEND URL (Node.js)
  // ===============================
  const API_BASE_URL = "https://drukhealthback.onrender.com/api/manage";

  useEffect(() => {
    checkCurrentUser();
    checkSuperAdminExistence();
    fetchAdmins();
    checkMobileView();
    
    // Add resize listener
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const checkMobileView = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const checkCurrentUser = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        console.log("No admin token found");
        setCurrentUser(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCurrentUser(result.data);
        }
      } else {
        console.error("Failed to get current user profile");
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error checking current user:", error);
      setCurrentUser(null);
    }
  };

  const checkSuperAdminExistence = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/super-admin-exists`);
      const result = await response.json();
      
      if (result.success) {
        setSuperAdminExists(result.data.superAdminExists);
      }
    } catch (error) {
      console.error("Error checking super admin existence:", error);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setAdmins(result.data || []);
      } else {
        console.error("Failed to fetch admins:", result.message);
        setAdmins([]);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      alert("Failed to fetch admins. Please check your connection.");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check permissions
    if (!currentUser || currentUser.role !== "super_admin") {
      alert("Access denied. Only super admins can perform this action.");
      return;
    }

    setLoading(true);

    try {
      const url = editingAdmin
        ? `${API_BASE_URL}/${editingAdmin.id || editingAdmin._id}`
        : `${API_BASE_URL}/register`;

      const method = editingAdmin ? "PUT" : "POST";

      const payload = { ...formData };

      // For update, don't send password if it's empty
      if (editingAdmin && !payload.password) {
        delete payload.password;
      }

      // Get auth token
      const token = localStorage.getItem("adminToken");
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setShowModal(false);
        setEditingAdmin(null);
        setFormData({ email: "", password: "", role: "admin" });
        fetchAdmins();
        checkSuperAdminExistence();
        alert(
          editingAdmin
            ? "Admin updated successfully!"
            : "Admin created successfully!"
        );
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving admin:", error);
      alert("Error saving admin. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    // Check permissions
    if (!currentUser || currentUser.role !== "super_admin") {
      alert("Access denied. Only super admins can edit admins.");
      return;
    }

    setEditingAdmin(admin);
    setFormData({
      email: admin.email,
      password: "", // Do not pre-fill password
      role: admin.role
    });
    setShowModal(true);
  };

  const handleDelete = async (adminId) => {
    // Check permissions
    if (!currentUser || currentUser.role !== "super_admin") {
      alert("Access denied. Only super admins can delete admins.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this admin?")) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      
      const response = await fetch(`${API_BASE_URL}/${adminId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        fetchAdmins();
        checkSuperAdminExistence();
        alert("Admin deleted successfully!");
      } else {
        alert(result.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Error deleting admin. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "", role: "admin" });
    setEditingAdmin(null);
    setShowModal(false);
  };

  const getAdminId = (admin) => {
    return admin.id || admin._id;
  };

  const canPerformCRUD = currentUser && currentUser.role === "super_admin";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isMobile) {
      return date.toLocaleDateString();
    }
    return date.toLocaleString();
  };

  return (
    <div className="management-container">
      <section className="management-section">
        <div className="section-header">
          <div className="header-info">
            {isMobile && (
              <button 
                className="mobile-menu-btn"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu size={20} />
              </button>
            )}
            <h1>Admin Management</h1>
            {currentUser && (
              <div className="user-role-badge">
                {currentUser.role === "super_admin" ? (
                  <span className="super-admin-badge">
                    <Shield size={16} />
                    {!isMobile && "Super Admin"}
                  </span>
                ) : (
                  <span className="admin-badge">
                    <User size={16} />
                    {!isMobile && "Admin"}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {canPerformCRUD && (
            <button
              className="add-button"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              <Plus size={18} />
              {!isMobile && "Add Admin"}
            </button>
          )}
        </div>

        {currentUser && !canPerformCRUD && (
          <div className="permission-notice">
            <p>You have view-only access. Contact a super admin for modifications.</p>
          </div>
        )}

        {!currentUser && (
          <div className="error-notice">
            <p>Unable to verify your permissions. Please login again.</p>
          </div>
        )}

        <div className="admins-table-container">
          {loading ? (
            <div className="loading-state">
              <p>Loading admins...</p>
            </div>
          ) : !admins || admins.length === 0 ? (
            <div className="empty-state">
              <p>No admins found. {canPerformCRUD && 'Click "Add Admin" to create the first one.'}</p>
            </div>
          ) : (
            <div className="admins-table">
              {isMobile ? (
                // Mobile Cards View
                <div className="admins-cards">
                  {admins.map((admin) => (
                    <div key={getAdminId(admin)} className="admin-card">
                      <div className="card-header">
                        <div className="card-email">{admin.email}</div>
                        <span className={`role-badge ${admin.role === 'super_admin' ? 'super-admin' : 'admin'}`}>
                          {admin.role === 'super_admin' ? <Shield size={14} /> : <User size={14} />}
                          {admin.role.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="card-details">
                        <div className="card-detail">
                          <span className="detail-label">Created:</span>
                          <span className="detail-value">{formatDate(admin.createdAt)}</span>
                        </div>
                        <div className="card-detail">
                          <span className="detail-label">Updated:</span>
                          <span className="detail-value">{formatDate(admin.updatedAt)}</span>
                        </div>
                      </div>
                      {canPerformCRUD && (
                        <div className="card-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(admin)}
                            title="Edit admin"
                            disabled={loading}
                          >
                            <Edit size={16} />
                            {!isMobile && "Edit"}
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(getAdminId(admin))}
                            title="Delete admin"
                            disabled={loading || (admin.role === 'super_admin' && admins.filter(a => a.role === 'super_admin').length === 1)}
                          >
                            <Trash2 size={16} />
                            {!isMobile && "Delete"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop Table View
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      {canPerformCRUD && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={getAdminId(admin)}>
                        <td className="email-cell">{admin.email}</td>
                        <td>
                          <span className={`role-badge ${admin.role === 'super_admin' ? 'super-admin' : 'admin'}`}>
                            {admin.role === 'super_admin' ? <Shield size={14} /> : <User size={14} />}
                            {admin.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td>{formatDate(admin.createdAt)}</td>
                        <td>{formatDate(admin.updatedAt)}</td>
                        {canPerformCRUD && (
                          <td className="actions">
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(admin)}
                              title="Edit admin"
                              disabled={loading}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(getAdminId(admin))}
                              title="Delete admin"
                              disabled={loading || (admin.role === 'super_admin' && admins.filter(a => a.role === 'super_admin').length === 1)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingAdmin ? "Edit Admin" : "Add New Admin"}</h2>
                <button className="close-btn" onClick={resetForm}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter admin email"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingAdmin}
                    minLength="6"
                    placeholder={
                      editingAdmin
                        ? "Leave blank to keep current password"
                        : "Enter password (min 6 characters)"
                    }
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Role:</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={loading || (superAdminExists && formData.role !== 'super_admin')}
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin" disabled={superAdminExists}>
                      Super Admin {superAdminExists && "(Already exists)"}
                    </option>
                  </select>
                  {superAdminExists && formData.role === 'super_admin' && (
                    <p className="role-hint">
                      Only one super admin is allowed. To change super admin, first demote the current one.
                    </p>
                  )}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="cancel-btn"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : editingAdmin
                      ? "Update"
                      : "Create Admin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}