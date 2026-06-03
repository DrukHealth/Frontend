import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaArrowLeft, FaClock, FaHeartbeat } from "react-icons/fa";
import { ThemeContext } from "./ThemeContext";
import "./css/ComingSoon.css";

export default function ComingSoon() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const darkMode = theme === "dark";

  return (
    <div className={`comingsoon-page ${darkMode ? "dark" : "light"}`}>
      {/* ===================== NAVBAR ===================== */}
      <nav className="comingsoon-navbar">
        {/* LEFT: Logo */}
        <div
          className="comingsoon-logo-box"
          onClick={() => navigate("/home")}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              navigate("/home");
            }
          }}
        >
          <img
            src={darkMode ? "/logo2.png" : "/Latestlogo.png"}
            alt="Druk eHealth Logo"
            className="comingsoon-logo"
          />
        </div>

        {/* CENTER: Title */}
        <div className="comingsoon-nav-title">
          <span>
            Druk <span className="comingsoon-e-letter">e</span>Health
          </span>
        </div>

        {/* RIGHT: Dark Mode Toggle */}
        <button
          className="comingsoon-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
      </nav>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="comingsoon-main">
        <section className="comingsoon-card">
          <div className="comingsoon-icon">
            <FaClock />
          </div>

          <div className="comingsoon-label">
            <FaHeartbeat />
            <span>Service Update</span>
          </div>

          <h1>Coming Soon</h1>

          <p>
            This service is currently under development. We are working to bring
            this feature to Druk eHealth soon.
          </p>

          <button
            className="comingsoon-back-btn"
            onClick={() => navigate("/home")}
          >
            {/* <FaArrowLeft /> */}
            Back to Home
          </button>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="comingsoon-footer">
        <p>
          © {new Date().getFullYear()} Druk{" "}
          <span className="footer-e-letter">e</span>Health. All rights reserved.
        </p>
      </footer>
    </div>
  );
}