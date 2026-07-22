import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles, CheckCircle2, EyeOff, ArrowRight, Search as SearchIcon } from "lucide-react";
import { initFeatureScroll } from "./featureScroll";

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function AskAIPill() {
  return (
    <span
      style={{
        flex: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: "linear-gradient(90deg,#d946ef,#ec4899)",
        color: "#fff",
        borderRadius: 999,
        padding: "9px 17px",
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      <Sparkles size={16} />
      <span>Ask AI</span>
    </span>
  );
}

function WithNobiPanel() {
  const products = [
    { img: "/media/prod-1.webp", name: "St. Bernard x Stark Maxi", price: "$98" },
    { img: "/media/prod-2.webp", name: "Lulus Bow Backless Maxi", price: "$55" },
    { img: "/media/prod-3.webp", name: "Maygel Coronel Cover-Up", price: "$178" },
  ];
  return (
    <div style={{ width: "100%", background: "#ffffff", borderRadius: 22, boxShadow: "0 50px 100px -40px rgba(20,6,60,0.7)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 13px 13px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <Search size={18} color="#8a8498" strokeWidth={2.3} style={{ flex: "none" }} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 15, color: "#1b1626", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          red dress under $200
        </span>
        <AskAIPill />
      </div>
      <div style={{ padding: "14px 15px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "0 2px 11px", color: "#8a8498", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          <CheckCircle2 size={15} color="#6d3bff" strokeWidth={2.2} />
          <span>Understood red &middot; formal &middot; under $200</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 11, alignItems: "start" }}>
          {products.map((p) => (
            <div key={p.name} style={{ minWidth: 0 }}>
              <div style={{ height: 190, borderRadius: 12, overflow: "hidden", background: "#f4eef2" }}>
                <img src={p.img} alt={p.name} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 600, color: "#1b1626", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {p.name}
              </div>
              <div style={{ fontSize: 12, color: "#8a8498", marginTop: 2 }}>{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WithoutNobiPanel() {
  return (
    <div style={{ width: "100%", background: "rgba(255,255,255,0.14)", border: "1px dashed rgba(255,255,255,0.4)", borderRadius: 22, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 13px 13px 18px", borderBottom: "1px dashed rgba(255,255,255,0.28)" }}>
        <Search size={18} color="rgba(255,255,255,0.6)" strokeWidth={2.3} style={{ flex: "none" }} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 15, color: "rgba(255,255,255,0.75)" }}>red dress under $200</span>
        <span style={{ flex: "none", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
          Keyword search
        </span>
      </div>
      <div style={{ position: "relative", padding: "14px 15px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 11 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 190, borderRadius: 12, border: "1.5px dashed rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)" }} />
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 58, height: 58, borderRadius: "50%", background: "rgba(27,22,38,0.55)" }}>
            <SearchIcon size={28} color="#fff" />
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>0 results</span>
        </div>
      </div>
    </div>
  );
}

function SearchPanel() {
  const [mode, setMode] = useState("with");
  return (
    <FeatPanel bg="#4a2fb8" radial="radial-gradient(70% 60% at 85% 15%, rgba(255,255,255,0.14), rgba(255,255,255,0) 70%), radial-gradient(60% 55% at 5% 95%, rgba(20,6,70,0.5), rgba(20,6,70,0) 70%)">
      <div className="nb-feat-col" style={{ flex: "1 1 420px", minWidth: 300 }}>
        <Kicker>Keyword search is dumb</Kicker>
        <FeatH2 maxCh={14}>More relevant search results</FeatH2>
        <FeatP color="rgba(255,247,255,0.82)">
          Nobi&rsquo;s semantic search reads what people mean, not just the words they type. Every search brings back
          the right results, and no one hits a dead end.
        </FeatP>
      </div>
      <div className="nb-feat-col" style={{ flex: "0 1 500px", minWidth: 300, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "min(480px,100%)" }}>
          <div
            style={{
              display: "flex",
              gap: 6,
              padding: 5,
              background: "rgba(0,0,0,0.22)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 999,
              marginBottom: 16,
            }}
          >
            {[
              { key: "with", label: "With Nobi" },
              { key: "without", label: "Without Nobi" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                style={{
                  cursor: "pointer",
                  flex: 1,
                  textAlign: "center",
                  padding: "10px 14px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  border: "none",
                  color: mode === tab.key ? (tab.key === "with" ? "#6d3bff" : "#1b1626") : "rgba(255,255,255,0.7)",
                  background: mode === tab.key ? "#ffffff" : "transparent",
                  boxShadow: mode === tab.key ? "0 6px 16px -8px rgba(20,6,60,0.5)" : "none",
                  transition: "color .2s ease, background .2s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {mode === "with" ? <WithNobiPanel /> : <WithoutNobiPanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </FeatPanel>
  );
}

function InstallPanel() {
  return (
    <FeatPanel bg="#b81e6a" radial="radial-gradient(70% 60% at 12% 18%, rgba(255,255,255,0.14), rgba(255,255,255,0) 70%), radial-gradient(60% 55% at 92% 92%, rgba(40,6,60,0.5), rgba(40,6,60,0) 70%)">
      <div className="nb-feat-col" style={{ flex: "1 1 380px", minWidth: 300 }}>
        <Kicker>Fast and easy setup</Kicker>
        <FeatH2 maxCh={13}>Install in just minutes</FeatH2>
        <FeatP color="rgba(255,247,255,0.84)">
          Paste one snippet and Nobi is live. Then make it fully your own, matching your fonts, colors, and voice so
          it looks like it was always part of your site.
        </FeatP>
      </div>
      <div className="nb-feat-col" style={{ flex: "1 1 420px", minWidth: 300, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: "min(460px,100%)", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
          <div style={{ background: "#14101f", borderRadius: 16, padding: "16px 18px", boxShadow: "0 30px 70px -40px rgba(20,6,60,0.8)", position: "relative", zIndex: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ marginLeft: 6, fontSize: 11.5, color: "#8a8498", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace" }}>index.html</span>
            </div>
            <div className="nb-code-wrap" style={{ fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 12.5, lineHeight: 1.7, color: "#c9c2e0", overflow: "hidden" }}>
              <div style={{ whiteSpace: "nowrap" }}>
                <span style={{ color: "#7dd3fc" }}>&lt;script</span> <span style={{ color: "#f0abfc" }}>src</span>=
                <span style={{ color: "#86efac" }}>"https://assistant-script.nobi.ai/nobi.bundle.js"</span>
              </div>
              <div style={{ whiteSpace: "nowrap", paddingLeft: 14 }}>
                <span style={{ color: "#f0abfc" }}>async</span> <span style={{ color: "#f0abfc" }}>onload</span>=
                <span style={{ color: "#86efac" }}>"window.Nobi.initialize({`{`}</span>
              </div>
              <div style={{ whiteSpace: "nowrap", paddingLeft: 28, color: "#86efac" }}>accountId: 'YOUR_ACCOUNT_ID'</div>
              <div style={{ whiteSpace: "nowrap", paddingLeft: 14 }}>
                <span style={{ color: "#86efac" }}>{`}`})"</span>
                <span style={{ color: "#7dd3fc" }}>&gt;&lt;/script&gt;</span>
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 15,
                    background: "#8affd4",
                    verticalAlign: "middle",
                    marginLeft: 3,
                    animation: "nb-blink 1s step-end infinite",
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", margin: "-6px 0", position: "relative", zIndex: 4 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#d541b3,#6d3bff)",
                boxShadow: "0 12px 28px -8px rgba(20,6,60,0.7)",
                animation: "nb-drop 3.2s ease-in-out infinite",
              }}
            >
              <ArrowRight size={22} color="#fff" strokeWidth={2.6} style={{ transform: "rotate(90deg)" }} />
            </span>
          </div>
          <div style={{ background: "#ffffff", borderRadius: 18, padding: 16, boxShadow: "0 40px 90px -45px rgba(20,6,60,0.75)", position: "relative", zIndex: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#faf8ff", border: "1px solid rgba(20,16,40,0.08)", borderRadius: 12, padding: "11px 13px" }}>
              <Search size={17} color="#6d3bff" strokeWidth={2.3} style={{ flex: "none" }} />
              <span style={{ flex: 1, fontSize: 13.5, color: "#8a8498" }}>Search anything on your site</span>
              <span
                style={{
                  flex: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#fff",
                  borderRadius: 999,
                  padding: "7px 13px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  animation: "nb-brandcolor 6s ease-in-out infinite",
                }}
              >
                <Sparkles size={13} />
                Ask AI
              </span>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: "#0f8a54" }}>
                <CheckCircle2 size={15} color="#1fab6d" strokeWidth={3} />
                Live on your site
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#8a8498" }}>Theme</span>
                {["#6d3bff", "#d541b3", "#1fab6d"].map((c) => (
                  <span key={c} style={{ width: 18, height: 18, borderRadius: "50%", background: c, border: "2px solid #fff", boxShadow: "0 0 0 1px rgba(20,16,40,0.1)" }} />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </FeatPanel>
  );
}

function MerchandisingPanel() {
  return (
    <FeatPanel bg="#0c4f46" radial="radial-gradient(70% 60% at 88% 15%, rgba(120,255,220,0.22), rgba(120,255,220,0) 70%), radial-gradient(60% 55% at 6% 92%, rgba(6,40,34,0.55), rgba(6,40,34,0) 70%)">
      <div className="nb-feat-col" style={{ flex: "1 1 420px", minWidth: 300 }}>
        <Kicker>Control what's shown</Kicker>
        <FeatH2 maxCh={14}>Merchandising options up the wazoo</FeatH2>
        <FeatP color="rgba(240,255,250,0.84)">
          Pin your bestsellers to the top, boost seasonal picks, and hide what's out of stock. You stay in full
          control of what shows, where, and when.
        </FeatP>
      </div>
      <div className="nb-feat-col" style={{ flex: "1 1 380px", minWidth: 300, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "min(420px,100%)", background: "#ffffff", borderRadius: 22, boxShadow: "0 50px 100px -45px rgba(4,30,26,0.75)", overflow: "hidden" }}>
          <div style={{ padding: "15px 18px", borderBottom: "1px solid rgba(20,16,40,0.06)", display: "flex", alignItems: "center", gap: 9 }}>
            <CheckCircle2 size={17} color="#0f8a54" strokeWidth={2.2} />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1b1626" }}>Results ordering</span>
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#0f8a54", background: "#ecfdf5", borderRadius: 999, padding: "4px 10px" }}>Live</span>
          </div>
          <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ position: "relative", border: "2px solid #6d3bff", borderRadius: 14, overflow: "hidden", animation: "nb-m-badge 6s ease-in-out infinite" }}>
              <div style={{ aspectRatio: "1/1", background: "#f4eef2" }}>
                <img src="/media/prod-1.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  background: "#6d3bff",
                  borderRadius: 999,
                  padding: "4px 9px",
                  boxShadow: "0 4px 12px -2px rgba(76,40,130,0.6)",
                }}
              >
                <Sparkles size={11} />
                Pinned
              </span>
            </div>
            <div style={{ border: "1px solid rgba(20,16,40,0.08)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ aspectRatio: "1/1", background: "#f4eef2" }}>
                <img src="/media/prod-2.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
            <div style={{ border: "1px solid rgba(20,16,40,0.08)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ aspectRatio: "1/1", background: "#f4eef2" }}>
                <img src="/media/prod-3.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
            <div style={{ position: "relative", border: "1px solid rgba(20,16,40,0.08)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ aspectRatio: "1/1", background: "#f4eef2" }}>
                <img src="/media/prod-1.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "rgba(20,16,30,0.55)",
                  animation: "nb-m-eye 6s ease-in-out infinite",
                }}
              >
                <EyeOff size={26} color="#fff" strokeWidth={2.2} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Hidden</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatPanel>
  );
}

function SiteAnswersPanel() {
  return (
    <FeatPanel bg="#152a5c" radial="radial-gradient(70% 60% at 12% 15%, rgba(150,190,255,0.22), rgba(150,190,255,0) 70%), radial-gradient(60% 55% at 92% 92%, rgba(8,16,44,0.55), rgba(8,16,44,0) 70%)">
      <div className="nb-feat-col" style={{ flex: "1 1 420px", minWidth: 300 }}>
        <Kicker>Search site pages</Kicker>
        <FeatH2 maxCh={14}>Google-style search results</FeatH2>
        <FeatP color="rgba(238,244,255,0.84)">
          Nobi reads your pages, docs, and FAQs, then answers questions in plain language with a real citation, so
          shoppers get the whole story without leaving search.
        </FeatP>
      </div>
      <div className="nb-feat-col" style={{ flex: "1 1 440px", minWidth: 300, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "min(500px,100%)", background: "#ffffff", borderRadius: 24, boxShadow: "0 50px 100px -40px rgba(6,12,38,0.85)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(20,16,40,0.06)", display: "flex", alignItems: "center", gap: 11 }}>
            <Search size={18} color="#6d3bff" strokeWidth={2.3} />
            <span style={{ flex: 1, fontSize: 15.5, color: "#3a3646" }}>What is your return window?</span>
            <span style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(90deg,#6d3bff,#d541b3)", color: "#fff", borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600 }}>
              <Sparkles size={12} />
              Answer
            </span>
          </div>
          <div style={{ padding: "22px 20px 20px", background: "linear-gradient(180deg,#faf8ff,#ffffff)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span
                style={{
                  flex: "none",
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "linear-gradient(135deg,#6d3bff,#d541b3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 16px -6px rgba(109,59,255,0.7)",
                }}
              >
                <Sparkles size={17} color="#fff" />
              </span>
              <div style={{ flex: 1, fontSize: 17, lineHeight: 1.6, color: "#1b1626", fontWeight: 500 }}>
                You can return any unworn item within{" "}
                <strong style={{ background: "linear-gradient(180deg,transparent 62%,#fce7f6 62%)" }}>30 days</strong> for a full
                refund. Exchanges are always free, and sale items are final.
              </div>
            </div>
            <div style={{ marginTop: 16, marginLeft: 44, display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid rgba(109,59,255,0.22)", borderRadius: 999, padding: "7px 13px", boxShadow: "0 2px 8px -4px rgba(76,40,130,0.3)" }}>
                <span style={{ fontSize: 12.5, color: "#6d3bff", fontWeight: 600 }}>Returns &amp; Exchanges</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid rgba(20,16,40,0.12)", borderRadius: 999, padding: "7px 13px", boxShadow: "0 2px 8px -4px rgba(76,40,130,0.2)" }}>
                <span style={{ fontSize: 12.5, color: "#57536a", fontWeight: 600 }}>Shipping Policy</span>
              </span>
            </div>
          </div>
          <div style={{ padding: "16px 20px 20px", borderTop: "1px solid rgba(20,16,40,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a49dba" }}>Related topics</div>
            <div style={{ marginTop: 13, display: "flex", flexWrap: "wrap", gap: 9 }}>
              {["How do I start a return?", "Free exchanges?", "When will I get my refund?"].map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", fontSize: 13.5, color: "#3a3646", background: "#f3f0fa", border: "1px solid rgba(20,16,40,0.08)", borderRadius: 999, padding: "8px 15px" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FeatPanel>
  );
}

function Kicker({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "'SF Mono',ui-monospace,Menlo,monospace",
        fontSize: 13,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.7)",
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
function FeatH2({ children, maxCh }) {
  return (
    <h2
      style={{
        margin: "16px 0 0",
        fontSize: "clamp(40px,5vw,74px)",
        fontWeight: 700,
        letterSpacing: "-0.035em",
        color: "#fff",
        lineHeight: 1.0,
        maxWidth: `${maxCh}ch`,
      }}
    >
      {children}
    </h2>
  );
}
function FeatP({ children, color }) {
  return <p style={{ margin: "22px 0 0", maxWidth: "42ch", fontSize: "clamp(17px,1.4vw,22px)", lineHeight: 1.5, color }}>{children}</p>;
}
function FeatPanel({ bg, radial, children }) {
  return (
    <div className="nb-snap nb-feat" style={{ boxSizing: "border-box", alignItems: "center", padding: 0, overflow: "hidden", background: bg }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.13, mixBlendMode: "soft-light", backgroundImage: NOISE_BG }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: radial }} />
      <div
        className="nb-feat-row"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1220,
          margin: "0 auto",
          padding: "32px clamp(24px,5vw,72px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(32px,6vw,150px)",
          flexWrap: "wrap",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function FeatureStack() {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const cleanup = initFeatureScroll();
      // stash for the effect cleanup below
      FeatureStack._cleanup = cleanup;
    });
    return () => {
      cancelAnimationFrame(raf);
      if (FeatureStack._cleanup) FeatureStack._cleanup();
    };
  }, []);

  return (
    <>
      <div id="nb-rail" aria-hidden="true">
        <button className="nb-dot" data-active="1" aria-label="Search" />
        <button className="nb-dot" data-active="0" aria-label="Install" />
        <button className="nb-dot" data-active="0" aria-label="Merchandising" />
        <button className="nb-dot" data-active="0" aria-label="Site answers" />
      </div>
      <div className="nb-fstack" style={{ height: "400vh" }}>
        <div className="nb-fstage">
          <SearchPanel />
          <InstallPanel />
          <MerchandisingPanel />
          <SiteAnswersPanel />
        </div>
      </div>
    </>
  );
}
