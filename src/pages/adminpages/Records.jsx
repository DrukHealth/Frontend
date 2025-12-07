// // import { useEffect, useState } from "react";
// // import { Loader2, Trash2, Image as ImageIcon } from "lucide-react";
// // import "./css/RecordUI.css";

// // export default function Records({ darkMode }) {
// //   const [records, setRecords] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [popupImage, setPopupImage] = useState(null);
// //   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);

// //   const recordsPerPage = 5;

// //   // ================================
// //   // 🚀 FASTAPI DEPLOYED BACKEND
// //   // ================================
// //   const fastAPI =
// //     import.meta.env.VITE_FASTAPI_URL ||
// //     "https://fastapi-backend-yrc0.onrender.com";

// //   // Fetch records
// //   useEffect(() => {
// //     const load = async () => {
// //       try {
// //         const res = await fetch(`${fastAPI}/records`);
// //         if (!res.ok) throw new Error("Failed to fetch records");

// //         const data = await res.json();
// //         const raw = data.records || [];

// //         // Keep only valid records
// //         const filtered = raw.filter((r) => {
// //           const hasImage = !!r.imageUrl;
// //           const hasFeatures =
// //             r.features && Object.keys(r.features || {}).length > 0;
// //           return hasImage && hasFeatures;
// //         });

// //         const sorted = filtered.sort(
// //           (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
// //         );

// //         setRecords(sorted);
// //       } catch (e) {
// //         console.error(e);
// //         setError("⚠️ Unable to load CTG records.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     load();
// //   }, [fastAPI]);

// //   // Delete a record
// //   const handleDelete = async (id) => {
// //     if (!id) return;
// //     try {
// //       const res = await fetch(`${fastAPI}/records/${id}`, {
// //         method: "DELETE",
// //       });

// //       if (!res.ok) throw new Error("Delete failed");

// //       setRecords((prev) => prev.filter((r) => r.id !== id));
// //       setCurrentPage(1);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Delete failed");
// //     } finally {
// //       setConfirmDeleteId(null);
// //     }
// //   };

// //   // Pagination logic
// //   const totalPages = Math.ceil(records.length / recordsPerPage);
// //   const startIndex = (currentPage - 1) * recordsPerPage;
// //   const currentRecords = records.slice(
// //     startIndex,
// //     startIndex + recordsPerPage
// //   );

// //   // ================================
// //   // ⭐ Correct Class Label Mapping
// //   // ================================
// //   const getClassName = (label) => {
// //     switch (label) {
// //       case "Reassuring":
// //         return "Reassuring";
// //       case "Non-Reassuring":
// //         return "Non-Reassuring";
// //       case "Abnormal":
// //         return "Abnormal";
// //       default:
// //         return "Reassuring";
// //     }
// //   };

// //   // Loading / error states
// //   if (loading)
// //     return (
// //       <div className="loading-container">
// //         <Loader2 className="spinner" size={32} />
// //         <p>Loading CTG Records...</p>
// //       </div>
// //     );

// //   if (error) return <p className="error">{error}</p>;

// //   if (!records.length)
// //     return <p className="no-records">No CTG scan records found yet.</p>;

// //   return (
// //     <div className={`records-container ${darkMode ? "dark-mode" : ""}`}>
// //       <div className="records-header">
// //         <h2>📊 CTG Scan Records</h2>
// //       </div>

// //       {/* Desktop Table View */}
// //       <div className="table-wrapper">
// //         <table className="records-table">
// //           <thead>
// //             <tr>
// //               <th>#</th>
// //               <th>Timestamp (Bhutan Time)</th>
// //               <th>Detected Class</th>
// //               <th>Image</th>
// //               {records[0]?.features &&
// //                 Object.keys(records[0].features).map((f) => (
// //                   <th key={f}>{f}</th>
// //                 ))}
// //               <th>Actions</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {currentRecords.map((r, i) => (
// //               <tr key={r.id}>
// //                 <td>{startIndex + i + 1}</td>

// //                 <td className="timestamp-cell">
// //   {r.timestamp
// //     ? new Date(r.timestamp).toLocaleString("en-BT", {
// //         timeZone: "Asia/Thimphu",
// //       })
// //     : "N/A"}
// // </td>
// //                 {/* ⭐ Use clientLabel instead of ctgDetected */}
// //                 <td
// //                   className={`label-cell label-${getClassName(
// //                     r.clientLabel
// //                   )}`}
// //                 >
// //                   {r.clientLabel || "N/A"}
// //                 </td>

// //                 <td>
// //                   {r.imageUrl ? (
// //                     <div
// //                       className="thumb-overlay"
// //                       onClick={() => setPopupImage(r.imageUrl)}
// //                     >
// //                       <img
// //                         src={r.imageUrl}
// //                         alt="CTG"
// //                         className="thumb-img"
// //                       />
// //                       <div className="overlay-icon">
// //                         <ImageIcon size={16} />
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="no-thumb">No Image</div>
// //                   )}
// //                 </td>

// //                 {r.features &&
// //                   Object.values(r.features).map((v, j) => (
// //                     <td key={j}>{Number(v).toFixed(2)}</td>
// //                   ))}

// //                 <td>
// //                   <button
// //                     onClick={() => setConfirmDeleteId(r.id)}
// //                     className="delete-btn"
// //                   >
// //                     <Trash2 size={14} /> Delete
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Mobile Card View */}
// //       <div className="records-cards">
// //         {currentRecords.map((r, i) => (
// //           <div key={r.id} className="record-card">
// //             <div className="card-header">
// //               <span className="card-number">#{startIndex + i + 1}</span>
// //               <span className="card-timestamp">
// //                 {new Date(r.timestamp).toLocaleString("en-BT", {
// //                   timeZone: "Asia/Thimphu",
// //                 })}
// //               </span>
// //             </div>

// //             <div className="card-content">
// //               <div className="card-image">
// //                 {r.imageUrl ? (
// //                   <div
// //                     className="thumb-overlay"
// //                     onClick={() => setPopupImage(r.imageUrl)}
// //                   >
// //                     <img
// //                       src={r.imageUrl}
// //                       alt="CTG"
// //                       className="thumb-img"
// //                     />
// //                     <div className="overlay-icon">
// //                       <ImageIcon size={14} />
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <div className="no-thumb">No Image</div>
// //                 )}
// //               </div>

// //               <div className="card-details">
// //                 {/* ⭐ Mobile version uses updated class too */}
// //                 <div className={`card-class ${getClassName(r.clientLabel)}`}>
// //                   {r.clientLabel}
// //                 </div>

// //                 <div className="card-features">
// //                   {r.features &&
// //                     Object.entries(r.features).map(([key, value], index) => (
// //                       <div key={index} className="feature-item">
// //                         <span className="feature-name">{key}:</span>
// //                         <span className="feature-value">
// //                           {Number(value).toFixed(2)}
// //                         </span>
// //                       </div>
// //                     ))}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="card-actions">
// //               <button
// //                 onClick={() => setConfirmDeleteId(r.id)}
// //                 className="delete-btn"
// //               >
// //                 <Trash2 size={14} /> Delete Record
// //               </button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Pagination */}
// //       <div className="pagination">
// //         <button
// //           className="pagination-btn"
// //           onClick={() => setCurrentPage((p) => p - 1)}
// //           disabled={currentPage === 1}
// //         >
// //           Prev
// //         </button>

// //         <span className="pagination-info">
// //           Page {currentPage} of {totalPages}
// //         </span>

// //         <button
// //           className="pagination-btn"
// //           onClick={() => setCurrentPage((p) => p + 1)}
// //           disabled={currentPage === totalPages}
// //         >
// //           Next
// //         </button>
// //       </div>

// //       {/* Delete confirmation */}
// //       {confirmDeleteId && (
// //         <div className="modal-overlay">
// //           <div className="modal-box">
// //             <p>Are you sure you want to delete this record?</p>
// //             <div className="modal-buttons">
// //               <button onClick={() => handleDelete(confirmDeleteId)}>
// //                 Yes, Delete
// //               </button>
// //               <button onClick={() => setConfirmDeleteId(null)}>
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Full image popup */}
// //       {popupImage && (
// //         <div className="image-popup" onClick={() => setPopupImage(null)}>
// //           <span className="close-btn">×</span>
// //           <img src={popupImage} alt="Full CTG" />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }





// import { useEffect, useState } from "react";
// import { Loader2, Trash2, Image as ImageIcon } from "lucide-react";
// import "./css/RecordUI.css";

// export default function Records({ darkMode }) {
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [popupImage, setPopupImage] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const recordsPerPage = 5;

//   const fastAPI =
//     import.meta.env.VITE_FASTAPI_URL ||
//     "https://fastapi-backend-yrc0.onrender.com";

//   // Fetch records
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(`${fastAPI}/records`);
//         if (!res.ok) throw new Error("Failed to fetch records");

//         const data = await res.json();
//         const raw = data.records || [];

//         const filtered = raw.filter((r) => {
//           const hasImage = !!r.imageUrl;
//           const hasFeatures =
//             r.features && Object.keys(r.features || {}).length > 0;
//           return hasImage && hasFeatures;
//         });

//         const sorted = filtered.sort(
//           (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
//         );

//         setRecords(sorted);
//       } catch (e) {
//         console.error(e);
//         setError("⚠️ Unable to load CTG records.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [fastAPI]);

//   const handleDelete = async (id) => {
//     if (!id) return;
//     try {
//       const res = await fetch(`${fastAPI}/records/${id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error("Delete failed");

//       setRecords((prev) => prev.filter((r) => r.id !== id));
//       setCurrentPage(1);
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     } finally {
//       setConfirmDeleteId(null);
//     }
//   };

//   const totalPages = Math.ceil(records.length / recordsPerPage);
//   const startIndex = (currentPage - 1) * recordsPerPage;
//   const currentRecords = records.slice(
//     startIndex,
//     startIndex + recordsPerPage
//   );

//   const getClassName = (label) => {
//     switch (label) {
//       case "Reassuring":
//         return "Reassuring";
//       case "Non-Reassuring":
//         return "Non-Reassuring";
//       case "Abnormal":
//         return "Abnormal";
//       default:
//         return "Reassuring";
//     }
//   };

//   if (loading)
//     return (
//       <div className="loading-container">
//         <Loader2 className="spinner" size={32} />
//         <p>Loading CTG Records...</p>
//       </div>
//     );

//   if (error) return <p className="error">{error}</p>;

//   if (!records.length)
//     return <p className="no-records">No CTG scan records found yet.</p>;

//   return (
//     <div className={`records-container ${darkMode ? "dark-mode" : ""}`}>
//       <div className="records-header">
//         <h2>📊 CTG Scan Records</h2>
//       </div>

//       {/* Desktop Table View */}
//       <div className="table-wrapper">
//         <table className="records-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Timestamp (Bhutan Time)</th>
//               <th>Detected Class</th>
//               <th>Image</th>
//               {records[0]?.features &&
//                 Object.keys(records[0].features).map((f) => (
//                   <th key={f}>{f}</th>
//                 ))}
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentRecords.map((r, i) => (
//               <tr key={r.id}>
//                 <td>{startIndex + i + 1}</td>

//                 <td className="timestamp-cell">
//                   {r.timestamp
//                     ? new Date(r.timestamp).toLocaleString("en-BT", {
//                         timeZone: "Asia/Thimphu",
//                       })
//                     : "N/A"}
//                 </td>

//                 {/* UPDATED: Use r.labelClient */}
//                 <td
//                   className={`label-cell label-${getClassName(
//                     r.labelClient
//                   )}`}
//                 >
//                   {r.labelClient || "N/A"}
//                 </td>

//                 <td>
//                   {r.imageUrl ? (
//                     <div
//                       className="thumb-overlay"
//                       onClick={() => setPopupImage(r.imageUrl)}
//                     >
//                       <img
//                         src={r.imageUrl}
//                         alt="CTG"
//                         className="thumb-img"
//                       />
//                       <div className="overlay-icon">
//                         <ImageIcon size={16} />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="no-thumb">No Image</div>
//                   )}
//                 </td>

//                 {r.features &&
//                   Object.values(r.features).map((v, j) => (
//                     <td key={j}>{Number(v).toFixed(2)}</td>
//                   ))}

//                 <td>
//                   <button
//                     onClick={() => setConfirmDeleteId(r.id)}
//                     className="delete-btn"
//                   >
//                     <Trash2 size={14} /> Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="records-cards">
//         {currentRecords.map((r, i) => (
//           <div key={r.id} className="record-card">
//             <div className="card-header">
//               <span className="card-number">#{startIndex + i + 1}</span>
//               <span className="card-timestamp">
//                 {new Date(r.timestamp).toLocaleString("en-BT", {
//                   timeZone: "Asia/Thimphu",
//                 })}
//               </span>
//             </div>

//             <div className="card-content">
//               <div className="card-image">
//                 {r.imageUrl ? (
//                   <div
//                     className="thumb-overlay"
//                     onClick={() => setPopupImage(r.imageUrl)}
//                   >
//                     <img
//                       src={r.imageUrl}
//                       alt="CTG"
//                       className="thumb-img"
//                     />
//                     <div className="overlay-icon">
//                       <ImageIcon size={14} />
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="no-thumb">No Image</div>
//                 )}
//               </div>

//               <div className="card-details">
//                 {/* UPDATED: Use r.labelClient */}
//                 <div
//                   className={`card-class ${getClassName(r.labelClient)}`}
//                 >
//                   {r.labelClient || "N/A"}
//                 </div>

//                 <div className="card-features">
//                   {r.features &&
//                     Object.entries(r.features).map(([key, value], index) => (
//                       <div key={index} className="feature-item">
//                         <span className="feature-name">{key}:</span>
//                         <span className="feature-value">
//                           {Number(value).toFixed(2)}
//                         </span>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>

//             <div className="card-actions">
//               <button
//                 onClick={() => setConfirmDeleteId(r.id)}
//                 className="delete-btn"
//               >
//                 <Trash2 size={14} /> Delete Record
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="pagination">
//         <button
//           className="pagination-btn"
//           onClick={() => setCurrentPage((p) => p - 1)}
//           disabled={currentPage === 1}
//         >
//           Prev
//         </button>

//         <span className="pagination-info">
//           Page {currentPage} of {totalPages}
//         </span>

//         <button
//           className="pagination-btn"
//           onClick={() => setCurrentPage((p) => p + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>

//       {/* Delete popup */}
//       {confirmDeleteId && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <p>Are you sure you want to delete this record?</p>
//             <div className="modal-buttons">
//               <button onClick={() => handleDelete(confirmDeleteId)}>
//                 Yes, Delete
//               </button>
//               <button onClick={() => setConfirmDeleteId(null)}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Image popup */}
//       {popupImage && (
//         <div className="image-popup" onClick={() => setPopupImage(null)}>
//           <span className="close-btn">×</span>
//           <img src={popupImage} alt="Full CTG" />
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { Loader2, Trash2, Image as ImageIcon } from "lucide-react";
import "./css/RecordUI.css";

export default function Records({ darkMode }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popupImage, setPopupImage] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  // Sorting state
  const [sortOrder, setSortOrder] = useState("newest");

  const recordsPerPage = 5;

  // const fastAPI =
  //   import.meta.env.VITE_FASTAPI_URL ||
  //   "https://fastapi-backend-yrc0.onrender.com";


  const fastAPI=
    import.meta.env.VITE_FASTAPI_URL ||
    "http://127.0.0.1:9000";
  // Sorting function
  const sortRecords = (data, order) => {
    return [...data].sort((a, b) => {
      const tA = new Date(a.timestamp);
      const tB = new Date(b.timestamp);
      return order === "newest" ? tB - tA : tA - tB;
    });
  };

  // Fetch records
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${fastAPI}/records`);
        if (!res.ok) throw new Error("Failed to fetch records");

        const data = await res.json();
        const raw = data.records || [];

        const filtered = raw.filter((r) => {
          const hasImage = !!r.imageUrl;
          const hasFeatures =
            r.features && Object.keys(r.features || {}).length > 0;
          return hasImage && hasFeatures;
        });

        const sorted = sortRecords(filtered, sortOrder);
        setRecords(sorted);
      } catch (e) {
        console.error(e);
        setError("⚠ Unable to load CTG records.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fastAPI, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = records.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // Toggle single selection
  const toggleSelectRecord = (id) => {
    setSelectedRecords((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((r) => r !== id)
        : [...prev, id];

      // Update allSelected correctly
      setAllSelected(newSelected.length === records.length);

      return newSelected;
    });
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRecords([]);
      setAllSelected(false);
    } else {
      const allIds = records.map((r) => r.id);
      setSelectedRecords(allIds);
      setAllSelected(true);
    }
  };

  // Delete single
  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`${fastAPI}/records/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      setRecords((prev) => prev.filter((r) => r.id !== id));
      setSelectedRecords((prev) => prev.filter((r) => r !== id));
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRecords.map(async (id) => {
          const res = await fetch(`${fastAPI}/records/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error(`Failed to delete record ${id}`);
        })
      );

      setRecords((prev) => prev.filter((r) => !selectedRecords.includes(r.id)));
      setSelectedRecords([]);
      setAllSelected(false);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert("Bulk delete failed");
    } finally {
      setConfirmBulkDelete(false);
    }
  };

  // Class styling
  const getClassName = (label) => {
    switch (label) {
      case "Reassuring":
        return "Reassuring";
      case "Non-Reassuring":
        return "Non-Reassuring";
      case "Abnormal":
        return "Abnormal";
      default:
        return "Reassuring";
    }
  };

  // UI States
  if (loading)
    return (
      <div className="loading-container">
        <Loader2 className="spinner" size={32} />
        <p>Loading CTG Records...</p>
      </div>
    );

  if (error) return <p className="error">{error}</p>;
  if (!records.length)
    return <p className="no-records">No CTG scan records found yet.</p>;

  return (
    <div className={`records-container ${darkMode ? "dark-mode" : ""}`}>
      <h2>📊 CTG Scan Records</h2>

      <div className="records-header-flex">
        <div className="header-left">
          <p>Sort Options:</p>
          {/* Sorting Dropdown */}
          <select
            className="sort-dropdown"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="header-right">
          <button onClick={toggleSelectAll}>
            {allSelected ? "Unselect All" : "Select All"}
          </button>
          {selectedRecords.length > 0 && (
            <button
              className="bulk-delete-btn"
              onClick={() => setConfirmBulkDelete(true)}
            >
              <Trash2 size={14} /> Delete Selected ({selectedRecords.length})
            </button>
          )}
        </div>
      </div>

      {/* TABLE VIEW */}
      <div className="table-wrapper">
        <table className="records-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Timestamp</th>
              <th>Detected Class</th>
              <th>Image</th>
              {records[0]?.features &&
                Object.keys(records[0].features).map((f) => (
                  <th key={f}>{f}</th>
                ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((r, i) => (
              <tr
                key={r.id}
                className={selectedRecords.includes(r.id) ? "selected-row" : ""}
              >
                <td>{startIndex + i + 1}</td>

                <td className="timestamp-cell">
                  {new Date(r.timestamp).toLocaleString("en-BT", {
                    timeZone: "Asia/Thimphu",
                  })}
                </td>

                <td
                  className={`label-cell label-${getClassName(
                    r.labelClient
                  )}`}
                >
                  {r.labelClient}
                </td>

                <td>
                  {r.imageUrl ? (
                    <div
                      className="thumb-overlay"
                      onClick={() => setPopupImage(r.imageUrl)}
                    >
                      <img src={r.imageUrl} className="thumb-img" />
                      <div className="overlay-icon">
                        <ImageIcon size={16} />
                      </div>
                    </div>
                  ) : (
                    "No Image"
                  )}
                </td>

                {r.features &&
                  Object.values(r.features).map((v, j) => (
                    <td key={j}>{Number(v).toFixed(2)}</td>
                  ))}

                <td>
                  <div className="action-checkbox">
                    <button
                      onClick={() => setConfirmDeleteId(r.id)}
                      className="delete-btn"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                    {allSelected && (
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(r.id)}
                        onChange={() => toggleSelectRecord(r.id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="records-cards">
        {currentRecords.map((r, i) => (
          <div
            key={r.id}
            className={`record-card ${
              selectedRecords.includes(r.id) ? "selected-card" : ""
            }`}
          >
            <div className="card-select">
              {allSelected && (
                <input
                  type="checkbox"
                  checked={selectedRecords.includes(r.id)}
                  onChange={() => toggleSelectRecord(r.id)}
                />
              )}
            </div>

            <div className="card-header">
              <span className="card-number">#{startIndex + i + 1}</span>
              <span className="card-timestamp">
                {new Date(r.timestamp).toLocaleString("en-BT", {
                  timeZone: "Asia/Thimphu",
                })}
              </span>
            </div>

            <div className="card-content">
              <div className="card-image">
                <div
                  className="thumb-overlay"
                  onClick={() => setPopupImage(r.imageUrl)}
                >
                  <img src={r.imageUrl} className="thumb-img" />
                  <div className="overlay-icon">
                    <ImageIcon size={14} />
                  </div>
                </div>
              </div>

              <div className="card-details">
                <div className={`card-class ${getClassName(r.labelClient)}`}>
                  {r.labelClient}
                </div>

                <div className="card-features">
                  {r.features &&
                    Object.entries(r.features).map(([key, val], idx) => (
                      <div key={idx} className="feature-item">
                        <span>{key}:</span>
                        <span>{Number(val).toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button
                onClick={() => setConfirmDeleteId(r.id)}
                className="delete-btn"
              >
                <Trash2 size={14} /> Delete Record
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* MODALS */}
      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to delete this record?</p>
            <div className="modal-buttons">
              <button onClick={() => handleDelete(confirmDeleteId)}>
                Yes, Delete
              </button>
              <button onClick={() => setConfirmDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmBulkDelete && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Delete {selectedRecords.length} selected records?</p>
            <div className="modal-buttons">
              <button onClick={handleBulkDelete}>Yes, Delete</button>
              <button onClick={() => setConfirmBulkDelete(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP IMAGE */}
      {popupImage && (
        <div className="image-popup" onClick={() => setPopupImage(null)}>
          <span className="close-btn">×</span>
          <img src={popupImage} alt="Full CTG" />
        </div>
      )}
    </div>
  );
}
