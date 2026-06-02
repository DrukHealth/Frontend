import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./css/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const NODE_API = "https://backend-drukhealth.onrender.com";
  // const NODE_API = "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage({ type: "", text: "" });

    if (!email.trim() || !password.trim()) {
      setMessage({
        type: "error",
        text: "Please enter both email and password.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${NODE_API}/api/manage/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminEmail", data.data.email);
        localStorage.setItem("adminRole", data.data.role);

        setMessage({
          type: "success",
          text: `Welcome ${
            data.data.role === "super_admin" ? "Super Admin" : "Admin"
          }. Redirecting...`,
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 700);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Invalid email or password.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        type: "error",
        text: "Unable to reach the server. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <section className="login-left">
        <div className="brand-card">
          <img src="/logo2.png" alt="Druk eHealth logo" />

          <h2>
            Druk{" "}
            <span className="brand-health">
              <span className="e-letter">e</span>Health
            </span>
          </h2>

          <p>
            Secure fetal health monitoring and clinical data analysis platform.
          </p>
        </div>
      </section>

      <section className="login-right">
        <form className="login-box" onSubmit={handleLogin}>
          <div className="login-header">
            <span className="login-badge">Admin Portal</span>
            <h1>Welcome Back</h1>
            <p>Login to continue to your Druk eHealth dashboard.</p>
          </div>

          {message.text && (
            <div className={`login-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? <span className="btn-loader"></span> : "Log In"}
          </button>

          <div className="forgot-password-container">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;