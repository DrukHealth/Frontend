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
      style={{
        textAlign: "center",
        paddingTop: "5rem",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#FFFFFF",
        color: darkMode ? "#F5F5F7" : "#0d52bd",
        transition: "0.3s ease",
      }}
    >
      <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
        No scan data found. Please try again.
      </p>

      <button
        onClick={() => navigate("/ctg-scan")}
        style={{
          backgroundColor: darkMode ? "#2969d7ff" : "#0d52bd",
          color: darkMode ? "#FFFFFF" : "#FFFFFF",
          padding: "12px 22px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "600",
          boxShadow: darkMode
            ? "0 0 10px rgba(255,255,255,0.1)"
            : "0 2px 8px rgba(0,0,0,0.15)",
          transition: "0.3s ease",
        }}
      >
        Return to Scan
      </button>
    </div>
  );
}

  // ===== LABEL COLORS =====
  const COLORS = {
    Normal: "#4ade80", // green
    Suspicious: "#facc15", // yellow
    Pathological: "#f87171", // red
    Default: darkMode ? "#ffffff" : "#0d52bd",
    NonCTG: "#9ca3af",
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

  const tableText = darkMode ? "#f0f0f0" : "#0d52bd";

  return (
    <div
      className="result-container"
      style={{
        background: darkMode
          ? "linear-gradient(180deg, #0d0d0d, #1a1a1a)"
          : "#ffffff",
        minHeight: "100vh",
        transition: "0.3s ease",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          padding: "10px 20px",
          backgroundColor: darkMode ? "rgba(30,30,30,0.9)" : "#e2edfb",
          backdropFilter: darkMode ? "blur(6px)" : "none",
          height: "90px",
          boxShadow: darkMode
            ? "0 2px 10px rgba(255,255,255,0.05)"
            : "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* LOGO */}
        <div
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", marginLeft: "-30px" }}
        >
          <img
            src={darkMode ? "/logo2.png" : "/Latestlogo.png"}
            style={{
              height: "115px",
              filter: darkMode
                ? "drop-shadow(0 0 10px rgba(255,255,255,0.3))"
                : "none",
            }}
          />
        </div>

        {/* TITLE */}
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            color: darkMode ? "#ffffff" : "#0d52bd",
            textShadow: darkMode
              ? "0px 0px 10px rgba(255,255,255,0.2)"
              : "none",
          }}
        >
          CTG Result
        </div>

             {/* RIGHT: Dark Mode Toggle */}
               <div
                 style={{
                   display: "flex",
                   alignItems: "center",
                   fontSize: "1.7rem",
                   cursor: "pointer",
                   color: darkMode ? "#ffc400" : "#0d52bd",
                 }}
               >
                 <span onClick={toggleTheme}>
                   {darkMode ? <MdLightMode /> : <MdDarkMode />}
                 </span>
               </div>
      </nav>

      {/* BODY */}
      <div className="result-body fade-in">

        {/* PREVIEW IMAGE */}
        {imagePreview && (
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <img
              src={imagePreview}
              className="preview-img"
              style={{
                width: "92%",
                maxWidth: "450px",
                borderRadius: "12px",
                boxShadow: darkMode
                  ? "0 0 20px rgba(255,255,255,0.08)"
                  : "0 0 10px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        )}

        {/* LABEL */}
        <h2
          style={{
            color: labelColor,
            fontSize: "2rem",
            fontWeight: 600,
            textAlign: "center",
            marginTop: "1.5rem",
            textShadow: darkMode
              ? "0 0 10px rgba(255,255,255,0.15)"
              : "none",
          }}
        >
          {displayLabel}
        </h2>

        {/* FEATURES TABLE */}
        {isCTG && Object.keys(features).length > 0 && (
          <div
            style={{
              margin: "2rem auto",
              width: "92%",
              maxWidth: "600px",
              background: darkMode
                ? "rgba(255,255,255,0.05)"
                : "#ffffff",
              backdropFilter: darkMode ? "blur(10px)" : "none",
              padding: "1rem",
              borderRadius: "12px",
              boxShadow: darkMode
                ? "0 0 20px rgba(255,255,255,0.06)"
                : "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
<table
  className="feature-table"
  style={{
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "transparent",
  }}
>
  <thead>
    <tr>
      <th
        style={{
          color: darkMode ? "#FFFFFF" : tableText,
          borderBottom: darkMode ? "1px solid #444" : "1px solid #0d52bd",
          padding: "12px 8px",
        }}
      >
        Feature
      </th>
      <th
        style={{
          color: darkMode ? "#FFFFFF" : tableText,
          borderBottom: darkMode ? "1px solid #444" : "1px solid #0d52bd",
          padding: "12px 8px",
        }}
      >
        Value
      </th>
    </tr>
  </thead>

  <tbody>
    {Object.entries(features).map(([key, value]) => (
      <tr key={key}>
        <td
          style={{
            color: darkMode ? "#EAEAEA" : tableText,
            borderBottom: darkMode ? "1px solid #333" : "1px solid #c6d7f5",
            padding: "10px 8px",
          }}
        >
          {key}
        </td>
        <td
          style={{
            color: darkMode ? "#FFFFFF" : tableText,
            borderBottom: darkMode ? "1px solid #333" : "1px solid #c6d7f5",
            padding: "10px 8px",
          }}
        >
          {Number(value).toFixed(3)}
        </td>
      </tr>
    ))}
  </tbody>
</table>

          </div>
        )}

        {/* BUTTON */}
{/* BUTTON */}
<div style={{ textAlign: "center", marginBottom: "2rem" }}>
  <button
    onClick={() => navigate("/ctg-scan")}
    style={{
      backgroundColor: darkMode ? "#0d52bd" : "#679ADC",
      color: darkMode ? "#fff" : "#fff",
      padding: "12px 28px",
      borderRadius: "10px",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
      boxShadow: darkMode
        ? "0 0 10px rgba(255,255,255,0.08)"
        : "0 2px 8px rgba(0,0,0,0.25)",
      transition: "0.25s ease",
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = "scale(1.05)";
      e.target.style.boxShadow = darkMode
        ? "0 0 12px rgba(255,255,255,0.15)"
        : "0 3px 10px rgba(0,0,0,0.35)";
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = "scale(1)";
      e.target.style.boxShadow = darkMode
        ? "0 0 10px rgba(255,255,255,0.08)"
        : "0 2px 8px rgba(0,0,0,0.25)";
    }}
  >
    Return to Scan
  </button>
</div>

      </div>

      {/* FOOTER */}
      <footer
        className={`footer ${darkMode ? "dark" : ""}`}
        style={{
          backgroundColor: darkMode ? "rgba(20,20,20,0.9)" : "#e2edfb",
          color: darkMode ? "#EAEAEA" : "#0d52bd",
          padding: "20px 0",
          textAlign: "center",
          transition: "0.3s ease",
        }}
      >
        <p>
          © {new Date().getFullYear()} Druk{" "}
          <span className="e-letter" style={{ color: "#ffc400" }}>
            e
          </span>
          Health. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
