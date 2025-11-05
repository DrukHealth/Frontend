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

  // -----------------------------------------------------
  // 🧠 Send uploaded CTG image to FastAPI for analysis
  // -----------------------------------------------------
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
        console.log("📡 Backend response:", data);

        setLabel(data.label || "Unknown");
        setFeatures(data.features || {});
      } catch (err) {
        console.error("❌ Prediction failed:", err);
        alert("Prediction failed. Check backend logs.");
      } finally {
        setLoading(false);
      }
    };

    sendToPython();
  }, [imageFile]);

  // -----------------------------------------------------
  // Handle case when no image was passed
  // -----------------------------------------------------
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

  // -----------------------------------------------------
  // 🎨 Color logic for result card
  // -----------------------------------------------------
  const labelColor =
    label.toLowerCase() === "normal"
      ? { bg: "#d4edda", text: "#155724" }
      : label.toLowerCase() === "suspect"
      ? { bg: "#fff3cd", text: "#856404" }
      : label.toLowerCase() === "pathologic"
      ? { bg: "#f8d7da", text: "#721c24" }
      : { bg: "#e2e3e5", text: "#383d41" };

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
      {/* -----------------------------------------------------
         🧭 Navbar 
      ------------------------------------------------------*/}
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

      {/* -----------------------------------------------------
         🩺 Main Result Section 
      ------------------------------------------------------*/}
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
          <div className="loading-section">
            <div className="loader"></div>
            <p className="loading-text">🔍 Analyzing CTG image...</p>
          </div>
        ) : (
          <div
            className="result-card fade-in"
            style={{
              margin: "2rem auto",
              width: "fit-content",
              backgroundColor: labelColor.bg,
              color: labelColor.text,
              borderRadius: "10px",
              padding: "1.5rem 2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>Prediction Result</h3>
            <p
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
            >
              {label}
            </p>
          </div>
        )}

        {/* -----------------------------------------------------
           📊 Feature Table (only for valid CTG predictions)
        ------------------------------------------------------*/}
        {!loading && Object.keys(features).length > 0 && (
          <div
            style={{
              marginTop: "2rem",
              overflowX: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <table
              style={{
                width: "90%",
                maxWidth: "800px",
                borderCollapse: "collapse",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                backgroundColor: darkMode ? "#1e1e1e" : "#fff",
              }}
            >
              <thead
                style={{
                  backgroundColor: darkMode ? "#333" : "#E2EDFB",
                  color: darkMode ? "#EAEAEA" : "#0d52bd",
                }}
              >
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
                        textAlign: "left",
                      }}
                    >
                      {key}
                    </td>
                    <td
                      style={{
                        padding: "8px 10px",
                        borderBottom: "1px solid #ddd",
                        textAlign: "right",
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

      {/* -----------------------------------------------------
         ⚙️ Footer 
      ------------------------------------------------------*/}
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
