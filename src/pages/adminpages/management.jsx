import React, { useState, useEffect } from "react";
import { Home, FileText, Settings, FileSearch, User, Plus, Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ADD THIS IMPORT
import "./management.css";

export default function Dashboard() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

    // ADD THIS: Initialize navigate hook
  const navigate = useNavigate();

  // Fetch admins on component mount
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
        console.error("Failed to fetch admins");
        alert("Failed to load admins. Please check if the server is running.");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      alert("Error connecting to server. Please make sure the backend is running on port 5000.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingAdmin 
        ? `http://localhost:5000/api/management/${editingAdmin._id}`
        : "http://localhost:5000/api/management/register";
      
      const method = editingAdmin ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
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
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      email: admin.email,
      password: "" // Don't pre-fill password for security
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/management/${id}`, {
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
      alert("Error deleting admin");
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "" });
    setEditingAdmin(null);
    setShowModal(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-circle">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </div>
          <h2 className="logo-text">Dashboard</h2>
        </div>

        <nav className="nav-menu">
          <div className="nav-item " onClick={()=> navigate("/dashboard")}>
            <Home size={18} /> <span>Home</span>
          </div>
          <div className="nav-item">
            <FileText size={18} /> <span>Records</span>
          </div>
          <div className="nav-item active">
            <Settings size={18} /> <span>Management</span>
          </div>
          <div className="nav-item">
            <FileSearch size={18} /> <span>Record Log</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="admin-profile">
            <span>Admin Panel</span>
            <User size={20} />
          </div>
        </header>

        <section className="management-section">
          <div className="section-header">
            <h1>Admin Management</h1>
            <button 
              className="add-button"
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} />
              Add Admin
            </button>
          </div>

          <div className="admins-table-container">
            {admins.length === 0 ? (
              <div className="empty-state">
                <p>No admins found. Click "Add Admin" to create the first admin.</p>
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
                        <td className="email-cell">{admin.email}</td>
                        <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(admin.updatedAt).toLocaleDateString()}</td>
                        <td className="actions">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEdit(admin)}
                            title="Edit admin"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete(admin._id)}
                            title="Delete admin"
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
        </section>

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
                    placeholder="Enter admin email"
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
                    placeholder={editingAdmin ? "Leave blank to keep current password" : "Enter password (min 6 characters)"}
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingAdmin ? "Update" : "Create"} Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


