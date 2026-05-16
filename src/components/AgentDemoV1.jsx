/**
 * AgentDemoV1 — snapshot of the homepage "Reach AI agents" animation
 * as of 2026-05-15, after the full bidirectional wire + server-log redesign.
 *
 * To restore: copy the constants and AgentDemo function back into HeroDemo.jsx,
 * replacing whatever is there, and update HERO_SLIDES index 4 to point at AgentDemo.
 *
 * Dependencies (already in HeroDemo.jsx): React, useState, useEffect,
 * motion, AnimatePresence (framer-motion), Sparkles (lucide-react).
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const AGENT_SYMBOLS = ["{ }", "</>", ">>>", "0x1f", "[ ]", "fn()", "=>", "0101", "GET", "JSON"];

function SummitLogo({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 2L20 16H2L11 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7.5 16L11 10.5L14.5 16" stroke="white" strokeWidth="1" strokeLinejoin="round" strokeOpacity="0.5"/>
    </svg>
  );
}

const AGENT_PRODUCTS = [
  { img: "https://www.alpsandmeters.com/cdn/shop/products/Cashmere_Alpine_Guide_Sweater_Camel.jpg?v=1753426053&width=400", name: "Classic Crew",    price: "$265" },
  { img: "https://www.alpsandmeters.com/cdn/shop/products/Ski_Race_Knit_Sports_Club_Navy.jpg?v=1753426053&width=400",       name: "Rib Turtleneck", price: "$295" },
  { img: "https://www.alpsandmeters.com/cdn/shop/products/Classic_Cable_Knit_IVORY_Front.jpg?v=1753426168&width=400",       name: "Cable Knit",      price: "$245" },
];

const AGENT_Q1 = "What cashmere sweaters does summitcashmere.com carry?";
const AGENT_Q2 = "Do they offer gift wrapping?";
const AGENT_A2_AGENT = "Yes, we offer complimentary gift wrapping on all orders.";
const AGENT_A2_RELAY  = "Yes, they offer complimentary gift wrapping on all orders.";

// ─── Component ────────────────────────────────────────────────────────────────

function AgentDemo({ isActive }) {
  const [userQ1, setUserQ1] = useState("");
  const [showThinking, setShowThinking] = useState(false);
  const [flowLR, setFlowLR] = useState(false);
  const [rightBusy, setRightBusy] = useState(false);
  const [flowRL, setFlowRL] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [userQ2, setUserQ2] = useState("");
  const [flowLR2, setFlowLR2] = useState(false);
  const [rightBusy2, setRightBusy2] = useState(false);
  const [flowRL2, setFlowRL2] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [symIdx, setSymIdx] = useState(0);

  const TS = 23;

  useEffect(() => {
    if (!isActive) return;
    setUserQ1(""); setShowThinking(false); setFlowLR(false); setRightBusy(false); setFlowRL(false);
    setShowProducts(false); setUserQ2(""); setFlowLR2(false); setRightBusy2(false);
    setFlowRL2(false); setShowAnswer(false); setShowBadge(false); setSymIdx(0);

    const timers = [];
    const at = (fn, ms) => timers.push(setTimeout(fn, ms));

    let t = 400;
    for (let i = 1; i <= AGENT_Q1.length; i++) {
      const idx = i;
      at(() => setUserQ1(AGENT_Q1.slice(0, idx)), t + idx * TS);
    }
    t += AGENT_Q1.length * TS + 300;

    at(() => setShowThinking(true), t);
    t += 900;

    at(() => setFlowLR(true), t);
    t += 1100;
    at(() => { setFlowLR(false); setRightBusy(true); }, t);
    t += 650;
    at(() => { setRightBusy(false); setFlowRL(true); }, t);
    t += 1100;
    at(() => { setFlowRL(false); setShowThinking(false); setShowProducts(true); }, t);
    t += 950;

    for (let i = 1; i <= AGENT_Q2.length; i++) {
      const idx = i;
      at(() => setUserQ2(AGENT_Q2.slice(0, idx)), t + idx * TS);
    }
    t += AGENT_Q2.length * TS + 300;

    at(() => setFlowLR2(true), t);
    t += 950;
    at(() => { setFlowLR2(false); setRightBusy2(true); }, t);
    t += 500;
    at(() => { setRightBusy2(false); setFlowRL2(true); }, t);
    t += 950;
    at(() => { setFlowRL2(false); setShowAnswer(true); }, t);
    t += 700;
    at(() => setShowBadge(true), t);

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  useEffect(() => {
    const flowing = flowLR || flowRL || flowLR2 || flowRL2;
    if (!flowing) return;
    const id = setInterval(() => setSymIdx(i => (i + 1) % AGENT_SYMBOLS.length), 180);
    return () => clearInterval(id);
  }, [flowLR, flowRL, flowLR2, flowRL2]);

  const flowingLR = flowLR || flowLR2;
  const flowingRL = flowRL || flowRL2;
  const isFlowing = flowingLR || flowingRL;
  const rightProcessing = rightBusy || rightBusy2;
  const rightGotQ1 = showProducts || !!userQ2 || flowLR2 || rightBusy2 || flowRL2 || showAnswer;
  const rightGotQ2 = showAnswer;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="select-none space-y-3">
      <div className="flex items-stretch gap-2 sm:gap-3">

        {/* Left: Customer's AI */}
        <div className="flex-1 min-w-0 rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border-b border-black/5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-black/60">Customer's AI</span>
          </div>
          <div className="p-3 space-y-2 min-h-[150px]">
            {userQ1 && (
              <div className="flex justify-end">
                <div className="bg-black/5 rounded-2xl rounded-br-sm px-3 py-2 text-sm text-black/80 max-w-[95%] leading-relaxed">
                  {userQ1}{userQ1.length < AGENT_Q1.length && <span className="animate-pulse ml-0.5">|</span>}
                </div>
              </div>
            )}
            {showThinking && (
              <motion.div initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 py-0.5">
                <motion.div className="h-1.5 w-1.5 rounded-full bg-violet-400 flex-shrink-0" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                <span className="text-sm text-violet-500 italic">Routing to Summit Cashmere's agent...</span>
              </motion.div>
            )}
            {showProducts && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="flex gap-1.5 flex-1 min-w-0">
                  {AGENT_PRODUCTS.map((p, i) => (
                    <motion.div key={p.name} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="flex-1 min-w-0 rounded-lg overflow-hidden border border-black/5 bg-white shadow-sm">
                      <div className="aspect-[3/4]"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /></div>
                      <div className="px-1.5 py-1.5">
                        <div className="text-xs font-medium text-black/70 truncate leading-tight">{p.name}</div>
                        <div className="text-xs text-black/45">{p.price}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {userQ2 && (
              <div className="flex justify-end">
                <div className="bg-black/5 rounded-2xl rounded-br-sm px-3 py-2 text-sm text-black/80 max-w-[95%] leading-relaxed">
                  {userQ2}{userQ2.length < AGENT_Q2.length && <span className="animate-pulse ml-0.5">|</span>}
                </div>
              </div>
            )}
            {showAnswer && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-slate-50 border border-black/8 rounded-2xl rounded-bl-sm px-3 py-2 text-sm text-black/80 leading-relaxed">
                  {AGENT_A2_RELAY}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Center: bidirectional wire with cycling computer symbols */}
        <div className="flex-shrink-0 w-10 sm:w-12 flex flex-col items-center justify-center gap-1.5">
          <div className="relative w-full" style={{ height: 20 }}>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-200" />
            {flowingLR && [0, 1, 2].map((i) => (
              <motion.div key={`lr${i}`}
                className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_7px_3px_rgba(139,92,246,0.5)]"
                initial={{ left: "0%", opacity: 0 }}
                animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
            {flowingRL && [0, 1, 2].map((i) => (
              <motion.div key={`rl${i}`}
                className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_7px_3px_rgba(16,185,129,0.5)]"
                initial={{ left: "100%", opacity: 0 }}
                animate={{ left: "0%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </div>
          {isFlowing && (
            <motion.div
              key={symIdx}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="font-mono text-[9px] text-violet-400 text-center leading-none select-none"
            >
              {AGENT_SYMBOLS[symIdx]}
            </motion.div>
          )}
        </div>

        {/* Right: Summit Cashmere's agent — server-side API log */}
        <div className="flex-1 min-w-0 rounded-2xl border border-slate-700 bg-slate-900 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-b border-slate-700">
            <SummitLogo className="h-4 w-auto flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white leading-tight truncate">Summit Cashmere</div>
              <div className="text-[10px] text-slate-400 leading-tight">Agent · Powered by Nobi</div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-slate-400">online</span>
            </div>
          </div>
          <div className="p-3 font-mono space-y-3 min-h-[150px]">
            {rightGotQ1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 text-xs">
                <div className="text-slate-500">POST /mcp/query</div>
                <div className="text-slate-300 pl-2 line-clamp-2">"{AGENT_Q1}"</div>
                <div className="text-emerald-400 mt-1">200 OK · products: [3]</div>
              </motion.div>
            )}
            {rightProcessing && (
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-slate-600" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.65, delay: i * 0.16, repeat: Infinity }} />
                ))}
              </div>
            )}
            {rightGotQ2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 text-xs">
                <div className="text-slate-500">POST /mcp/query</div>
                <div className="text-slate-300 pl-2">"{AGENT_Q2}"</div>
                <div className="text-emerald-400 mt-1">200 OK · "{AGENT_A2_AGENT}"</div>
              </motion.div>
            )}
          </div>
        </div>

      </div>

      {/* Badge */}
      {showBadge && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="flex items-center gap-3 rounded-xl bg-black text-white px-4 py-3.5"
        >
          <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-snug">Two customer queries, zero human effort</div>
            <div className="text-xs text-white/50 mt-0.5">Summit Cashmere's agent handled both automatically</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
