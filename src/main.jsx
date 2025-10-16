import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import CTGScan from "./pages/CTGScan";
import "./index.css";
import Diagnosis from "./pages/Diagnosis";
import Result from "./pages/Result";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/ctg-scan" element={<CTGScan />} />
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/result" element={<Result />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
);


