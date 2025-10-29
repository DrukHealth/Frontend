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
  const [isNonCTG, setIsNonCTG] = useState(false);

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

        // Check if backend says it is non-CTG
        if (data.label.includes("Non CTG")) {
          setIsNonCTG(true);
        } else {
          setIsNonCTG(false);
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
      <div className={`no-image ${darkMode ? "dark-mode" : ""}`}>
        <p>No image provided. Go back to scan page.</p>
        <button onClick={() => navigate("/ctg-scan")} className="return-btn">
          Return to CTG Scan
        </button>
      </div>
    );
  }

  return (
    <div className={`result-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Navbar */}
      <nav className="navbar">
        <div
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img src="/logo.png" alt="Druk eHealth Logo" className="nav-logo" />
        </div>
        <div className="nav-title">CTG Diagnosis Result</div>
        <div className="dark-mode-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider round"></span>
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
            <h3>Prediction Result:</h3>
            <p>{label}</p>
          </div>
        )}

        {/* Show features only if it's a CTG image */}
        {!loading && !isNonCTG && (
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
