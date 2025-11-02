import React, { useState, useEffect } from "react";
import {
  Home,
  FileText,
  Settings,
  FileSearch,
  LogOut,
  Eye,
  Download
} from "lucide-react";
import "./css/RecordUI.css";

const RecordUI = () => {
  const [records, setRecords] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [imageModal, setImageModal] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    async function fetchRecords() {
      try {
        const res = await fetch("http://localhost:8000/records/");
        const data = await res.json();
        if (data.success) setRecords(data.records);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRecords();
  }, []);

  const handleEdit = (record) => {
    setEditRowId(record._id);
    setEditData(JSON.parse(JSON.stringify(record)));
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/records/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData.features)
      });
      if (res.ok) {
        setRecords((prev) => prev.map((r) => (r._id === id ? editData : r)));
        setEditRowId(null);
        setEditData({});
        alert("Record updated successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`http://localhost:8000/records/${id}`, { method: "DELETE" });
      if (res.ok) setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (key, value) => {
    setEditData((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: value }
    }));
  };

  const handleDownload = (url) => {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = url.split("/").pop();
        link.click();
      })
      .catch(err => console.error("Download failed:", err));
  };

  const filteredRecords = records
    .filter(
      (rec) =>
        rec._id.includes(searchTerm) ||
        rec.scannedDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.scanTime?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(`${a.scannedDate} ${a.scanTime}`);
      const dateB = new Date(`${b.scannedDate} ${b.scanTime}`);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const allFeatureKeys = Array.from(
    new Set(records.flatMap((r) => Object.keys(r.features || {})))
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section">
          <div className="logo-circle">
            <img src="/logo2.png" alt="Logo" className="logo-img" />
          </div>
        </div>

        <div className="nav-menu">
          <div className="nav-item"><Home /> Home</div>
          <div className="nav-item"><FileText /> Records</div>
          <div className="nav-item"><FileSearch /> Search</div>
          <div className="nav-item"><Settings /> Settings</div>
        </div>

        <div className="logout-section">
          <LogOut /> Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="records-header">
          <h3>CTG Records</h3>
          <input
            type="text"
            placeholder="Search by ID, Date or Time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="records-table-wrapper">
          <table className="records-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Classification</th>
                {allFeatureKeys.map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 && (
                <tr>
                  <td colSpan={8 + allFeatureKeys.length} className="no-records-box">
                    No records found
                  </td>
                </tr>
              )}

              {currentRecords.map((rec, index) => (
                <tr key={rec._id}>
                  {/* Serial Number */}
                  <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>

                  <td>{rec._id}</td>
                  <td>{rec.scannedDate}</td>
                  <td>{rec.scanTime}</td>
                  <td>
                    <span className={`classification-badge ${rec.classification.toLowerCase()}`}>
                      {rec.classification}
                    </span>
                  </td>

                  {allFeatureKeys.map((key) => {
                    const value = rec.features ? rec.features[key] : "";
                    const numericValue = !isNaN(Number(value)) ? Number(value) : "";
                    return editRowId === rec._id ? (
                      <td key={key}>
                        <input
                          type="text"
                          value={editData.features[key] ?? ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                        />
                      </td>
                    ) : (
                      <td key={key}>{numericValue}</td>
                    );
                  })}

                  <td>
                    {rec.imageUrl && (
                      <div className="image-buttons">
                        <button onClick={() => setImageModal(rec.imageUrl)} title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDownload(rec.imageUrl)} title="Download">
                          <Download size={16} />
                        </button>
                      </div>
                    )}
                  </td>

                  <td>
                    {editRowId === rec._id ? (
                      <>
                        <button className="save-btn" onClick={() => handleSave(rec._id)}>Save</button>
                        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => handleEdit(rec)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(rec._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {imageModal && (
        <div className="image-modal" onClick={() => setImageModal(null)}>
          <img src={imageModal} alt="Record" />
        </div>
      )}
    </div>
  );
};

export default RecordUI;
