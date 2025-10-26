import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/userpages/Landing.jsx";
import Home from "./pages/userpages/Home.jsx";
import CTGScan from "./pages/userpages/CTGScan.jsx";
import Diagnosis from "./pages/userpages/Diagnosis.jsx";
import Result from "./pages/userpages/Result.jsx";
import Management from "./pages/adminpages/management.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/ctg-scan" element={<CTGScan />} />
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/result" element={<Result />} />
      <Route path="/home" element={<Home />} />
      <Route path="/management" element={<Management/>} />

    </Routes>
  </BrowserRouter>
);


