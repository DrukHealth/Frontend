import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image1 from "../../assets/image1.svg";

export default function CTGScan() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000/api"; // Node backend

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1E1E1E" : "#F5F5F5";
    document.body.style.color = darkMode ? "#FFFFFF" : "#000000";
  }, [darkMode]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCapture = async () => {
    try {
      setCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      toast.error("Unable to access the camera. Please allow permission.");
      console.error(err);
    }
  };

  const takePhoto = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.png", { type: "image/png" });
      setImageFile(file);
      setImagePreview(URL.createObjectURL(blob));
      stopCamera();
    }, "image/png");
  };

  const stopCamera = () => {
    setCapturing(false);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  // ✅ Upload to Node and then navigate to Result page (Python handles model)
  const handleProceed = async () => {
    if (!imageFile)
      return toast.warn("Please upload or capture an image first.");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("ctgImage", imageFile);

      await axios.post(`${BASE_URL}/postCTG`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Image uploaded successfully!");

      setTimeout(() => {
        navigate("/result", {
          state: { imageFile, imagePreview }, // 👈 pass actual file & preview
        });
      }, 1200);
    } catch (err) {
      console.error("❌ Error uploading CTG image:", err);
      toast.error("Unable to connect to the backend. Please check server logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    setImageFile(null);
    setImagePreview(null);
    stopCamera();
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#FFFFFF",
        color: darkMode ? "#EAEAEA" : "#0d52bd",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ToastContainer position="top-center" autoClose={2000} theme={darkMode ? "dark" : "light"} />

      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: darkMode ? "#222" : "#E2EDFB",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          height: "92px",
        }}
      >
        <div onClick={() => navigate("/home")} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="Druk eHealth Logo" style={{ height: "70px" }} />
        </div>

        <div style={{ fontSize: "2.5rem", fontWeight: "bold", flex: 1, textAlign: "center" }}>CTG Scan</div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ position: "relative", display: "inline-block", width: "50px", height: "26px" }}>
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)}
              style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{
              position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: darkMode ? "#444" : "#ccc", transition: "0.4s", borderRadius: "34px"
            }}>
              <span style={{
                position: "absolute", height: "18px", width: "18px",
                left: darkMode ? "26px" : "4px", bottom: "4px", backgroundColor: "white",
                transition: "0.4s", borderRadius: "50%"
              }}></span>
            </span>
          </label>
        </div>
      </nav>

      {/* Body */}
      <div style={{ flex: 1, textAlign: "center", paddingTop: "2rem" }}>
        {capturing && (
          <div>
            <video ref={videoRef} />
            <div style={{ marginTop: "1rem" }}>
              <button onClick={takePhoto} style={buttonStyle("#4CAF50")}>Capture Photo</button>
              <button onClick={stopCamera} style={buttonStyle("#E74C3C")}>Cancel</button>
            </div>
          </div>
        )}

        {imagePreview && (
          <div>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "400px",
                height: "auto",
                borderRadius: "10px",
                boxShadow: darkMode
                  ? "0 0 10px rgba(255,255,255,0.2)"
                  : "0 0 10px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        )}

        {!imagePreview && !capturing && (
          <div style={emptyStateContainer}>
            <img src={image1} alt="Scan Icon" style={{ width: "400px", height: "400px" }} />
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button onClick={handleCapture} style={primaryButtonStyle(darkMode)}>
                Scan CTG Record Image
              </button>
              <label htmlFor="fileUpload" style={primaryButtonStyle(darkMode)}>
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
          </div>
        )}

        {imagePreview && (
          <div style={actionButtonsContainer}>
            <button
              onClick={handleProceed}
              disabled={loading}
              style={{
                ...buttonStyle(loading ? "#888" : "#4CAF50"),
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Diagnosing..." : "Diagnose"}
            </button>
            <button onClick={handleReturn} style={buttonStyle("#E74C3C")}>
              Return
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "1rem",
          textAlign: "center",
          backgroundColor: darkMode ? "#222" : "#E8EEF5",
          color: darkMode ? "#AAA" : "#000",
        }}
      >
        <p>© {new Date().getFullYear()} Druk eHealth. All rights reserved.</p>
      </footer>
    </div>
  );
}

const buttonStyle = (bg) => ({
  backgroundColor: bg,
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
});

const primaryButtonStyle = (darkMode) => ({
  backgroundColor: darkMode ? "#4C8BE8" : "#679ADC",
  color: "white",
  padding: "12px 24px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  border: "none",
  transition: "background 0.3s",
});

const emptyStateContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: "1rem",
  marginTop: "2rem",
};

const actionButtonsContainer = {
  marginTop: "2rem",
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
};
