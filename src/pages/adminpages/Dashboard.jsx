import React, { useEffect, useState } from "react";
import {
  Home,
  FileText,
  Settings,
  User,
  LogOutIcon,
  Menu,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Records from "./Records";
import Management from "./Management";
import "./css/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [scanStats, setScanStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
    nspStats: { Normal: 0, Suspect: 0, Pathological: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const COLORS = ["#4d79ff", "#ffa64d", "#ff4d4d"];

  // Fetch CTG AI analysis data
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analysis")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Fetch scan statistics from Node.js backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/scans/stats");
        setScanStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const pieData = [
    { name: "Normal", value: scanStats.nspStats.Normal },
    { name: "Suspect", value: scanStats.nspStats.Suspect },
    { name: "Pathological", value: scanStats.nspStats.Pathological },
  ];

  const handleLogout = () => setShowLogoutDialog(true);
  const confirmLogout = () => {
    setShowLogoutDialog(false);
    navigate("/login");
  };
  const cancelLogout = () => setShowLogoutDialog(false);
  const openAdminDialog = () => setShowAdminDialog(true);
  const closeAdminDialog = () => setShowAdminDialog(false);
  const handleChangePassword = () => {
    setShowAdminDialog(false);
    navigate("/change-password");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) return <p>Loading analysis...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div
          className="logo-section"
          onClick={() => {
            setActiveNav("Dashboard");
            setSidebarOpen(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <span className="logo-text">
            Druk <span className="logo-e"><br />e</span>Health
          </span>
        </div>

        <nav className="nav-menu">
          {["Dashboard", "Records", "Management"].map((item) => (
            <div
              key={item}
              className={`nav-item ${activeNav === item ? "active" : ""}`}
              onClick={() => {
                setActiveNav(item);
                setSidebarOpen(false);
              }}
            >
              {item === "Dashboard" && <Home size={25} />}
              {item === "Records" && <FileText size={25} />}
              {item === "Management" && <Settings size={25} />}
              <span>{item}</span>
            </div>
          ))}
        </nav>

        <div className="nav-item" onClick={handleLogout} id="Logout">
          <LogOutIcon size={25} /> <span>Log Out</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="header">
          {/* Hamburger toggle button */}
          <button className="hamburger-btn" onClick={toggleSidebar}>
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div className="admin-profile" onClick={openAdminDialog}>
            <span>Admin</span>
            <User size={20} />
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="page-content fade-in" key={activeNav}>
          {activeNav === "Dashboard" && (
            <>
              <h2 className="section-title">Fetal Health Data Analysis</h2>

              {/* Stats Section */}
              <section className="stats-section">
                <div className="stats-grid">
                  <div className="stat-card">
                    <h4>Today’s Scans</h4>
                    <p>{scanStats.daily}</p>
                  </div>
                  <div className="stat-card">
                    <h4>This Week</h4>
                    <p>{scanStats.weekly}</p>
                  </div>
                  <div className="stat-card">
                    <h4>This Month</h4>
                    <p>{scanStats.monthly}</p>
                  </div>
                  <div className="stat-card">
                    <h4>This Year</h4>
                    <p>{scanStats.yearly}</p>
                  </div>
                </div>
              </section>

              {/* Charts */}
              <section className="charts-container">
                <div className="chart-section">
                  <h4>Predictions Over Time</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data.predictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="N"
                        stroke="#4d79ff"
                        name="Normal (N)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="S"
                        stroke="#ffcc00"
                        name="Suspect (S)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="P"
                        stroke="#ff4d4d"
                        name="Pathological (P)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-section">
                  <h4>Overall Case Distribution</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        layout="vertical"
                        verticalAlign="top"
                        align="right"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </>
          )}

          {activeNav === "Records" && <Records />}
          {activeNav === "Management" && <Management />}
        </div>

        {/* Admin Dialog */}
        {showAdminDialog && (
          <div className="admin-dialog-overlay">
            <div className="admin-dialog">
              <button className="back-btn" onClick={closeAdminDialog}>
                ×
              </button>
              <User size={60} className="profile-icon" />
              <h2>Admin</h2>
              <p>admin@example.com</p>
              <button
                className="reset-password-btn"
                onClick={handleChangePassword}
              >
                Re-set Password
              </button>
            </div>
          </div>
        )}

        {/* Logout Dialog */}
        {showLogoutDialog && (
          <div className="logout-dialog-overlay">
            <div className="logout-dialog">
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>
              <div className="dialog-buttons">
                <button className="confirm-btn" onClick={confirmLogout}>
                  Yes
                </button>
                <button className="cancel-btn" onClick={cancelLogout}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
