import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import image1 from "../../assets/image1.svg";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { ThemeContext } from "./ThemeContext";

export default function CTGScan() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const NODE_API =
    import.meta.env.VITE_NODE_BACKEND ||
    "https://backend-drukhealth.onrender.com/api";

  const FASTAPI_API = 
  import.meta.env.VITE_FASTAPI_BACKEND || "https://fastapi-backend-yrc0.onrender.com";

  // const FASTAPI_API =
  //   import.meta.env.VITE_FASTAPI_BACKEND ||
  //   "http://127.0.0.1:8000";

  // Upload preview
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // MAIN SCAN LOGIC
  // MAIN SCAN LOGIC
const handleProceed = async () => {
  if (!imageFile) {
    toast.warn("Please upload or capture an image first.");
    return;
  }

  try {
    setLoading(true);

    // Send to FastAPI
    const formData = new FormData();
    formData.append("file", imageFile);

    const fastApiRes = await axios.post(`${FASTAPI_API}/predict/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const predictionData = fastApiRes.data;

    if (!predictionData.isCTG) {
      toast.error("❌ Oops! The uploaded image is not a valid or clear CTG image. Please try again.");
      setLoading(false);
      return;
    }

    // Send to Node backend
    const nodeData = new FormData();
    nodeData.append("ctgImage", imageFile);
    nodeData.append("result", predictionData.label || "Normal");

    await axios.post(`${NODE_API}/postCTG`, nodeData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Diagnosis complete!");

    setTimeout(() => {
      navigate("/result", {
        state: { imageFile, imagePreview, result: predictionData },
      });
    }, 800);

  } catch (err) {
    console.error("❌ CTG Scan error:", err);
    toast.error("Unable to analyze image. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleReturn = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#2B2F3A" : "#FFFFFF",
        color: darkMode ? "#E0E0E0" : "#0d52bd",
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme={darkMode ? "dark" : "light"}
      />

      {/* NAVBAR */}
      <nav
        className="navbar"
        style={{
          padding: "10px 20px",
          backgroundColor: darkMode ? "#3A3F4A" : "#e2edfb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          height: "90px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          onClick={() => navigate("/home")}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginLeft: "-30px",
          }}
        >
          <img
            src={darkMode ? "/logo2.png" : "/Latestlogo.png"}
            alt="Druk eHealth Logo"
            style={{
              height: "115px",
              filter: darkMode
                ? "drop-shadow(0px 0px 8px rgba(255,255,255,0.3))"
                : "none",
              transition: "0.3s ease",
            }}
          />
        </div>

        <div
          style={{
            fontWeight: "bold",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "1.8rem",
          }}
        >
          CTG Scan
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

      {/* MAIN CONTENT */}
      <div style={{ textAlign: "center", paddingTop: "2rem" }}>
        {!imagePreview && (
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            <img src={image1} alt="Scan Icon" style={{ width: "260px" }} />

            <label
              htmlFor="fileUpload"
              style={{
                backgroundColor: "#679ADC",
                color: "white",
                padding: "14px 28px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                minWidth: "200px",
              }}
            >
              Upload CTG Record
            </label>

            <input
              type="file"
              id="fileUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
          </div>
        )}

        {imagePreview && (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "90%",
                maxWidth: "420px",
                borderRadius: "12px",
                marginTop: "1rem",
              }}
            />
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                paddingBottom: "120px",  // <-- THE FIX
              }}
            >

              <button
                onClick={handleProceed}
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#777" : "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                {loading ? "Diagnosing..." : "Diagnose"}
              </button>

              <button
                onClick={handleReturn}
                style={{
                  backgroundColor: "#E74C3C",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                Return
              </button>
            </div>
          </>
        )}
      </div>
      {/* Footer */}
      <footer
        className={`footer ${darkMode ? "dark" : ""}`}
        style={{
          backgroundColor: darkMode ? "#222" : "#e2edfb",
          color: darkMode ? "#EAEAEA" : "#0d52bd",
          textAlign: "center",
          padding: "18px 10px",
          fontSize: "0.95rem",
        }}
      >
        <p>
          © {new Date().getFullYear()} Druk{" "}
          <span className="e-letter">e</span>Health. All rights reserved.
        </p>
      </footer>
    </div>
    
  );
}
