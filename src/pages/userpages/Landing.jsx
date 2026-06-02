import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaHeartbeat,
  FaUserShield,
  FaArrowRight,
  FaTimes,
  FaLock,
} from "react-icons/fa";
import "./css/Landing.css";

export default function Landing() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="landing-container">
      {/* Background decoration */}
      <div className="bg-circle circle-one"></div>
      <div className="bg-circle circle-two"></div>
      <div className="bg-circle circle-three"></div>

      {/* Admin Button */}
      <button className="admin-btn" onClick={() => setShowModal(true)}>
        <FaUserShield />
        <span>Admin</span>
      </button>

      {/* Main Content */}
      <div className="landing-card">
        <div className="logo-wrapper animated">
          <img
            src="/logo.png"
            alt="Druk eHealth Logo"
            className="logo"
          />
        </div>

        <div className="brand-section animated delay-1">
          <div className="app-badge">
            <FaHeartbeat />
            <span>CTG Scan Application</span>
          </div>

          <h1 className="title">
            <span>Druk </span>
            <span className="e-letter">e</span>
            <span>Health</span>
          </h1>

          <p className="subtitle">
            A simple and secure digital platform for CTG scan access,
            maternal care support, and healthcare guidance.
          </p>
        </div>

        <div className="action-section animated delay-2">
          <button onClick={() => navigate("/home")} className="start-btn">
            Get Started
            <FaArrowRight />
          </button>

          <p className="helper-text">
            Continue to access CTG scan services and medical guidance.
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <div className="modal-icon">
              <FaLock />
            </div>

            <h2>Admin Access</h2>

            <p>
              This area is only for authorized administrators. Continue to the
              admin login dashboard?
            </p>

            <div className="modal-buttons">
              <button
                className="confirm-btn"
                onClick={() => navigate("/login")}
              >
                Yes, Continue
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}