import React, { useEffect, useState, useMemo } from "react";
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
  Bar,
  BarChart,
  LabelList,
  Sector,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Records from "./Records";
import Management from "./Management";
import "./css/dashboard.css";

const NODE_API = "http://localhost:9000/api";
const FASTAPI_URL = "http://127.0.0.1:9000";

export default function Dashboard() {
  const navigate = useNavigate();

  const [scanStats, setScanStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  });

  const [analysisData, setAnalysisData] = useState({
    predictions: [],
    nspStats: { Normal: 0, Suspect: 0, Pathologic: 0 },
    patients: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const [globalImportance, setGlobalImportance] = useState([]);
  const [activePieIndex, setActivePieIndex] = useState(0);

  const COLORS = ["#4d79ff", "#ffcc00", "#ff4d4d"];

  const adminRole =
    localStorage.getItem("adminRole")?.replace("_", " ") || "Admin";

  const adminEmail = localStorage.getItem("adminEmail") || "No email found";

  const safePredictions = useMemo(() => {
    if (!Array.isArray(analysisData?.predictions)) return [];
    return analysisData.predictions;
  }, [analysisData]);

  const pieData = useMemo(() => {
    const stats = analysisData?.nspStats || {};

    return [
      { name: "Normal", value: Number(stats.Normal) || 0 },
      { name: "Suspect", value: Number(stats.Suspect) || 0 },
      { name: "Pathologic", value: Number(stats.Pathologic) || 0 },
    ];
  }, [analysisData]);

  const normalizedImportance = useMemo(() => {
    if (!Array.isArray(globalImportance) || globalImportance.length === 0) {
      return [];
    }

    const total = globalImportance.reduce(
      (sum, item) => sum + (Number(item.value) || 0),
      0
    );

    if (total === 0) return [];

    return globalImportance.map((item) => ({
      name: String(item.name || "").replace(/_/g, " "),
      value: ((Number(item.value) || 0) / total) * 100,
      rawValue: Number(item.value) || 0,
    }));
  }, [globalImportance]);

  const sortedImportance = useMemo(() => {
    return [...normalizedImportance].sort((a, b) => b.value - a.value);
  }, [normalizedImportance]);

  const totalCases = useMemo(() => {
    return pieData.reduce((sum, item) => sum + item.value, 0);
  }, [pieData]);

  const renderActiveShape = (props) => {
    if (!props) return null;

    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
    } = props;

    return (
      <Sector
        cx={cx || 0}
        cy={cy || 0}
        innerRadius={innerRadius || 0}
        outerRadius={(outerRadius || 0) + 6}
        startAngle={startAngle || 0}
        endAngle={endAngle || 0}
        fill={fill || "#ccc"}
      />
    );
  };

  useEffect(() => {
    const fetchGlobalImportance = async () => {
      try {
        const res = await axios.get(`${FASTAPI_URL}/api/feature-importance`);
        const data = res.data?.feature_importance || {};

        const formatted = Object.keys(data).map((key) => ({
          name: key,
          value: data[key],
        }));

        setGlobalImportance(formatted);
      } catch (err) {
        console.error("Error fetching feature importance:", err);
        setGlobalImportance([]);
      }
    };

    fetchGlobalImportance();
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${FASTAPI_URL}/api/analysis`);

        if (!res.ok) {
          throw new Error("Failed to fetch FastAPI analysis");
        }

        const data = await res.json();

        setAnalysisData({
          predictions: Array.isArray(data?.predictions)
            ? data.predictions
            : [],
          nspStats: data?.nspStats || {
            Normal: 0,
            Suspect: 0,
            Pathologic: 0,
          },
          patients: Number(data?.patients) || 0,
        });
      } catch (err) {
        console.error("FastAPI error:", err);
        setError(err.message || "Something went wrong while loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  useEffect(() => {
    const fetchScanStats = async () => {
      try {
        const res = await axios.get(`${NODE_API}/scans/stats`);
        setScanStats((prev) => ({
          ...prev,
          ...res.data,
        }));
      } catch (err) {
        console.error("Node API error:", err);
      }
    };

    fetchScanStats();
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        setShowAdminDialog(false);
        setShowLogoutDialog(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleNavClick = (item) => {
    setActiveNav(item);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const openAdminDialog = () => {
    setShowAdminDialog(true);
  };

  const closeAdminDialog = () => {
    setShowAdminDialog(false);
  };

  const handleChangePassword = () => {
    setShowAdminDialog(false);
    navigate("/change-password");
  };

  if (loading) {
    return (
      <div className="loading">
        <div style={{ fontWeight: "700", marginBottom: "8px" }}>
          Loading dashboard...
        </div>
        <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          Please wait while the latest fetal health analysis is prepared.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div style={{ fontWeight: "700", marginBottom: "8px" }}>
          Unable to load dashboard
        </div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div
          className="logo-section"
          onClick={() => handleNavClick("Dashboard")}
          role="button"
          tabIndex={0}
        >
          <img src="/logo.png" alt="Druk eHealth Logo" className="logo-img" />
            <span className="logo-text">
              <span className="logo-druk">Druk</span>
              <span className="logo-health">
                <span className="logo-e">e</span>Health
              </span>
            </span>
        </div>

        <nav className="nav-menu">
          <button
            type="button"
            className={`nav-item ${activeNav === "Dashboard" ? "active" : ""}`}
            onClick={() => handleNavClick("Dashboard")}
          >
            <Home size={25} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeNav === "Records" ? "active" : ""}`}
            onClick={() => handleNavClick("Records")}
          >
            <FileText size={25} />
            <span>Records</span>
          </button>

          <button
            type="button"
            className={`nav-item ${
              activeNav === "Management" ? "active" : ""
            }`}
            onClick={() => handleNavClick("Management")}
          >
            <Settings size={25} />
            <span>Management</span>
          </button>
        </nav>

        <button
          type="button"
          className="nav-item logout-link"
          onClick={handleLogout}
          id="Logout"
        >
          <LogOutIcon size={25} />
          <span>Log Out</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="dashboard-header-left">
            <button
              type="button"
              className="hamburger-btn"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <h2 className="dashboard-page-title">{activeNav}</h2>
          </div>

          <div className="dashboard-header-center"></div>

          <button
            type="button"
            className="admin-profile"
            onClick={openAdminDialog}
            aria-label="Open admin profile"
          >
            <span>{adminRole}</span>
            <User size={20} />
          </button>
        </header>

        <div className="page-content fade-in" key={activeNav}>
          {activeNav === "Dashboard" && (
            <>
              <section
                style={{
                  background: "linear-gradient(135deg, #ffffff, #eef6ff)",
                  borderRadius: "22px",
                  padding: "22px",
                  marginBottom: "24px",
                  boxShadow: "0 8px 24px rgba(31, 41, 55, 0.08)",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 8px 0",
                    color: "#1f2937",
                    fontSize: "1.6rem",
                  }}
                >
                  Fetal Health Data Analysis
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: "#6b7280",
                    maxWidth: "760px",
                    lineHeight: 1.6,
                  }}
                >
                  Monitor patient scans, review NSP predictions, and understand
                  which clinical features influence the model output.
                </p>
              </section>

              <div className="stats-grid-compact">
                <div className="stat-card-mini">
                  <span className="stat-label">Total Scans</span>
                  <span className="stat-value">{analysisData.patients || 0}</span>
                </div>

                <div className="stat-card-mini">
                  <span className="stat-label">Today</span>
                  <span className="stat-value">{scanStats.daily || 0}</span>
                </div>

                <div className="stat-card-mini">
                  <span className="stat-label">This Week</span>
                  <span className="stat-value">{scanStats.weekly || 0}</span>
                </div>

                <div className="stat-card-mini">
                  <span className="stat-label">This Month</span>
                  <span className="stat-value">{scanStats.monthly || 0}</span>
                </div>

                <div className="stat-card-mini">
                  <span className="stat-label">This Year</span>
                  <span className="stat-value">{scanStats.yearly || 0}</span>
                </div>
              </div>

              <div className="charts-row">
                <div className="chart-card">
                  <div className="chart-header">
                    <h4>NSP Predictions Over Time</h4>
                  </div>

                  {safePredictions.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart data={safePredictions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tick={{
                            angle: -30,
                            textAnchor: "end",
                            fontSize: 10,
                          }}
                          height={60}
                          interval={
                            Math.floor(safePredictions.length / 8) || 1
                          }
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend verticalAlign="top" align="right" />
                        <Line
                          type="monotone"
                          dataKey="N"
                          name="Normal"
                          stroke="#4d79ff"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="S"
                          name="Suspect"
                          stroke="#ffcc00"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="P"
                          name="Pathologic"
                          stroke="#ff4d4d"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-chart">
                      No prediction data available
                    </div>
                  )}

                  <div className="chart-note">
                    Shows how Normal, Suspect, and Pathologic cases change over
                    scan dates.
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h4>Overall Case Distribution</h4>
                  </div>

                  {pieData.some((item) => item.value > 0) ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          activeIndex={activePieIndex}
                          activeShape={renderActiveShape}
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          label={({ percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                          labelLine
                          onMouseEnter={(_, index) => {
                            if (typeof index === "number") {
                              setActivePieIndex(index);
                            }
                          }}
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-chart">
                      No case distribution data
                    </div>
                  )}

                  <div className="chart-note">
                    Total classified cases: {totalCases}
                  </div>
                </div>
              </div>

              {sortedImportance.length > 0 && (
                <div className="chart-card full-width">
                  <div className="chart-header">
                    <h4>Feature Importance</h4>
                    <div
                      className="chart-help-icon"
                      title="Shows which clinical features most influence the model prediction. Percentages are normalized to 100%."
                    >
                      ⓘ
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={sortedImportance}
                      layout="vertical"
                      margin={{
                        left: 160,
                        right: 50,
                        top: 10,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={160}
                        tick={{ fontSize: 12 }}
                      />
                      <XAxis
                        type="number"
                        unit="%"
                        domain={[0, 100]}
                      />
                      <Tooltip
                        formatter={(value) =>
                          `${Number(value).toFixed(1)}%`
                        }
                      />
                      <Bar
                        dataKey="value"
                        fill="#679ADC"
                        radius={[0, 6, 6, 0]}
                      >
                        <LabelList
                          dataKey="value"
                          position="right"
                          formatter={(value) =>
                            `${Math.round(Number(value))}%`
                          }
                          offset={5}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="chart-note">
                    Higher percentage means stronger influence on the final NSP
                    classification.
                  </div>
                </div>
              )}
            </>
          )}

          {activeNav === "Records" && <Records />}
          {activeNav === "Management" && <Management />}
        </div>

        {showAdminDialog && (
          <div className="admin-dialog-overlay">
            <div className="admin-dialog" role="dialog" aria-modal="true">
              <button
                type="button"
                className="close-btn"
                onClick={closeAdminDialog}
                aria-label="Close admin dialog"
              >
                ×
              </button>

              <User size={60} className="profile-icon" />

              <h2>{adminRole}</h2>
              <p>{adminEmail}</p>

              <div className="admin-dialog-buttons">
                <button
                  type="button"
                  className="reset-password-btn"
                  onClick={handleChangePassword}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        )}

        {showLogoutDialog && (
          <div className="logout-dialog-overlay">
            <div className="logout-dialog" role="dialog" aria-modal="true">
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to log out?</p>

              <div className="dialog-buttons">
                <button
                  type="button"
                  className="confirm-btn"
                  onClick={confirmLogout}
                >
                  Yes, Logout
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={cancelLogout}
                >
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