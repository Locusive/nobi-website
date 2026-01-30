import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const DEMO_QUERY = "red dress for a weekend out";

function Button({ variant = "primary", size = "md", className = "", children, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/20";
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-[15px]",
    lg: "h-12 px-6 text-base",
    compact: "h-8 px-3 text-sm",
  };
  const variants = {
    primary:
      "bg-black text-white dark:bg-white dark:text-black hover:opacity-90 shadow-sm",
    ghost:
      "bg-transparent text-black/80 dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/10",
    outline:
      "border border-black/10 dark:border-white/15 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10",
    ai: "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:opacity-90 shadow-sm",
  };
  return (
    <button className={[base, sizes[size], variants[variant], className].join(" ")} {...props}>
      {children}
    </button>
  );
}

function DualModeSearchBar({
  defaultMode = "ai",
  size = "regular",
  mode: controlledMode,
  onModeChange,
  onDemoSubmit,
  locked = true,
}) {
  const isLocked = !!locked;
  const [internalMode, setInternalMode] = useState(defaultMode);
  const mode = controlledMode ?? internalMode;

  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(
    mode === "ai" ? "Describe what you want..." : "Search products..."
  );

  const doneRef = useRef(onDemoSubmit);
  useEffect(() => { doneRef.current = onDemoSubmit; }, [onDemoSubmit]);

  const [demoEnabled, setDemoEnabled] = useState(true);

  useEffect(() => {
    if (!demoEnabled) return;

    const toType = mode === "ai" ? DEMO_QUERY : "Red dress";

    setPlaceholder(mode === "ai" ? "Describe what you want..." : "Search products...");
    setQuery("");

    const startDelay = 450;
    const baseSpeed = 22;
    const jitter = 20;

    let i = 0;
    let cancelled = false;
    const timers = [];

    const tick = () => {
      if (cancelled) return;
      setQuery(toType.slice(0, i + 1));
      i += 1;
      if (i < toType.length) {
        timers.push(setTimeout(tick, baseSpeed + Math.random() * jitter));
      } else {
        timers.push(setTimeout(() => doneRef.current?.({ mode, query: toType }), 300));
      }
    };

    timers.push(setTimeout(tick, startDelay));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [mode, demoEnabled]);

  const ctaLabel = "Ask AI";
  const height = size === "compact" ? "h-11" : "h-14";

  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur px-4 ${height} shadow-sm`}
      >
        {/* Input */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <input
            value={query}
            readOnly={true}
            tabIndex={isLocked ? -1 : 0}
            placeholder={placeholder}
            className={`min-w-0 w-full bg-transparent outline-none text-[15px] placeholder:text-black/40 dark:placeholder:text-white/40 ${
              isLocked ? "pointer-events-none select-none cursor-default" : ""
            }`}
            aria-readonly="true"
          />
        </div>

        {/* CTA */}
        <Button
          variant="ai"
          size="compact"
          className="whitespace-nowrap px-4 h-9 sm:h-8"
        >
          <Sparkles className="h-4 w-4" />
          <span>{ctaLabel}</span>
        </Button>
      </div>
    </div>
  );
}

const PRODUCTS = [
  { title: "Cherry Evening Gown", price: "$189", img: "/media/prod-1.png" },
  { title: "Satin A-Line Dress", price: "$156", img: "/media/prod-2.png" },
  { title: "Sequin Maxi Dress", price: "$224", img: "/media/prod-3.png" },
  { title: "Off-Shoulder Formal", price: "$178", img: "/media/prod-4.png" },
];

const PDP_QUESTION = "Does this run true to size?";
const PDP_ANSWER = "This dress runs true to size. Most customers find it fits perfectly when ordering their usual size. The stretchy fabric provides a comfortable, flattering fit.";

export default function HeroDemo({ className = "" }) {
  const [searchMode, setSearchMode] = useState("ai");
  const [showProducts, setShowProducts] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showPDP, setShowPDP] = useState(false);
  const [pdpQuestion, setPdpQuestion] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  const handleDemoComplete = () => {
    setTimeout(() => setShowProducts(true), 300);
    // After products appear, show cursor and click
    setTimeout(() => setShowCursor(true), 1200);
    setTimeout(() => setClicked(true), 2000);
    // After click, transition to PDP
    setTimeout(() => setShowPDP(true), 2800);
  };

  // Typing animation for PDP question
  useEffect(() => {
    if (!showPDP) return;

    setPdpQuestion("");
    setShowAnswer(false);
    setShowFAQ(false);
    let i = 0;
    const timers = [];

    const startDelay = setTimeout(() => {
      const timer = setInterval(() => {
        if (i < PDP_QUESTION.length) {
          setPdpQuestion(PDP_QUESTION.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          // Show answer after question is done
          timers.push(setTimeout(() => setShowAnswer(true), 600));
          // Transition to FAQ section after answer is shown
          timers.push(setTimeout(() => setShowFAQ(true), 3000));
        }
      }, 50);
      timers.push(timer);
    }, 500);

    timers.push(startDelay);

    return () => timers.forEach(t => clearTimeout(t));
  }, [showPDP]);

  return (
    <div className={`${className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Abstract rectangular container */}
        <div className="rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 bg-gradient-to-br from-violet-50 via-white to-emerald-50 dark:from-violet-900/20 dark:via-zinc-900 dark:to-emerald-900/10 p-8">

          <AnimatePresence mode="wait">
            {!showPDP ? (
              <motion.div
                key="search-view"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DualModeSearchBar
                  locked
                  mode={searchMode}
                  onModeChange={setSearchMode}
                  onDemoSubmit={handleDemoComplete}
                  defaultMode="ai"
                  size="regular"
                />

                {/* Product grid */}
                <div className="mt-8 grid grid-cols-4 gap-4 relative">
                  {PRODUCTS.map((product, i) => (
                    <motion.div
                      key={i}
                      className={`rounded-xl bg-white/60 dark:bg-white/5 border overflow-hidden transition-all duration-300 ${
                        i === 0 && clicked
                          ? "border-fuchsia-400 ring-2 ring-fuchsia-400/50 scale-[1.02]"
                          : "border-black/5 dark:border-white/10"
                      }`}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Image area */}
                      <div className="aspect-[3/4] relative overflow-hidden">
                        {!showProducts ? (
                          <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10" />
                        ) : (
                          <motion.img
                            src={product.img}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                          />
                        )}
                      </div>

                      {/* Text area */}
                      <div className="p-3 space-y-2">
                        {!showProducts ? (
                          <>
                            <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-3/4" />
                            <div className="h-3 bg-black/5 dark:bg-white/5 rounded w-1/2" />
                          </>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                          >
                            <div className="text-sm font-medium text-black/80 dark:text-white/80 truncate">{product.title}</div>
                            <div className="text-sm text-black/50 dark:text-white/50">{product.price}</div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Animated cursor */}
                  <AnimatePresence>
                    {showCursor && !showPDP && (
                      <motion.div
                        className="absolute pointer-events-none z-10"
                        initial={{ top: "50%", left: "50%", opacity: 0 }}
                        animate={{
                          top: "30%",
                          left: "12%",
                          opacity: 1,
                          scale: clicked ? [1, 0.8, 1] : 1
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          scale: { duration: 0.2, delay: 0.8 }
                        }}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" className="drop-shadow-lg">
                          <path d="M19.739 7.408c-.34 0-.662.069-.956.195a2.425 2.425 0 0 0-2.251-1.538c-.379 0-.739.088-1.058.244a2.424 2.424 0 0 0-2.148-1.314 2.4 2.4 0 0 0-.788.133V2.441A2.433 2.433 0 0 0 10.117 0a2.434 2.434 0 0 0-2.424 2.441v9.668l-1.747-1.998a2.425 2.425 0 0 0-1.753-.756H4.18c-.647 0-1.255.25-1.708.705-.801.802-.845 1.992-.122 3.266.938 1.648 1.957 3.201 2.857 4.571.658 1.002 1.278 1.948 1.731 2.729.393.681 1.439 2.882 1.451 2.904.133.287.422.47.738.47h10.367c.356 0 .672-.23.779-.568.194-.602 1.89-5.933 1.89-7.99V9.847a2.435 2.435 0 0 0-2.424-2.439z" fill="#000000"/>
                          <path fill="#ffffff" d="M18.956 9.847c0-.44.353-.801.783-.801.433 0 .785.36.785.801v5.594c0 1.369-1.052 5.046-1.632 6.919H9.644c-.339-.707-.975-2.018-1.288-2.556-.476-.821-1.109-1.784-1.78-2.806-.885-1.351-1.889-2.881-2.8-4.483-.239-.419-.458-.984-.146-1.296a.792.792 0 0 1 1.104-.005l3.163 3.616a.818.818 0 0 0 1.435-.539V2.441c0-.442.353-.801.786-.801.431.001.782.36.782.801v7.654a.82.82 0 0 0 1.638 0V7.434c0-.44.353-.799.788-.799a.79.79 0 0 1 .782.799v3.73a.82.82 0 0 0 1.638 0V8.506c0-.443.352-.802.785-.802s.785.359.785.802v3.726a.82.82 0 1 0 1.638 0V9.847z"/>
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="pdp-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex gap-8"
              >
                {/* Product image - 35% width */}
                <div className="w-[35%] flex-shrink-0">
                  <div className="rounded-2xl overflow-hidden bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-lg">
                    <img
                      src={PRODUCTS[0].img}
                      alt={PRODUCTS[0].title}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  </div>
                </div>

                {/* Product details + Ask AI bar / FAQ section */}
                <div className="flex-1">
                  {/* Product info */}
                  <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-black/90 dark:text-white/90 mb-1">
                      {PRODUCTS[0].title}
                    </h2>
                    <p className="text-xl text-black/70 dark:text-white/70">
                      {PRODUCTS[0].price}
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {!showFAQ ? (
                      <motion.div
                        key="ask-ai"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Stylized Ask AI bar */}
                        <div className="rounded-2xl border border-fuchsia-200 dark:border-fuchsia-800 bg-white/80 dark:bg-zinc-900/80 p-4 shadow-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-black/70 dark:text-white/70">Ask about this product</span>
                          </div>
                          <div className="flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 px-4 h-12">
                            <div className="flex-1 text-sm text-black/80 dark:text-white/80">
                              {pdpQuestion || <span className="text-black/40 dark:text-white/40">Ask a question...</span>}
                              {pdpQuestion.length < PDP_QUESTION.length && pdpQuestion.length > 0 && (
                                <span className="animate-pulse">|</span>
                              )}
                            </div>
                            <Button variant="ai" size="compact" className="px-4 h-8">
                              <Sparkles className="w-4 h-4" />
                              Ask
                            </Button>
                          </div>

                          {/* Answer */}
                          <AnimatePresence>
                            {showAnswer && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="mt-4 p-4 rounded-xl bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 border border-fuchsia-100 dark:border-fuchsia-800"
                              >
                                <p className="text-sm text-black/80 dark:text-white/80 leading-relaxed">
                                  {PDP_ANSWER}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Skeleton details below */}
                        {!showAnswer && (
                          <div className="mt-4 space-y-2">
                            <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-full" />
                            <div className="h-3 bg-black/5 dark:bg-white/5 rounded w-5/6" />
                            <div className="h-3 bg-black/5 dark:bg-white/5 rounded w-4/6" />
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="faq-section"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* FAQ Section */}
                        <div className="rounded-xl border border-fuchsia-200 dark:border-fuchsia-800 bg-white/80 dark:bg-zinc-900/80 p-4 shadow-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-base font-semibold text-black/80 dark:text-white/80">Conversational FAQs</span>
                          </div>
                          <div className="space-y-2">
                            {/* The Q&A that transitioned */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="p-2.5 rounded-lg bg-fuchsia-50/50 dark:bg-fuchsia-900/10 border border-fuchsia-100/50 dark:border-fuchsia-800/30"
                            >
                              <p className="font-semibold text-sm text-black/90 dark:text-white/90 mb-1.5 leading-tight">
                                {PDP_QUESTION}
                              </p>
                              <p className="text-xs text-black/60 dark:text-white/60 leading-snug line-clamp-2">
                                {PDP_ANSWER}
                              </p>
                            </motion.div>

                            {/* Second FAQ - occasion based */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              className="p-2.5 rounded-lg bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10"
                            >
                              <p className="font-semibold text-sm text-black/70 dark:text-white/70 mb-1.5 leading-tight">
                                When should I wear this dress?
                              </p>
                              <p className="text-xs text-black/50 dark:text-white/50 leading-snug line-clamp-2">
                                Perfect for a fun weekend night out, dinner dates, rooftop bars, or any semi-casual evening event.
                              </p>
                            </motion.div>
                          </div>

                          {/* Nobi logo at bottom right */}
                          <div className="flex justify-end mt-3">
                            <img src="/media/nobi-logo.png" alt="Nobi" className="h-6" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
