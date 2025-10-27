import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// === User Pages ===
import Landing from "./pages/userpages/Landing.jsx";
import Home from "./pages/userpages/Home.jsx";
import CTGScan from "./pages/userpages/CTGScan.jsx";
import Diagnosis from "./pages/userpages/Diagnosis.jsx";
import Result from "./pages/userpages/Result.jsx";

// === Admin Pages ===
import LoginPage from "./pages/adminpages/LoginPage.jsx";
import ForgotPassword from "./pages/adminpages/ForgotPassword.jsx";
import ForgotPasswordVerify from "./pages/adminpages/PasswordVerify.jsx";
import ChangePassword from "./pages/adminpages/ChangePassword.jsx";
import Dashboard from "./pages/adminpages/Dashboard.jsx";
import Management from "./pages/adminpages/Management.jsx"; // ✅ Capital M

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* ==== USER ROUTES ==== */}
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/ctg-scan" element={<CTGScan />} />
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/result" element={<Result />} />

      {/* ==== ADMIN ROUTES ==== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password-verify" element={<ForgotPasswordVerify />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/management" element={<Management />} />
    </Routes>
  </BrowserRouter>
);
