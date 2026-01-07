import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import FAQs from "./pages/FAQs.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import BetterSearch from "./pages/BetterSearch.jsx";
import NotFound from "./pages/NotFound.jsx";
import { RequestDemoModal } from "./components/DemoModals.jsx";

import { DemoFormProvider } from "./context/DemoFormContext.jsx";
import "./index.css";

function App() {
  const location = useLocation();

  const [isFormOpen, setIsFormOpen] = useState(() => {
    const params = new URLSearchParams(location.search);
    return isContactParamTrue(params);
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (isContactParamTrue(params)) {
      setIsFormOpen(true);
    }
  }, [location.search]);

  return (
    <DemoFormProvider isOpen={isFormOpen} onOpen={() => setIsFormOpen(true)}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/why-nobi/better-search" element={<BetterSearch />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RequestDemoModal open={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </DemoFormProvider>
  );
}

function isContactParamTrue(params) {
  const value = params.get("contact-us");
  if (!value) return false;
  return ["1", "true", "yes", "open"].includes(value.toLowerCase());
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
