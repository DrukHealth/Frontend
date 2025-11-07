import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./css/Diagnosis.css";

export default function Diagnosis() {
  const location = useLocation();
  const navigate = useNavigate();
  const imageFile = location.state?.imageFile;

  if (!imageFile) {
    return (
      <div className="diagnosis-container">
        <p>No image provided. Please go back to scan page.</p>
      </div>
    );
  }

  const [imagePreview] = useState(URL.createObjectURL(imageFile));

  return (
    <div className="diagnosis-container">
     {/* Navbar */}
<nav className="navbar">
  <div
    className="nav-left"
    onClick={() => navigate("/home")}
    style={{ cursor: "pointer" }}
  >
    <img src="/Latestlogo.png" alt="Druk eHealth Logo" style={{ height: "115px" }} />
  </div>

</nav>


      {/* ===== Main Content ===== */}
      <div className="diagnosis-body">
        <h2>Confirm Your CTG Scan</h2>

        <div className="preview">
          <img src={imagePreview} alt="CTG Preview" className="preview-img" />
        </div>

        <button
          className="diagnose-btn"
          onClick={() => navigate("/result", { state: { imageFile } })}
        >
          Diagnose
        </button>
      </div>

      {/* ===== Footer ===== */}
      <footer
        className={`footer ${darkMode ? "dark" : ""}`}
        style={{
          backgroundColor: darkMode ? "#222" : "#e2edfb",
          color: darkMode ? "#EAEAEA" : "#0d52bd",
        }}
      >
        <p>
          © {new Date().getFullYear()} Druk <span className="e-letter">e</span>Health. All rights reserved.
        </p>
    </footer>
    </div>
  );
}
