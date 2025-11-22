// src/pages/adminpages/Management.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import useSessionTimeout from "../../hooks/useSessionTimeout";
import "./css/management.css";

export default function Management() {
  useSessionTimeout(); // ✅ auto logout if session expired

  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const API_BASE_URL = "https://backend-drukhealth.onrender.com/api/manage";

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) setAdmins(result.data || []);
      else setAdmins([]);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      if (editingAdmin && !payload.password) delete payload.password;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setEditingAdmin(null);
        setFormData({ email: "", password: "" });
        fetchAdmins();
        alert(editingAdmin ? "Admin updated successfully!" : "Admin created successfully!");
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
    setFormData({ email: admin.email, password: "" });
    setShowModal(true);
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${adminId}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) fetchAdmins();
      else alert(result.message || "Failed to delete admin");
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

  const getAdminId = (admin) => admin.id || admin._id;

  return (
    <div className="management-container">
      <header className="management-header">
        <h2>Admin Management</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Admin
        </button>
      </header>

      {loading ? (
        <p>Loading admins...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={3}>No admins found.</td>
              </tr>
            ) : (
              admins.map((admin, idx) => (
                <tr key={getAdminId(admin)}>
                  <td>{idx + 1}</td>
                  <td>{admin.email}</td>
                  <td className="actions-cell">
                    <button className="edit-btn" onClick={() => handleEdit(admin)}>
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(getAdminId(admin))}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-btn" onClick={resetForm}>
              <X size={18} />
            </button>
            <h3>{editingAdmin ? "Edit Admin" : "Add Admin"}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editingAdmin ? "(Leave blank to keep current)" : ""}
                  required={!editingAdmin}
                />
              </label>
              <button type="submit" className="save-btn" disabled={loading}>
                {editingAdmin ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
