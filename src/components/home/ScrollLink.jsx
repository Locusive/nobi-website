import React from "react";
import { Link } from "react-router-dom";

// A plain <Link>. Scroll on navigation is handled per route in main.jsx, not on click here,
// which used to move the current tab on a new-tab click and overwrite the leaving page's saved scroll.
export default function ScrollLink(props) {
  return <Link {...props} />;
}
