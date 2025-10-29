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
  PieChart,
  Pie,
  Cell
} from "recharts";

import { useNavigate } from "react-router-dom";
import ChangePassword from "./ChangePassword";
import LoginPage from "./LoginPage";
import "./css/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activePage, setActivePage] = useState("Dashboard"); // "Dashboard", "Records", "Management"
  const [activeNav, setActiveNav] = useState("Dashboard"); // highlights sidebar
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  // Logout handlers
  const handleLogout = () => setShowLogoutDialog(true);
  const confirmLogout = () => {
    setShowLogoutDialog(false);
    navigate("/login"); // redirect to login page
  };
  const cancelLogout = () => setShowLogoutDialog(false);

  // Admin handlers
  const openAdminDialog = () => setShowAdminDialog(true);
  const closeAdminDialog = () => setShowAdminDialog(false);
  const handleChangePassword = () => {
    setShowAdminDialog(false);
  setActivePage("ChangePassword"); // Show change password page
  window.history.pushState({}, "", "/changepassword"); // Update URL in browser
  
};
// Prepare data for PieChart
const totalCounts = {
  N: 0,
  S: 0,
  P: 0
};

monthlyData.forEach(item => {
  totalCounts.N += item.N;
  totalCounts.S += item.S;
  totalCounts.P += item.P;
});

const pieData = [
  { name: "Normal (N)", value: totalCounts.N },
  { name: "Suspect (S)", value: totalCounts.S },
  { name: "Pathological (P)", value: totalCounts.P },
];

const COLORS = ["#4d79ff", "#ffa64d", "#ff4d4d"];
  // Render Dashboard content
  const renderPageContent = () => {
    if (activePage === "Dashboard") {
      return (
        <section className="data-section">
          <h2 className="section-title">
            <BarChart2 size={22} className="mr-2" />
            Fetal Health Data Analysis
          </h2>

            <div className="summary-cards">
              <div className="card"><h4>Total Patients</h4><p>{data.patients}</p></div>
              <div className="card"><h4>Daily Cases</h4><p>{}</p></div>
              <div className="card"><h4>Monthly Cases</h4><p>{}</p></div>
              <div className="card"><h4>Yearly Cases</h4><p>{}</p></div>
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

          {/* <div className="chart-section">
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
          </div> */}

   <div className="chart-section">
<h4>Overall Case Distribution</h4>
  <ResponsiveContainer width="100%" height={350}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="40%"
        cy="50%"
        outerRadius={110}
        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
        labelLine={false}
        labelStyle={{
          fill: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          textShadow: "0 1px 3px rgba(0,0,0,0.6)",
        }}
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>

      <Tooltip />

      <Legend
        layout="vertical"
        verticalAlign="top"
        align="right"
        wrapperStyle={{
          padding: "12px 16px",
          borderRadius: "12px",
          background: "white",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
          lineHeight: "26px",
          fontWeight: "500",
          color: "#333",
        }}
      />
    </PieChart>
  </ResponsiveContainer>
</div>

        </section>
        

      );
    } else {
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
      {/* Sidebar for Dashboard/Records/Management */}
      {activePage !== "ChangePassword" && (
        <aside className="sidebar">
          <div className="sidebar-toggle" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
  {isSidebarCollapsed ? "→" : "←"}
</div>

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
          </nav>

          <div
            className={`nav-item ${activeNav === "Logout" ? "active" : ""}`}
            onClick={handleLogout}
            id="Logout"
          >
            <LogOutIcon size={25} /> <span>Log Out</span>
          </div>
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

        {/* Admin Dialog */}
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

        {/* Logout Dialog */}
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
