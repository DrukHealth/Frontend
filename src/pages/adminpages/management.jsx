import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import "./management.css";

export default function Management() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/management");
      if (response.ok) {
        const result = await response.json();
        setAdmins(result.data);
      } else {
        alert("Failed to load admins. Check server.");
      }
    } catch (error) {
      alert("Error connecting to server.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAdmin 
        ? `http://localhost:5000/api/management/${editingAdmin._id}`
        : "http://localhost:5000/api/management/register";
      const method = editingAdmin ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setEditingAdmin(null);
        setFormData({ email: "", password: "" });
        fetchAdmins();
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      alert("Error saving admin.");
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ email: admin.email, password: "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/management/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) fetchAdmins();
      else alert(result.message || "Failed to delete admin");
    } catch {
      alert("Error deleting admin");
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "" });
    setEditingAdmin(null);
    setShowModal(false);
  };

  return (
    <div className="management-page">
      <div className="section-header">
        <h1>Admin Management</h1>
        <button className="add-button" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Admin
        </button>
      </div>

      <div className="admins-table-container">
        {admins.length === 0 ? (
          <div className="empty-state">
            <p>No admins found. Click "Add Admin" to create one.</p>
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
                {admins.map(admin => (
                  <tr key={admin._id}>
                    <td>{admin.email}</td>
                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(admin.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEdit(admin)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(admin._id)} title="Delete">
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
                  placeholder={editingAdmin ? "Leave blank to keep current password" : ""}
                  minLength={6}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn">{editingAdmin ? "Update" : "Create"} Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
