import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./management.css";

export default function Management() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ----------------------------------------------------
     🔐 Auto-fetch on mount with token validation
  ---------------------------------------------------- */
  useEffect(() => {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("superAdminToken");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
    } else {
      fetchAdmins(token);
    }
    // eslint-disable-next-line
  }, []);

  /* ----------------------------------------------------
     🔐 Helper: Get token or redirect if missing
  ---------------------------------------------------- */
  const getToken = () => {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("superAdminToken");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return null;
    }
    return token;
  };

  /* ----------------------------------------------------
     📋 FETCH ADMINS (Protected)
  ---------------------------------------------------- */
  const fetchAdmins = async (tokenParam) => {
    const token = tokenParam || getToken();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/api/management", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setAdmins(result.data);
      } else {
        alert(result.message || "Failed to load admins. Check permissions.");
      }
    } catch (error) {
      console.error("❌ Fetch admins error:", error);
      alert("Error connecting to server.");
    }
  };

  /* ----------------------------------------------------
     ✏️ FORM INPUT HANDLER
  ---------------------------------------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ----------------------------------------------------
     💾 ADD / UPDATE ADMIN
  ---------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const url = editingAdmin
        ? `http://localhost:5000/api/management/${editingAdmin._id}`
        : "http://localhost:5000/api/management/register";
      const method = editingAdmin ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(
          editingAdmin
            ? "Admin updated successfully ✅"
            : "Admin created successfully ✅"
        );
        resetForm();
        fetchAdmins(token);
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("❌ Save admin error:", error);
      alert("Error saving admin.");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------
     🖊️ EDIT ADMIN
  ---------------------------------------------------- */
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ email: admin.email, password: "" });
    setShowModal(true);
  };

  /* ----------------------------------------------------
     🗑️ DELETE ADMIN (Protected)
  ---------------------------------------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/management/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();

      if (response.ok && result.success) {
        alert("Admin deleted successfully ✅");
        fetchAdmins(token);
      } else {
        alert(result.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("❌ Delete admin error:", error);
      alert("Error deleting admin");
    }
  };

  /* ----------------------------------------------------
     🧹 RESET FORM / CLOSE MODAL
  ---------------------------------------------------- */
  const resetForm = () => {
    setFormData({ email: "", password: "" });
    setEditingAdmin(null);
    setShowModal(false);
  };

  /* ----------------------------------------------------
     💻 RENDER UI
  ---------------------------------------------------- */
  return (
    <div className="management-page">
      {/* Header */}
      <div className="section-header">
        <h1>Admin Management</h1>
        <button className="add-button" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="admins-table-container">
        {admins.length === 0 ? (
          <div className="empty-state">
            <p>No admins found. Click “Add Admin” to create one.</p>
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
                  <tr key={admin._id}>
                    <td>{admin.email}</td>
                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(admin.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(admin)}
                        title="Edit"
                        className="action-btn edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        title="Delete"
                        className="action-btn delete"
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

      {/* Add/Edit Modal */}
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
                  placeholder={
                    editingAdmin ? "Leave blank to keep current password" : ""
                  }
                  minLength={6}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : editingAdmin
                    ? "Update Admin"
                    : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
