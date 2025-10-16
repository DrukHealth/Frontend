import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Diagnosis.css";

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
    <img src="/logo.png" alt="Druk eHealth Logo" className="nav-logo" />
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
      <footer className="footer">
        <p>© {new Date().getFullYear()} Druk eHealth. All rights reserved.</p>
      </footer>
    </div>
  );
}
