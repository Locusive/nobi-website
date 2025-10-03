import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";   // ← this line is required

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// src/main.jsx or wherever your Router is defined
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/terms", element: <Terms /> },
  { path: "/privacy", element: <Privacy /> },
]);

export default function Root() {
  return <RouterProvider router={router} />;
}
