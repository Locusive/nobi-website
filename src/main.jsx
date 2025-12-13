import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import NotFound from "./pages/NotFound.jsx";

import "./index.css";

const handleDemoClick = () => {
  // Demo click handler can be implemented here
  // For now, it's a placeholder for future functionality
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home onDemoClick={handleDemoClick} />} />
      <Route path="/terms" element={<Terms onDemoClick={handleDemoClick} />} />
      <Route path="/privacy" element={<Privacy onDemoClick={handleDemoClick} />} />
      <Route path="*" element={<NotFound onDemoClick={handleDemoClick} />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
