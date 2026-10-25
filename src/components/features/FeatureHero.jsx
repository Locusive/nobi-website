import React from "react";
import { FeatH2, FeatP, Kicker, NOISE_BG } from "../home/featurePanelParts";
import { useDemoForm } from "../../context/DemoFormContext";
import { trackDemoFormOpened } from "../../utils/usageSignals";
import { getSignupUrl } from "../../utils/signupUrl";
import { PanelTheme } from "./panelThemes";

const SOLID_BUTTON = { display: "inline-block", background: "#ffffff", color: "#5a32c4", borderRadius: 12, padding: "14px 25px", fontSize: 15.5, fontWeight: 700, textDecoration: "none", border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 14px 30px -14px rgba(40,16,90,0.5)" };
const OUTLINE_BUTTON = { display: "inline-block", background: "rgba(255,255,255,0.1)", color: "#fff7ee", borderRadius: 12, padding: "14px 25px", fontSize: 15.5, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.45)", cursor: "pointer", fontFamily: "inherit" };

/** The two calls to action. Enterprise features lead with a demo, since our team sets them up; the rest lead with signing up. */
function HeroActions({ enterprise }) {
  const { onOpen } = useDemoForm();
  const openDemo = () => {
    trackDemoFormOpened();
    onOpen();
  };

  const startFree = <a key="start" href={getSignupUrl({ path: "" })} className="nb-hero-action" style={enterprise ? OUTLINE_BUTTON : SOLID_BUTTON}>Start Free</a>;
  const bookDemo = <button key="demo" type="button" onClick={openDemo} className="nb-hero-action" style={enterprise ? SOLID_BUTTON : OUTLINE_BUTTON}>Book A Demo</button>;

  return <div style={{ display: "flex", flexWrap: "wrap", gap: 13, marginTop: 34 }}>{enterprise ? [bookDemo, startFree] : [startFree, bookDemo]}</div>;
}

/** The note under an enterprise feature's paragraph, saying who sets it up. */
function EnterpriseNote() {
  return (
    <div style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14.5, color: "rgba(255,255,255,0.86)" }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1b1626", background: "#ffffff", borderRadius: 999, padding: "4px 10px" }}>Enterprise</span>
      Our team sets this up for you.
    </div>
  );
}

/** A feature page's full-screen opening panel, in the homepage panel style: the pitch on the left, a sample on the right. */
export default function FeatureHero({ groupName, feature, page, sample }) {
  const theme = PanelTheme[page.theme];

  return (
    <section className="nb-product-section" style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", background: theme.bg }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.13, mixBlendMode: "soft-light", backgroundImage: NOISE_BG }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: theme.glow }} />
      <div className="nb-feat-row" style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1220, margin: "0 auto", padding: "clamp(120px,12vw,160px) clamp(24px,5vw,72px) clamp(72px,8vw,110px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "clamp(32px,6vw,150px)", flexWrap: "wrap" }}>
        <div className="nb-feat-col" style={{ flex: "1 1 420px", minWidth: 300 }}>
          <Kicker>{groupName}</Kicker>
          <FeatH2 as="h1" maxCh={page.headlineMaxCh}>{page.headline}</FeatH2>
          <FeatP color={theme.text}>{page.intro}</FeatP>
          {feature.enterprise && <EnterpriseNote />}
          <HeroActions enterprise={feature.enterprise} />
        </div>
        <div className="nb-feat-col" style={{ flex: "1 1 440px", minWidth: 300, display: "flex", justifyContent: "center" }}>
          {sample}
        </div>
      </div>
    </section>
  );
}
