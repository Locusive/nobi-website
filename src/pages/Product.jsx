import React from "react";
import { useSEO } from "../hooks/useSEO";
import { useDemoForm } from "../context/DemoFormContext";
import { trackDemoFormOpened } from "../utils/eventTracker";
import { getSignupUrl } from "../utils/signupUrl";
import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import SiteFooter from "../components/home/SiteFooter";

// Placeholder — the real Product page design is coming separately.
// noindex until real content ships so this stub doesn't get crawled.
export default function Product() {
  useSEO({
    title: "Nobi Product",
    description: "The Nobi product page is being redesigned.",
    path: "/product",
    noindex: true,
  });

  const { onOpen } = useDemoForm();
  const openDemo = () => {
    trackDemoFormOpened();
    onOpen();
  };

  return (
    <div style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif" }}>
      <Nav />
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "160px 24px 100px",
        }}
      >
        <span
          style={{
            fontFamily: "'SF Mono',ui-monospace,Menlo,monospace",
            fontSize: 12.5,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#6d3bff",
            fontWeight: 600,
          }}
        >
          Coming soon
        </span>
        <h1 style={{ margin: "16px 0 0", fontSize: "clamp(34px,4.4vw,54px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", maxWidth: "18ch" }}>
          The new Product page is on its way
        </h1>
        <p style={{ margin: "18px 0 0", maxWidth: "44ch", fontSize: 17, lineHeight: 1.6, color: "#615b70" }}>
          In the meantime, take a look at what Nobi does on the homepage, or book a demo and we'll walk you through
          it directly.
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href={getSignupUrl()}
            style={{ display: "inline-flex", height: 50, alignItems: "center", gap: 8, background: "#6d3bff", color: "#fff", borderRadius: 16, padding: "0 28px", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
          >
            Start Free
          </a>
          <span
            onClick={openDemo}
            style={{ cursor: "pointer", display: "inline-flex", height: 50, alignItems: "center", background: "#fff", color: "#020617", border: "1px solid #e2e8f0", borderRadius: 16, padding: "0 28px", fontSize: 16, fontWeight: 600 }}
          >
            Book A Demo
          </span>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
