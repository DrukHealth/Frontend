// src/pages/userpages/Result.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

        if (data.success) {
          setPrediction(data.prediction);
          setLabel(data.label);
          setFeatures(data.features || {});
        } else {
          alert("Prediction failed!");
        }
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
      <nav className="navbar">
        <div onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <img src="/logo.png" alt="Druk eHealth Logo" style={{ height: "70px" }} />
        </div>
        <div className="title">CTG Diagnosis Result</div>
        <label className="darkmode-toggle">
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          <span></span>
        </label>
      </nav>

      {/* Body */}
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
