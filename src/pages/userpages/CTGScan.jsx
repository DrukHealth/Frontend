import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../../assets/image1.svg";

export default function CTGScan() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

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
    setCapturing(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
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

  const handleProceed = () => {
    if (!imageFile) return alert("Please upload or capture an image first.");
    navigate("/result", { state: { imageFile } });
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
      {/* NAVBAR */}
      <nav
        className="navbar"
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
        {/* Left: Logo */}
        <div
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        > 
          <img
            src="/logo.png"
            alt="Druk eHealth Logo"
            style={{ height: "70px" }}
          />
        </div>

        {/* Center: Title */}
        <div
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          }}
        >
          CTG Scan
        </div>

        {/* Right: Dark Mode Button */}
        {/* <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              backgroundColor: darkMode ? "#444" : "#679ADC",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = darkMode ? "#555" : "#5A88C0")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = darkMode ? "#444" : "#679ADC")
            }
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div> */}

        {/* Right: Dark Mode Toggle Switch */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            style={{
              position: "relative",
              display: "inline-block",
              width: "50px",
              height: "26px",
            }}
          >
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: darkMode ? "#444" : "#ccc",
                transition: "0.4s",
                borderRadius: "34px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  height: "18px",
                  width: "18px",
                  left: darkMode ? "26px" : "4px",
                  bottom: "4px",
                  backgroundColor: "white",
                  transition: "0.4s",
                  borderRadius: "50%",
                }}
              ></span>
            </span>
          </label>
        </div>

      </nav>
{/* ////////////////////////////////////////// */}
      {/* BODY */}
      {/* <div style={{ flex: 1, textAlign: "center", paddingTop: "2rem" }}>
        {capturing && (
          <div>
            <video ref={videoRef} />
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={takePhoto}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "1rem",
                }}
              >
                Capture Photo
              </button>
              <button
                onClick={stopCamera}
                style={{
                  backgroundColor: "#E74C3C",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <img
              src={image1}
              alt="Scan Icon"
              style={{ width: "400px", height: "400px" }}
            />
            <button
              onClick={handleCapture}
              style={{
                backgroundColor: darkMode ? "#4C8BE8" : "#679ADC",
                color: "white",
                padding: "12px 24px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = darkMode ? "#3C7BD6" : "#5A88C0")
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = darkMode ? "#4C8BE8" : "#679ADC")
              }
            >
              Scan CTG Record Image
            </button>
          </div>
        )}

        {imagePreview && (
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
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Diagnose
            </button>
            <button
              onClick={handleReturn}
              style={{
                backgroundColor: "#E74C3C",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Return
            </button>
          </div>
        )}
      </div> */}
      {/* //////////////////////////////////////////////////// */}

      {/* Body  */}
      <div style={{ flex: 1, textAlign: "center", paddingTop: "2rem" }}>
      {capturing && (
      <div>
        <video ref={videoRef} />
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={takePhoto}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            Capture Photo
          </button>
          <button
            onClick={stopCamera}
            style={{
              backgroundColor: "#E74C3C",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <img src={image1} alt="Scan Icon" style={{ width: "400px", height: "400px" }} />

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          {/* Scan Button */}
          <button
            onClick={handleCapture}
            style={{
              backgroundColor: darkMode ? "#4C8BE8" : "#679ADC",
              color: "white",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = darkMode ? "#3C7BD6" : "#5A88C0")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = darkMode ? "#4C8BE8" : "#679ADC")
            }
          >
            Scan CTG Record Image
          </button>

          {/* Upload Button */}
          <label
            htmlFor="fileUpload"
            style={{
              backgroundColor: darkMode ? "#4C8BE8" : "#679ADC",
              color: "white",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = darkMode ? "#3C7BD6" : "#5A88C0")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = darkMode ? "#4C8BE8" : "#679ADC")
            }
          >
            Upload CTG Record
          </label>
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result);
                reader.readAsDataURL(file);
                setImageFile(file);
              }
            }}
          />
        </div>
      </div>
    )}

    {imagePreview && (
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
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Diagnose
        </button>
        <button
          onClick={handleReturn}
          style={{
            backgroundColor: "#E74C3C",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Return
        </button>
      </div>
    )}
  </div>


      {/* FOOTER */}
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
