import "./Home.css";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <img src="/logo.png" alt="Druk eHealth Logo" className="nav-logo" />
        </div>

        <div className="nav-title">
          Welcome to{" "}
          <span className="title">
            Druk <span className="e-letter">e</span>Health
          </span>
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
