import React, { StrictMode, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";

import "./index.css";

// --- tiny built-in router (no react-router-dom needed) ---
const getPath = () => window.location.pathname;

// Subscribe to browser navigation changes
function subscribe(callback) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

// Optional helper for client-side nav (use on buttons/links if you want)
export function navigate(to) {
  if (to !== window.location.pathname) {
    window.history.pushState({}, "", to);
    // Trigger a popstate-like update for our store
    const popStateEvent = new PopStateEvent("popstate");
    dispatchEvent(popStateEvent);
  }
}

function usePathname() {
  return useSyncExternalStore(subscribe, getPath, getPath);
}

function RouterView() {
  const path = usePathname();
  switch (path) {
    case "/":
      return <App />;
    case "/terms":
      return <Terms />;
    case "/privacy":
      return <Privacy />;
    default:
      return <App />; // fallback
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterView />
  </StrictMode>
);
