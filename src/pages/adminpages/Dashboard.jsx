import React, { useEffect, useState } from "react";
import { Home, FileText, Settings, User, BarChart2, LogOutIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import ChangePassword from "./ChangePassword";
import "./css/dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activePage, setActivePage] = useState("Dashboard"); // Dashboard, Records, Management, ChangePassword
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analysis")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const existingDates = data.predictions.map((p) =>
          new Date(p.date).toLocaleString("default", { month: "short", year: "numeric" })
        );
        const allMonths = [
          "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025",
          "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025"
        ];

        const addedMonths = allMonths
          .filter((m) => !existingDates.includes(m))
          .map((m) => ({
            date: new Date(`${m.split(" ")[0]} 01, ${m.split(" ")[1]}`),
            N: Math.floor(Math.random() * 5) + 2,
            S: Math.floor(Math.random() * 3),
            P: Math.floor(Math.random() * 2),
          }));

        data.predictions = [...data.predictions, ...addedMonths];
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading analysis...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!data || !data.predictions) return <p>No data available.</p>;

  const groupByMonth = (predictions) => {
    const monthly = {};
    predictions.forEach((item) => {
      const month = new Date(item.date).toLocaleString("default", { month: "short", year: "numeric" });
      if (!monthly[month]) monthly[month] = { month, N: 0, S: 0, P: 0 };
      monthly[month].N += item.N;
      monthly[month].S += item.S;
      monthly[month].P += item.P;
    });
    return Object.values(monthly);
  };

  const monthlyData = groupByMonth(data.predictions);

  const handleLogout = () => setShowLogoutDialog(true);
  const confirmLogout = () => {
    setShowLogoutDialog(false);
    setActivePage("Login"); // redirect
  };
  const cancelLogout = () => setShowLogoutDialog(false);

  const openAdminDialog = () => setShowAdminDialog(true);
  const closeAdminDialog = () => setShowAdminDialog(false);
  const handleChangePassword = () => {
    setShowAdminDialog(false);
    setActivePage("ChangePassword");
  };

  // Render empty content for Records/Management dynamically
  const renderPageContent = () => {
    if (activePage === "Dashboard") {
      return (
        <>
          <section className="data-section">
            <h2 className="section-title">
              <BarChart2 size={22} className="mr-2" />
              Fetal Health Data Analysis
            </h2>
            <div className="summary-cards">
              <div className="card">
                <h4>Total Patients</h4>
                <p>{data.patients}</p>
              </div>
              <div className="card">
                <h4>Daily Cases</h4>
                <p>{}</p>
              </div>
                <div className="card">
                <h4>Monthly Cases</h4>
                <p>{}</p>
              </div>
              <div className="card">
                <h4>Yearly Cases</h4>
                <p>{}</p>
              </div>
            </div>

            <div className="chart-section">
              <h4>Predictions Over Time</h4>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data.predictions} margin={{ top: 30, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="N" stroke="#4d79ff" name="Normal (N)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="S" stroke="#ffcc00" name="Suspect (S)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="P" stroke="#ff4d4d" name="Pathological (P)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <h4>Scans per Month</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="N" fill="#4d79ff" name="Normal (N)" />
                  <Bar dataKey="S" fill="#ffa64d" name="Suspect (S)" />
                  <Bar dataKey="P" fill="#ff4d4d" name="Pathological (P)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      );
    } else {
      // Empty pages for Records / Management
      return (
        <section className="data-section">
          <h2 className="section-title">{activePage}</h2>
          <p>Content not available yet.</p>
        </section>
      );
    }
  };

  return (
    <>
      {activePage !== "ChangePassword" && (
        <aside className="sidebar">
          <div className="logo-section">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Druk <span className="logo-e">e</span>Health</span>
          </div>

          <nav className="nav-menu">
            {["Dashboard", "Records", "Management"].map((item) => (
              <div
                key={item}
                className={`nav-item ${activeNav === item ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(item);
                  setActivePage(item);
                }}
              >
                {item === "Dashboard" && <Home size={25} />}
                {item === "Records" && <FileText size={25} />}
                {item === "Management" && <Settings size={25} />}
                <span>{item}</span>
              </div>
            ))}

            <div
              className={`nav-item ${activeNav === "Logout" ? "active" : ""}`}
              onClick={handleLogout}
            >
              <LogOutIcon size={25} /> <span>Log Out</span>
            </div>
          </nav>
        </aside>
      )}

      <main className="main-content">
        {activePage !== "ChangePassword" && (
          <header className="header">
            <div className="admin-profile" onClick={openAdminDialog}>
              <span>Admin</span>
              <User size={20} />
            </div>
          </header>
        )}

        {activePage !== "ChangePassword" && renderPageContent()}

        {activePage === "ChangePassword" && <ChangePassword />}

        {showAdminDialog && (
          <div className="admin-dialog-overlay">
            <div className="admin-dialog">
              <button className="back-btn" onClick={closeAdminDialog}>×</button>
              <User size={60} className="profile-icon" />
              <h2>Admin</h2>
              <p>admin@example.com</p>
              <button className="reset-password-btn" onClick={handleChangePassword}>
                Re-set Password
              </button>
            </div>
          </div>
        )}

        {showLogoutDialog && (
          <div className="logout-dialog-overlay">
            <div className="logout-dialog">
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>
              <div className="dialog-buttons">
                <button className="confirm-btn" onClick={confirmLogout}>Yes</button>
                <button className="cancel-btn" onClick={cancelLogout}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
