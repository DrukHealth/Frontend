import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./css/Landing.css";

export default function Landing() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLoginClick = () => {
    setShowModal(true);
  };

  const confirmLogin = () => {
    setShowModal(false);
    navigate("/login");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="landing-container">
      {/* Header with Login Button */}
      <div className="landing-header">
        <button onClick={handleLoginClick} className="login-btn">
          Login
        </button>
      </div>

      {/* Logo and Title */}
      <img src="/logo.png" alt="Druk eHealth Logo" className="logo animated" />

      <h1 className="title animated">
        Druk <span className="e-letter">e</span>Health
      </h1>

      <button onClick={() => navigate("/home")} className="start-btn animated">
        Get Started
      </button>

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