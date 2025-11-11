import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#FFFFFF",
        color: darkMode ? "#EAEAEA" : "#0d52bd",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Altos Sans, sans-serif",
      }}
    >
      {/* Navigation Bar */}
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
        {/* Left: Logo - Extreme left with no spacing */}
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
            src="/Latestlogo.png" 
            alt="Druk eHealth Logo" 
            style={{ height: "115px" }} 
          />
        </div>

        {/* Center: Title - Now with "Coming Soon" text */}
        <div
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: darkMode ? "#EAEAEA" : "#0d52bd",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span className="title" style={{fontSize: "1.8rem",color: darkMode ? "#EAEAEA" : "#0d52bd" }}>
          </span>
        </div>

        {/* Right: Dark Mode Toggle */}
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

      {/* Coming Soon Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{
          fontSize: "4rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          color: darkMode ? "#EAEAEA" : "#0d52bd",
        }}>
                    Coming Soon!

        </div>
    
        
    
        
        <button
          onClick={() => navigate("/home")}
          style={{
            backgroundColor: darkMode ? "#4C8BE8" : "#679ADC",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Back to Home
        </button>
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