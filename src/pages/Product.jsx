import React from "react";
import { useSEO } from "../hooks/useSEO";
import { ProductSeo } from "../content/product";
import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import ProofBar from "../components/home/ProofBar";
import FooterCTA from "../components/home/FooterCTA";
import SiteFooter from "../components/home/SiteFooter";
import SearchSection from "../components/product/SearchSection";
import SupportSection from "../components/product/SupportSection";
import LeadCaptureSection from "../components/product/LeadCaptureSection";
import InsightsSection from "../components/product/InsightsSection";
import MerchandisingSection from "../components/product/MerchandisingSection";
import AlsoInNobi from "../components/product/AlsoInNobi";

// Every capability claim on this page was checked against the Nobi code. Check again before adding one.

/** The page's opening: what the page covers, framed around search. */
function ProductHero() {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#6656ce,#5a3fc0)", color: "#fff", padding: "150px clamp(24px,5vw,80px) 96px", textAlign: "center" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(60% 55% at 15% 12%, rgba(255,150,110,0.28), rgba(255,150,110,0) 70%), radial-gradient(55% 55% at 90% 90%, rgba(213,65,179,0.32), rgba(213,65,179,0) 70%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto" }}>
        <span style={{ display: "inline-block", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
          Product
        </span>
        <h1 style={{ margin: "20px 0 0", fontSize: "clamp(42px,6vw,88px)", fontWeight: 800, letterSpacing: "-0.038em", lineHeight: 0.98 }}>
          Everything Nobi does
        </h1>
        <p style={{ margin: "26px auto 0", maxWidth: "44ch", fontSize: "clamp(17px,1.4vw,22px)", lineHeight: 1.5, color: "rgba(255,255,255,0.86)" }}>
          It starts as your site search. The same AI answers questions, captures leads, and shows you what shoppers
          want.
        </p>
      </div>
    </div>
  );
}

export default function Product() {
  useSEO(ProductSeo);

  return (
    <div style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif", background: "#ffffff" }}>
      <Nav active="product" />
      <ProductHero />
      <ProofBar />
      <SearchSection />
      <SupportSection />
      <LeadCaptureSection />
      <InsightsSection />
      <MerchandisingSection />
      <AlsoInNobi />
      <FooterCTA />
      <SiteFooter />
    </div>
  );
}
