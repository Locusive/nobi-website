import React, { useEffect, useRef, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { startNobiField } from "./nobiField";
import { useDemoForm } from "../../context/DemoFormContext";
import { trackDemoFormOpened } from "../../utils/eventTracker";
import { getSignupUrl } from "../../utils/signupUrl";

const QUERIES = [
  "trail running shoes, wide fit",
  "is this gluten free?",
  "do you offer free returns?",
  "noise-cancelling headphones",
  "when will it be back in stock?",
];

function useTypingLoop(queries) {
  const [text, setText] = useState("");
  useEffect(() => {
    let alive = true;
    let qi = 0;
    let timer;

    const run = () => {
      const full = queries[qi % queries.length];
      let ci = 0;
      const typeStep = () => {
        if (!alive) return;
        ci += 1;
        setText(full.slice(0, ci));
        if (ci < full.length) {
          timer = setTimeout(typeStep, 32);
        } else {
          timer = setTimeout(eraseStep, 1400);
        }
      };
      const eraseStep = () => {
        if (!alive) return;
        ci -= 1;
        setText(full.slice(0, Math.max(0, ci)));
        if (ci > 0) {
          timer = setTimeout(eraseStep, 18);
        } else {
          qi += 1;
          timer = setTimeout(() => run(), 300);
        }
      };
      typeStep();
    };
    run();

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [queries]);
  return text;
}

export default function Hero() {
  const canvasRef = useRef(null);
  const { onOpen } = useDemoForm();
  const typed = useTypingLoop(QUERIES);

  useEffect(() => startNobiField(canvasRef.current), []);

  const openDemo = () => {
    trackDemoFormOpened();
    onOpen();
  };

  return (
    <div className="nb-snap" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#6656ce" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "scale(1.13)", filter: "blur(34px)" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(60% 55% at 92% 12%, rgba(255,168,120,0.5), rgba(255,168,120,0) 70%), radial-gradient(55% 50% at 8% 92%, rgba(233,140,205,0.42), rgba(233,140,205,0) 72%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          transform: "translate(-50%,-50%)",
          width: 1100,
          height: 560,
          background: "radial-gradient(ellipse at center, rgba(60,38,120,0.32), rgba(60,38,120,0) 68%)",
          filter: "blur(20px)",
        }}
      />

      <div style={{ position: "relative", zIndex: 5, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "104px 24px 40px",
          }}
        >
          <div
            style={{
              color: "rgba(255,247,238,0.82)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Semantic &middot; Conversational &middot; Converting
          </div>
          <h1
            style={{
              margin: "24px 0 0",
              fontWeight: 800,
              color: "#fff7ee",
              fontSize: "clamp(42px,6vw,88px)",
              lineHeight: 0.98,
              letterSpacing: "-0.038em",
              textShadow: "0 2px 40px rgba(45,20,90,0.3)",
            }}
          >
            <span style={{ display: "block", whiteSpace: "nowrap" }}>Modern site search</span>
            <span style={{ display: "block", whiteSpace: "nowrap" }}>that converts</span>
          </h1>
          <p
            style={{
              margin: "24px 0 0",
              color: "rgba(255,247,238,0.85)",
              fontSize: "clamp(16px,1.3vw,20px)",
              lineHeight: 1.5,
              maxWidth: "46ch",
            }}
          >
            Keyword search is outdated. Nobi's modern techniques drive better results, so more of your visitors
            convert.
          </p>

          <div style={{ width: "min(560px,94%)", marginTop: 38 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(255,255,255,0.7)",
                borderRadius: 16,
                padding: "11px 11px 11px 20px",
                boxShadow: "0 26px 56px -24px rgba(40,16,90,0.55)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <Search size={21} color="#6d3bff" strokeWidth={2.2} style={{ flex: "none" }} />
              <div style={{ flex: 1, display: "flex", alignItems: "center", minWidth: 0 }}>
                <span style={{ color: "#1b1626", fontSize: 18, whiteSpace: "nowrap", overflow: "hidden" }}>{typed}</span>
                <span
                  style={{
                    width: 2,
                    height: 21,
                    background: "#6d3bff",
                    display: "inline-block",
                    marginLeft: 3,
                    flex: "none",
                    animation: "nb-blink 1s step-end infinite",
                  }}
                />
              </div>
              <button
                type="button"
                style={{
                  flex: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#6d3bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "11px 20px",
                  fontFamily: "inherit",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 8px 20px -8px rgba(109,59,255,0.6)",
                }}
              >
                <Sparkles size={18} color="#fff" />
                Search
              </button>
            </div>

            <div style={{ display: "flex", gap: 13, justifyContent: "center", marginTop: 22 }}>
              <a
                href={getSignupUrl({ path: "" })}
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                  background: "#ffffff",
                  color: "#5a32c4",
                  borderRadius: 12,
                  padding: "14px 25px",
                  fontSize: 15.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 14px 30px -14px rgba(40,16,90,0.5)",
                }}
              >
                Start Free
              </a>
              <span
                onClick={openDemo}
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff7ee",
                  border: "1px solid rgba(255,255,255,0.45)",
                  borderRadius: 12,
                  padding: "14px 25px",
                  fontSize: 15.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
                Book A Demo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
