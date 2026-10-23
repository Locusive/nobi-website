import React from "react";
import { useSEO } from "../hooks/useSEO";
import { ProductSeo } from "../content/product";
import { FEATURE_GROUPS } from "../content/features";
import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import ProofBar from "../components/home/ProofBar";
import FooterCTA from "../components/home/FooterCTA";
import SiteFooter from "../components/home/SiteFooter";
import FeatureGroupSection from "../components/features/FeatureGroupSection";

// The group sections alternate between these backgrounds so each group reads as its own block.
const GROUP_BACKGROUNDS = ["#ffffff", "#f7f5fc"];

/** The page's opening: what the page covers, framed around search. */
function AllFeaturesHero() {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#6656ce,#5a3fc0)", color: "#fff", padding: "160px clamp(24px,5vw,80px) 104px", textAlign: "center" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(60% 55% at 15% 12%, rgba(255,150,110,0.28), rgba(255,150,110,0) 70%), radial-gradient(55% 55% at 90% 90%, rgba(213,65,179,0.32), rgba(213,65,179,0) 70%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 860, margin: "0 auto" }}>
        <span style={{ display: "inline-block", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
          All features
        </span>
        <h1 style={{ margin: "20px 0 0", fontSize: "clamp(42px,6vw,88px)", fontWeight: 800, letterSpacing: "-0.038em", lineHeight: 0.98 }}>
          Everything Nobi does
        </h1>
        <p style={{ margin: "26px auto 0", maxWidth: "46ch", fontSize: "clamp(17px,1.4vw,22px)", lineHeight: 1.5, color: "rgba(255,255,255,0.86)" }}>
          It starts as your site search. The same AI answers questions, captures leads, and helps shoppers buy. Features
          marked Enterprise are set up by our team.
        </p>
      </div>
    </div>
  );
}

/** The All features page: every Nobi feature, by group, each linking to its own page. */
export default function Product() {
  useSEO(ProductSeo);

  return (
    <div style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif", background: "#ffffff" }}>
      <Nav active="product" />
      <AllFeaturesHero />
      <ProofBar />
      {FEATURE_GROUPS.map((group, index) => (
        <FeatureGroupSection key={group.id} group={group} background={GROUP_BACKGROUNDS[(index + 1) % GROUP_BACKGROUNDS.length]} />
      ))}
      <FooterCTA />
      <SiteFooter />
    </div>
  );
}
