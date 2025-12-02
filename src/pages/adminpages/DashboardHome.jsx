// import { useEffect, useState } from "react";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
//   PieChart, Pie, Cell, Legend,
//   BarChart, Bar, ResponsiveContainer
// } from "recharts";

// const COLORS = ["#4d79ff", "#ffcc00", "#ff4d4d"]; // Normal, Suspect, Pathological

// // ===============================
// // 🔗 Deployed API URLs
// // ===============================
// const NODE_API = "https://backend-drukhealth.onrender.com/api";
// const FASTAPI = "https://fastapi-backend-yrc0.onrender.com";

// export default function Dashboard() {
//   const [scanStats, setScanStats] = useState({});
//   const [analysisData, setAnalysisData] = useState({ predictions: [] });
//   const [weeklyNSP, setWeeklyNSP] = useState([]);

//   // --- Compute pie data dynamically ---
//   const pieData = scanStats.nspStats
//     ? [
//         { name: "Normal", value: scanStats.nspStats.Normal },
//         { name: "Suspect", value: scanStats.nspStats.Suspect },
//         { name: "Pathological", value: scanStats.nspStats.Pathological },
//       ]
//     : [];

//   const totalCases = pieData.reduce((sum, item) => sum + item.value, 0);

//   useEffect(() => {
//     // -------------------------------
//     // 🟦 Fetch scan stats (Node.js)
//     // -------------------------------
//     fetch(`${NODE_API}/scans/stats`)
//       .then((res) => res.json())
//       .then((data) => setScanStats(data))
//       .catch((err) => console.error("Node stats error:", err));

//     // -------------------------------
//     // 🟣 Fetch predictions (FastAPI)
//     // -------------------------------
//     fetch(`${FASTAPI}/api/analysis`)
//       .then((res) => res.json())
//       .then((data) => setAnalysisData(data))
//       .catch((err) => console.error("FastAPI analysis error:", err));

//     // -------------------------------
//     // 🟣 Fetch weekly NSP (FastAPI)
//     // (If you have this route)
//     // -------------------------------
//     fetch(`${FASTAPI}/api/analysis/weekly-nsp`)
//       .then((res) => res.json())
//       .then((data) => setWeeklyNSP(data))
//       .catch((err) => console.error("FastAPI weekly NSP error:", err));
//   }, []);

//   // --- Custom Pie Label ---
//   const renderCustomLabel = ({ name, value, percent }) => {
//     if (totalCases === 0) return "";
//     const percentValue = (percent * 100).toFixed(1);
//     return `${name}: ${value} (${percentValue}%)`;
//   };

//   return (
//     <div className="page-content">
//       <h2 className="section-title">Fetal Health Data Analysis</h2>

//       {/* --- Scan Stats --- */}
//       <section className="stats-section">
//         <div className="stats-grid">
//           <div className="stat-card">
//             <h4>Today’s Scans</h4>
//             <p>{scanStats.daily || 0}</p>
//           </div>
//           <div className="stat-card">
//             <h4>This Week</h4>
//             <p>{scanStats.weekly || 0}</p>
//           </div>
//           <div className="stat-card">
//             <h4>This Month</h4>
//             <p>{scanStats.monthly || 0}</p>
//           </div>
//           <div className="stat-card">
//             <h4>This Year</h4>
//             <p>{scanStats.yearly || 0}</p>
//           </div>
//         </div>
//       </section>

//       {/* --- Charts Section --- */}
//       <section className="charts-container">

//         {/* --- Line Chart --- */}
//         <div className="chart-section">
//           <h4>Predictions Over Time</h4>
//           <ResponsiveContainer width="100%" height={350}>
//             <LineChart data={analysisData.predictions}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="N" stroke="#4d79ff" name="Normal (N)" strokeWidth={2} dot={false} />
//               <Line type="monotone" dataKey="S" stroke="#ffcc00" name="Suspect (S)" strokeWidth={2} dot={false} />
//               <Line type="monotone" dataKey="P" stroke="#ff4d4d" name="Pathological (P)" strokeWidth={2} dot={false} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* --- Pie Chart --- */}
//         <div className="chart-section">
//           <h4>Overall Case Distribution</h4>
//           <p style={{ textAlign: "center", marginBottom: "8px" }}>
//             Total Classifications: <strong>{totalCases}</strong>
//           </p>

//           <ResponsiveContainer width="100%" height={350}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={120}
//                 label={renderCustomLabel}
//                 labelLine={false}
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>

//               <Tooltip
//                 formatter={(value, name) => {
//                   const percent = totalCases
//                     ? ((value / totalCases) * 100).toFixed(1)
//                     : 0;
//                   return [`${value} (${percent}%)`, name];
//                 }}
//               />

//               <Legend
//                 layout="vertical"
//                 verticalAlign="top"
//                 align="right"
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* --- Weekly NSP Bar Chart --- */}
//         <div className="chart-section">
//           <h4>Weekly NSP Distribution</h4>
//           <ResponsiveContainer width="100%" height={350}>
//             <BarChart data={weeklyNSP}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="week" />
//               <YAxis />
//               <Tooltip />
//               <Legend verticalAlign="top" align="right" />
//               <Bar dataKey="N" name="Normal" fill="#4d79ff" />
//               <Bar dataKey="S" name="Suspect" fill="#ffcc00" />
//               <Bar dataKey="P" name="Pathological" fill="#ff4d4d" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </section>
//     </div>
//   );
// }
