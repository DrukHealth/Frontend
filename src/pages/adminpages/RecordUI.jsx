import React, { useState, useEffect } from 'react';
import './css/RecordUI.css';
import { FaHome, FaFileAlt, FaCog, FaSignOutAlt, FaUserCircle, FaListUl } from 'react-icons/fa';

const RecordsUI = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsData, setRecordsData] = useState([]);

  const initialRecords = [
    { id: 1, date: '2025-09-11', hr: 150, uc: 13, acceleration: 8, deceleration: 6, variability: 15.3, classification: 'Normal' },
    { id: 2, date: '2025-09-11', hr: 140, uc: 10, acceleration: 6, deceleration: 4, variability: 12.3, classification: 'Normal' },
    { id: 3, date: '2025-09-10', hr: 160, uc: 15, acceleration: 9, deceleration: 7, variability: 18.1, classification: 'Normal' },
    { id: 4, date: '2025-09-09', hr: 155, uc: 12, acceleration: 7, deceleration: 5, variability: 14.5, classification: 'Normal' },
    { id: 5, date: '2025-09-08', hr: 148, uc: 11, acceleration: 8, deceleration: 6, variability: 13.2, classification: 'Normal' },
    { id: 6, date: '2025-09-07', hr: 152, uc: 14, acceleration: 7, deceleration: 5, variability: 16.0, classification: 'Normal' },
    { id: 7, date: '2025-09-06', hr: 147, uc: 12, acceleration: 6, deceleration: 4, variability: 12.9, classification: 'Normal' },
    { id: 8, date: '2025-09-05', hr: 149, uc: 13, acceleration: 8, deceleration: 6, variability: 14.8, classification: 'Normal' },
  ];

  useEffect(() => {
    setRecordsData(initialRecords);
  }, []);

  const sortRecords = (records, sortType) => {
    const sorted = [...records];
    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'hrHigh':
        return sorted.sort((a, b) => b.hr - a.hr);
      case 'hrLow':
        return sorted.sort((a, b) => a.hr - b.hr);
      default:
        return sorted;
    }
  };

  const recordsPerPage = 4;
  const sortedRecords = sortRecords(recordsData, sortBy);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(recordsData.length / recordsPerPage);

  const handleDelete = (id) => {
    setRecordsData(prev => prev.filter(record => record.id !== id));
    if ((currentPage - 1) * recordsPerPage >= recordsData.length - 1) {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    }
  };

  return (
    <div className="records-container-full">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/2.png" alt="App Logo" />
        </div>

        <nav className="nav">
          <button className="nav-item"><FaHome /><span>Home</span></button>
          <button className="nav-item active"><FaFileAlt /><span>Records</span></button>
          <button className="nav-item"><FaCog /><span>Management</span></button>
          <button className="nav-item"><FaListUl /><span>Record Log</span></button>
        </nav>

        <div className="logout-container">
          <button className="logout-btn"><FaSignOutAlt /><span>Log Out</span></button>
        </div>
      </aside>

      {/* Main Section */}
      <main className="main-section">
        <header className="header">
          <div className="admin-area">
            <span className="admin-text">Admin</span>
            <div className="admin-avatar"><FaUserCircle /></div>
          </div>
        </header>

        <section className="records-section">
          <div className="records-header">
            <h2>Records</h2>
            <div className="sort-section">
              <span>Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="hrHigh">HR (High → Low)</option>
                <option value="hrLow">HR (Low → High)</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>HR</th>
                  <th>UC</th>
                  <th>Acceleration</th>
                  <th>Deceleration</th>
                  <th>Variability</th>
                  <th>Classification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.hr}</td>
                    <td>{record.uc}</td>
                    <td>{record.acceleration}</td>
                    <td>{record.deceleration}</td>
                    <td>{record.variability}</td>
                    <td>{record.classification}</td>
                    <td>
                      <button onClick={() => handleDelete(record.id)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span>Showing {indexOfFirst + 1}-{Math.min(indexOfLast, recordsData.length)} of {recordsData.length}</span>
            <div className="page-buttons">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>&lt;</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>&gt;</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RecordsUI;
