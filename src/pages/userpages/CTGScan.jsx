import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { getCroppedImg } from "../../utils/cropImage";
import { rotateImageBlob } from "../../utils/rotateImage";

import image1 from "../../assets/image1_transparent_cropped.png";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import {
  FaUpload,
  FaHeartbeat,
  FaArrowLeft,
  FaCheckCircle,
  FaRedo,
  FaTimes,
  FaCropAlt,
} from "react-icons/fa";
import { ThemeContext } from "./ThemeContext";
import "./css/CTGScan.css";

export default function CTGScan() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [rawPreview, setRawPreview] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  const [crop, setCrop] = useState({
    unit: "px",
    x: 40,
    y: 40,
    width: 320,
    height: 200,
  });

  const imgRef = useRef(null);
  const navigate = useNavigate();

  const { theme, toggleTheme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const NODE_API =
    import.meta.env.VITE_NODE_BACKEND || "http://localhost:9000/api";

  const FASTAPI_API =
    import.meta.env.VITE_FASTAPI_BACKEND || "http://127.0.0.1:9000";

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setRawPreview(url);

    setImageFile(null);
    setImagePreview(null);

    setCrop({
      unit: "px",
      x: 40,
      y: 40,
      width: 320,
      height: 200,
    });

    setShowCrop(true);
  };

  const handleRotate = async (direction = "right") => {
    if (!rawPreview) return;

    try {
      const deg = direction === "right" ? 90 : -90;
      const blob = await rotateImageBlob(rawPreview, deg);
      const newUrl = URL.createObjectURL(blob);

  

      setRawPreview(newUrl);

      setCrop({
        unit: "px",
        x: 40,
        y: 40,
        width: 320,
        height: 200,
      });

      toast.info("Image rotated");
    } catch (err) {
      console.error(err);
      toast.error("Rotation failed. Please try again.");
    }
  };

  const handleConfirmCrop = async () => {
    if (!rawPreview) return toast.warn("No image to crop.");
    if (!crop?.width || !crop?.height) {
      return toast.warn("Please select a crop area.");
    }
    if (!imgRef.current) return toast.warn("Image not ready yet.");

    try {
      const blob = await getCroppedImg(rawPreview, crop, imgRef.current);

      const croppedFile = new File([blob], "ctg_cropped.jpg", {
        type: "image/jpeg",
      });

      setImageFile(croppedFile);
      setImagePreview(URL.createObjectURL(croppedFile));
      setShowCrop(false);

      toast.success("Crop saved. Ready to diagnose.");
    } catch (err) {
      console.error(err);
      toast.error("Cropping failed. Please try again.");
    }
  };

  const handleCancelCrop = () => {
    setShowCrop(false);
    setRawPreview(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleProceed = async () => {
    if (!imageFile) {
      toast.warn("Please upload and crop an image first.");
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

      if (!predictionData?.isCTG) {
        toast.error("Not a valid or clear CTG image. Please try again.");
        return;
      }

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
      console.error("CTG Scan error:", err);
      toast.error("Unable to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    setImageFile(null);
    setImagePreview(null);
    setRawPreview(null);
    setShowCrop(false);
  };

  return (
    <div className={`ctg-page ${darkMode ? "dark" : "light"}`}>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme={darkMode ? "dark" : "light"}
      />

      {/* NAVBAR */}
      <nav className="ctg-navbar">
        <div className="ctg-logo-box" onClick={() => navigate("/home")}>
          <img
            src={darkMode ? "/logo2.png" : "/Latestlogo.png"}
            alt="Druk eHealth Logo"
            className="ctg-logo"
          />
        </div>

        <div className="ctg-nav-title">
          {/* <FaHeartbeat /> */}
          <span>CTG Scan</span>
        </div>

        <button
          className="ctg-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
      </nav>

      {/* CROP MODAL */}
      {showCrop && rawPreview && (
        <div className="crop-modal-overlay">
          <div className="crop-modal">
            <div className="crop-modal-header">
              <div>
                <h3>
                  <FaCropAlt /> Crop CTG Trace
                </h3>
                <p>Drag the corners to select the CTG graph area.</p>
              </div>

              <button className="crop-close-btn" onClick={handleCancelCrop}>
                <FaTimes />
              </button>
            </div>

            <div className="crop-toolbar">
              <button onClick={() => handleRotate("left")}>⟲ Rotate Left</button>
              <button onClick={() => handleRotate("right")}>⟳ Rotate Right</button>
            </div>

            <div className="crop-image-area">
              <ReactCrop crop={crop} onChange={(next) => setCrop(next)} keepSelection>
                <img
                  ref={imgRef}
                  src={rawPreview}
                  alt="CTG"
                  className="crop-image"
                />
              </ReactCrop>
            </div>

            <div className="crop-actions">
              <button className="cancel-btn" onClick={handleCancelCrop}>
                Cancel
              </button>

              <button className="confirm-btn" onClick={handleConfirmCrop}>
                Confirm Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="ctg-main">
        {!imagePreview && (
          <section className="upload-section">
            <div className="upload-card">
              <div className="upload-text">
                <div className="page-badge">
                  <FaHeartbeat />
                  <span>Fetal Heart Monitoring</span>
                </div>

                <h1>Upload CTG Record</h1>

                <p>
                  Upload a clear CTG image, crop the trace area, and continue to
                  diagnosis. Make sure the graph is readable for better results.
                </p>

                <div className="upload-tips">
                  <div>
                    <FaCheckCircle />
                    <span>Use a clear image</span>
                  </div>
                  <div>
                    <FaCheckCircle />
                    <span>Crop only the CTG trace</span>
                  </div>
                  <div>
                    <FaCheckCircle />
                    <span>Rotate if the image is sideways</span>
                  </div>
                </div>

                <label htmlFor="fileUpload" className="upload-btn">
                  <FaUpload />
                  Upload CTG Record
                </label>

                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  onChange={handleUpload}
                />
              </div>

              <div className="upload-illustration">
                <div className="upload-illustration-frame">
                  <img src={image1} alt="CTG upload illustration" />
                </div>
              </div>
            </div>
          </section>
        )}

        {imagePreview && (
          <section className="preview-section">
            <div className="preview-card">
              <div className="preview-header">
                <div>
                  <h1>CTG Image Ready</h1>
                  <p>Review the cropped image before starting diagnosis.</p>
                </div>

                <button className="recrop-btn" onClick={() => setShowCrop(true)}>
                  <FaRedo />
                  Re-crop / Rotate
                </button>
              </div>

              <div className="preview-image-wrapper">
                <img src={imagePreview} alt="Preview" className="preview-image" />
              </div>

              <div className="preview-actions">
                <button
                  className="diagnose-btn"
                  onClick={handleProceed}
                  disabled={loading}
                >
                  {loading ? "Diagnosing..." : "Diagnose"}
                </button>

                <button className="return-btn" onClick={handleReturn}>
                  <FaArrowLeft />
                  Return
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="ctg-footer">
        <p>
          © {new Date().getFullYear()} Druk{" "}
          <span className="footer-e-letter">e</span>Health. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
