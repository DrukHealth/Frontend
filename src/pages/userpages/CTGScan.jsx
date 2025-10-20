import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import "./css/CTGScan.css";

export default function CTGScan() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Upload Image
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Open Camera
  const handleCapture = async () => {
    setCapturing(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  // Take Photo
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

  // Stop Camera
  const stopCamera = () => {
    setCapturing(false);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  // Proceed to Diagnosis
  const handleProceed = () => {
    if (!imageFile) return alert("Please upload or capture an image first.");
    navigate("/result", { state: { imageFile } });
  };

  // Reset and go back to initial state
  const handleReturn = () => {
    setImageFile(null);
    setImagePreview(null);
    stopCamera();
  };

  return (
    <div className="ctgscan-container">
      {/* Navbar */}
 <nav className="navbar">
  <div
    className="nav-left"
    onClick={() => navigate("/home")}
    style={{ cursor: "pointer" }}
  >
    <img src="/logo.png" alt="Druk eHealth Logo" className="nav-logo" />
  </div>

  <div className="nav-title">CTG Scan</div>
</nav>

      {/* Main Section */}
      <div className="ctgscan-body">
        <h2>CTG Scan</h2>

        {/* Camera Section */}
        {capturing && (
          <div className="camera-section">
            <video ref={videoRef} className="camera-view" />
            <button onClick={takePhoto} className="capture-btn">
              Capture Photo
            </button>
            <button onClick={stopCamera} className="cancel-btn">
              Cancel
            </button>
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && (
          <div className="preview">
            <img src={imagePreview} alt="Preview" className="preview-img" />
          </div>
        )}

        {/* Upload or Capture (when no image) */}
        {!imagePreview && !capturing && (
          <div className="upload-options">
            <label htmlFor="upload" className="upload-btn">
              Upload Photo
            </label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleUpload}
            />
            <button onClick={handleCapture} className="capture-btn">
              Take Photo
            </button>
          </div>
        )}

        {/* Diagnose & Return (when image selected) */}
        {imagePreview && (
          <div className="action-buttons">
            <button onClick={handleProceed} className="return-btn">
              Diagnose
            </button>
            <button onClick={handleReturn} className="return-btn">
              Return
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Druk eHealth. All rights reserved.</p>
      </footer>
    </div>
  );
}
