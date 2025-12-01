import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { ThemeContext } from "./ThemeContext";

export default function ComingSoon() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

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
          position: "relative",
        }}
      >
        {/* Left: Logo */}
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

        {/* Center Title */}
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
          <span className="title" style={{ fontSize: "1.8rem" }}>
            Druk <span className="e-letter">e</span>Health
          </span>
        </div>

        {/* Right: Dark Mode Toggle (same as home page) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          <span onClick={toggleTheme}>
            {darkMode ? <MdLightMode /> : <MdDarkMode />}
          </span>
        </div>
      </nav>

      {/* Coming Soon Section */}
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
        <div
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: darkMode ? "#EAEAEA" : "#0d52bd",
          }}
        >
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
