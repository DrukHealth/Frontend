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

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#0d0d0d" : "#FFFFFF",
        color: darkMode ? "#F7F7F7" : "#0d52bd",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s ease",
      }}
      className="home-container"
    >
      {/* ===================== NAV BAR ===================== */}
      <nav
        className="navbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: darkMode ? "rgba(20,20,20,0.9)" : "#e2edfb",
          backdropFilter: darkMode ? "blur(6px)" : "none",
          boxShadow: darkMode
            ? "0 2px 6px rgba(255,255,255,0.08)"
            : "0 2px 4px rgba(0,0,0,0.1)",
          height: "90px",
          transition: "0.3s ease",
        }}
      >
        {/* LEFT: Logo */}
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
            src={darkMode ? "/logo2.png" : "/Latestlogo.png"}
            alt="Druk eHealth Logo"
            style={{
              height: "115px",
              filter: darkMode
                ? "drop-shadow(0px 0px 8px rgba(255,255,255,0.3))"
                : "none",
              transition: "0.3s ease",
            }}
          />
        </div>

        {/* CENTER: Main Title */}
        <div
          style={{
            fontWeight: "bold",
            textAlign: "center",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span
            className="title"
            style={{
              fontSize: "1.8rem",
              textShadow: darkMode
                ? "0 0 8px rgba(255,255,255,0.25)"
                : "0px 3px 6px rgba(0,0,0,0.35)",
            }}
          >
            <span style={{ color: darkMode ? "#FFFFFF" : "#0d52bd" }}>
              Druk{" "}
            </span>
            <span
              className="e-letter"
              style={{
                color: "#ffc400",
                filter: "drop-shadow(0 0 4px rgba(255,215,0,0.6))",
              }}
            >
              e
            </span>
            <span style={{ color: darkMode ? "#FFFFFF" : "#0d52bd" }}>
              Health
            </span>
          </span>
        </div>

        {/* RIGHT: Dark Mode Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.7rem",
            cursor: "pointer",
            color: darkMode ? "#ffc400" : "#0d52bd",
          }}
        >
          <span onClick={toggleTheme}>
            {darkMode ? <MdLightMode /> : <MdDarkMode />}
          </span>
        </div>
      </nav>

      {/* ===================== SERVICES ===================== */}
      <section className="services">
        <h2
          className="services-title"
          style={{
            color: darkMode ? "#F7F7F7" : "#2966c1ff",
            textShadow: darkMode ? "0 0 6px rgba(255,255,255,0.2)" : "none",
          }}
        >
          Our Services
        </h2>

        <div className="services-grid">
          {[
            {
              icon: <FaHeartbeat size={40} color="#0d52bd" />,
              title: "CTG Scan",
              text: "Monitor fetal health with real-time CTG analysis.",
              link: "/ctg-scan",
            },
            {
              icon: <FaBookMedical size={40} color="#0d52bd" />,
              title: "Guidelines",
              text: "Access essential medical and pregnancy guidelines.",
              link: "/guidelines",
            },
            {
              icon: <FaHospital size={40} color="#0d52bd" />,
              title: "OTG",
              text: "On-the-go medical support for remote healthcare.",
              link: "/otg",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="service-card"
              onClick={() => navigate(card.link)}
              style={{
                backgroundColor: darkMode ? "rgba(255,255,255,0.07)" : "white",
                backdropFilter: darkMode ? "blur(8px)" : "none",
                border: darkMode
                  ? "1px solid rgba(255,255,255,0.12)"
                  : "none",
                color: darkMode ? "#ffffff" : "#0d52bd",
                boxShadow: darkMode
                  ? "0 4px 15px rgba(255,255,255,0.05)"
                  : "0 4px 12px rgba(0,0,0,0.15)",
                transition: "0.3s ease",
              }}
            >
              {/* ICON COLOR FIX */}
              {darkMode
                ? React.cloneElement(card.icon, { color: "#ffffff" })
                : card.icon}

              <h3 style={{ color: darkMode ? "#ffffff" : "#0d52bd" }}>
                {card.title}
              </h3>

              <p style={{ color: darkMode ? "#dcdcdc" : "#0d52bd" }}>
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer
        className={`footer ${darkMode ? "dark" : ""}`}
        style={{
          backgroundColor: darkMode ? "rgba(20,20,20,0.9)" : "#e2edfb",
          color: darkMode ? "#EAEAEA" : "#0d52bd",
          padding: "20px 0",
          textAlign: "center",
          transition: "0.3s ease",
        }}
      >
        <p>
          © {new Date().getFullYear()} Druk{" "}
          <span className="e-letter" style={{ color: "#ffc400" }}>
            e
          </span>
          Health. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
