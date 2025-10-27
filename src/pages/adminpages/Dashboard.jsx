
import React from "react";
import { Home, FileText, Settings, FileSearch, User } from "lucide-react";
import "./css/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-circle">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </div>
          <h2 className="logo-text">Dashboard</h2>
        </div>

        {/* Navigation Links */}
        <nav className="nav-menu">
          <div className="nav-item">
            <Home size={18} /> <span>Home</span>
          </div>
          <div className="nav-item">
            <FileText size={18} /> <span>Records</span>
          </div>
          <div className="nav-item">
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
            <span>Admin</span>
            <User size={20} />
          </div>
        </header>

        <section className="placeholder">
          <p>Dashboard Content Goes Here</p>
        </section>
      </main>
    </div>
  );
}
