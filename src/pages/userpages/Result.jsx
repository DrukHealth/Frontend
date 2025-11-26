import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "./css/Result.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { ThemeContext } from "./ThemeContext";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const imageFile = location.state?.imageFile || null;
  const imagePreviewState = location.state?.imagePreview || null;
  const resultData = location.state?.result || null;

  const isCTG = resultData?.isCTG ?? null;
  const label = resultData?.label || "";
  const backendMessage = resultData?.message || "";
  const features = isCTG ? resultData?.features || {} : {};
  const [imagePreview, setImagePreview] = useState(imagePreviewState);

  useEffect(() => {
    if (imageFile && !imagePreview) {
      setImagePreview(URL.createObjectURL(imageFile));
    }
  }, [imageFile, imagePreview]);

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

  const titleText = isCTG === false ? "Non-CTG Scan" : "CTG Result";

  // ===============================
  // ⭐ COLOR MAPPING FOR LABEL
  // ===============================
  const COLORS = {
    Normal: "#28a745",
    Suspicious: "#ffc107",
    Pathological: "#dc3545",
    Default: darkMode ? "#EAEAEA" : "#0d52bd",
    NonCTG: "#6c757d",
  };

  let displayLabel = "";
  let labelColor = COLORS.Default;

  if (isCTG === false) {
    displayLabel = `❌ Non-CTG image detected. ${backendMessage || ""}`;
    labelColor = COLORS.NonCTG;
  } else {
    displayLabel = label || "CTG classification unavailable";
    labelColor = COLORS[label] || COLORS.Default;
  }

  const tableTextColor = darkMode ? "#EAEAEA" : "#0d52bd";

  return (
    <div
      className="result-container"
      style={{
        backgroundColor: darkMode ? "#121212" : "#FFFFFF",
        color: darkMode ? "#EAEAEA" : "#0d52bd",
        minHeight: "100vh",
      }}
    >
      {/* NAVBAR */}
      <nav
        className="navbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: darkMode ? "#222" : "#e2edfb",
          height: "90px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
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
          <span style={{ fontSize: "1.8rem" }}>{titleText}</span>
        </div>

        <div
          style={{ fontSize: "1.6rem", cursor: "pointer" }}
          onClick={toggleTheme}
        >
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </div>
      </nav>

      {/* BODY */}
      <div className="result-body fade-in">
        {imagePreview && (
          <div className="preview">
            <img src={imagePreview} alt="Scan Preview" className="preview-img" />
          </div>
        )}

        {/* MAIN LABEL */}
        <div
          style={{
            margin: "1.5rem 0",
            fontWeight: "900",
            fontSize: "1.8rem",
            color: labelColor,
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          {displayLabel}
        </div>

        {/* FEATURES TABLE */}
        {isCTG === true && Object.keys(features).length > 0 && (
          <div className="feature-section">
            <div className="table-wrapper">
              <table className="feature-table">
                <thead>
                  <tr style={{ color: tableTextColor }}>
                    <th>Feature</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(features).map(([key, value]) => (
                    <tr key={key} style={{ color: tableTextColor }}>
                      <td>{key}</td>
                      <td>{Number(value).toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RETURN BUTTON */}
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <button onClick={() => navigate("/ctg-scan")} className="return-btn">
            Return to Scan
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        className="footer"
        style={{
          backgroundColor: darkMode ? "#222" : "#e2edfb",
          color: darkMode ? "#EAEAEA" : "#0d52bd",
        }}
      >
        <p>
          © {new Date().getFullYear()} Druk <span className="e-letter">e</span>
          Health. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
