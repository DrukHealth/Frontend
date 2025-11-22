// Frontend/src/hooks/useSessionTimeout.js

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * useSessionTimeout
 * Auto-logs out the user when session expires.
 * @param {number} expiryMinutes - How many minutes until session expires (default 30)
 */
export default function useSessionTimeout(expiryMinutes = 30) {
  const navigate = useNavigate();

  useEffect(() => {
    const expiryTime = expiryMinutes * 60 * 1000; // convert minutes to milliseconds

    const checkSession = () => {
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      if (!tokenExpiry || Date.now() > Number(tokenExpiry)) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("superAdminToken");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("superAdminEmail");
        localStorage.removeItem("tokenExpiry");

        alert("⚠️ Session expired. Please log in again.");
        navigate("/login");
      }
    };

    // Initial check
    checkSession();

    // Interval check every 1 minute
    const interval = setInterval(checkSession, 60 * 1000);

    return () => clearInterval(interval);
  }, [expiryMinutes, navigate]);
}
