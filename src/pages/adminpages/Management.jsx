import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import "./css/management.css";

export default function Management() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ===============================
  // 🚀 DEPLOYED BACKEND URL (Node.js)
  // ===============================
  const API_BASE_URL = "https://backend-drukhealth.onrender.com/api/manage";

  useEffect(() => {
    fetchAdmins();
  }, []);

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

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setShowModal(false);
        setEditingAdmin(null);
        setFormData({ email: "", password: "" });
        fetchAdmins();
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
    setEditingAdmin(admin);
    setFormData({
      email: admin.email,
      password: "", // Do not pre-fill password
    });
    setShowModal(true);
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${adminId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        fetchAdmins();
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
    setFormData({ email: "", password: "" });
    setEditingAdmin(null);
    setShowModal(false);
  };

  const getAdminId = (admin) => {
    return admin.id || admin._id;
  };

  return (
    <div className="management-container">
      <section className="management-section">
        <div className="section-header">
          <h1>Admin Management</h1>
          <button
            className="add-button"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            <Plus size={18} />
            Add Admin
          </button>
        </div>

        <div className="admins-table-container">
          {loading ? (
            <div className="loading-state">
              <p>Loading admins...</p>
            </div>
          ) : !admins || admins.length === 0 ? (
            <div className="empty-state">
              <p>No admins found. Click "Add Admin" to create the first one.</p>
            </div>
          ) : (
            <div className="admins-table">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={getAdminId(admin)}>
                      <td className="email-cell">{admin.email}</td>
                      <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(admin.updatedAt).toLocaleDateString()}</td>
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
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
