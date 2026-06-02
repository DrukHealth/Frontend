import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "./css/Result.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import {
  FaArrowLeft,
  FaHeartbeat,
  FaImage,
  FaInfoCircle,
  FaTable,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSkullCrossbones,
} from "react-icons/fa";
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
  const interpretations = resultData?.interpretation || {};

  const [imagePreview, setImagePreview] = useState(imagePreviewState);
  const [showImageModal, setShowImageModal] = useState(false);
  useEffect(() => {
    if (imageFile && !imagePreview) {
      setImagePreview(URL.createObjectURL(imageFile));
    }
  }, [imageFile, imagePreview]);

  const getResultMeta = () => {
    if (isCTG === false) {
      return {
        title: "Non-CTG Image Detected",
        message:
          backendMessage ||
          "The uploaded image does not appear to be a valid or clear CTG record.",
        type: "nonctg",
        icon: <FaExclamationTriangle />,
      };
    }

    if (label === "Normal") {
      return {
        title: "Normal",
        message: "The uploaded CTG record has been classified as normal.",
        type: "normal",
        icon: <FaCheckCircle />,
      };
    }

    if (label === "Suspicious") {
      return {
        title: "Suspicious",
        message:
          "The CTG record shows suspicious indicators and may require further clinical review.",
        type: "suspicious",
        icon: <FaExclamationTriangle />,
      };
    }

    if (label === "Pathological") {
      return {
        title: "Pathological",
        message:
          "The CTG record shows pathological indicators. Immediate clinical attention may be required.",
        type: "pathological",
        icon: <FaSkullCrossbones />,
      };
    }

    return {
      title: "CTG Classification Unavailable",
      message: "The system could not provide a clear classification.",
      type: "unknown",
      icon: <FaInfoCircle />,
    };
  };

  const resultMeta = getResultMeta();

  const clinicalAdviceKey = Object.keys(interpretations).find((key) => {
    const normalizedKey = key.toLowerCase().replace(/_/g, " ");
    return normalizedKey.includes("clinical") || normalizedKey.includes("advice");
  });

  const clinicalAdvice = clinicalAdviceKey
    ? interpretations[clinicalAdviceKey]
    : null;

  const otherInterpretations = Object.fromEntries(
    Object.entries(interpretations).filter(([key]) => key !== clinicalAdviceKey)
  );

  if (!imageFile || !resultData) {
    return (
      <div className={`result-page ${darkMode ? "dark" : "light"}`}>
        <div className="empty-result-card">
          <div className="empty-icon">
            <FaInfoCircle />
          </div>

          <h1>No Scan Data Found</h1>

          <p>
            There is no CTG scan result available. Please return to the scan page
            and upload a CTG record again.
          </p>

          <button
            className="primary-return-btn"
            onClick={() => navigate("/ctg-scan")}
          >
            <FaArrowLeft />
            Return to Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`result-page ${darkMode ? "dark" : "light"}`}>
      {/* NAVBAR */}
      <nav className="result-navbar">
        <div className="result-logo-box" onClick={() => navigate("/home")}>
          <img
            src={darkMode ? "/logo2.png" : "/Latestlogo.png"}
            alt="Druk eHealth Logo"
            className="result-logo"
          />
        </div>

        <div className="result-nav-title">
          <FaHeartbeat />
          <span>CTG Result</span>
        </div>

        <button
          className="result-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
      </nav>

      {/* BODY */}
      <main className="result-main">
        <section className="result-hero-card fade-in">
          <div className="result-summary">
            <div className={`result-status-pill ${resultMeta.type}`}>
              {resultMeta.icon}
              <span>{resultMeta.title}</span>
            </div>

            <h1>CTG Analysis Result</h1>

            <p>{resultMeta.message}</p>

            <div className="result-note">
              <FaInfoCircle />
              <span>
                This result is generated by the system and should be reviewed by
                qualified healthcare personnel when needed.
              </span>
            </div>


          </div>

          {imagePreview && (
            <div className="result-image-panel">
              <div className="panel-heading">
                <FaImage />
                <span>Uploaded CTG Record</span>
              </div>

              <div className="result-image-wrapper">
                <img
                  src={imagePreview}
                  alt="CTG Preview"
                  className="preview-img"
                  onClick={() => setShowImageModal(true)}
                />
              </div>
            </div>
          )}

          
        </section>

        {/* FEATURES TABLE */}
        {isCTG && Object.keys(features).length > 0 && (
          <section className="result-section fade-in">
            <div className="section-title">
              <FaTable />
              <div>
                <h2>Extracted CTG Features</h2>
                <p>Key values extracted from the uploaded CTG record.</p>
              </div>
            </div>

            <div className="table-card">
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
                        <td>
                          {key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </td>
                        <td>
                          {typeof value === "number"
                            ? Number(value).toFixed(3)
                            : value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* CTG INTERPRETATION */}
        {Object.keys(otherInterpretations).length > 0 && (
          <section className="result-section interpretation-section fade-in">
            <div className="section-title">
              <FaInfoCircle />
              <div>
                <h2>CTG Interpretation</h2>
                <p>Explanation of the result and related CTG indicators.</p>
              </div>
            </div>

            <div className="interpretation-grid">
              {Object.entries(otherInterpretations).map(([key, value]) => (
                <div className="interpretation-card" key={key}>
                  <h3>
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </h3>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        
        {/* CLINICAL ADVICE - IMPORTANT PRECAUTION */}
        {clinicalAdvice && (
          <section className={`clinical-advice-card ${resultMeta.type} fade-in`}>
            <div className="clinical-advice-icon">
              <FaExclamationTriangle />
            </div>

            <div className="clinical-advice-content">
              <h2>Clinical Advice</h2>
              <p>{clinicalAdvice}</p>
            </div>
          </section>
        )}

      </main>
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="image-modal-close"
              onClick={() => setShowImageModal(false)}
            >
              ×
            </button>

            <img src={imagePreview} alt="Full CTG Preview" />
          </div>
        </div>
      )}
      {/* FOOTER */}
      <footer className="result-footer">
        <p>
          © {new Date().getFullYear()} Druk{" "}
          <span className="footer-e-letter">e</span>Health. All rights reserved.
        </p>
      </footer>
    </div>
  );
}