import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import NotFound from "./pages/NotFound.jsx";
import { RequestDemoModal } from "./components/DemoModals.jsx";
import { DemoFormProvider } from "./context/DemoFormContext.jsx";

import "./index.css";

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <DemoFormProvider isOpen={isFormOpen} onOpen={() => setIsFormOpen(true)}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RequestDemoModal open={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </DemoFormProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
