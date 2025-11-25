import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image1 from "../../assets/image1.svg";
import { MdDarkMode, MdLightMode } from "react-icons/md";

// ⬇️ Import GLOBAL theme
import { ThemeContext } from "./ThemeContext";

export default function CTGScan() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ⬇️ Use global theme
  const { theme, toggleTheme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const NODE_API =
    import.meta.env.VITE_NODE_BACKEND ||
    "https://backend-drukhealth.onrender.com/api";

  const FASTAPI_API =
    import.meta.env.VITE_FASTAPI_BACKEND ||
    "https://fastapi-backend-yrc0.onrender.com";

  // ⬇️ Remove local body styling — ThemeContext already handles global colors.

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProceed = async () => {
    if (!imageFile) {
      toast.warn("Please upload or capture an image first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", imageFile);

      const fastApiRes = await axios.post(`${FASTAPI_API}/predict/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const predictionData = fastApiRes.data;

      const nodeData = new FormData();
      nodeData.append("ctgImage", imageFile);

      await axios.post(`${NODE_API}/postCTG`, nodeData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Diagnosis complete!");

      setTimeout(() => {
        navigate("/result", {
          state: {
            imageFile,
            imagePreview,
            result: predictionData,
          },
        });
      }, 1000);
    } catch (err) {
      console.error("❌ CTG Scan error:", err);
      toast.error("Unable to connect to backend. Check server logs.");
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
          transition: "all 0.3s ease",
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
            textAlign: "center",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span style={{ fontSize: "1.8rem" }}>CTG Scan</span>
        </div>

        {/* GLOBAL dark mode toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
          onClick={toggleTheme}
        >
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </div>
      </nav>

      <div style={{ flex: 1, textAlign: "center", paddingTop: "2rem" }}>
        {!imagePreview && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2rem",
              gap: "1.5rem",
            }}
          >
            <img
              src={image1}
              alt="Scan Icon"
              style={{ width: "280px", height: "280px" }}
            />
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
                width: "fit-content",
                minWidth: "200px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
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
              style={{ width: "90%", maxWidth: "420px", borderRadius: "10px" }}
            />

            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleProceed}
                disabled={loading}
                style={{
                  backgroundColor: loading
                    ? "#888"
                    : darkMode
                    ? "#5A9B70"
                    : "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Diagnosing..." : "Diagnose"}
              </button>

              <button
                onClick={handleReturn}
                style={{
                  backgroundColor: darkMode ? "#C94F4F" : "#E74C3C",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
              >
                Return
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
