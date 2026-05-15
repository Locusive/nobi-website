import React, { StrictMode, Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// HomePage is eagerly loaded — it's the first thing every visitor sees
import HomePage from "./pages/HomePage.jsx";

// Everything else is lazy-loaded — only downloaded when navigated to
const Terms              = lazy(() => import("./pages/Terms.jsx"));
const Privacy            = lazy(() => import("./pages/Privacy.jsx"));
const FAQs               = lazy(() => import("./pages/FAQs.jsx"));
const Blog               = lazy(() => import("./pages/Blog.jsx"));
const BlogPost           = lazy(() => import("./pages/BlogPost.jsx"));
const BetterSearch       = lazy(() => import("./pages/BetterSearch.jsx"));
const LeadCapture        = lazy(() => import("./pages/LeadCapture.jsx"));
const CustomActions      = lazy(() => import("./pages/CustomActions.jsx"));
const AutomatedSupport   = lazy(() => import("./pages/AutomatedSupport.jsx"));
const AgentEndpoint      = lazy(() => import("./pages/AgentEndpoint.jsx"));
const CustomersIndex     = lazy(() => import("./pages/customers/index.jsx"));
const LuccheseCustomer   = lazy(() => import("./pages/customers/Lucchese.jsx"));
const UNTUCKitCustomer   = lazy(() => import("./pages/customers/UNTUCKit.jsx"));
const KilteCustomer      = lazy(() => import("./pages/customers/Kilte.jsx"));
const Pricing            = lazy(() => import("./pages/Pricing.jsx"));
const SearchEngineLanding = lazy(() => import("./pages/landing/SearchEngineLanding.jsx"));
const AIAssistantLanding  = lazy(() => import("./pages/landing/AIAssistantLanding.jsx"));
const Webinar            = lazy(() => import("./pages/Webinar.jsx"));
const WebinarIPullRank   = lazy(() => import("./pages/WebinarIPullRank.jsx"));
const NotFound           = lazy(() => import("./pages/NotFound.jsx"));

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
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/why-nobi/better-search" element={<BetterSearch />} />
          <Route path="/why-nobi/automated-support" element={<AutomatedSupport />} />
          <Route path="/why-nobi/ai-agents" element={<AgentEndpoint />} />
          <Route path="/why-nobi/agent-endpoint" element={<AgentEndpoint />} />
          <Route path="/lead-capture" element={<LeadCapture />} />
          <Route path="/custom-actions" element={<CustomActions />} />
          <Route path="/customers" element={<CustomersIndex />} />
          <Route path="/customers/lucchese" element={<LuccheseCustomer />} />
          <Route path="/customers/untuckit" element={<UNTUCKitCustomer />} />
          <Route path="/customers/kilte" element={<KilteCustomer />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/s/search" element={<SearchEngineLanding />} />
          <Route path="/s/ai-assistant" element={<AIAssistantLanding />} />
          <Route path="/webinar" element={<Webinar />} />
          <Route path="/webinar/ipullrank" element={<WebinarIPullRank />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

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
