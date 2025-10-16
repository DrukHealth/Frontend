import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <img src="/logo.png" alt="Druk eHealth Logo" className="logo animated" />

      <h1 className="title animated">
        Druk <span className="e-letter">e</span>Health
      </h1>

      <button onClick={() => navigate("/home")} className="start-btn animated">
        Get Started
      </button>
    </div>
  );
}
