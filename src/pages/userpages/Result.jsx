import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/Result.css";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // Data passed from CTGScan.jsx
  const imageFile = location.state?.imageFile;
  const imagePreviewState = location.state?.imagePreview;
  const resultData = location.state?.result;

  const [imagePreview, setImagePreview] = useState(imagePreviewState || null);
  const [label, setLabel] = useState(resultData?.label || "");
  const [features, setFeatures] = useState(resultData?.features || {});
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(!resultData);

  // Handle cases where user opens result page directly
  useEffect(() => {
    if (!imageFile || !resultData) {
      setLoading(false);
      return;
    }

    // Preview from state
    if (!imagePreview) {
      setImagePreview(URL.createObjectURL(imageFile));
    }

    // Load prediction from state
    setLabel(resultData.label);
    setFeatures(resultData.features);
    setLoading(false);
  }, [imageFile, resultData]);

  // If user came without image or prediction
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
        <p>No CTG data found. Please scan again.</p>
        <button onClick={() => navigate("/ctg-scan")} className="return-btn">
          Return to CTG Scan
        </button>
      </div>
    );
  }

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
          <span style={{ fontSize: "1.8rem" }}>CTG Result</span>
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
        {/* Image Preview */}
        {imagePreview && (
          <div className="preview">
            <img src={imagePreview} alt="CTG Preview" className="preview-img" />
          </div>
        )}

        {/* Prediction */}
        {loading ? (
          <p className="analyzing-text">🔍 Analyzing image...</p>
        ) : (
          <div
            className={`prediction-result ${
              label === "Normal"
                ? "normal"
                : label === "Suspect"
                ? "suspect"
                : label === "Pathologic"
                ? "pathologic"
                : "non-ctg"
            }`}
          >
            <h3>Prediction Result</h3>
            <p>{label}</p>
          </div>
        )}

        {/* Features Table */}
        {!loading && features && Object.keys(features).length > 0 && (
          <div className="feature-section">
            <h3>Extracted Features</h3>
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

        <button onClick={() => navigate("/ctg-scan")} className="return-btn">
          Return to CTG Scan
        </button>
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
