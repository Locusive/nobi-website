import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Terms from "./pages/Terms.jsx";     // make sure filename & casing match exactly
import Privacy from "./pages/Privacy.jsx"; // make sure filename & casing match exactly

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/terms", element: <Terms /> },
  { path: "/privacy", element: <Privacy /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
