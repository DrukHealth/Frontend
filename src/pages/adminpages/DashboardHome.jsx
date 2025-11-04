import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, ResponsiveContainer
} from "recharts";

const COLORS = ["#4d79ff", "#ffcc00", "#ff4d4d"]; // Normal, Suspect, Pathological

export default function Dashboard() {
  const [scanStats, setScanStats] = useState({});
  const [analysisData, setAnalysisData] = useState({ predictions: [] });
  const [weeklyNSP, setWeeklyNSP] = useState([]);
  
  const pieData = scanStats.nspStats
    ? [
        { name: "Normal", value: scanStats.nspStats.Normal },
        { name: "Suspect", value: scanStats.nspStats.Suspect },
        { name: "Pathological", value: scanStats.nspStats.Pathological },
      ]
    : [];

  useEffect(() => {
    // Fetch scan stats
    fetch("http://localhost:8000/api/scans/stats")
      .then(res => res.json())
      .then(data => setScanStats(data))
      .catch(err => console.error(err));

    // Fetch line chart predictions
    fetch("http://localhost:8000/api/analysis")
      .then(res => res.json())
      .then(data => setAnalysisData(data))
      .catch(err => console.error(err));

    // Fetch weekly NSP distribution
    fetch("http://localhost:8000/api/analysis/weekly-nsp")
      .then(res => res.json())
      .then(data => setWeeklyNSP(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-content">
      <h2 className="section-title">Fetal Health Data Analysis</h2>

      {/* Scan Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card"><h4>Today’s Scans</h4><p>{scanStats.daily}</p></div>
          <div className="stat-card"><h4>This Week</h4><p>{scanStats.weekly}</p></div>
          <div className="stat-card"><h4>This Month</h4><p>{scanStats.monthly}</p></div>
          <div className="stat-card"><h4>This Year</h4><p>{scanStats.yearly}</p></div>
        </div>
      </section>

      {/* Charts */}
      <section className="charts-container">

        {/* Line Chart */}
        <div className="chart-section">
          <h4>Predictions Over Time</h4>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={analysisData.predictions}>
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

        {/* Pie Chart */}
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
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" verticalAlign="top" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly NSP Bar Chart */}
        <div className="chart-section">
          <h4>Weekly NSP Distribution</h4>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyNSP}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="N" name="Normal" fill="#4d79ff" />
              <Bar dataKey="S" name="Suspect" fill="#ffcc00" />
              <Bar dataKey="P" name="Pathological" fill="#ff4d4d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </section>
    </div>
  );
}
