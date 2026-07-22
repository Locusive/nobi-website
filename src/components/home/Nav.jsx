import React, { useState } from "react";
import ScrollLink from "./ScrollLink";
import { Menu, X } from "lucide-react";
import { useDemoForm } from "../../context/DemoFormContext";
import { trackDemoFormOpened } from "../../utils/eventTracker";
import { getSignupUrl } from "../../utils/signupUrl";
import logo from "../../assets/nobi-logo@2x.webp";

// NOTE: mobile hamburger behavior (breakpoint, menu contents, styling) is
// owned by the Claude Design bundle handoff — keep this isolated so it's a
// clean swap if that design changes again.
export default function Nav({ active }) {
  const { onOpen } = useDemoForm();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkStyle = (key) => ({
    color: active === key ? "#6d3bff" : "#3a3646",
    fontWeight: active === key ? 600 : 500,
    textDecoration: "none",
    cursor: "pointer",
  });

  const openDemo = () => {
    trackDemoFormOpened();
    onOpen();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        padding: "22px 18px 0",
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    >
      <nav
        className="nb-nav"
        style={{
          position: "relative",
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 22,
          maxWidth: "calc(100% - 32px)",
          background: "#ffffff",
          border: "1px solid rgba(20,16,40,0.08)",
          borderRadius: 999,
          padding: "10px 14px 10px 22px",
          boxShadow: "0 10px 30px rgba(60,40,110,0.10)",
        }}
      >
        <ScrollLink to="/" style={{ display: "flex", alignItems: "center", flex: "none" }}>
          <img src={logo} alt="Nobi" style={{ height: 38, width: "auto", display: "block" }} />
        </ScrollLink>

        <div
          className="nb-nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 14.5,
            fontWeight: 500,
            color: "#3a3646",
            whiteSpace: "nowrap",
          }}
        >
          <ScrollLink to="/product" style={linkStyle("product")}>
            Product
          </ScrollLink>
          <ScrollLink to="/pricing" style={linkStyle("pricing")}>
            Pricing
          </ScrollLink>
        </div>

        <span className="nb-nav-pipe" style={{ width: 1, height: 18, background: "rgba(20,16,40,0.16)", flex: "none" }} />

        <div className="nb-nav-aux" style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            className="nb-nav-book"
            onClick={openDemo}
            style={{ color: "#3a3646", fontSize: 14.5, fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer" }}
          >
            Book A Demo
          </span>
          <a
            href={getSignupUrl()}
            className="nb-nav-login"
            style={{ color: "#3a3646", fontSize: 14.5, fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer", textDecoration: "none" }}
          >
            Log in
          </a>
          <a
            href={getSignupUrl()}
            style={{
              textDecoration: "none",
              display: "inline-block",
              background: "#6d3bff",
              color: "#fff",
              borderRadius: 999,
              padding: "10px 18px",
              fontSize: 14.5,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Start Free
          </a>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="nb-nav-hamb"
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 999,
              border: "1px solid rgba(20,16,40,0.1)",
              background: "#fff",
              cursor: "pointer",
              flex: "none",
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className="nb-nav-menu"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              left: 0,
              background: "#fff",
              border: "1px solid rgba(20,16,40,0.08)",
              borderRadius: 18,
              padding: 12,
              boxShadow: "0 18px 44px rgba(60,40,110,0.20)",
              minWidth: 220,
              zIndex: 5,
            }}
          >
            <ScrollLink
              to="/product"
              onClick={() => setMobileOpen(false)}
              style={{ ...linkStyle("product"), fontSize: 16, padding: "15px 16px", borderRadius: 12 }}
            >
              Product
            </ScrollLink>
            <ScrollLink
              to="/pricing"
              onClick={() => setMobileOpen(false)}
              style={{ ...linkStyle("pricing"), fontSize: 16, padding: "15px 16px", borderRadius: 12 }}
            >
              Pricing
            </ScrollLink>
            <span
              onClick={() => {
                setMobileOpen(false);
                openDemo();
              }}
              style={{ color: "#3a3646", textDecoration: "none", fontSize: 16, fontWeight: 500, padding: "15px 16px", borderRadius: 12, cursor: "pointer" }}
            >
              Book A Demo
            </span>
            <a
              href={getSignupUrl()}
              style={{ color: "#3a3646", textDecoration: "none", fontSize: 16, fontWeight: 500, padding: "15px 16px", borderRadius: 12 }}
            >
              Log in
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}
