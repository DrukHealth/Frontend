import { useNavigate } from "react-router-dom";
import "../adminpages/css/Loginsuccess.css";

export default function LoginSuccess() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login"); // Go back to login
  };

  return (
    <div className="success-container">
      <h1>Login Successful!</h1>
      <p>Welcome to DRUK HEALTH admin dashboard.</p>
      <button onClick={handleLogout} className="logout-btn">
        Log Out
      </button>
    </div>
  );
}
