import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./css/Landing.css";

export default function Landing() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="landing-container">

      <div className="landing-content">
        <img
          src="/logo.png"
          alt="Druk eHealth Logo"
          className="logo animated"
        />

      <h1 className="title animated delay-1">
        <span style={{ color: "white" }}>Druk </span>
        <span className="e-letter" style={{ color: "#ffc400" }}>e</span>
        <span style={{ color: "white" }}>Health</span>
      </h1>


        <button
          onClick={() => navigate("/home")}
          className="start-btn animated delay-2"
        >
          Get Started
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Admin Access</h2>
            <p>Only administrators can access this dashboard. Continue to login?</p>

            <div className="modal-buttons">
              <button className="confirm-btn" onClick={() => navigate("/login")}>
                Yes, Continue
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
