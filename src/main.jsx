import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/userpages/Landing.jsx";
import Home from "./pages/userpages/Home.jsx";
import CTGScan from "./pages/userpages/CTGScan.jsx";
import Diagnosis from "./pages/userpages/Diagnosis.jsx";
import Result from "./pages/userpages/Result.jsx";
import LoginPage from "./pages/adminpages/LoginPage.jsx";
import ForgotPassword from "./pages/adminpages/ForgotPassword.jsx";
import ForgotPasswordVerify from "./pages/adminpages/PasswordVerify.jsx";
import ChangePassword from "./pages/adminpages/ChangePassword.jsx";
import Dashboard from "./pages/adminpages/Dashboard.jsx";
import Analysis from "./pages/adminpages/Analysis.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/ctg-scan" element={<CTGScan />} />
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/result" element={<Result />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password-verify" element={<ForgotPasswordVerify />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analysis" element={<Analysis />} />
    </Routes>
  </BrowserRouter>
);