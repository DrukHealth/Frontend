import React, { useState } from "react";
import { Home, FileText, Settings, FileSearch, User, LogOut } from "lucide-react";
import "./css/RecordUI.css";

const RecordUI = () => {
  const initialRecords = [
    { id: 1, date: "2024-11-10", fhr: "140 bpm", uc: "Normal", acc: "Yes", dec: "No", var: "Moderate", classification: "Normal" },
    { id: 2, date: "2024-11-08", fhr: "135 bpm", uc: "Mild", acc: "No", dec: "Yes", var: "Low", classification: "Suspect" },
    { id: 3, date: "2024-10-23", fhr: "148 bpm", uc: "Normal", acc: "Yes", dec: "No", var: "High", classification: "Normal" },
    { id: 4, date: "2024-10-01", fhr: "130 bpm", uc: "Low", acc: "No", dec: "Yes", var: "Low", classification: "Pathological" },
    { id: 5, date: "2024-11-12", fhr: "145 bpm", uc: "Normal", acc: "Yes", dec: "No", var: "Moderate", classification: "Normal" },
    { id: 6, date: "2024-11-13", fhr: "138 bpm", uc: "Mild", acc: "No", dec: "Yes", var: "Low", classification: "Normal" },
    { id: 7, date: "2024-11-14", fhr: "142 bpm", uc: "Normal", acc: "Yes", dec: "No", var: "High", classification: "Normal" },
  ];

  const [records, setRecords] = useState(initialRecords);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const recordsPerPage = 3;

  const sortedRecords = [...records].sort((a, b) =>
    sortOrder === "newest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
  );

  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);

  const currentRecords = sortedRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const newRecords = records.filter(rec => rec.id !== id);
      setRecords(newRecords);
      const newTotalPages = Math.ceil(newRecords.length / recordsPerPage);
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-circle">
               <img src="./logo.png" alt="YOLO Logo" className="logo-img" />
          </div>
        </div>
        <nav className="nav-menu">
          <div className="nav-item"><Home size={20} /> Home</div>
          <div className="nav-item"><FileText size={20} /> Records</div>
          <div className="nav-item"><FileSearch size={20} /> Search</div>
          <div className="nav-item"><User size={20} /> Profile</div>
          <div className="nav-item"><Settings size={20} /> Settings</div>
        </nav>
        <div className="logout-section">
          <LogOut size={20} /> Logout
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="records-container">
          <div className="records-header">
            <h3>Patient Records</h3>
            <select
              className="sort-dropdown"
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
            >
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
            </select>
          </div>

          <table className="records-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Scanned Date</th>
                <th>FHR</th>
                <th>UC</th>
                <th>Acceleration</th>
                <th>Deceleration</th>
                <th>Variability</th>
                <th>Classification</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.id}</td>
                  <td>{rec.date}</td>
                  <td>{rec.fhr}</td>
                  <td>{rec.uc}</td>
                  <td>{rec.acc}</td>
                  <td>{rec.dec}</td>
                  <td>{rec.var}</td>
                  <td>{rec.classification}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(rec.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination with arrows */}
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &laquo; Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                className={`page-btn ${num === currentPage ? "active" : ""}`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecordUI;
