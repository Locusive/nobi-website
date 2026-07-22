import React from "react";
import ScrollLink from "./ScrollLink";
import { ExternalLink } from "lucide-react";
import logo from "../../assets/nobi-logo@2x.webp";

// Product page is a placeholder while its real design is in progress —
// hidden from the footer until that's ready. Add it back when it ships:
// { to: "/product", label: "Product" },
const LINKS = [
  { to: "/pricing", label: "Pricing" },
  { to: "/faqs", label: "FAQs" },
  { to: "/blog", label: "Blog" },
  { to: "/customers", label: "Case Studies" },
];

export default function SiteFooter() {
  return (
    <footer style={{ background: "#100a24", color: "rgba(255,255,255,0.6)", padding: "clamp(48px,6vw,64px) clamp(24px,5vw,80px) 32px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "space-between" }}>
        <ScrollLink to="/" style={{ display: "block", flex: "none" }}>
          <img src={logo} alt="Nobi" style={{ height: 40, width: "auto", display: "block", filter: "brightness(0) invert(1)" }} />
        </ScrollLink>
        <div style={{ display: "flex", gap: "clamp(18px,3vw,30px)", flexWrap: "wrap", fontSize: 14 }}>
          {LINKS.map((l) => (
            <ScrollLink key={l.to} to={l.to} style={{ color: "inherit", textDecoration: "none" }}>
              {l.label}
            </ScrollLink>
          ))}
          <a href="https://docs.nobi.ai" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "inherit", textDecoration: "none" }}>
            Docs
            <ExternalLink size={12} style={{ flex: "none" }} />
          </a>
        </div>
        <div style={{ display: "flex", gap: 11 }}>
          <a
            href="https://www.youtube.com/@trynobi/videos"
            aria-label="YouTube"
            style={{ display: "inline-flex", width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", color: "#fff", textDecoration: "none" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12zM9.8 15.3V8.7l5.7 3.3z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/company/nobiai/"
            aria-label="LinkedIn"
            style={{ display: "inline-flex", width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", color: "#fff", textDecoration: "none" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4 0 4.75 2.65 4.75 6.1V21H18v-5.5c0-1.3 0-3-1.85-3s-2.15 1.45-2.15 2.9V21H10z" />
            </svg>
          </a>
        </div>
      </div>
      <div style={{ maxWidth: 1160, margin: "28px auto 0", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
        <span>&copy; 2026 Nobi. All rights reserved.</span>
        <div style={{ display: "flex", gap: 22 }}>
          <ScrollLink to="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy</ScrollLink>
          <ScrollLink to="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms</ScrollLink>
        </div>
      </div>
    </footer>
  );
}
