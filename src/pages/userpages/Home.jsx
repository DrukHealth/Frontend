import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat, FaBookMedical, FaHospital } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import "./css/Home.css";
import { ThemeContext } from "./ThemeContext";

export default function Home() {
  const navigate = useNavigate();

  // ⬇️ Pull theme + toggle from global context
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
      }}
      className="home-container"
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
        {/* Left: Logo */}
        <div
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", marginLeft: "-30px" }}
        >
          <img src="/Latestlogo.png" alt="Druk eHealth Logo" style={{ height: "115px" }} />
        </div>

        {/* Center: Title */}
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

        {/* Right: Dark Mode Toggle */}
        <div style={{ display: "flex", alignItems: "center", fontSize: "1.5rem", cursor: "pointer" }}>
          <span onClick={toggleTheme}>
            {darkMode ? <MdLightMode /> : <MdDarkMode />}
          </span>
        </div>
      </nav>

      {/* Services Section */}
      <section className="services">
        <h2 className="services-title" style={{ color: darkMode ? "#EAEAEA" : "#0d52bd" }}>
          Our Services
        </h2>

        <div className="services-grid">
          <div className="service-card" onClick={() => navigate("/ctg-scan")}>
            <FaHeartbeat size={40} color="#0d52bd" />
            <h3>CTG Scan</h3>
            <p>Monitor fetal health and contractions with real-time analysis.</p>
          </div>

          <div className="service-card" onClick={() => navigate("/guidelines")}>
            <FaBookMedical size={40} color="#0d52bd" />
            <h3>Guidelines</h3>
            <p>Access medical and pregnancy care guidelines instantly.</p>
          </div>

          <div className="service-card" onClick={() => navigate("/otg")}>
            <FaHospital size={40} color="#0d52bd" />
            <h3>OTG</h3>
            <p>On-the-go medical assistance for remote healthcare support.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`footer ${darkMode ? "dark" : ""}`}
        style={{
          backgroundColor: darkMode ? "#222" : "#e2edfb",
          color: darkMode ? "#EAEAEA" : "#0d52bd",
        }}
      >
        <p>
          © {new Date().getFullYear()} Druk <span className="e-letter">e</span>Health. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
