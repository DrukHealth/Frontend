// // Dashboard.jsx (Updated for deployed API)

// import React, { useEffect, useState } from "react";
// import {
//   Home,
//   FileText,
//   Settings,
//   User,
//   LogOutIcon,
//   Menu,
//   X,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Records from "./Records";
// import Management from "./Management";
// import "./css/dashboard.css";

// // =====================================
// //  🚀 API CONFIG — CHANGE THESE
// // =====================================
// const NODE_API = "https://backend-drukhealth.onrender.com/api";
// const FASTAPI_URL = "https://fastapi-backend-yrc0.onrender.com"; 
// // 👉 Replace with your actual FASTAPI URL

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [scanStats, setScanStats] = useState({
//     daily: 0,
//     weekly: 0,
//     monthly: 0,
//     yearly: 0,
//     nspStats: { Normal: 0, Suspect: 0, Pathologic: 0 },
//   });

//   const [analysisData, setAnalysisData] = useState({
//     predictions: [],
//     nspStats: {},
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeNav, setActiveNav] = useState("Dashboard");
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
//   const [showAdminDialog, setShowAdminDialog] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const COLORS = ["#4d79ff", "#ffcc00", "#ff4d4d"];

//   // ---------------------------------------------------------
//   // 🟦 Fetch analysis — FROM FASTAPI (cloud)
//   // ---------------------------------------------------------
//   useEffect(() => {
//     fetch(`${FASTAPI_URL}/api/analysis`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch FastAPI analysis");
//         return res.json();
//       })
//       .then((data) => {
//         setAnalysisData(data);
//         setScanStats((prev) => ({
//           ...prev,
//           nspStats: {
//             Normal: data.nspStats?.Normal || 0,
//             Suspect: data.nspStats?.Suspect || 0,
//             Pathologic: data.nspStats?.Pathologic || 0,
//           },
//         }));
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("FastAPI error:", err);
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   // ---------------------------------------------------------
//   // 🟧 Fetch scan stats — FROM NODE (cloud)
//   // ---------------------------------------------------------
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await axios.get(`${NODE_API}/scans/stats`);
//         setScanStats((prev) => ({ ...prev, ...res.data }));
//       } catch (err) {
//         console.error("Node backend error:", err);
//       }
//     };

//     fetchStats();
//   }, []);

//   // Pie chart data
//   const pieData = [
//     { name: "Normal", value: scanStats.nspStats.Normal || 0 },
//     { name: "Suspect", value: scanStats.nspStats.Suspect || 0 },
//     { name: "Pathologic", value: scanStats.nspStats.Pathologic || 0 },
//   ];

//   // Logout logic
//   const handleLogout = () => setShowLogoutDialog(true);
//   const confirmLogout = () => {
//     setShowLogoutDialog(false);
//     navigate("/login");
//   };
//   const cancelLogout = () => setShowLogoutDialog(false);

//   // Admin profile dialog
//   const openAdminDialog = () => setShowAdminDialog(true);
//   const closeAdminDialog = () => setShowAdminDialog(false);
//   const handleChangePassword = () => {
//     setShowAdminDialog(false);
//     navigate("/change-password");
//   };

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   // Loading & error UI
//   if (loading) return <p>Loading analysis...</p>;
//   if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

//   // =======================================
//   //  MAIN RENDER
//   // =======================================
//   return (
//     <div className="dashboard-container">
//       {sidebarOpen && (
//         <div className="sidebar-overlay" onClick={toggleSidebar}></div>
//       )}

//       {/* SIDEBAR */}
//       <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
//         <div
//           className="logo-section"
//           onClick={() => {
//             setActiveNav("Dashboard");
//             setSidebarOpen(false);
//           }}
//           style={{ cursor: "pointer" }}
//         >
//           <img src="/logo.png" alt="Logo" className="logo-img" />
//           <span className="logo-text">
//             Druk <span className="logo-e">e</span>Health
//           </span>
//         </div>

//         <nav className="nav-menu">
//           {["Dashboard", "Records", "Management"].map((item) => (
//             <div
//               key={item}
//               className={`nav-item ${activeNav === item ? "active" : ""}`}
//               onClick={() => {
//                 setActiveNav(item);
//                 setSidebarOpen(false);
//               }}
//             >
//               {item === "Dashboard" && <Home size={25} />}
//               {item === "Records" && <FileText size={25} />}
//               {item === "Management" && <Settings size={25} />}
//               <span>{item}</span>
//             </div>
//           ))}
//         </nav>

//         <div className="nav-item" onClick={handleLogout} id="Logout">
//           <LogOutIcon size={25} /> <span>Log Out</span>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="main-content">
//         <header className="header">
//           <button className="hamburger-btn" onClick={toggleSidebar}>
//             {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>

//           <div className="admin-profile" onClick={openAdminDialog}>
//             <span>Admin</span>
//             <User size={20} />
//           </div>
//         </header>

//         {/* PAGE CONTENT */}
//         <div className="page-content fade-in" key={activeNav}>
//           {activeNav === "Dashboard" && (
//             <>
//               <h2 className="section-title">Fetal Health Data Analysis</h2>

//               {/* Stats */}
//               <section className="stats-section">
//                 <div className="stats-grid">
//                   <div className="stat-card"><h4>Today’s Scans</h4><p>{scanStats.daily}</p></div>
//                   <div className="stat-card"><h4>This Week</h4><p>{scanStats.weekly}</p></div>
//                   <div className="stat-card"><h4>This Month</h4><p>{scanStats.monthly}</p></div>
//                   <div className="stat-card"><h4>This Year</h4><p>{scanStats.yearly}</p></div>
//                 </div>
//               </section>

//               {/* Charts */}
//               <section className="charts-container">
//                 <div className="chart-section">
//                   <h4>Predictions Over Time</h4>
//                   <ResponsiveContainer width="100%" height={350}>
//                     <LineChart data={analysisData.predictions}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="date" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Line type="monotone" dataKey="N" stroke="#4d79ff" strokeWidth={2} dot={false} />
//                       <Line type="monotone" dataKey="S" stroke="#ffcc00" strokeWidth={2} dot={false} />
//                       <Line type="monotone" dataKey="P" stroke="#ff4d4d" strokeWidth={2} dot={false} />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className="chart-section">
//                   <h4>Overall Case Distribution</h4>
//                   <ResponsiveContainer width="100%" height={350}>
//                     <PieChart>
//                       <Pie
//                         data={pieData}
//                         dataKey="value"
//                         nameKey="name"
//                         cx="50%"
//                         cy="50%"
//                         label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
//                         labelLine
//                       >
//                         {pieData.map((entry, index) => (
//                           <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend layout="vertical" verticalAlign="top" align="right" />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </section>
//             </>
//           )}

//           {activeNav === "Records" && <Records />}
//           {activeNav === "Management" && <Management />}
//         </div>

//        {showAdminDialog && (
//   <div className="admin-dialog-overlay">
//     <div className="admin-dialog">
//       <button className="close-btn" onClick={closeAdminDialog}>×</button>
      
//       <User size={60} className="profile-icon" />

//       <h2 style={{ textTransform: "capitalize" }}>
//         {localStorage.getItem("adminRole")?.replace("_", " ") || "Admin"}
//       </h2>

//       <p>
//         {localStorage.getItem("adminEmail") || "No email found"}
//       </p>

//       <div className="admin-dialog-buttons">
//         <button className="reset-password-btn" onClick={handleChangePassword}>
//           Re-set Password
//         </button>
//       </div>
//     </div>
//   </div>
// )}


//         {/* Logout Dialog */}
//         {showLogoutDialog && (
//           <div className="logout-dialog-overlay">
//             <div className="logout-dialog">
//               <h3>Confirm Logout</h3>
//               <p>Are you sure you want to logout?</p>
//               <div className="dialog-buttons">
//                 <button className="confirm-btn" onClick={confirmLogout}>Yes</button>
//                 <button className="cancel-btn" onClick={cancelLogout}>Cancel</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


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
  Bar,
  BarChart,
} from "recharts";
import Plot from "react-plotly.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Records from "./Records";
import Management from "./Management";
import "./css/dashboard.css";

// =====================================
//  🚀 API CONFIG
// =====================================
const NODE_API = "https://backend-drukhealth.onrender.com/api";

const FASTAPI_URL =
  import.meta.env.VITE_FASTAPI_BACKEND || "http://127.0.0.1:8000";
// const FASTAPI_URL = "http://127.0.0.1:8080"


export default function Dashboard() {
  const navigate = useNavigate();
  const [scanStats, setScanStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
    nspStats: { Normal: 0, Suspect: 0, Pathologic: 0 },
  });

  const [analysisData, setAnalysisData] = useState({
    predictions: [],
    nspStats: {},
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [globalImportance, setGlobalImportance] = useState(null);
//   const [fastapiNSP, setFastapiNSP] = useState({ Normal: 0, Suspect: 0, Pathologic: 0 });
// const [nodeNSP, setNodeNSP] = useState({ Normal: 0, Suspect: 0, Pathologic: 0 });

// const [combinedNSP, setCombinedNSP] = useState({ Normal: 0, Suspect: 0, Pathologic: 0 });


  const COLORS = ["#4d79ff", "#ffcc00", "#ff4d4d"];


//   useEffect(() => {
//   axios.get(`${NODE_API}/scans/all`)
//     .then(res => {
//       const records = res.data.records;

//       const nodeNormal = records.filter(r => r.ctgDetected === "Normal").length;
//       const nodeSuspect = records.filter(r => r.ctgDetected === "Suspect").length;
//       const nodePath = records.filter(r => r.ctgDetected === "Pathological").length;

//       setNodeNSP({
//         Normal: nodeNormal,
//         Suspect: nodeSuspect,
//         Pathologic: nodePath,
//       });
//     })
//     .catch(err => console.error("Node fetch error:", err));
// }, []);

// useEffect(() => {
//   setCombinedNSP({
//     Normal: (fastapiNSP.Normal || 0) + (nodeNSP.Normal || 0),
//     Suspect: (fastapiNSP.Suspect || 0) + (nodeNSP.Suspect || 0),
//     Pathologic: (fastapiNSP.Pathologic || 0) + (nodeNSP.Pathologic || 0),
//   });
// }, [fastapiNSP, nodeNSP]);

// useEffect(() => {
//   const fetchAllScans = async () => {
//     try {
//       // Try the new route first
//       const res = await axios.get(`${NODE_API}/scans/all`);
//       setAllNodeCTG(res.data.records);
//     } catch (err) {
//       console.warn("⚠ /scans/all failed, falling back to /scans");

//       try {
//         const fallback = await axios.get(`${NODE_API}/scans`);
//         setAllNodeCTG(fallback.data);
//       } catch (err2) {
//         console.error("❌ Node fetch error:", err2);
//       }
//     }
//   };

//   fetchAllScans();
// }, []);


  // =====================================
  // Fetch Global Feature Importance
  // =====================================
  useEffect(() => {
    const fetchGlobalImportance = async () => {
      try {
        const res = await axios.get(`${FASTAPI_URL}/api/feature-importance`);
        const data = res.data.feature_importance;

        const formatted = Object.keys(data).map((key) => ({
          name: key,
          value: data[key],
        }));

        setGlobalImportance(formatted);
      } catch (err) {
        console.error("Error fetching global importance:", err);
      }
    };

    fetchGlobalImportance();
  }, []);

  // =====================================
  // Fetch FastAPI-analysis
  // =====================================
  useEffect(() => {
    fetch(`${FASTAPI_URL}/api/analysis`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch FastAPI analysis");
        return res.json();
      })
      .then((data) => {
        setAnalysisData(data);

        setScanStats((prev) => ({
          ...prev,
          nspStats: {
            Normal: data.nspStats?.Normal || 0,
            Suspect: data.nspStats?.Suspect || 0,
            Pathologic: data.nspStats?.Pathologic || 0,
          },
        }));

        setLoading(false);
      })
      .catch((err) => {
        console.error("FastAPI error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // =====================================
  // Fetch Node scan stats
  // =====================================
  useEffect(() => {
    axios
      .get(`${NODE_API}/scans/stats`)
      .then((res) => {
        setScanStats((prev) => ({ ...prev, ...res.data }));
      })
      .catch((err) => {
        console.error("Node backend error:", err);
      });
  }, []);

  // Pie chart data
// const pieData = [
//   { name: "Normal", value: combinedNSP.Normal },
//   { name: "Suspect", value: combinedNSP.Suspect },
//   { name: "Pathologic", value: combinedNSP.Pathologic },
// ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* SIDEBAR */}
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
            Druk <br /><span className="logo-e">e</span>Health
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

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header">
          <button className="hamburger-btn" onClick={toggleSidebar}>
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div className="admin-profile" onClick={openAdminDialog}>
            <span>Admin</span>
            <User size={20} />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="page-content fade-in" key={activeNav}>
          {activeNav === "Dashboard" && (
            <>
              <h2 className="section-title">Fetal Health Data Analysis</h2>

              {/* Stats */}
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
                {/* <div className="chart-section">
                  <h4>Predictions Over Time</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={analysisData.predictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="1"
                        name="Normal"
                        stroke="#4d79ff"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="2"
                        name="Suspect"
                        stroke="#ffcc00"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="3"
                        name="Pathologic"
                        stroke="#ff4d4d"
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
                        label={({ percent }) =>
                          `${(percent * 100).toFixed(1)}%`
                        }
                        labelLine
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
                </div> */}

                {/* GLOBAL FEATURE IMPORTANCE */}
                {globalImportance && (
                  <div className="chart-section">
                    <h4>Feature Importance (%)</h4>

                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={[
                          ...globalImportance
                            .sort((a, b) => b.value - a.value)
                            .map((item) => ({
                              name: item.name,
                              value: item.value * 100,
                            })),
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={140}
                        />
                        <XAxis type="number" unit="%" />
                        <Tooltip
                          formatter={(v) => `${v.toFixed(2)}%`}
                        />
                        <Bar dataKey="value" fill="#679ADC" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>
            </>
          )}

          {activeNav === "Records" && <Records />}
          {activeNav === "Management" && <Management />}
        </div>

        {/* ADMIN DIALOG */}
        {showAdminDialog && (
          <div className="admin-dialog-overlay">
            <div className="admin-dialog">
              <button className="close-btn" onClick={closeAdminDialog}>
                ×
              </button>

              <User size={60} className="profile-icon" />

              <h2 style={{ textTransform: "capitalize" }}>
                {localStorage
                  .getItem("adminRole")
                  ?.replace("_", " ") || "Admin"}
              </h2>

              <p>{localStorage.getItem("adminEmail") || "No email found"}</p>

              <div className="admin-dialog-buttons">
                <button
                  className="reset-password-btn"
                  onClick={handleChangePassword}
                >
                  Re-set Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOGOUT DIALOG */}
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
