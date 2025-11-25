import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "./css/Result.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";

// ⬇️ Import global theme
import { ThemeContext } from "./ThemeContext";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // ⬇️ Use global theme
  const { theme, toggleTheme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const imageFile = location.state?.imageFile;
  const imagePreviewState = location.state?.imagePreview;
  const resultData = location.state?.result;

  const [imagePreview, setImagePreview] = useState(imagePreviewState || null);
  const [label, setLabel] = useState(resultData?.label || "");
  const [features, setFeatures] = useState(resultData?.features || {});
  const [loading, setLoading] = useState(!resultData);

  const source = resultData?.source || "ctg";

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
    setLoading(false);
  }, [imageFile, resultData]);

  // ❗ Remove local body styling — ThemeContext handles this.

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

  // ----- COLOR LOGIC -----
  const displayLabel =
    source === "nyckel" ? "Non-CTG Detected" : label || "No result";

  const labelColor =
    source === "nyckel"
      ? "#6c757d"
      : label === "Normal"
      ? "#28a745"
      : label === "Suspect"
      ? "#ffc107"
      : label === "Pathologic"
      ? "#dc3545"
      : "#0d52bd";

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
            {source === "nyckel" ? "Non-CTG Scan" : "CTG Result"}
          </span>
        </div>

        {/* GLOBAL DARK MODE TOGGLE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "1.6rem",
          }}
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

        {/* LABEL */}
        {loading ? (
          <p className="analyzing-text">🔍 Processing scan...</p>
        ) : (
          <div
            style={{
              margin: "1.5rem 0",
              fontWeight: "900",
              fontSize: "2rem",
              color: labelColor,
              textAlign: "center",
            }}
          >
            {displayLabel}
          </div>
        )}

        {/* FEATURES TABLE */}
        {!loading && features && Object.keys(features).length > 0 && (
          <div className="feature-section">
            <div
              className={`table-wrapper ${darkMode ? "dark-mode" : "light-mode"}`}
            >
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
          <button
            onClick={() => navigate("/ctg-scan")}
            className="return-btn"
            style={{
              padding: "0.7rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "8px",
              backgroundColor: "#0d52bd",
              color: "white",
              border: "none",
            }}
          >
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
