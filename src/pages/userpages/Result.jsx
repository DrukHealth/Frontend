// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./css/Result.css";

// export default function Result() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const imageFile = location.state?.imageFile;
//   const imagePreview = location.state?.imagePreview;

//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [label, setLabel] = useState("");
//   const [features, setFeatures] = useState({});

//   useEffect(() => {
//     if (!imageFile) return;

//     const sendToPython = async () => {
//       try {
//         const formData = new FormData();
//         formData.append("file", imageFile);

//         const res = await fetch("http://localhost:8000/predict/", {
//           method: "POST",
//           body: formData,
//         });

//         if (!res.ok) throw new Error(`HTTP ${res.status}`);

//         const data = await res.json();
//         setLabel(data.label || "Unknown");
//         setFeatures(data.features || {});
//       } catch (err) {
//         console.error("❌ Prediction failed:", err);
//         alert("Prediction failed. Check Python server logs.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     sendToPython();
//   }, [imageFile]);

//   if (!imageFile) {
//     return (
//       <div
//         style={{
//           backgroundColor: darkMode ? "#121212" : "#FFFFFF",
//           color: darkMode ? "#EAEAEA" : "#0d52bd",
//           minHeight: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <p>No CTG image provided. Please go back to scan page.</p>
//         <button
//           onClick={() => navigate("/ctg-scan")}
//           style={{
//             marginTop: "1rem",
//             padding: "10px 20px",
//             backgroundColor: "#0d52bd",
//             color: "#fff",
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer",
//           }}
//         >
//           Return to CTG Scan
//         </button>
//       </div>
//     );
//   }

//   const labelColor =
//     label.toLowerCase() === "normal"
//       ? { bg: "#d4edda", text: "#155724" }
//       : label.toLowerCase() === "suspect"
//       ? { bg: "#fff3cd", text: "#856404" }
//       : { bg: "#f8d7da", text: "#721c24" };

//   return (
//     <div
//       style={{
//         backgroundColor: darkMode ? "#121212" : "#FFFFFF",
//         color: darkMode ? "#EAEAEA" : "#0d52bd",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* Navbar */}
//       <nav
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "10px 20px",
//           backgroundColor: darkMode ? "#222" : "#E2EDFB",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//           height: "92px",
//         }}
//       >
//         <div onClick={() => navigate("/home")} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
//           <img src="/logo.png" alt="Logo" style={{ height: "70px" }} />
//         </div>
//         <div style={{ fontSize: "2rem", fontWeight: "bold", flex: 1, textAlign: "center" }}>
//           CTG Diagnosis Result
//         </div>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <label style={{ position: "relative", display: "inline-block", width: "50px", height: "26px" }}>
//             <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)}
//               style={{ opacity: 0, width: 0, height: 0 }} />
//             <span style={{
//               position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0,
//               backgroundColor: darkMode ? "#444" : "#ccc", transition: "0.4s", borderRadius: "34px"
//             }}>
//               <span style={{
//                 position: "absolute", height: "18px", width: "18px",
//                 left: darkMode ? "26px" : "4px", bottom: "4px", backgroundColor: "white",
//                 transition: "0.4s", borderRadius: "50%"
//               }}></span>
//             </span>
//           </label>
//         </div>
//       </nav>

//       {/* Body */}
//       <div style={{ flex: 1, textAlign: "center", padding: "2rem" }}>
//         {imagePreview && (
//           <img
//             src={imagePreview}
//             alt="CTG Preview"
//             style={{
//               width: "400px",
//               borderRadius: "10px",
//               boxShadow: darkMode
//                 ? "0 0 10px rgba(255,255,255,0.2)"
//                 : "0 0 10px rgba(0,0,0,0.2)",
//             }}
//           />
//         )}

//         {loading ? (
//           <p style={{ marginTop: "1.5rem" }}>🔍 Analyzing CTG image...</p>
//         ) : (
//           <div
//             style={{
//               backgroundColor: labelColor.bg,
//               color: labelColor.text,
//               padding: "20px 40px",
//               marginTop: "2rem",
//               borderRadius: "12px",
//               display: "inline-block",
//               boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//             }}
//           >
//             <h3>Prediction Result</h3>
//             <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>{label}</p>
//           </div>
//         )}

//         {!loading && Object.keys(features).length > 0 && (
//           <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
//             <table
//               style={{
//                 width: "80%",
//                 borderCollapse: "collapse",
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//               }}
//             >
//               <thead style={{ backgroundColor: "#E2EDFB" }}>
//                 <tr>
//                   <th style={{ padding: "10px" }}>Feature</th>
//                   <th style={{ padding: "10px" }}>Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.entries(features).map(([key, val]) => (
//                   <tr key={key}>
//                     <td style={{ padding: "8px 10px", borderBottom: "1px solid #ddd" }}>{key}</td>
//                     <td style={{ padding: "8px 10px", borderBottom: "1px solid #ddd" }}>{val}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {!loading && (
//           <button
//             onClick={() => navigate("/ctg-scan")}
//             style={{
//               marginTop: "2rem",
//               padding: "10px 20px",
//               backgroundColor: "#0d52bd",
//               color: "#fff",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               fontWeight: "600",
//             }}
//           >
//             Return to CTG Scan
//           </button>
//         )}
//       </div>

//       {/* Footer */}
//       <footer
//         style={{
//           padding: "1rem",
//           textAlign: "center",
//           backgroundColor: darkMode ? "#222" : "#E8EEF5",
//           color: darkMode ? "#AAA" : "#000",
//         }}
//       >
//         <p>© {new Date().getFullYear()} Druk eHealth. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }



import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/Result.css";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const imageFile = location.state?.imageFile;
  const [imagePreview, setImagePreview] = useState(location.state?.imagePreview || null);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [features, setFeatures] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [isNonCTG, setIsNonCTG] = useState(false);

  // --- Send file to backend for prediction ---
  useEffect(() => {
    if (!imageFile) return;
    if (!imagePreview) setImagePreview(URL.createObjectURL(imageFile));

    const sendToPython = async () => {
      try {
        const formData = new FormData();
        formData.append("file", imageFile);

        const res = await fetch("http://127.0.0.1:8000/predict/", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setLabel(data.label || "Unknown");
        setFeatures(data.features || {});

        // detect if backend reported non-CTG image
        if (data.label?.toLowerCase().includes("non ctg")) {
          setIsNonCTG(true);
        } else {
          setIsNonCTG(false);
        }
      } catch (err) {
        console.error("❌ Prediction failed:", err);
        alert("Prediction failed. Check Python server logs.");
      } finally {
        setLoading(false);
      }
    };

    sendToPython();
  }, [imageFile]);

  // --- Handle case: no image passed from scan page ---
  if (!imageFile) {
    return (
      <div
        style={{
          backgroundColor: darkMode ? "#121212" : "#FFFFFF",
          color: darkMode ? "#EAEAEA" : "#0d52bd",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>No image provided. Please go back to scan page.</p>
        <button
          onClick={() => navigate("/ctg-scan")}
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            backgroundColor: "#0d52bd",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Return to CTG Scan
        </button>
      </div>
    );
  }

  // --- Color logic for result card ---
  const labelColor = isNonCTG
    ? { bg: "#f8d7da", text: "#721c24" }
    : label.toLowerCase() === "normal"
    ? { bg: "#d4edda", text: "#155724" }
    : label.toLowerCase() === "suspect"
    ? { bg: "#fff3cd", text: "#856404" }
    : { bg: "#f8d7da", text: "#721c24" };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#FFFFFF",
        color: darkMode ? "#EAEAEA" : "#0d52bd",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: darkMode ? "#222" : "#E2EDFB",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          height: "92px",
        }}
      >
        <div
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img src="/logo.png" alt="Logo" style={{ height: "70px" }} />
        </div>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            flex: 1,
            textAlign: "center",
          }}
        >
          CTG Diagnosis Result
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            style={{
              position: "relative",
              display: "inline-block",
              width: "50px",
              height: "26px",
            }}
          >
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: darkMode ? "#444" : "#ccc",
                transition: "0.4s",
                borderRadius: "34px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  height: "18px",
                  width: "18px",
                  left: darkMode ? "26px" : "4px",
                  bottom: "4px",
                  backgroundColor: "white",
                  transition: "0.4s",
                  borderRadius: "50%",
                }}
              ></span>
            </span>
          </label>
        </div>
      </nav>

      {/* Body */}
      <div style={{ flex: 1, textAlign: "center", padding: "2rem" }}>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="CTG Preview"
            style={{
              width: "400px",
              borderRadius: "10px",
              boxShadow: darkMode
                ? "0 0 10px rgba(255,255,255,0.2)"
                : "0 0 10px rgba(0,0,0,0.2)",
            }}
          />
        )}

        {loading ? (
          <p style={{ marginTop: "1.5rem" }}>🔍 Analyzing CTG image...</p>
        ) : (
          <div
            style={{
              backgroundColor: labelColor.bg,
              color: labelColor.text,
              padding: "20px 40px",
              marginTop: "2rem",
              borderRadius: "12px",
              display: "inline-block",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Prediction Result</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>{label}</p>
          </div>
        )}

        {/* Show features only if it's a valid CTG image */}
        {!loading && !isNonCTG && Object.keys(features).length > 0 && (
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <table
              style={{
                width: "80%",
                borderCollapse: "collapse",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <thead style={{ backgroundColor: "#E2EDFB" }}>
                <tr>
                  <th style={{ padding: "10px" }}>Feature</th>
                  <th style={{ padding: "10px" }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(features).map(([key, val]) => (
                  <tr key={key}>
                    <td
                      style={{
                        padding: "8px 10px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {key}
                    </td>
                    <td
                      style={{
                        padding: "8px 10px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <button
            onClick={() => navigate("/ctg-scan")}
            style={{
              marginTop: "2rem",
              padding: "10px 20px",
              backgroundColor: "#0d52bd",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Return to CTG Scan
          </button>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "1rem",
          textAlign: "center",
          backgroundColor: darkMode ? "#222" : "#E8EEF5",
          color: darkMode ? "#AAA" : "#000",
        }}
      >
        <p>© {new Date().getFullYear()} Druk eHealth. All rights reserved.</p>
      </footer>
    </div>
  );
}
