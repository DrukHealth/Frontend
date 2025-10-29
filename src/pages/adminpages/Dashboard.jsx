import React, { useEffect, useState } from "react";
import { Home, FileText, Settings, FileSearch, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ daily: 0, weekly: 0, monthly: 0, yearly: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/scans/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

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
          <div className="nav-item" onClick={() => navigate("/dashboard")}>
            <Home size={18} /> <span>Home</span>
          </div>
          <div className="nav-item">
            <FileText size={18} /> <span>Records</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/management")}>
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

        {/* Stats */}
        <section className="stats-section">
          <div className="stat-card">
            <h3>Today’s Scans</h3>
            <p>{stats.daily}</p>
          </div>
          <div className="stat-card">
            <h3>This Week</h3>
            <p>{stats.weekly}</p>
          </div>
          <div className="stat-card">
            <h3>This Month</h3>
            <p>{stats.monthly}</p>
          </div>
          <div className="stat-card">
            <h3>This Year</h3>
            <p>{stats.yearly}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
