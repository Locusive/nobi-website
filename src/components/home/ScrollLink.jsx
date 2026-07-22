import React from "react";
import { Link } from "react-router-dom";

// A plain <Link> that scrolls to top as part of the click itself, before
// navigation happens — not after, in a useEffect reacting to the route
// change, which proved unreliable on lazy-loaded routes (see main.jsx).
export default function ScrollLink({ onClick, ...props }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        // scroll-behavior: smooth is set globally — an animated scrollTo(0,0)
        // gets cut short by the page transition before it finishes. Force instant.
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        onClick?.(e);
      }}
    />
  );
}
