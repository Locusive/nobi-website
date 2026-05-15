import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const DEMO_QUERIES = {
  default: "red dress for a weekend out",
  search:  "red dress for a weekend out",
  answers: "what's your return policy?",
  leads:   "I need help finding the right size",
};

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
  demoQuery,
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

    const defaultQuery = DEMO_QUERIES[demoQuery] || DEMO_QUERIES.default;
    const toType = mode === "ai" ? defaultQuery : "Red dress";

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
  { title: "Cherry Evening Gown", price: "$189", img: "/media/prod-1.webp" },
  { title: "Satin A-Line Dress", price: "$156", img: "/media/prod-2.webp" },
  { title: "Sequin Maxi Dress", price: "$224", img: "/media/prod-3.webp" },
  { title: "Off-Shoulder Formal", price: "$178", img: "/media/prod-4.webp" },
];

const PDP_QUESTION = "Does this run true to size?";
const PDP_ANSWER = "This dress runs true to size. Most customers find it fits perfectly when ordering their usual size. The stretchy fabric provides a comfortable, flattering fit.";

function SearchDemo({ isActive, variant = "default" }) {
  const [searchMode, setSearchMode] = useState("ai");
  const [showProducts, setShowProducts] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  const handleDemoComplete = () => {
    setTimeout(() => setShowProducts(true), 300);
    setTimeout(() => setShowCursor(true), 1200);
    setTimeout(() => setClicked(true), 2000);
  };

  useEffect(() => {
    if (!isActive) return;
    setShowProducts(false);
    setShowCursor(false);
    setClicked(false);
    setRestartKey((k) => k + 1);
  }, [isActive]);

  return (
    <div>
      <DualModeSearchBar
        key={restartKey}
        locked
        mode={searchMode}
        onModeChange={setSearchMode}
        onDemoSubmit={handleDemoComplete}
        defaultMode="ai"
        size="regular"
        demoQuery={variant}
      />

      {showProducts && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-3 text-sm text-black/80 dark:text-white/80"
        >
          <div className="flex items-start gap-2">
            <img src="/favicon.svg" alt="Nobi" className="h-4 w-4 mt-0.5" />
            <span>
              Here are the most popular red dresses that shoppers have purchased over the past 6 months for a weekend out.
            </span>
          </div>
        </motion.div>
      )}

      <div className="mt-3 sm:mt-4 relative p-3 -m-3">
        {showProducts && (
          <div className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-black/60 dark:text-white/60">
            Red Dresses Popular for a Weekend Out
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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

        </div>
        <AnimatePresence>
          {showCursor && (
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
                scale: { duration: 0.2 }
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
    </div>
  );
}

function PdpDemo({ isActive }) {
  const [pdpQuestion, setPdpQuestion] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  useEffect(() => {
    if (!isActive) return;

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
          timers.push(setTimeout(() => setShowAnswer(true), 600));
          timers.push(setTimeout(() => setShowFAQ(true), 1800));
        }
      }, 50);
      timers.push(timer);
    }, 500);

    timers.push(startDelay);

    return () => timers.forEach((t) => clearTimeout(t));
  }, [isActive]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-4 md:gap-8 h-full"
    >
      <div className="hidden md:block md:w-[26%] flex-shrink-0">
        <div className="rounded-2xl overflow-hidden bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-lg">
          <img
            src={PRODUCTS[0].img}
            alt={PRODUCTS[0].title}
            className="w-full aspect-[1/1] object-cover object-top"
          />
        </div>
      </div>

      <div className="flex-1">
        {!showFAQ && (
          <div className="flex md:hidden gap-3 mb-3">
            <div className="w-16 sm:w-20 flex-shrink-0">
              <div className="rounded-lg overflow-hidden bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-lg">
                <img
                  src={PRODUCTS[0].img}
                  alt={PRODUCTS[0].title}
                  className="w-full aspect-[3/4] object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-black/90 dark:text-white/90 mb-1">
                {PRODUCTS[0].title}
              </h2>
              <p className="text-sm sm:text-base text-black/70 dark:text-white/70">
                {PRODUCTS[0].price}
              </p>
            </div>
          </div>
        )}

        {!showFAQ && (
          <div className="hidden md:block mb-4">
            <h2 className="text-2xl font-semibold text-black/90 dark:text-white/90 mb-1">
              {PRODUCTS[0].title}
            </h2>
            <p className="text-xl text-black/70 dark:text-white/70">
              {PRODUCTS[0].price}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!showFAQ ? (
            <motion.div
              key="ask-ai"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-xl md:rounded-2xl border border-fuchsia-200 dark:border-fuchsia-800 bg-white/80 dark:bg-zinc-900/80 p-3 md:p-4 shadow-lg">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-black/70 dark:text-white/70">Ask about this product</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 px-3 md:px-4 h-10 md:h-12">
                  <div className="flex-1 min-w-0 text-xs md:text-sm text-black/80 dark:text-white/80 truncate">
                    {pdpQuestion || <span className="text-black/40 dark:text-white/40">Ask a question...</span>}
                    {pdpQuestion.length < PDP_QUESTION.length && pdpQuestion.length > 0 && (
                      <span className="animate-pulse">|</span>
                    )}
                  </div>
                  <Button variant="ai" size="compact" className="px-2 md:px-4 h-7 md:h-8 flex-shrink-0">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden md:inline">Ask</span>
                  </Button>
                </div>

                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-3 md:mt-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 border border-fuchsia-100 dark:border-fuchsia-800"
                  >
                    <p className="text-xs md:text-sm text-black/80 dark:text-white/80 leading-relaxed line-clamp-3 md:line-clamp-none">
                      {PDP_ANSWER}
                    </p>
                  </motion.div>
                )}
              </div>

              {!showAnswer && (
                <div className="mt-3 md:mt-4 space-y-2 hidden md:block">
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
              className="flex gap-3"
            >
              <div className="w-20 sm:w-24 flex-shrink-0 md:hidden">
                <div className="rounded-lg overflow-hidden bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-lg">
                  <img
                    src={PRODUCTS[0].img}
                    alt={PRODUCTS[0].title}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 rounded-lg md:rounded-xl border border-fuchsia-200 dark:border-fuchsia-800 bg-white/80 dark:bg-zinc-900/80 p-3 md:p-4 shadow-lg">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-black/80 dark:text-white/80">
                    Common questions shoppers ask about the Cherry Evening Gown
                  </span>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-2 md:p-2.5 rounded-md md:rounded-lg bg-fuchsia-50/50 dark:bg-fuchsia-900/10 border border-fuchsia-100/50 dark:border-fuchsia-800/30"
                  >
                    <p className="font-semibold text-xs md:text-sm text-black/90 dark:text-white/90 mb-1 md:mb-1.5 leading-tight">
                      {PDP_QUESTION}
                    </p>
                    <p className="text-[10px] md:text-xs text-black/60 dark:text-white/60 leading-snug line-clamp-2">
                      {PDP_ANSWER}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="p-2 md:p-2.5 rounded-md md:rounded-lg bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10"
                  >
                    <p className="font-semibold text-xs md:text-sm text-black/70 dark:text-white/70 mb-1 md:mb-1.5 leading-tight">
                      What are the materials of this dress?
                    </p>
                    <p className="text-[10px] md:text-xs text-black/50 dark:text-white/50 leading-snug line-clamp-2">
                      A soft satin blend with a touch of stretch, plus a breathable lining for comfort.
                    </p>
                  </motion.div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const LEADS_USER_QUESTION = "Do you offer installations in Chicago?";
const LEADS_ANSWER = "Yes — 3 certified installers in Chicago, 5–7 day turnaround. Drop your name and email and I'll have one reach out with a quote.";
const LEADS_NAME = "Jamie Patel";
const LEADS_EMAIL = "jamie@example.com";
const LEADS_CONFIRMATION = "Sent! Sarah on our team will reach out within 24 hours.";

function LeadsDemo({ isActive }) {
  const [userText, setUserText] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [nameText, setNameText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [pulseSubmit, setPulseSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    setUserText("");
    setShowAnswer(false);
    setShowForm(false);
    setNameText("");
    setEmailText("");
    setPulseSubmit(false);
    setSubmitted(false);

    const timers = [];
    const schedule = (fn, ms) => timers.push(setTimeout(fn, ms));
    const typeInto = (setter, text, startAt, speed) => {
      for (let i = 1; i <= text.length; i++) {
        schedule(() => setter(text.slice(0, i)), startAt + i * speed);
      }
      return startAt + text.length * speed;
    };

    const userDone = typeInto(setUserText, LEADS_USER_QUESTION, 300, 25);
    schedule(() => setShowAnswer(true), userDone + 350);
    const formStart = userDone + 900;
    schedule(() => setShowForm(true), formStart);
    const nameDone = typeInto(setNameText, LEADS_NAME, formStart + 300, 28);
    const emailDone = typeInto(setEmailText, LEADS_EMAIL, nameDone + 200, 28);
    schedule(() => setPulseSubmit(true), emailDone + 200);
    schedule(() => setSubmitted(true), emailDone + 600);

    return () => timers.forEach((t) => clearTimeout(t));
  }, [isActive]);

  const userTyping = userText.length > 0 && userText.length < LEADS_USER_QUESTION.length;
  const nameTyping = nameText.length > 0 && nameText.length < LEADS_NAME.length;
  const emailTyping = emailText.length > 0 && emailText.length < LEADS_EMAIL.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row gap-4 md:gap-6"
    >
      <div className="md:w-[38%] md:flex-shrink-0">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-900/60 p-5 shadow-sm h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <div className="text-sm font-semibold text-black/80 dark:text-white/80">
              Pacific Home Solutions
            </div>
          </div>
          <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed mb-4">
            Certified installation & repair services across the Midwest.
          </p>
          <div className="space-y-1.5">
            {["HVAC installation", "Solar panels", "Water filtration", "Smart home setup"].map((svc) => (
              <div
                key={svc}
                className="flex items-center gap-2 text-xs text-black/60 dark:text-white/60"
              >
                <span className="h-1 w-1 rounded-full bg-black/30 dark:bg-white/30" />
                {svc}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="rounded-2xl border border-fuchsia-200 dark:border-fuchsia-800 bg-white/90 dark:bg-zinc-900/80 shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/30 dark:to-pink-900/20 border-b border-fuchsia-100 dark:border-fuchsia-800">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-black/80 dark:text-white/80">Ask Nobi</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Online</span>
            </div>
          </div>

          <div className="p-4 space-y-3 min-h-[240px]">
            {userText && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-slate-100 dark:bg-white/10 px-3.5 py-2 text-sm text-black/80 dark:text-white/90">
                  {userText}
                  {userTyping && <span className="ml-0.5 animate-pulse">|</span>}
                </div>
              </motion.div>
            )}

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 border border-fuchsia-100 dark:border-fuchsia-800 px-3.5 py-2 text-sm text-black/80 dark:text-white/90 leading-relaxed">
                  {LEADS_ANSWER}
                </div>
              </motion.div>
            )}

            {showForm && !submitted && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-8 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-3 space-y-2 shadow-sm"
              >
                <div className="flex items-center gap-3 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-black/40 dark:text-white/40 w-12">Name</span>
                  <span className="text-sm text-black/90 dark:text-white/90 min-h-[20px]">
                    {nameText}
                    {nameTyping && <span className="ml-0.5 animate-pulse">|</span>}
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-black/40 dark:text-white/40 w-12">Email</span>
                  <span className="text-sm text-black/90 dark:text-white/90 min-h-[20px]">
                    {emailText}
                    {emailTyping && <span className="ml-0.5 animate-pulse">|</span>}
                  </span>
                </div>
                <Button
                  variant="ai"
                  size="compact"
                  className={`w-full h-9 transition-all ${
                    pulseSubmit ? "ring-2 ring-fuchsia-300 shadow-lg scale-[1.02]" : ""
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Send to sales team</span>
                </Button>
              </motion.div>
            )}

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 border border-fuchsia-100 dark:border-fuchsia-800 px-3.5 py-2 text-sm text-black/80 dark:text-white/90">
                  {LEADS_CONFIRMATION}
                </div>
              </motion.div>
            )}
          </div>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-4 mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                {LEADS_NAME} → your CRM, with the full chat
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const SUPPORT_QUESTION = "How do I cancel my account?";
const SUPPORT_ANSWER = "You can cancel anytime from Settings → Account → Cancel subscription. Your access stays active until the end of the current billing period.";
const SUPPORT_SOURCE_LABEL = "Help Center / Cancellations";

function SupportQADemo({ isActive }) {
  const [userText, setUserText] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [showDeflection, setShowDeflection] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    setUserText("");
    setShowAnswer(false);
    setShowSource(false);
    setShowDeflection(false);

    const timers = [];
    const schedule = (fn, ms) => timers.push(setTimeout(fn, ms));
    const typeInto = (setter, text, startAt, speed) => {
      for (let i = 1; i <= text.length; i++) {
        schedule(() => setter(text.slice(0, i)), startAt + i * speed);
      }
      return startAt + text.length * speed;
    };

    const userDone = typeInto(setUserText, SUPPORT_QUESTION, 300, 28);
    schedule(() => setShowAnswer(true), userDone + 350);
    schedule(() => setShowSource(true), userDone + 1000);
    schedule(() => setShowDeflection(true), userDone + 1800);

    return () => timers.forEach((t) => clearTimeout(t));
  }, [isActive]);

  const userTyping = userText.length > 0 && userText.length < SUPPORT_QUESTION.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row gap-4 md:gap-6"
    >
      <div className="md:w-[38%] md:flex-shrink-0">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-900/60 p-5 shadow-sm h-full">
          <div className="text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mb-2">
            Help Center
          </div>
          <div className="text-base font-semibold text-black/80 dark:text-white/80 mb-4">
            How can we help?
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["Account", "Billing", "Shipping", "Returns"].map((topic) => (
              <div
                key={topic}
                className="rounded-lg border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 py-2 text-xs font-medium text-black/60 dark:text-white/60"
              >
                {topic}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 text-[11px] text-black/40 dark:text-white/40">
            Still stuck?{" "}
            <span className="text-fuchsia-600 dark:text-fuchsia-400">Contact support</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="rounded-2xl border border-fuchsia-200 dark:border-fuchsia-800 bg-white/90 dark:bg-zinc-900/80 shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/30 dark:to-pink-900/20 border-b border-fuchsia-100 dark:border-fuchsia-800">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-black/80 dark:text-white/80">Ask Nobi</span>
          </div>

          <div className="p-4 space-y-3 min-h-[220px]">
            {userText && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-slate-100 dark:bg-white/10 px-3.5 py-2 text-sm text-black/80 dark:text-white/90">
                  {userText}
                  {userTyping && <span className="ml-0.5 animate-pulse">|</span>}
                </div>
              </motion.div>
            )}

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="max-w-[85%] space-y-2">
                  <div className="rounded-2xl rounded-bl-sm bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 border border-fuchsia-100 dark:border-fuchsia-800 px-3.5 py-2 text-sm text-black/80 dark:text-white/90 leading-relaxed">
                    {SUPPORT_ANSWER}
                  </div>
                  {showSource && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-1"
                    >
                      <svg
                        className="h-3 w-3 text-slate-500 dark:text-slate-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        Source:{" "}
                        <span className="text-fuchsia-600 dark:text-fuchsia-400">
                          {SUPPORT_SOURCE_LABEL}
                        </span>
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {showDeflection && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-4 mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                Answered in chat — one less support ticket
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

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

  // Cycle computer symbols while data is in flight
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

        {/* Right: Summit Cashmere's agent — server-side API log, not a user chat */}
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

const HERO_SLIDES = [
  { id: "search",  label: "Search + discovery", Component: SearchDemo },
  { id: "pdp",     label: "Product Q&A",        Component: PdpDemo },
  { id: "support", label: "Support deflection", Component: SupportQADemo },
  { id: "leads",   label: "Lead capture",       Component: LeadsDemo },
  { id: "agents",  label: "AI agent endpoint",  Component: AgentDemo },
];

const VARIANT_TO_INDEX = { search: 0, product: 1, support: 2, leads: 3, answer: 1, agents: 4 };

const SLIDE_DURATIONS_MS = [
  4200 + 1200,
  500 + PDP_QUESTION.length * 50 + 600 + 1800 + 600 + 1200,
  3200,
  4500,
];

export default function HeroDemo({
  className = "",
  variant = "search",
  showTabs = false,
  autoAdvance = false,
}) {
  const initialIndex = VARIANT_TO_INDEX[variant] ?? 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    const next = VARIANT_TO_INDEX[variant] ?? 0;
    setActiveIndex(next);
  }, [variant]);

  const autoAdvanceRef = useRef(null);
  useEffect(() => {
    if (!autoAdvance) return;
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    autoAdvanceRef.current = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATIONS_MS[activeIndex] ?? 6000);
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, [activeIndex, autoAdvance]);

  const ActiveComponent = HERO_SLIDES[activeIndex].Component;

  return (
    <div className={className}>
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-zinc-800/40 dark:via-zinc-900 dark:to-zinc-800/20 p-3 sm:p-8">
          {showTabs && (
            <div className="inline-flex rounded-xl bg-black/[0.04] dark:bg-white/[0.06] p-1 mb-5">
              {HERO_SLIDES.map((slide, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`relative text-xs uppercase tracking-[0.2em] px-4 sm:px-5 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-white dark:bg-white/15 text-black/70 dark:text-white/80 shadow-sm"
                        : "text-black/30 dark:text-white/30 hover:text-black/50 dark:hover:text-white/50"
                    }`}
                  >
                    {slide.label}
                  </button>
                );
              })}
            </div>
          )}

          <motion.div
            layout
            transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            className="relative"
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={HERO_SLIDES[activeIndex].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="px-1"
              >
                <ActiveComponent isActive={true} variant={variant} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
