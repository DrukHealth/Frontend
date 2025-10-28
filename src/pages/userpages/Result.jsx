import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/Result.css";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const imageFile = location.state?.imageFile;
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [label, setLabel] = useState("");
  const [features, setFeatures] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!imageFile) return;
    setImagePreview(URL.createObjectURL(imageFile));

    const sendForPrediction = async () => {
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await fetch("http://localhost:8000/predict/", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setPrediction(data.prediction);
        setLabel(data.label);
        setFeatures(data.features || {});
      } catch (err) {
        console.error(err);
        alert("Prediction failed!");
      } finally {
        setLoading(false);
      }
    };

    sendForPrediction();
  }, [imageFile]);

  if (!imageFile) {
    return (
      <div
        className="no-image"
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
        <p>No image provided. Go back to scan page.</p>
        <button onClick={() => navigate("/ctg-scan")} className="return-btn">
          Return to CTG Scan
        </button>
      </div>
    );
  }

  // Determine dynamic class for prediction
  const resultClass =
    label.toLowerCase() === "normal"
      ? "normal"
      : label.toLowerCase() === "suspect"
      ? "suspicious"
      : label.toLowerCase() === "pathologic"
      ? "pathological"
      : "";

  return (
    <div
      className="result-container"
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
        className="navbar"
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
          <img src="/logo.png" alt="Druk eHealth Logo" style={{ height: "70px" }} />
        </div>

        <div
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
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

      {/* Main Body */}
      <div className="result-body fade-in">
        {imagePreview && (
          <div className="preview">
            <img src={imagePreview} alt="CTG Preview" className="preview-img" />
          </div>
        )}

        {loading ? (
          <p className="analyzing-text">🔍 Analyzing image...</p>
        ) : (
          <div className={`prediction-result ${resultClass}`}>
            <h3>Prediction Result:</h3>
            <p>{label}</p>
          </div>
        )}

        {!loading && (
          <div className="feature-section">
            <h3>Extracted Features</h3>
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
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <button onClick={() => navigate("/ctg-scan")} className="return-btn">
            Return to CTG Scan
          </button>
        )}
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Druk eHealth. All rights reserved.</p>
      </footer>
    </div>
  );
}
