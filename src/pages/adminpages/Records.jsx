// import { useEffect, useState } from "react";
// import { Loader2, Trash2, Image as ImageIcon } from "lucide-react";
// import "./css/RecordUI.css";

// export default function Records({ darkMode }) {
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [popupImage, setPopupImage] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRecords, setSelectedRecords] = useState([]);
//   const [allSelected, setAllSelected] = useState(false);

//   // Sorting state
//   const [sortOrder, setSortOrder] = useState("newest");

//   const recordsPerPage = 5;

//   // const fastAPI =
//   //   import.meta.env.VITE_FASTAPI_URL ||
//   //   "https://fastapi-backend-yrc0.onrender.com";


//   const fastAPI=
//     import.meta.env.VITE_FASTAPI_URL ||
//     "http://127.0.0.1:9000";
//   // Sorting function
//   const sortRecords = (data, order) => {
//     return [...data].sort((a, b) => {
//       const tA = new Date(a.timestamp);
//       const tB = new Date(b.timestamp);
//       return order === "newest" ? tB - tA : tA - tB;
//     });
//   };

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

//         const sorted = sortRecords(filtered, sortOrder);
//         setRecords(sorted);
//       } catch (e) {
//         console.error(e);
//         setError("⚠ Unable to load CTG records.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [fastAPI, sortOrder]);

//   // Pagination
//   const totalPages = Math.ceil(records.length / recordsPerPage);
//   const startIndex = (currentPage - 1) * recordsPerPage;
//   const currentRecords = records.slice(
//     startIndex,
//     startIndex + recordsPerPage
//   );

//   // Toggle single selection
//   const toggleSelectRecord = (id) => {
//     setSelectedRecords((prev) => {
//       const newSelected = prev.includes(id)
//         ? prev.filter((r) => r !== id)
//         : [...prev, id];

//       // Update allSelected correctly
//       setAllSelected(newSelected.length === records.length);

//       return newSelected;
//     });
//   };

//   // Toggle select all
//   const toggleSelectAll = () => {
//     if (allSelected) {
//       setSelectedRecords([]);
//       setAllSelected(false);
//     } else {
//       const allIds = records.map((r) => r.id);
//       setSelectedRecords(allIds);
//       setAllSelected(true);
//     }
//   };

//   // Delete single
//   const handleDelete = async (id) => {
//     if (!id) return;
//     try {
//       const res = await fetch(`${fastAPI}/records/${id}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Delete failed");

//       setRecords((prev) => prev.filter((r) => r.id !== id));
//       setSelectedRecords((prev) => prev.filter((r) => r !== id));
//       setCurrentPage(1);
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     } finally {
//       setConfirmDeleteId(null);
//     }
//   };

//   // Bulk delete
//   const handleBulkDelete = async () => {
//     try {
//       await Promise.all(
//         selectedRecords.map(async (id) => {
//           const res = await fetch(`${fastAPI}/records/${id}`, {
//             method: "DELETE",
//           });
//           if (!res.ok) throw new Error(`Failed to delete record ${id}`);
//         })
//       );

//       setRecords((prev) => prev.filter((r) => !selectedRecords.includes(r.id)));
//       setSelectedRecords([]);
//       setAllSelected(false);
//       setCurrentPage(1);
//     } catch (err) {
//       console.error(err);
//       alert("Bulk delete failed");
//     } finally {
//       setConfirmBulkDelete(false);
//     }
//   };

//   // Class styling
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

//   // UI States
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
//       <h2>📊 CTG Scan Records</h2>

//       <div className="records-header-flex">
//         <div className="header-left">
//           <p>Sort Options:</p>
//           {/* Sorting Dropdown */}
//           <select
//             className="sort-dropdown"
//             value={sortOrder}
//             onChange={(e) => {
//               setSortOrder(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="newest">Newest First</option>
//             <option value="oldest">Oldest First</option>
//           </select>
//         </div>

//         <div className="header-right">
//           <button onClick={toggleSelectAll}>
//             {allSelected ? "Unselect All" : "Select All"}
//           </button>
//           {selectedRecords.length > 0 && (
//             <button
//               className="bulk-delete-btn"
//               onClick={() => setConfirmBulkDelete(true)}
//             >
//               <Trash2 size={14} /> Delete Selected ({selectedRecords.length})
//             </button>
//           )}
//         </div>
//       </div>

//       {/* TABLE VIEW */}
//       <div className="table-wrapper">
//         <table className="records-table">
//           <thead>
//             <tr>
//               <th>Sl. No.</th>
//               <th>Timestamp</th>
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
//               <tr
//                 key={r.id}
//                 className={selectedRecords.includes(r.id) ? "selected-row" : ""}
//               >
//                 <td>{startIndex + i + 1}</td>

//                 <td className="timestamp-cell">
//                   {new Date(r.timestamp).toLocaleString("en-BT", {
//                     timeZone: "Asia/Thimphu",
//                   })}
//                 </td>

//                 <td
//                   className={`label-cell label-${getClassName(
//                     r.labelClient
//                   )}`}
//                 >
//                   {r.labelClient}
//                 </td>

//                 <td>
//                   {r.imageUrl ? (
//                     <div
//                       className="thumb-overlay"
//                       onClick={() => setPopupImage(r.imageUrl)}
//                     >
//                       <img src={r.imageUrl} className="thumb-img" />
//                       <div className="overlay-icon">
//                         <ImageIcon size={16} />
//                       </div>
//                     </div>
//                   ) : (
//                     "No Image"
//                   )}
//                 </td>

//                 {r.features &&
//                   Object.values(r.features).map((v, j) => (
//                     <td key={j}>{Number(v).toFixed(2)}</td>
//                   ))}

//                 <td>
//                   <div className="action-checkbox">
//                     <button
//                       onClick={() => setConfirmDeleteId(r.id)}
//                       className="delete-btn"
//                     >
//                       <Trash2 size={14} /> Delete
//                     </button>
//                     {allSelected && (
//                       <input
//                         type="checkbox"
//                         checked={selectedRecords.includes(r.id)}
//                         onChange={() => toggleSelectRecord(r.id)}
//                       />
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* MOBILE CARDS */}
//       <div className="records-cards">
//         {currentRecords.map((r, i) => (
//           <div
//             key={r.id}
//             className={`record-card ${
//               selectedRecords.includes(r.id) ? "selected-card" : ""
//             }`}
//           >
//             <div className="card-select">
//               {allSelected && (
//                 <input
//                   type="checkbox"
//                   checked={selectedRecords.includes(r.id)}
//                   onChange={() => toggleSelectRecord(r.id)}
//                 />
//               )}
//             </div>

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
//                 <div
//                   className="thumb-overlay"
//                   onClick={() => setPopupImage(r.imageUrl)}
//                 >
//                   <img src={r.imageUrl} className="thumb-img" />
//                   <div className="overlay-icon">
//                     <ImageIcon size={14} />
//                   </div>
//                 </div>
//               </div>

//               <div className="card-details">
//                 <div className={`card-class ${getClassName(r.labelClient)}`}>
//                   {r.labelClient}
//                 </div>

//                 <div className="card-features">
//                   {r.features &&
//                     Object.entries(r.features).map(([key, val], idx) => (
//                       <div key={idx} className="feature-item">
//                         <span>{key}:</span>
//                         <span>{Number(val).toFixed(2)}</span>
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

//       {/* PAGINATION */}
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

//       {/* MODALS */}
//       {confirmDeleteId && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <p>Are you sure you want to delete this record?</p>
//             <div className="modal-buttons">
//               <button onClick={() => handleDelete(confirmDeleteId)}>
//                 Yes, Delete
//               </button>
//               <button onClick={() => setConfirmDeleteId(null)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {confirmBulkDelete && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <p>Delete {selectedRecords.length} selected records?</p>
//             <div className="modal-buttons">
//               <button onClick={handleBulkDelete}>Yes, Delete</button>
//               <button onClick={() => setConfirmBulkDelete(false)}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* POPUP IMAGE */}
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
import {
  Loader2,
  Trash2,
  Image as ImageIcon,
  Pencil,
  Save,
  X,
} from "lucide-react";
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

  const [sortOrder, setSortOrder] = useState("newest");

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    labelClient: "",
    features: {},
  });
  const [savingEditId, setSavingEditId] = useState(null);

  const recordsPerPage = 5;

  const fastAPI =
    import.meta.env.VITE_FASTAPI_URL || "http://127.0.0.1:9000";

  // These labels match your backend server.py
  const classOptions = ["Normal", "Suspicious", "Pathological"];

  const sortRecords = (data, order) => {
    return [...data].sort((a, b) => {
      const tA = new Date(a.timestamp);
      const tB = new Date(b.timestamp);
      return order === "newest" ? tB - tA : tA - tB;
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

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

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = records.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const toggleSelectRecord = (id) => {
    setSelectedRecords((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((r) => r !== id)
        : [...prev, id];

      setAllSelected(newSelected.length === records.length);
      return newSelected;
    });
  };

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

  const handleStartEdit = (record) => {
    setEditingId(record.id);
    setEditForm({
      labelClient: record.labelClient || "Normal",
      features: { ...(record.features || {}) },
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      labelClient: "",
      features: {},
    });
  };

  const handleEditLabelChange = (value) => {
    setEditForm((prev) => ({
      ...prev,
      labelClient: value,
    }));
  };

  const handleEditFeatureChange = (key, value) => {
    setEditForm((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: value,
      },
    }));
  };

  const handleSaveEdit = async (id) => {
    if (!id) return;

    try {
      setSavingEditId(id);

      const cleanedFeatures = {};

      Object.entries(editForm.features || {}).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          cleanedFeatures[key] = null;
        } else {
          const numericValue = Number(value);
          cleanedFeatures[key] = Number.isNaN(numericValue)
            ? value
            : numericValue;
        }
      });

      const payload = {
        labelClient: editForm.labelClient,
        features: cleanedFeatures,
      };

      const res = await fetch(`${fastAPI}/records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || "Update failed");
      }

      const updatedData = await res.json();

      setRecords((prev) => {
        const updatedRecords = prev.map((record) => {
          if (record.id !== id) return record;

          return {
            ...record,
            ...updatedData.record,
            labelClient:
              updatedData.record?.labelClient || payload.labelClient,
            features: updatedData.record?.features || payload.features,
            interpretation:
              updatedData.record?.interpretation || record.interpretation,
          };
        });

        return sortRecords(updatedRecords, sortOrder);
      });

      handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update record.");
    } finally {
      setSavingEditId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`${fastAPI}/records/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setRecords((prev) => prev.filter((r) => r.id !== id));
      setSelectedRecords((prev) => prev.filter((r) => r !== id));

      if (editingId === id) {
        handleCancelEdit();
      }

      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setConfirmDeleteId(null);
    }
  };

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

      if (selectedRecords.includes(editingId)) {
        handleCancelEdit();
      }

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

  // Map backend labels to your existing CSS color classes
  const getClassName = (label) => {
    switch (label) {
      case "Normal":
        return "Reassuring";
      case "Suspicious":
        return "Non-Reassuring";
      case "Pathological":
        return "Abnormal";
      default:
        return "Reassuring";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner" size={32} />
        <p>Loading CTG Records...</p>
      </div>
    );
  }

  if (error) return <p className="error">{error}</p>;

  if (!records.length) {
    return <p className="no-records">No CTG scan records found yet.</p>;
  }

  return (
    <div className={`records-container ${darkMode ? "dark-mode" : ""}`}>
      <h2>📊 CTG Scan Records</h2>

      <div className="records-header-flex">
        <div className="header-left">
          <p>Sort Options:</p>

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
            {currentRecords.map((r, i) => {
              const isEditing = editingId === r.id;

              return (
                <tr
                  key={r.id}
                  className={
                    selectedRecords.includes(r.id) ? "selected-row" : ""
                  }
                >
                  <td>{startIndex + i + 1}</td>

                  <td className="timestamp-cell">
                    {new Date(r.timestamp).toLocaleString("en-BT", {
                      timeZone: "Asia/Thimphu",
                    })}
                  </td>

                  <td
                    className={`label-cell label-${getClassName(
                      isEditing ? editForm.labelClient : r.labelClient
                    )}`}
                  >
                    {isEditing ? (
                      <select
                        className="edit-select"
                        value={editForm.labelClient}
                        onChange={(e) =>
                          handleEditLabelChange(e.target.value)
                        }
                      >
                        {classOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      r.labelClient
                    )}
                  </td>

                  <td>
                    {r.imageUrl ? (
                      <div
                        className="thumb-overlay"
                        onClick={() => setPopupImage(r.imageUrl)}
                      >
                        <img
                          src={r.imageUrl}
                          className="thumb-img"
                          alt="CTG Record"
                        />
                        <div className="overlay-icon">
                          <ImageIcon size={16} />
                        </div>
                      </div>
                    ) : (
                      "No Image"
                    )}
                  </td>

                  {r.features &&
                    Object.entries(r.features).map(([key, value]) => (
                      <td key={key}>
                        {isEditing ? (
                          <input
                            className="edit-input"
                            type="number"
                            step="0.01"
                            value={editForm.features?.[key] ?? ""}
                            onChange={(e) =>
                              handleEditFeatureChange(key, e.target.value)
                            }
                          />
                        ) : value === null || value === undefined ? (
                          "-"
                        ) : (
                          Number(value).toFixed(2)
                        )}
                      </td>
                    ))}

                  <td>
                    <div className="action-checkbox">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(r.id)}
                            className="save-btn"
                            disabled={savingEditId === r.id}
                          >
                            <Save size={14} />
                            {savingEditId === r.id ? "Saving..." : "Save"}
                          </button>

                          <button
                            onClick={handleCancelEdit}
                            className="cancel-btn"
                            disabled={savingEditId === r.id}
                          >
                            <X size={14} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(r)}
                            className="edit-btn"
                          >
                            <Pencil size={14} /> Edit
                          </button>

                          <button
                            onClick={() => setConfirmDeleteId(r.id)}
                            className="delete-btn"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </>
                      )}

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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="records-cards">
        {currentRecords.map((r, i) => {
          const isEditing = editingId === r.id;

          return (
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
                    <img
                      src={r.imageUrl}
                      className="thumb-img"
                      alt="CTG Record"
                    />
                    <div className="overlay-icon">
                      <ImageIcon size={14} />
                    </div>
                  </div>
                </div>

                <div className="card-details">
                  {isEditing ? (
                    <select
                      className="edit-select mobile-edit-select"
                      value={editForm.labelClient}
                      onChange={(e) => handleEditLabelChange(e.target.value)}
                    >
                      {classOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={`card-class ${getClassName(r.labelClient)}`}>
                      {r.labelClient}
                    </div>
                  )}

                  <div className="card-features">
                    {r.features &&
                      Object.entries(r.features).map(([key, val], idx) => (
                        <div key={idx} className="feature-item">
                          <span>{key}:</span>

                          {isEditing ? (
                            <input
                              className="edit-input mobile-edit-input"
                              type="number"
                              step="0.01"
                              value={editForm.features?.[key] ?? ""}
                              onChange={(e) =>
                                handleEditFeatureChange(key, e.target.value)
                              }
                            />
                          ) : (
                            <span>
                              {val === null || val === undefined
                                ? "-"
                                : Number(val).toFixed(2)}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="card-actions">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(r.id)}
                      className="save-btn"
                      disabled={savingEditId === r.id}
                    >
                      <Save size={14} />
                      {savingEditId === r.id ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      className="cancel-btn"
                      disabled={savingEditId === r.id}
                    >
                      <X size={14} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(r)}
                      className="edit-btn"
                    >
                      <Pencil size={14} /> Edit Record
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(r.id)}
                      className="delete-btn"
                    >
                      <Trash2 size={14} /> Delete Record
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
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

      {/* DELETE MODAL */}
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

      {/* BULK DELETE MODAL */}
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
