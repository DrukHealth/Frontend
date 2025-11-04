import { useEffect, useState } from "react";
import "./css/RecordUI.css";

export default function Records({ darkMode }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch("http://localhost:8000/records");
        const data = await res.json();
        setRecords(data.records);
      } catch (err) {
        console.error("Failed to fetch records:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) return <p>Loading records...</p>;
  if (!records.length) return <p>No records found yet.</p>;

  return (
    <div className={`records-container ${darkMode ? "dark-mode" : ""}`}>
      <h2>CTG Scan Records</h2>
      <div className="table-wrapper">
        <table className="records-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Label</th>
              {/* Dynamically get all feature names from the first record */}
              {Object.keys(records[0].features).map((feature) => (
                <th key={feature}>{feature}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((rec, idx) => (
              <tr key={idx}>
                <td>{new Date(rec.timestamp).toLocaleString()}</td>
                <td>{rec.label}</td>
                {Object.values(rec.features).map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
