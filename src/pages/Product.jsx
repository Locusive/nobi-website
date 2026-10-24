import React from "react";
import { useSEO } from "../hooks/useSEO";
import { ProductSeo } from "../content/product";
import { FEATURE_GROUPS, listFeaturesInGroup } from "../content/features";
import { FEATURE_SAMPLES } from "../components/features/featureSamples";
import { PanelTheme } from "../components/features/panelThemes";
import { FEATURE_PAGES } from "../content/featurePages";
import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import FooterCTA from "../components/home/FooterCTA";
import SiteFooter from "../components/home/SiteFooter";
import FeatureGroupSection from "../components/features/FeatureGroupSection";

// The group sections alternate between these backgrounds so each group reads as its own block.
const GROUP_BACKGROUNDS = ["#ffffff", "#f7f5fc"];

// Three sample screens that stand in for the breadth of Nobi: search, support and insights.
const HERO_SAMPLE_SLUGS = ["ai-search", "automated-support", "insights"];
const HERO_SAMPLE_WIDTH = 480;
const HERO_SAMPLE_SCALE = 0.62;

/** One sample screen in the hero montage, shown on its feature's panel color. */
function HeroSample({ slug }) {
  const Sample = FEATURE_SAMPLES[slug];
  const theme = PanelTheme[FEATURE_PAGES[slug].theme];

  return (
    <div aria-hidden="true" style={{ position: "relative", flex: "1 1 300px", maxWidth: 340, height: 250, overflow: "hidden", borderRadius: 20, background: theme.bg, backgroundImage: theme.glow, boxShadow: "0 30px 60px -32px rgba(40,20,90,0.5)" }}>
      <div style={{ position: "absolute", top: 24, left: "50%", width: HERO_SAMPLE_WIDTH, transform: `translateX(-50%) scale(${HERO_SAMPLE_SCALE})`, transformOrigin: "top center", pointerEvents: "none" }}>
        <Sample shadow={theme.shadow} />
      </div>
    </div>
  );
}

/** A jump link to one group's section, showing the group name and how many features it holds. */
function GroupChip({ group }) {
  const count = listFeaturesInGroup(group.id).length;

  return (
    <a href={`#${group.id}`} className="nb-group-chip">
      {group.name}
      <span className="nb-group-chip-count">{count}</span>
    </a>
  );
}

/** The page's opening: a short, centered pitch, a montage of real screens, and a jump link to each group. */
function AllFeaturesHero() {
  return (
    <header style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#f6f2ff 0%,#ffffff 100%)", padding: "140px clamp(24px,5vw,80px) clamp(56px,6vw,80px)", textAlign: "center" }}>
      <div style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto" }}>
        <span style={{ fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6d3bff", fontWeight: 600 }}>
          All features
        </span>
        <h1 style={{ margin: "20px auto 0", maxWidth: "16ch", fontSize: "clamp(42px,6vw,82px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.98, color: "#1b1626" }}>
          One AI for search, support, and sales
        </h1>
        <p style={{ margin: "22px auto 0", maxWidth: "48ch", fontSize: "clamp(17px,1.4vw,21px)", lineHeight: 1.5, color: "#57536a" }}>
          It finds products, answers questions, recommends the next buy, and captures leads, on one platform.
        </p>
      </div>
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1120, margin: "clamp(44px,5vw,60px) auto 0", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
        {HERO_SAMPLE_SLUGS.map((slug) => (
          <HeroSample key={slug} slug={slug} />
        ))}
      </div>
      <nav aria-label="Feature groups" style={{ position: "relative", zIndex: 2, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: "clamp(40px,4vw,52px)" }}>
        {FEATURE_GROUPS.map((group) => (
          <GroupChip key={group.id} group={group} />
        ))}
      </nav>
    </header>
  );
}

/** The All features page: every Nobi feature, by group, each linking to its own page. */
export default function Product() {
  useSEO(ProductSeo);

  return (
    <div style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif", background: "#ffffff" }}>
      <Nav active="product" />
      <AllFeaturesHero />
      {FEATURE_GROUPS.map((group, index) => (
        <FeatureGroupSection key={group.id} group={group} background={GROUP_BACKGROUNDS[index % GROUP_BACKGROUNDS.length]} />
      ))}
      <FooterCTA />
      <SiteFooter />
    </div>
  );
}
