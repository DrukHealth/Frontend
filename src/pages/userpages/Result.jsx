// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./css/Result.css";

// export default function Result() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Data passed from CTGScan.jsx
//   const imageFile = location.state?.imageFile;
//   const imagePreviewState = location.state?.imagePreview;
//   const resultData = location.state?.result;

//   const [imagePreview, setImagePreview] = useState(imagePreviewState || null);
//   const [label, setLabel] = useState(resultData?.label || "");
//   const [features, setFeatures] = useState(resultData?.features || {});
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(!resultData);

//   // Handle cases where user opens result page directly
//   useEffect(() => {
//     if (!imageFile || !resultData) {
//       setLoading(false);
//       return;
//     }

//     // Preview from state
//     if (!imagePreview) {
//       setImagePreview(URL.createObjectURL(imageFile));
//     }

//     // Load prediction from state
//     setLabel(resultData.label);
//     setFeatures(resultData.features);
//     setLoading(false);
//   }, [imageFile, resultData]);

//   // If user came without image or prediction
//   if (!imageFile || !resultData) {
//     return (
//       <div
//         className="no-image"
//         style={{
//           textAlign: "center",
//           paddingTop: "5rem",
//           minHeight: "100vh",
//           color: darkMode ? "#EAEAEA" : "#0d52bd",
//         }}
//       >
//         <p>No CTG data found. Please scan again.</p>
//         <button onClick={() => navigate("/ctg-scan")} className="return-btn">
//           Return to CTG Scan
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="result-container"
//       style={{
//         backgroundColor: darkMode ? "#121212" : "#FFFFFF",
//         color: darkMode ? "#EAEAEA" : "#0d52bd",
//         minHeight: "100vh",
//       }}
//     >
//       {/* Navigation Bar */}
//       <nav
//         className="navbar"
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "10px 20px",
//           backgroundColor: darkMode ? "#222" : "#e2edfb",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//           height: "90px",
//         }}
//       >
//         <div
//           onClick={() => navigate("/home")}
//           style={{ cursor: "pointer", marginLeft: "-30px" }}
//         >
//           <img
//             src="/Latestlogo.png"
//             alt="Druk eHealth Logo"
//             style={{ height: "115px" }}
//           />
//         </div>

//         <div
//           style={{
//             fontWeight: "bold",
//             position: "absolute",
//             left: "50%",
//             transform: "translateX(-50%)",
//           }}
//         >
//           <span style={{ fontSize: "1.8rem" }}>CTG Result</span>
//         </div>

//         <div style={{ display: "flex", alignItems: "center" }}>
//           <label
//             style={{
//               position: "relative",
//               display: "inline-block",
//               width: "50px",
//               height: "26px",
//             }}
//           >
//             <input
//               type="checkbox"
//               checked={darkMode}
//               onChange={() => setDarkMode(!darkMode)}
//               style={{ opacity: 0, width: 0, height: 0 }}
//             />
//             <span
//               style={{
//                 position: "absolute",
//                 cursor: "pointer",
//                 top: 0,
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 backgroundColor: darkMode ? "#444" : "#ccc",
//                 borderRadius: "34px",
//                 transition: "0.4s",
//               }}
//             >
//               <span
//                 style={{
//                   position: "absolute",
//                   height: "18px",
//                   width: "18px",
//                   left: darkMode ? "26px" : "4px",
//                   bottom: "4px",
//                   backgroundColor: "white",
//                   borderRadius: "50%",
//                   transition: "0.4s",
//                 }}
//               ></span>
//             </span>
//           </label>
//         </div>
//       </nav>

//       {/* Main Body */}
//       <div className="result-body fade-in">
//         {/* Image Preview */}
//         {imagePreview && (
//           <div className="preview">
//             <img src={imagePreview} alt="CTG Preview" className="preview-img" />
//           </div>
//         )}

//         {/* Prediction */}
//         {loading ? (
//           <p className="analyzing-text">🔍 Analyzing image...</p>
//         ) : (
//           <div
//             className={`prediction-result ${
//               label === "Normal"
//                 ? "normal"
//                 : label === "Suspect"
//                 ? "suspect"
//                 : label === "Pathologic"
//                 ? "pathologic"
//                 : "non-ctg"
//             }`}
//           >
//             <h3>Prediction Result</h3>
//             <p>{label}</p>
//           </div>
//         )}

//         {/* Features Table */}
//         {!loading && features && Object.keys(features).length > 0 && (
//           <div className="feature-section">
//             <h3>Extracted Features</h3>
//             <div className="table-wrapper">
//               <table className="feature-table">
//                 <thead>
//                   <tr>
//                     <th>Feature</th>
//                     <th>Value</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(features).map(([key, value]) => (
//                     <tr key={key}>
//                       <td>{key}</td>
//                       <td>{Number(value).toFixed(3)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         <button onClick={() => navigate("/ctg-scan")} className="return-btn">
//           Return to CTG Scan
//         </button>
//       </div>

//       {/* Footer */}
//       <footer
//         className="footer"
//         style={{
//           backgroundColor: darkMode ? "#222" : "#e2edfb",
//           color: darkMode ? "#EAEAEA" : "#0d52bd",
//         }}
//       >
//         <p>
//           © {new Date().getFullYear()} Druk <span className="e-letter">e</span>Health.
//           All rights reserved.
//         </p>
//       </footer>
//     </div>
//   );
// }









// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./css/Result.css";

// export default function Result() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const imageFile = location.state?.imageFile;
//   const [imagePreview, setImagePreview] = useState(location.state?.imagePreview || null);
//   const [loading, setLoading] = useState(true);
//   const [displayPrediction, setDisplayPrediction] = useState(false); // controls final prediction display
//   const [label, setLabel] = useState("");
//   const [features, setFeatures] = useState({});
//   const [darkMode, setDarkMode] = useState(false);
//   const [isNonCTG, setIsNonCTG] = useState(false);

//   // --- Image preview ---
//   useEffect(() => {
//     if (!imagePreview && imageFile) {
//       const url = URL.createObjectURL(imageFile);
//       setImagePreview(url);
//       return () => URL.revokeObjectURL(url);
//     }
//   }, [imageFile]);

//   // --- Send file to backend for prediction ---
//   useEffect(() => {
//     if (!imageFile) return;

//     const sendToPython = async () => {
//       try {
//         const formData = new FormData();
//         formData.append("file", imageFile);

//         const res = await fetch("http://127.0.0.1:8000/predict/", {
//           method: "POST",
//           body: formData,
//         });

//         if (!res.ok) throw new Error(`HTTP ${res.status}`);

//         const data = await res.json();
//         console.log("[DEBUG] Full response from backend:", data);

//         const nyckel = data.nyckel_prediction;
//         let predictedLabel = "Prediction unavailable";

//         if (nyckel) predictedLabel = nyckel.labelName || predictedLabel;

//         const nonCTGDetected = /non[- ]?ctg/i.test(predictedLabel);
//         setIsNonCTG(nonCTGDetected);

//         if (nonCTGDetected) {
//           setLabel("Non-CTG Detected");
//         } else {
//           const localPred = data.local_prediction;
//           if (localPred && localPred.label) setLabel(localPred.label);
//           else setLabel("Prediction unavailable");
//         }

//         setFeatures(data.features || {});

//         // Simulate processing animation before showing final result
//         setTimeout(() => setDisplayPrediction(true), 2000);
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
//         <p>No image provided. Please go back to scan page.</p>
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

//   // --- Color logic ---
//   const labelColor = isNonCTG
//     ? { bg: "#f8d7da", text: "#721c24" } // Non-CTG: red
//     : label.toLowerCase().includes("normal")
//     ? { bg: "#d4edda", text: "#155724" } // Normal: green
//     : label.toLowerCase().includes("suspect")
//     ? { bg: "#fff3cd", text: "#856404" } // Suspect: yellow
//     : { bg: "#f8d7da", text: "#721c24" }; // Pathologic: red

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
//         <div
//           onClick={() => navigate("/home")}
//           style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
//         >
//           <img src="/logo.png" alt="Logo" style={{ height: "70px" }} />
//         </div>
//         <div
//           style={{
//             fontSize: "2rem",
//             fontWeight: "bold",
//             flex: 1,
//             textAlign: "center",
//           }}
//         >
//           CTG Diagnosis Result
//         </div>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <label
//             style={{
//               position: "relative",
//               display: "inline-block",
//               width: "50px",
//               height: "26px",
//             }}
//           >
//             <input
//               type="checkbox"
//               checked={darkMode}
//               onChange={() => setDarkMode(!darkMode)}
//               style={{ opacity: 0, width: 0, height: 0 }}
//             />
//             <span
//               style={{
//                 position: "absolute",
//                 cursor: "pointer",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 backgroundColor: darkMode ? "#444" : "#ccc",
//                 transition: "0.4s",
//                 borderRadius: "34px",
//               }}
//             >
//               <span
//                 style={{
//                   position: "absolute",
//                   height: "18px",
//                   width: "18px",
//                   left: darkMode ? "26px" : "4px",
//                   bottom: "4px",
//                   backgroundColor: "white",
//                   transition: "0.4s",
//                   borderRadius: "50%",
//                 }}
//               ></span>
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

//         {/* Processing animation */}
//         {loading && (
//           <div className="loading-section">
//             <div className="loader"></div>
//             <p className="loading-text">⏳ Processing CTG image...</p>
//           </div>
//         )}

//         {/* Final prediction display */}
//         {!loading && displayPrediction && (
//           <div
//             className="result-card fade-in"
//             style={{
//               backgroundColor: labelColor.bg,
//               color: labelColor.text,
//               padding: "1.5rem",
//               borderRadius: "12px",
//               margin: "2rem auto",
//               fontSize: "1.5rem",
//               fontWeight: "bold",
//               width: "fit-content",
//               animation: "pulse 1.5s infinite",
//             }}
//           >
//             {label}
//           </div>
//         )}

//         {/* Show features only for valid CTG */}
//         {!loading && displayPrediction && !isNonCTG && Object.keys(features).length > 0 && (
//           <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
//             <table
//               style={{
//                 width: "80%",
//                 borderCollapse: "collapse",
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//                 backgroundColor: darkMode ? "#1e1e1e" : "#fff",
//                 color: darkMode ? "#EAEAEA" : "#000",
//               }}
//             >
//               <thead style={{ backgroundColor: darkMode ? "#333" : "#E2EDFB" }}>
//                 <tr>
//                   <th style={{ padding: "10px" }}>Feature</th>
//                   <th style={{ padding: "10px" }}>Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.entries(features).map(([key, val]) => (
//                   <tr key={key}>
//                     <td style={{ padding: "8px 10px", borderBottom: "1px solid #ddd" }}>
//                       {key}
//                     </td>
//                     <td style={{ padding: "8px 10px", borderBottom: "1px solid #ddd" }}>
//                       {val}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Return button */}
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
  const imagePreviewState = location.state?.imagePreview;
  const resultData = location.state?.result;

  const [imagePreview, setImagePreview] = useState(imagePreviewState || null);
  const [label, setLabel] = useState(resultData?.label || "");
  const [features, setFeatures] = useState(resultData?.features || {});
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(!resultData);
  const [source, setSource] = useState(resultData?.source || "ctg"); // "ctg" or "nyckel"

  useEffect(() => {
    if (!imageFile || !resultData) {
      setLoading(false);
      return;
    }

    if (!imagePreview) {
      setImagePreview(URL.createObjectURL(imageFile));
    }

    setLabel(resultData.label);
    setFeatures(resultData.features);
    setSource(resultData.source || "ctg");
    setLoading(false);
  }, [imageFile, resultData]);

  if (!imageFile || !resultData) {
    return (
      <div
        className="no-image"
        style={{
          textAlign: "center",
          paddingTop: "5rem",
          minHeight: "100vh",
          color: darkMode ? "#EAEAEA" : "#0d52bd",
        }}
      >
        <p>No scan data found. Please try again.</p>
        <button onClick={() => navigate("/ctg-scan")} className="return-btn">
          Return to Scan
        </button>
      </div>
    );
  }

  // Color based on label value
  const labelColor =
    label === "Normal" ? "#28a745" :
    label === "Suspect" ? "#ffc107" :
    label === "Pathologic" ? "#dc3545" :
    "#0d52bd"; // default

  return (
    <div
      className="result-container"
      style={{
        backgroundColor: darkMode ? "#121212" : "#FFFFFF",
        color: darkMode ? "#EAEAEA" : "#0d52bd",
        minHeight: "100vh",
      }}
    >
      {/* Navigation Bar */}
      <nav
        className="navbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: darkMode ? "#222" : "#e2edfb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          height: "90px",
        }}
      >
        <div
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", marginLeft: "-30px" }}
        >
          <img
            src="/Latestlogo.png"
            alt="Druk eHealth Logo"
            style={{ height: "115px" }}
          />
        </div>

        <div
          style={{
            fontWeight: "bold",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span style={{ fontSize: "1.8rem" }}>
            {source === "nyckel" ? "" : "Prediction Result"}
          </span>
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
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: darkMode ? "#444" : "#ccc",
                borderRadius: "34px",
                transition: "0.4s",
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
                  borderRadius: "50%",
                  transition: "0.4s",
                }}
              ></span>
            </span>
          </label>
        </div>
      </nav>

      {/* Main Body */}
      <div className="result-body fade-in">
        {imagePreview && (
          <div className="preview">
            <img src={imagePreview} alt="Scan Preview" className="preview-img" />
          </div>
        )}

        {loading ? (
          <p className="analyzing-text">🔍 Analyzing image...</p>
        ) : (
          <div
            style={{
              margin: "1.5rem 0",
              fontWeight: "900",      // extra bold
              fontSize: "2rem",       // bigger font
              color: labelColor,
              textAlign: "center"     // center it for better visibility
            }}
          >
            {label || "No result"}
          </div>
        )}


        {!loading && features && Object.keys(features).length > 0 && (
          <div className="feature-section">
            {/* <h3>Extracted Features</h3> */}
            <div className="table-wrapper">
              <table className="feature-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(features).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{Number(value).toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        className="footer"
        style={{
          backgroundColor: darkMode ? "#222" : "#e2edfb",
          color: darkMode ? "#EAEAEA" : "#0d52bd",
        }}
      >
        <p>
          © {new Date().getFullYear()} Druk <span className="e-letter">e</span>Health.
          All rights reserved.
        </p>
      </footer>
    </div>
  );
}
