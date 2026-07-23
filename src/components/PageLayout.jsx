import React from "react";
import Nav from "./home/Nav";
import SiteFooter from "./home/SiteFooter";

// Nav is position: fixed, so it takes no space in normal flow — the
// paddingTop below is what actually clears it, not Nav's own height.
export default function PageLayout({ children, active }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav active={active} />
      <main className="flex-1" style={{ paddingTop: 128 }}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
