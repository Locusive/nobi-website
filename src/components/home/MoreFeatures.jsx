import React from "react";
import { ArrowRight } from "lucide-react";
import ScrollLink from "./ScrollLink";
import FeatureCard from "../features/FeatureCard";
import { ALL_FEATURES_PATH } from "../../content/features";

// The features the homepage grid shows. Search, merchandising and site answers already have their own panels above it.
const GRID_FEATURE_SLUGS = ["automated-support", "lead-capture", "product-recommendations", "proactive-prompts", "search-analytics", "quick-add"];

/** The homepage section after the search panels: six more features, with a link to every feature. */
export default function MoreFeatures() {
  return (
    <div style={{ background: "#ffffff", padding: "clamp(72px,8vw,110px) clamp(24px,5vw,80px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", maxWidth: "40ch", margin: "0 auto" }}>
          <span style={{ fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 12.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6d3bff", fontWeight: 600 }}>
            And more
          </span>
          <h2 style={{ margin: "14px 0 0", fontSize: "clamp(30px,3.6vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1b1626", lineHeight: 1.05 }}>
            Everything else you get
          </h2>
        </div>
        <div className="nb-grid3" style={{ marginTop: "clamp(40px,5vw,60px)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(16px,2vw,24px)" }}>
          {GRID_FEATURE_SLUGS.map((slug) => (
            <FeatureCard key={slug} slug={slug} />
          ))}
        </div>
        <div style={{ marginTop: "clamp(36px,4vw,48px)", textAlign: "center" }}>
          <ScrollLink to={ALL_FEATURES_PATH} className="nb-hero-action" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#6d3bff", color: "#ffffff", borderRadius: 12, padding: "14px 24px", fontSize: 15.5, fontWeight: 700, textDecoration: "none" }}>
            Explore all features <ArrowRight size={17} />
          </ScrollLink>
        </div>
      </div>
    </div>
  );
}
