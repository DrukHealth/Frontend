import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Home.css";

export default function Home() {
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
          <img src="/logo.png" alt="Druk eHealth Logo" style={{ height: "70px" }} />
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
          Welcome to{" "}
          <span className="title">
            Druk <span className="e-letter">e</span>Health
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

      {/* Services Section */}
      <section className="services">
        <h2 className="services-title">Our Services</h2>

        <div className="services-grid">
          <div className="service-card" onClick={() => navigate("/ctg-scan")}>
            <h3>CTG Scan</h3>
            <p>Monitor fetal health and contractions with real-time analysis.</p>
          </div>

          <div className="service-card">
            <h3>Guidelines</h3>
            <p>Access medical and pregnancy care guidelines instantly.</p>
          </div>

          <div className="service-card">
            <h3>OTG</h3>
            <p>On-the-go medical assistance for remote healthcare support.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Druk eHealth. All rights reserved.</p>
      </footer>
    </div>
  );
}
