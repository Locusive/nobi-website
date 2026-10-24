import React from "react";
import { Link } from "react-router-dom";

// A plain <Link>. Forward navigation scrolls the new page to the top, and the
// back button restores where you were; both are handled per route in main.jsx.
// Scrolling here on click broke those: it moved the current tab on a new-tab
// click, and it overwrote the saved scroll of the page being left.
export default function ScrollLink(props) {
  return <Link {...props} />;
}
