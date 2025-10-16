import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Result.css";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const imageFile = location.state?.imageFile;
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);

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
      <div className="no-image">
        <p>No image provided. Go back to scan page.</p>
        <button onClick={() => navigate("/ctg-scan")} className="return-btn">
          Return to CTG Scan
        </button>
      </div>
    );
  }

  return (
    <div className="result-container">
      {/* Navbar */}
      <nav className="navbar">
        <div
          className="nav-left"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          <img src="/logo.png" alt="Druk eHealth Logo" className="nav-logo" />
        </div>

        <div className="nav-title">CTG Diagnosis Result</div>
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
              prediction >= 0.5 ? "normal" : "abnormal"
            }`}
          >
            <h3>Prediction Result:</h3>
            <p>{prediction >= 0.5 ? "Normal" : "Abnormal"}</p>
          </div>
        )}

        {!loading && (
          <button onClick={() => navigate("/ctg-scan")} className="return-btn">
            Return to CTG Scan
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Druk eHealth. All rights reserved.</p>
      </footer>
    </div>
  );
}
