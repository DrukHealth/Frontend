import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat, FaBookMedical, FaHospital } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import "./css/Home.css";
import { ThemeContext } from "./ThemeContext";

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const darkMode = theme === "dark";

  const services = [
    {
      icon: <FaHeartbeat size={40} />,
      title: "CTG Scan",
      text: "Monitor fetal health with real-time CTG analysis.",
      link: "/ctg-scan",
    },
    {
      icon: <FaBookMedical size={40} />,
      title: "Guidelines",
      text: "Access essential medical and pregnancy guidelines.",
      link: "/guidelines",
    },
    {
      icon: <FaHospital size={40} />,
      title: "OTG",
      text: "On-the-go medical support for remote healthcare.",
      link: "/otg",
    },
  ];

  return (
    <div className={`home-container ${darkMode ? "dark" : "light"}`}>
      {/* ===================== NAV BAR ===================== */}
      <nav className="navbar">
        {/* LEFT: Logo */}
        <div className="nav-logo-box" onClick={() => navigate("/home")}>
          <img
            src={darkMode ? "/logo2.png" : "/Latestlogo.png"}
            alt="Druk eHealth Logo"
            className="nav-logo"
          />
        </div>

        {/* CENTER: Main Title */}
        <div className="nav-title">
          <span className="title">
            <span>Druk </span>
            <span className="e-letter">e</span>
            <span>Health</span>
          </span>
        </div>

        {/* RIGHT: Dark Mode Toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
      </nav>

      {/* ===================== SERVICES ===================== */}
      <section className="services">
        <h2 className="services-title">Our Services</h2>

        <p className="services-subtitle">
          Choose a service to continue with CTG scan, pregnancy guidelines, or
          remote healthcare support.
        </p>

        <div className="services-grid">
          {services.map((card, index) => (
            <div
              key={index}
              className="service-card"
              onClick={() => navigate(card.link)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  navigate(card.link);
                }
              }}
            >
              <div className="service-icon">{card.icon}</div>

              <h3>{card.title}</h3>

              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Druk{" "}
          <span className="footer-e-letter">e</span>Health. All rights reserved.
        </p>
      </footer>
    </div>
  );
}