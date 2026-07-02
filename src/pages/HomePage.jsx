import React, {useEffect, useMemo, useRef, useState} from "react";
import { useSEO } from "../hooks/useSEO";
import {AnimatePresence, animate, motion, useInView, useReducedMotion, useScroll} from "framer-motion";
import Marquee from "react-fast-marquee";
import {
    BarChart3,
    Bot,
    CheckCircle2,
    ChevronDown,
    Heart,
    LayoutGrid,
    MessageCircleQuestion,
    MousePointerClick,
    PlayCircle,
    Quote,
    Search as SearchIcon,
    ShoppingCart,
    Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQList from "../components/FAQList.jsx";
import ScrollPreview from "../components/ScrollPreview";
import {posts, formatPostDate} from "../content/utils/mdxPostLoader";
import HeroDemo from "../components/HeroDemo";
import {VideoModal} from "../components/VideoModal";
import {useDemoForm} from "../context/DemoFormContext";
import DemoCTAButton from "../components/DemoCTAButton";
import {getSignupUrl} from "../utils/signupUrl";
import { trackEvent } from "../utils/eventTracker";
import { EVENTS } from "../constants/events";
import { CANONICAL_DESCRIPTION, LINKEDIN_URL } from "../constants/positioning";


// ===== feature flags (hide sections/links without deleting code) =====
// Build trigger for Cloudflare Pages preview.
const SHOW_LOGOS = true;
const SHOW_PRICING = true;

// …

// Demo sentence that should be typed into the search bar for both modes
const DEMO_QUERY =
  `Red dress for a beach wedding. I'm 5'5" and want something under $200.`;

// ===== Personalization variant content =====
const CHIPS = [
  { id: "search",  label: "Better search" },
  { id: "answer",  label: "Answer every question" },
  { id: "leads",   label: "Capture more leads" },
  { id: "agents",  label: "Reach AI agents" },
];

const VALID_VARIANTS = CHIPS.map((c) => c.id);

const PREVIEW_SECTIONS = [
  { id: "results",  label: "Real results" },
  { id: "features", label: "What Nobi does" },
  { id: "how",      label: "How it works" },
  { id: "pricing",  label: "Pricing" },
];

const VARIANT_CONTENT = {
  default: {
    headline: "Turn your website into your best sales associate",
    subline:  "An AI assistant that answers every question, finds the right product, and turns more visitors into buyers.",
    problemHeading: "Most visitors leave without finding what they need",
    problemBody:    "Your search needs exact words. Your FAQ takes patience. Most visitors bounce before they get an answer.",
    problemPoints: [
      { Icon: SearchIcon,           label: "Dead-end searches",      desc: "Your search needs exact keywords. Visitors who describe what they want get nothing and give up." },
      { Icon: MessageCircleQuestion, label: "Unanswered questions",   desc: "Visitors want to know if it fits their situation, what you charge, or if you ship to them. Your FAQ doesn't have it." },
      { Icon: ShoppingCart,          label: "Lost sales",             desc: "High-intent visitors who couldn't find help buy somewhere else and never come back." },
    ],
    numbersHeading: "What our customers have seen",
    stats: [
      { number: "$1M+",  label: "in extra revenue",    desc: "What Lucchese made in incremental sales in year one. Nobi's AI search surfaced products their keyword search was missing entirely." },
      { number: "2.5x",  label: "more likely to buy",   desc: "Nobi searchers convert at 2.5x the rate of visitors who don't use Nobi, measured across Lucchese and UNTUCKit in head-to-head A/B tests." },
      { number: "39x",   label: "ROI",                 desc: "Lucchese's sustained return since launch. $865K in incremental revenue in the first six months, with the number continuing to grow." },
    ],
  },
  search: {
    headline: "Visitors who can't find it won't buy it.",
    subline:  "AI search that understands what visitors mean, not just what they type. Lucchese generated $1M+ in incremental revenue in year one.",
    problemHeading: "Shoppers describe what they want and get nothing back",
    problemBody:    "Your search needs exact words from product descriptions. Natural language returns zero results, so they leave and buy somewhere else.",
    problemPoints: [
      { Icon: SearchIcon,    label: "Keyword-only search",   desc: "Your search engine matches exact words, not intent. Natural language queries return zero results." },
      { Icon: LayoutGrid,    label: "Dead-end result pages", desc: "Visitors who can't find the right product in two tries don't try a third time. They leave." },
      { Icon: ShoppingCart,  label: "Revenue left behind",   desc: "Every failed search is a product you carry but couldn't surface. That's direct, measurable lost revenue." },
    ],
    numbersHeading: "What better search has done for our customers",
    stats: [
      { number: "$1M+",  label: "in extra revenue",         desc: "Lucchese, year one. Nobi surfaced products their keyword search never would have found, turning dead-end searches into sales." },
      { number: "21.7%", label: "more conversions",         desc: "Kilte vs. Shopify default search in a head-to-head A/B test." },

    ],
  },
  answer: {
    headline: "Every question answered before it costs you a sale or a ticket",
    subline:  "Nobi answers product questions on the page and support questions before they hit your queue. Both cited, both instant, both from your own content.",
    problemHeading: "Unanswered questions bleed revenue on both ends",
    problemBody:    "A shopper on a product page who can't confirm sizing bounces. A customer who can't find your return policy files a ticket. Both are avoidable with an AI that actually knows your content.",
    problemPoints: [
      { Icon: MousePointerClick,     label: "Doubts kill add-to-carts",  desc: "Questions about fit, material, or compatibility that go unanswered send shoppers to a competitor whose page makes it easier to decide." },
      { Icon: LayoutGrid,            label: "Buried answers create tickets", desc: "Your help center has the answer, but it's three clicks deep. Visitors file a ticket instead. Your team answers the same five questions all week." },
      { Icon: MessageCircleQuestion, label: "Support handles what the site should", desc: "Agents spend the day on deflectable questions - returns, shipping, billing - instead of the cases that actually need a human." },
    ],
    numbersHeading: "What changes when every question gets answered",
    stats: [
      { number: "6x",    label: "more purchases",    desc: "Shoppers who engage with a product question and get a cited answer are 6x more likely to buy than those who don't." },
      { number: "2.5x",  label: "higher conversion", desc: "Nobi-assisted shoppers convert at 2.5x the rate of unassisted visitors, measured across Lucchese and UNTUCKit in A/B tests." },
      { number: "Zero",  label: "new tickets",       desc: "Questions answered in chat never become support tickets. Your team focuses on the cases that actually need a human." },
    ],
  },
  agents: {
    headline: "AI agents can now find your business and talk to it directly",
    subline:  "Nobi gives you two things automatically: structured content that AI crawlers index so agents know you exist, and a live endpoint they can call to get real answers.",
    problemHeading: "Your customers' AI agents want to talk to you. Most businesses can't respond.",
    problemBody:    "People are using AI assistants to research, evaluate, and get recommendations. Those agents read indexed content to find businesses, then call endpoints to get live answers. Without both, you're invisible.",
    problemPoints: [
      { Icon: SearchIcon,            label: "Not findable by AI crawlers",    desc: "AI systems index structured content to learn what businesses offer. If your knowledge lives in chat logs or unformatted pages, it never gets indexed." },
      { Icon: MessageCircleQuestion, label: "No endpoint to answer agents",   desc: "When an AI agent wants live answers about your offering, it calls an endpoint. Businesses without one can't respond, and the agent moves on." },
      { Icon: BarChart3,             label: "Two channels, both growing fast", desc: "Indexed content determines whether AI knows you exist. Callable endpoints determine whether AI can serve you to someone right now. Nobi handles both." },
    ],
    numbersHeading: "Your AI presence goes live with Nobi",
    stats: [
      { number: "Auto", label: "indexed from real conversations", desc: "Nobi turns real visitor conversations into structured content AI crawlers can read. Your knowledge base builds itself from actual questions people ask." },
      { number: "Reach",    label: "customers inside their AI",      desc: "When someone uses Claude, ChatGPT, or any AI assistant to research what you offer, your Nobi endpoint answers them directly." },
    ],
  },
  leads: {
    headline: "Turn website conversations into qualified leads",
    subline:  "Nobi answers visitor questions, makes prospects comfortable enough to share who they are, and sends every lead to your CRM with the full chat so sales knows exactly what to say.",
    problemHeading: "Your best prospects leave without telling you who they are",
    problemBody:    "Visitors arrive with real intent, get their questions answered, and leave without your sales team ever knowing they were there.",
    problemPoints: [
      { Icon: MousePointerClick, label: "Silent exits",         desc: "Visitors land, read, and leave. Even high-intent ones disappear without a trace, no contact info, no chance for sales to follow up." },
      { Icon: Heart,             label: "Pop-ups get ignored",  desc: "Generic email-capture pop-ups interrupt at the wrong moment. Visitors dismiss them on reflex, so you get neither the answer nor the lead." },
      { Icon: BarChart3,         label: "Sales flies blind",    desc: "Without the conversation attached to the contact, your team can't tell which leads are ready, what they asked about, or where they came from." },
    ],
    numbersHeading: "What your sales team gets when the website captures leads",
    stats: [
      { number: "0",    label: "forms to build",      desc: "Nobi captures leads inside the conversation itself. No new pop-ups, landing pages, or form integrations to maintain." },
      { number: "100%", label: "of leads attributed", desc: "Every lead arrives with the conversation, campaign source, and referring page attached. Route it to your CRM, Slack, or sales inbox in real time." },
    ],
  },
};


/* ===================== Hero Conversation Demo ===================== */

function ChatBubble({ from = "user", children }) {
  const isUser = from === "user";
  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-[15px] leading-6",
          isUser
            ? "bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/90"
            : "bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

function HeroProductCard({ title = "Oxford Shirt", price = "$168", img }) {
  const hasImage = Boolean(img);

  if (hasImage) {
    // Image variant (uses AssetImage)
    return (
      <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
        <div className="aspect-[6/5] bg-black/5 dark:bg-white/10">
  <AssetImage
    src={img}
    alt={title}
    className="w-full h-full object-cover object-top"
    labelForPlaceholder="Product image"
  />
</div>
       <div className="p-2.5">
          <div className="text-[13px] font-medium text-black/90 dark:text-white/90 line-clamp-1">
            {title}
          </div>
          <div className="text-[13px] text-black/60 dark:text-white/60">{price}</div>
        </div>
      </div>
    );
  }

  // Simple (no image provided)
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-2.5">
<div className="aspect-[6/5] w-full rounded-lg bg-black/5 dark:bg-white/10" />
      <div className="mt-2 text-[13px] font-medium text-black/80 dark:text-white/90">{title}</div>
      <div className="mt-2 text-[13px] font-medium text-black/80 dark:text-white/90">{title}</div>
    </div>
  );
}

function HeroConversationDemo({ script, startKey, ratio = 4 / 3, ratioVar }) {
  const {
    userText = `Red dress for a beach wedding. I'm 5'5" and want something under $200.`,
    aiText   = "Got it! Here are some red dresses that are warm-weather appropriate and comfortable on sand / in a slight breeze (rather than a formal ballroom). These are all available in your size (M) and under $200.",
    products = [
      { title: "St. Bernard x Stark Maxi", price: "$98", img: "/media/prod-1.webp" },
      { title: "Maygel Coronel Cover-Up", price: "$178", img: "/media/prod-2.webp" },
      { title: "Hunter Puff-Sleeve Mini", price: "$124", img: "/media/prod-3.webp" },
    ],
  } = script || {};

  const [step, setStep] = React.useState(-1); // -1 idle, 0 user, 1 ai, 2 products
  const scrollerRef = React.useRef(null);
  const productsRef = React.useRef(null);

  // Start sequence ONLY when startKey becomes >= 0
  React.useEffect(() => {
    if (startKey < 0) return; // gate on initial mount
    const hasUser = Boolean(userText?.trim());
    const hasAi   = Boolean(aiText?.trim());
    // If no bubbles at all, jump straight to products
    if (!hasUser && !hasAi) {
      setStep(2);
      return;
    }
    // Otherwise, step through what exists
    setStep(hasUser ? 0 : 1);
    scrollerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    const t1 = hasAi ? setTimeout(() => setStep(1), 900) : null;
    const t2 = setTimeout(() => setStep(2), hasAi ? 1800 : 900);
    return () => { if (t1) clearTimeout(t1); clearTimeout(t2); };
  }, [startKey, userText, aiText, products]);

  // Smooth scroll to products
  React.useEffect(() => {
    if (step === 2 && scrollerRef.current && productsRef.current) {
      const id = setTimeout(() => {
        const top = productsRef.current.offsetTop - 12;
        scrollerRef.current.scrollTo({ top, behavior: "smooth" });
      }, 140);
      return () => clearTimeout(id);
    }
  }, [step]);

  const showUser1 = step >= 0 && Boolean(userText?.trim());
  const showAi1   = step >= 1 && Boolean(aiText?.trim());
  const showProducts = step >= 2;

  return (
    <div className="hero-preview-panel w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 overflow-hidden shadow-inner">
      <AspectBox ratio={ratio} ratioVar={ratioVar}>
        <div className="absolute inset-0 px-4 md:px-5 py-4 flex flex-col gap-2.5 sm:gap-3">
          <div ref={scrollerRef} className="flex-1 overflow-y-auto hero-demo-scroll">
            <div className="flex h-full flex-col gap-2.5 sm:gap-3">
              {showUser1 && userText && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                  <ChatBubble from="user">{userText}</ChatBubble>
                </motion.div>
              )}
              {showAi1 && aiText && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                  <ChatBubble from="ai">{aiText}</ChatBubble>
                </motion.div>
              )}
              {showProducts && (
                <motion.div
                  key={`prods-${startKey}`}
                  ref={productsRef}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.55 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1"
                >
                  {products.map((p) => (
                    <HeroProductCard key={p.title} title={p.title} price={p.price} img={p.img} />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </AspectBox>
    </div>
  );
}

// --- one script builder used by the preview ---
function makeScript(mode, q = "red dress for a wedding") {
  if (mode === "ai") {
    return {
      userText: `Red dress for a beach wedding. I'm 5'5" and want something under $200.`,
      aiText:
        "Got it! Here are some red dresses that are warm-weather appropriate and comfortable on sand / in a slight breeze (rather than a formal ballroom). These are all available in your size (M) and under $200.",
     products: [
     { title: "St. Bernard x Stark Maxi",        price: "$98", img: "/media/prod-1.webp" },
      { title: "Lulus Bow Backless Maxi",        price: "$55", img: "/media/prod-2.webp" },
        { title: "Maygel Coronel Cover-Up",        price: "$178", img: "/media/prod-3.webp" },
      { title: "Hunter Puff-Sleeve Mini",        price: "$124", img: "/media/prod-4.webp" },
     { title: "Banjanan Cotton Maxi",   price: "$172", img: "/media/prod-5.webp" },
     { title: "Majestic Coconut Maxi",        price: "$189", img: "/media/prod-6.webp" },
   ],
    };
  }
  return {
    userText: "",
    aiText: "",
    products: [
   { title: "Efrain Mogollon Chau Rosa",   price: "$499", img: "/media/prod-default-1.webp" },
   { title: "Loeffler Red Dress Sandal",        price: "$138", img: "/media/prod-default-2.webp" },
   { title: "Anna Quan Penelope Dress",  price: "$148", img: "/media/prod-default-3.webp" },
   { title: "Nadia Red Dress Heel",  price: "$119", img: "/media/prod-default-4.webp" },
   { title: "Mayoral Girl's Red Dress",     price: "$89", img: "/media/prod-default-5.webp" },
   { title: "MVG Brie Dress",      price: "$228", img: "/media/prod-default-6.webp" },
    ],
  };
}

// Adapter so the hero can pass mode + a restart key
function ConversationDemo({ mode, playKey, query }) {
  return <HeroConversationDemo script={makeScript(mode, query)} startKey={playKey} />;
}

function ConversationPreview({ mode, playKey, query }) {
  return (
    <AnimatePresence initial={false} mode="wait">
      <HeroConversationDemo
        key={`${mode}-${playKey}`}
        script={makeScript(mode, query)}
        startKey={playKey}
        ratio={2.2}
        ratioVar="--hero-preview-ratio"
      />
    </AnimatePresence>
  );
}

// -------------------- NOTE --------------------
// This file mirrors the Canvas version, adapted for Vite.
// Assets live in /public/media in this starter. If missing, fallbacks render.

function PlaceholderSVG({ label = "Image", className = "w-full h-full" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${label} placeholder`}
    >
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopOpacity="1" stopColor="#f5f5f5" />
          <stop offset="100%" stopOpacity="1" stopColor="#ebebeb" />
        </linearGradient>
      </defs>
      <rect width="200" height="120" fill="url(#g)" />
      <g opacity="0.6">
        <circle cx="34" cy="90" r="12" fill="#d1d5db" />
        <rect x="60" y="80" width="70" height="8" rx="4" fill="#d1d5db" />
        <rect x="60" y="94" width="40" height="8" rx="4" fill="#d1d5db" />
      </g>
      <text x="100" y="56" textAnchor="middle" fontFamily="ui-sans-serif,system-ui" fontSize="14" fill="#9ca3af">
        {label}
      </text>
    </svg>
  );
}

// --- Responsive aspect-ratio wrapper and media helpers ---
function AspectBox({ ratio = 16 / 9, className = "", ratioVar, children }) {
  const style = ratioVar
    ? { paddingTop: `calc(100% / var(${ratioVar}, ${ratio}))` }
    : { paddingTop: `${100 / ratio}%` };

  return (
    <div className={`relative w-full ${className}`} style={style}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

function isVideoSource(src = "") {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
}

function MediaBox({ src, alt = "", restartKey, objectPosition }) {
  const [failed, setFailed] = useState(false);
  const vidRef = useRef(null);

  // Clear previous error when source changes
  useEffect(() => setFailed(false), [src]);

  // Seek to 0 and play whenever src/restartKey changes
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    try {
      v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    } catch {}
  }, [restartKey, src]);

  // Pause when scrolled off-screen (battery-friendly on mobile)
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play?.(); else v.pause?.(); },
      { threshold: 0.5 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [restartKey, src]);

  if (!src) return <PlaceholderSVG label="" className="w-full h-full" />;

  if (isVideoSource(src) && !failed) {
    return (
      <video
        key={restartKey || src}      // force remount on reselect
        ref={vidRef}
        src={src}
        preload="metadata"
        autoPlay
        loop                         // make feature videos loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ objectPosition: objectPosition || "top" }}
        onError={() => setFailed(true)}
        aria-hidden="true"
        tabIndex={-1}
      />
    );
  }

  return (
    <AssetImage
      src={failed ? undefined : src}
      alt={alt}
      className="w-full h-full object-contain"
    />
  );
}

function AssetImage({ src, alt, className = "", labelForPlaceholder, ...imgProps }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <PlaceholderSVG label={labelForPlaceholder || alt || "Image"} className={className} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
      {...imgProps}     // 👈 allow srcSet, width/height, etc.
    />
  );
}

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

function Logo({ className = "h-7 md:h-9 lg:h-10" }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!failed ? (
        <img
          src="/media/nobi-logo.webp"
          srcSet="/media/nobi-logo.webp 1x, /media/nobi-logo@2x.webp 2x"
          alt="Nobi"
          className="h-full w-auto"
          onError={() => setFailed(true)}
        />
      ) : (
        <svg className="h-full w-auto" viewBox="0 0 120 24" aria-label="Nobi logo">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10" fill="url(#lg)" />
          <rect x="28" y="6" width="86" height="12" rx="6" fill="#111827" />
        </svg>
      )}
    </div>
  );
}

function useTypingDemo({
  mode,
  setQuery,
  setPlaceholder,
  enabled = true,
  onDone,
  textForMode,     // string or (mode) => string
  seed = 0,        // 👈 tiny key that forces a re-run
}) {
  // keep the latest onDone without retriggering the typing effect
  const doneRef = React.useRef(onDone);
  React.useEffect(() => { doneRef.current = onDone; }, [onDone]);

  React.useEffect(() => {
    if (!enabled) return;

    const toType =
      typeof textForMode === "function" ? textForMode(mode) : (textForMode || "");

    // show normal placeholders first, then type actual value in black
    setPlaceholder(mode === "ai" ? "Describe what you want..." : "Search products...");
    setQuery("");

    const startDelay = 450; // ms before first char
    const baseSpeed  = 22;  // ms per char
    const jitter     = 20;  // random variation

    let cancelled = false;
    const timers = [];

    const startTimer = setTimeout(() => {
      let i = 0;
      const step = () => {
        if (cancelled) return;
        setQuery(toType.slice(0, i + 1));
        i++;
        if (i < toType.length) {
          const t = setTimeout(step, baseSpeed + Math.random() * jitter);
          timers.push(t);
        } else {
          const t = setTimeout(() => doneRef.current?.(toType), 300);
          timers.push(t);
        }
      };
      step();
    }, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      timers.forEach(clearTimeout);
    };
  // 👇 include `seed` so changing it restarts the effect even if dependencies look the same
  }, [mode, enabled, seed, setQuery, setPlaceholder, textForMode]);
}

function DualModeSearchBar({
  defaultMode = "ai",
  size = "regular",
  mode: controlledMode,
  onModeChange,
  onSubmit,
  onDemoSubmit, // fired after the typing demo finishes
  locked = false, // 👈 NEW
}) {
     const isLocked = !!locked;
  const [internalMode, setInternalMode] = React.useState(defaultMode);
  const mode = controlledMode ?? internalMode;

  const [query, setQuery] = React.useState("");
  const [placeholder, setPlaceholder] = React.useState(
    mode === "ai" ? "Describe what you want..." : "Search products..."
  );

  // Keep onDemoSubmit stable inside effects
  const doneRef = React.useRef(onDemoSubmit);
  React.useEffect(() => { doneRef.current = onDemoSubmit; }, [onDemoSubmit]);

  // typing demo control
  const [demoEnabled, setDemoEnabled] = React.useState(true);

  // animated toggle thumb
  const toggleRef = React.useRef(null);
  const siteBtnRef = React.useRef(null);
  const aiBtnRef = React.useRef(null);
  const [thumb, setThumb] = React.useState({ left: 0, width: 0 });

  const measureThumb = React.useCallback(() => {
    const btn = mode === "ai" ? aiBtnRef.current : siteBtnRef.current;
    if (!btn) return;
    setThumb({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [mode]);

  React.useEffect(() => {
    measureThumb();
    if (typeof window !== "undefined") {
      const onResize = () => measureThumb();
      window.addEventListener("resize", onResize);
      let ro;
      if ("ResizeObserver" in window && toggleRef.current) {
        ro = new ResizeObserver(() => measureThumb());
        try { ro.observe(toggleRef.current); } catch {}
      }
      return () => {
        window.removeEventListener("resize", onResize);
        ro?.disconnect?.();
      };
    }
  }, [measureThumb]);

  // Re-enable demo on toggle; the typing effect below handles reset/start
  React.useEffect(() => {
    setDemoEnabled(true);
  }, [mode]);

  // Type the demo query (no dependency on onDemoSubmit)
  React.useEffect(() => {
    if (!demoEnabled) return;

    const toType = mode === "ai" ? DEMO_QUERY : "Red dress";

    // reset UI before typing
    setPlaceholder(mode === "ai" ? "Describe what you want..." : "Search products...");
    setQuery("");

    const startDelay = 450;
    const baseSpeed  = 22;
    const jitter     = 20;

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
  }, [mode, demoEnabled]); // ← no onDemoSubmit here

  const setMode = (m) => {
     if (controlledMode === undefined) setInternalMode(m);
    onModeChange?.(m);
  };

  // cancel demo on any user interaction in the input/CTA
  const stopDemoAnd = (next) => (e) => {
    if (demoEnabled) setDemoEnabled(false);
    next?.(e);
  };

  const ctaLabel = mode === "ai" ? "Ask AI" : "Search";
  const height = size === "compact" ? "h-11" : "h-14";

  function submit() {
    if (!query.trim()) return;
    onSubmit?.({ mode, query });
  }

  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur px-2 ${height} shadow-sm`}
      >
        {/* Toggle */}
        <div
          ref={toggleRef}
          className="relative isolate inline-flex rounded-xl bg-black/5 dark:bg-white/10 overflow-hidden shrink-0"
        >
          <button
            ref={siteBtnRef}
            className={`relative z-[1] rounded-lg px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium transition-colors duration-300 ${
              mode === "site" ? "text-black dark:text-white" : "text-black/60 dark:text-white/60"
            }`}
            onClick={() => setMode("site")}
          >
            Default
          </button>
          <button
  ref={aiBtnRef}
  className={`relative z-[1] rounded-lg px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium transition-colors duration-300 ${
    (mode === "ai" ? "text-black dark:text-white" : "text-black/60 dark:text-white/60")
  }`}
  onClick={() => setMode("ai")}
>
  AI
</button>
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={`absolute inset-y-1 rounded-full shadow-sm ${
              mode === "ai"
                ? "bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20"
                : "bg-black/10 dark:bg-white/20"
            }`}
            style={{ left: thumb.left, width: thumb.width }}
          />
        </div>

        {/* Input */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <input
  value={query}
  readOnly={true}                                     // 👈 NEW: no edits allowed
  tabIndex={isLocked ? -1 : 0}                        // 👈 NEW: not focusable when locked
  onChange={isLocked ? undefined : stopDemoAnd((e) => setQuery(e.target.value))}
  onKeyDown={isLocked ? (e) => e.preventDefault() : stopDemoAnd((e) => e.key === "Enter" && submit())}
  onMouseDown={isLocked ? (e) => e.preventDefault() : stopDemoAnd()}
  onTouchStart={isLocked ? (e) => e.preventDefault() : stopDemoAnd()}
  placeholder={placeholder}
  className={`min-w-0 w-full bg-transparent outline-none text-[15px] placeholder:text-black/40 dark:placeholder:text-white/40 ${
    isLocked ? "pointer-events-none select-none cursor-default" : ""
  }`}                                                 // 👈 NEW: ignore taps/clicks
  aria-readonly="true"
/>
        </div>

        {/* CTA */}
        <Button
          onClick={stopDemoAnd(submit)}
          variant={mode === "ai" ? "ai" : "primary"}
          size="compact"
          className="whitespace-nowrap px-3 h-9 sm:h-8"
        >
          {mode === "ai" ? <Sparkles className="h-4 w-4" /> : <SearchIcon className="h-4 w-4" />}
          <span className="hidden sm:inline">{ctaLabel}</span>
        </Button>
      </div>
    </div>
  );
}

function HeroSkeletonLine({ w = "60%" }) {
  return (
    <div
      className="h-3 rounded bg-black/5 dark:bg-white/10"
      style={{ width: w }}
    />
  );
}

// --- HERO PREVIEW HELPERS (names are unique to avoid clashes) ---


const GRADIENT = "bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

// Inline gradient icon-chip echoing the Nobi logo mark (Apptics-style headline motif)
function IconChip({ Icon = Sparkles }) {
  return (
    <span className="mx-[0.12em] inline-grid h-[0.86em] w-[0.86em] shrink-0 translate-y-[0.02em] place-items-center rounded-[0.24em] bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 align-middle shadow-sm">
      <Icon className="h-[56%] w-[56%] text-white" strokeWidth={2.5} />
    </span>
  );
}

function renderHeadline(variant) {
  switch (variant) {
    case "search":
      return <>Visitors who can't find it{" "}<span className={GRADIENT}>won't buy it.</span></>;
    case "product":
      return <>Shoppers won't buy what they still{" "}<span className={GRADIENT}>have doubts about</span></>;
    case "support":
      return <>Your knowledge base should be{" "}<span className={GRADIENT}>answering the tickets</span></>;
    case "leads":
      return <>Turn website conversations into{" "}<span className={GRADIENT}>qualified leads</span></>;
    case "answer":
      return <>Every question answered before it costs you{" "}<span className={GRADIENT}>a sale or a ticket</span></>;
    case "agents":
      return <>AI agents can now find and talk to{" "}<span className={GRADIENT}>your business</span></>;
    default:
      return <>Turn your website into your best{" "}<span className={GRADIENT}>sales associate</span></>;
  }
}

const HERO_STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};
const HERO_ITEM = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function Hero({ onOpenVideo, onOpenDemo, variant, setVariant }) {
  const content = VARIANT_CONTENT[variant] || VARIANT_CONTENT.default;
  const reduce = useReducedMotion();

  // Floating value pills that bob around the demo (real Nobi stats)
  // Clipped onto the demo card's edges (~25% overlapping) so they read as attached to it.
  // x offset goes through framer-motion (not Tailwind translate) because motion owns the
  // transform for the bob. Heights avoid the query text, Ask AI button, answer copy, and
  // product name/price — only card padding and box corners get overlapped.
  const pills = [
    { label: "Lead captured", Icon: CheckCircle2, cls: "left-0 top-[16%]", x: "-75%", ring: "bg-emerald-100 text-emerald-600", delay: 0 },
    { label: "+36% add-to-cart", Icon: ShoppingCart, cls: "right-0 top-[38%]", x: "75%", ring: "bg-blue-100 text-blue-600", delay: 0.7 },
    { label: "2.5x more likely to buy", Icon: Heart, cls: "left-0 bottom-[5%]", x: "-85%", ring: "bg-violet-100 text-violet-600", delay: 1.4 },
  ];

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Animated brand aurora */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-[-12%] h-[520px] w-[820px] max-w-full -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),rgba(139,92,246,0.14),transparent)]"
          // framer replaces the class transform, so centering (-50%) must live in the keyframes
          animate={reduce ? {} : { x: ["-55%", "-45%", "-55%"], y: [0, 24, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[6%] top-[6%] h-[360px] w-[360px] rounded-full blur-3xl bg-[radial-gradient(closest-side,rgba(236,72,153,0.16),transparent)]"
          animate={reduce ? {} : { x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-10 sm:pt-14 lg:pt-16 pb-24">
        <motion.div variants={HERO_STAGGER} initial="hidden" animate="show" className="max-w-3xl mx-auto text-center space-y-6">

          <motion.div variants={HERO_ITEM} className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-black/70 backdrop-blur">
              <Sparkles className="h-4 w-4 text-blue-500" />
              For ecommerce, dealerships, and service sites
            </span>
          </motion.div>

          <motion.h1 variants={HERO_ITEM} className="text-balance text-5xl sm:text-6xl lg:text-[4.25rem] font-semibold leading-[1.05] tracking-tight">
            {renderHeadline(variant)}
          </motion.h1>

          <motion.p variants={HERO_ITEM} className="mx-auto max-w-2xl text-lg sm:text-xl text-black/70">
            {content.subline}
          </motion.p>

          <motion.div variants={HERO_ITEM} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={getSignupUrl()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 text-white hover:opacity-95 shadow-lg shadow-fuchsia-500/25 h-12 px-7 text-base w-full sm:w-auto"
            >
              Get started free
            </a>
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] border border-black/10 bg-white/70 h-12 px-7 text-base w-full sm:w-auto hover:border-black/30"
            >
              Get a demo
            </button>
          </motion.div>

        </motion.div>

        {/* Hero product demo with floating, bobbing value pills */}
        <div className="relative mt-14 max-w-3xl mx-auto">
          {pills.map((p) => (
            <motion.div
              key={p.label}
              className={`absolute z-20 hidden items-center gap-2 rounded-2xl border border-black/5 bg-white px-3.5 py-2.5 shadow-xl xl:flex ${p.cls}`}
              style={{ x: p.x }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { delay: 0.7 + p.delay * 0.18, duration: 0.4 },
                scale: { delay: 0.7 + p.delay * 0.18, duration: 0.4 },
                y: { duration: 3.2 + p.delay, repeat: Infinity, ease: "easeInOut", delay: p.delay },
              }}
            >
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${p.ring}`}>
                <p.Icon className="h-3.5 w-3.5" />
              </span>
              <span className="whitespace-nowrap text-sm font-medium text-black/80">{p.label}</span>
            </motion.div>
          ))}
          <HeroDemo variant={variant} />
        </div>

        {/* Moving logo marquee */}
        <div className="mt-16 max-w-5xl mx-auto">
          <p className="text-center text-sm font-medium text-black/40">Trusted by leading brands</p>
          <div className="mt-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <Marquee speed={32} gradient={false} pauseOnHover autoFill>
              {CUSTOMER_LOGOS.map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className="mx-10 h-8 w-28 select-none object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </Marquee>
          </div>
        </div>

      </div>
    </section>
  );
}

// ===== Problem section =====
function Problem({ variant }) {
  const content = VARIANT_CONTENT[variant] || VARIANT_CONTENT.default;
  return (
    <section className="py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={content.problemHeading}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Sound familiar?
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance max-w-3xl mx-auto">
              {content.problemHeading}
            </h2>
            <p className="mt-4 text-lg text-zinc-500 dark:text-white/60 max-w-2xl mx-auto">
              {content.problemBody}
            </p>
            {content.problemPoints && (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
                {content.problemPoints.map((pt) => (
                  <div
                    key={pt.label}
                    className="rounded-2xl border border-black/8 dark:border-white/8 bg-white/60 dark:bg-white/5 p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 shrink-0">
                        <pt.Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-sm">{pt.label}</h3>
                    </div>
                    <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">{pt.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// Card reveal + hover-lift, shared across section cards. Delay lives inside the
// show variant so the hover/unhover spring stays snappy instead of inheriting the stagger.
const cardReveal = (i = 0) => ({
  variants: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] } },
  },
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.25 },
  whileHover: { y: -6, transition: { type: "spring", stiffness: 320, damping: 24 } },
});

// Rolls a stat like "2.5x" / "39x" / "21.7%" from zero when scrolled into view.
// Non-numeric stats ("Zero", "Auto") and trivial targets ("$1M+") render static.
function CountUp({ value, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const parsed = useMemo(() => {
    const m = String(value).match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)([^0-9]*)$/);
    if (!m) return null;
    const target = parseFloat(m[2]);
    const decimals = (m[2].split(".")[1] || "").length;
    if (target < 2 && decimals === 0) return null;
    return { prefix: m[1], target, decimals, suffix: m[3] };
  }, [value]);
  const [display, setDisplay] = useState(() => (parsed ? (0).toFixed(parsed.decimals) : null));
  useEffect(() => {
    if (!parsed || !inView) return;
    if (reduce) {
      setDisplay(parsed.target.toFixed(parsed.decimals));
      return;
    }
    const controls = animate(0, parsed.target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(parsed.decimals)),
    });
    return () => controls.stop();
  }, [parsed, inView, reduce]);
  if (!parsed) return <div ref={ref} className={className}>{value}</div>;
  return (
    <div ref={ref} className={`${className} tabular-nums`}>
      {parsed.prefix}{display}{parsed.suffix}
    </div>
  );
}

// ===== Numbers section =====
function Numbers({ variant }) {
  const content = VARIANT_CONTENT[variant] || VARIANT_CONTENT.default;
  return (
    <section id="results" className="scroll-mt-20 py-24 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-2xl">
          {content.numbersHeading}
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {content.stats.map((stat, i) => (
            <motion.div
              key={stat.number + stat.label}
              {...cardReveal(i)}
              className="rounded-3xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_16px_40px_-16px_rgba(37,99,235,0.25)]"
            >
              <CountUp
                value={stat.number}
                className="text-5xl lg:text-6xl font-semibold tracking-tight text-blue-600 dark:text-blue-400"
              />
              <div className="mt-2 text-base font-semibold text-zinc-800 dark:text-white/80">
                {stat.label}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-white/60">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
        {!["agents", "leads"].includes(variant) && (
          <p className="mt-5 text-xs text-zinc-400 dark:text-white/40">
            Results measured in A/B tests with a one-day conversion window.
          </p>
        )}
      </div>
    </section>
  );
}

function PlacementVisual({ placement }) {
  if (!placement) return null;
  const mockTitle = placement.mockTitle || placement.heading || "";
  const mockStat = placement.mockStat || "30% more engaged searches";
  const mockCaption = placement.mockCaption || "";

  if (placement.id === "search") {
    return (
      <div className="placement-visual placement-visual--search">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Live search</p>
            <p className="text-lg font-semibold text-slate-900">{mockTitle}</p>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500">{mockStat}</span>
        </div>
        <div className="placement-search-bar">
          <div className="placement-search-toggle">
            <span className="placement-search-toggle-pill placement-search-toggle-pill--active">AI</span>
            <span className="placement-search-toggle-pill text-slate-500">Site</span>
          </div>
          <div className="placement-search-input">Search for “red dresses under $200”</div>
          <div className="placement-search-hint text-slate-500">Hints + quick filters appear as soon as you type.</div>
        </div>
        <p className="text-sm text-slate-500 mt-3">{mockCaption}</p>
      </div>
    );
  }

  if (placement.id === "engagement") {
    return (
      <div className="placement-visual placement-visual--collections">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Live collection</p>
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500">{mockStat}</span>
        </div>
        <div className="placement-collections-grid">
          <div className="placement-mock-card">
            <p className="text-sm font-semibold text-slate-900">Curated slots</p>
            <p className="text-xs text-slate-500">Mood-based AI blocks</p>
          </div>
          <div className="placement-mock-card">
            <p className="text-sm font-semibold text-slate-900">Toggle filters</p>
            <p className="text-xs text-slate-500">AI + manual switch</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">{mockCaption}</p>
      </div>
    );
  }

  if (placement.id === "pdp") {
    return (
      <div className="placement-visual placement-visual--badge">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Live badge</p>
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500">{mockStat}</span>
        </div>
        <div className="placement-badge-shell">
          <div className="placement-badge-avatar text-slate-600">?</div>
          <div>
            <p className="text-base font-semibold text-slate-900">Ask Nobi</p>
            <p className="text-xs text-slate-500">Fit, shipping, availability answered instantly.</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">{mockCaption}</p>
      </div>
    );
  }

  if (placement.id === "recover") {
    return (
      <div className="placement-visual placement-visual--modal">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Live intercept</p>
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500">{mockStat}</span>
        </div>
        <div className="placement-modal-shell">
          <p className="text-sm font-semibold text-slate-900">Don’t leave yet</p>
          <p className="text-xs text-slate-500">Here are 3 red dresses in your size + free shipping code.</p>
        </div>
        <p className="text-sm text-slate-500 mt-3">{mockCaption}</p>
      </div>
    );
  }

  if (placement.id === "api") {
    return (
      <div className="placement-visual placement-visual--api">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Programmatic trigger</p>
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500">{mockStat}</span>
        </div>
        <div className="placement-program-shell">
          {placement.liveMarkup}
        </div>
        <p className="text-sm text-slate-500 mt-3">{mockCaption}</p>
      </div>
    );
  }

  return null;
}

function SearchBarPreview() {
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 650;
  });

  React.useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 650);
    };

    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  return (
    <div className="placement-visual placement-visual--search" style={{ pointerEvents: "auto" }}>
      {isMobile ? (
        <nobi-search-bar
          key="mobile-search"
          default-mode="ai"
          show-icon="true"
          start-collapsed="true"
          show-mode-toggle="false"
        ></nobi-search-bar>
      ) : (
        <nobi-search-bar key="desktop-search" default-mode="ai"></nobi-search-bar>
      )}
    </div>
  );
}

const PILL_OPTIONS = [
  { id: "search", label: "Improve search & discovery", icon: SearchIcon },
  { id: "engage", label: "Engage more visitors", icon: LayoutGrid },
  { id: "answers", label: "Answer customer questions", icon: MessageCircleQuestion },
  { id: "api", label: "Launch AI on demand", icon: Sparkles },
];

const CUSTOMER_LOGOS = [
  { alt: "UNTUCKit", src: "/media/logos/untuckit.svg" },
  { alt: "Lucchese", src: "/media/logos/lucchese.svg" },
{ alt: "TOOLUP", src: "/media/logos/toolup.svg" },
  { alt: "Kilte", src: "/media/logos/kilte.webp" },
  { alt: "Alps and Meters", src: "/media/logos/alps_meters.png" },
];

const PILL_DETAILS = {
  search: {
    title: "AI Search Bar",
    summary: "Use it to replace your existing search bar for better search results (Nobi's semantic search results provably outperform most legacy search engines) along with conversational AI capabilities.",
    ctaLabel: "Learn More →",
    ctaHref: "/why-nobi/better-search",
    customers: [
      { alt: "UNTUCKit", src: "/media/logos/untuckit.svg" },
      { alt: "Lucchese", src: "/media/logos/lucchese.svg" },
    ],
    visual: <SearchBarPreview />,
    snippet:
      "<nobi-search-bar></nobi-search-bar>",
  },
  engage: {
    title: "Suggestion Pills",
    summary: "Use on collections/PLPs to spark exploration with AI prompts that reflect page context, keeping shoppers clicking instead of bouncing.", // citeturn0search0
    customers: [],
    visual: (
      <div className="placement-visual placement-visual--collections">
        <nobi-suggestion-pills pill-count="3"></nobi-suggestion-pills>
      </div>
    ),
    snippet: "<nobi-suggestion-pills></nobi-suggestion-pills>",
  },
  answers: {
    title: "Button",
    summary: "Use in the hero, nav, or help sections to give shoppers a clear CTA to open the assistant, best when you want a single, obvious entry point.",
    customers: [],
    visual: (
      <div className="placement-visual placement-visual--api">
        <nobi-button></nobi-button>
      </div>
    ),
    snippet: "<nobi-button></nobi-button>",
  },
  api: {
    title: "Programmatic Trigger",
    summary: "Use when you need to launch Nobi from your own UI (menus, forms, post‑purchase flows) or want to prefill intent like category or cart context.",
    customers: [],
    visual: (
      <div className="placement-visual placement-visual--api">
        <div className="placement-program-shell">
          <button className="placement-program-btn" type="button" onClick={() => window.Nobi?.openChat?.()}>
            Open Nobi assistant
          </button>
        </div>
      </div>
    ),
    snippet: "Nobi.openChat();",
  },
};

function PillPicker() {
  const [active, setActive] = React.useState(PILL_OPTIONS[0].id);
  const detail = PILL_DETAILS[active] || PILL_DETAILS.search;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-3">
        <div className="w-full sm:w-auto inline-flex flex-col items-start sm:items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 py-4 shadow-sm">
          <span className="text-sm font-semibold text-black/55 dark:text-white/55 pb-1">
            What's your goal?
          </span>
          <div className="flex flex-wrap justify-start sm:justify-center gap-2 sm:gap-3 pt-1">
            {PILL_OPTIONS.map((pill) => {
              const Icon = pill.icon;
              const isActive = active === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActive(pill.id)}
                  className={[
                    "group inline-flex items-center gap-2 rounded-full border bg-white/80 dark:bg-white/10 px-4 py-2 text-sm font-medium text-black dark:text-white transition",
                    "border-black/10 dark:border-white/10 hover:border-blue-200 hover:bg-blue-50/60 dark:hover:bg-white/20",
                    isActive ? "border-blue-200 bg-blue-50/70 dark:bg-white/20" : "",
                  ].join(" ")}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="placement-card">
        <div className="placement-card-grid placement-card-grid--wide">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">{detail.title}</h3>
            <p className="text-base text-black/70 dark:text-white/70 leading-relaxed">
              {detail.summary}
            </p>
            {detail.ctaLabel && detail.ctaHref && (
              <div className="pt-1">
                <a
                  href={detail.ctaHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black hover:border-blue-200 hover:bg-blue-50 transition"
                >
                  {detail.ctaLabel}
                </a>
              </div>
            )}
      </div>
      <div className="space-y-3">
        <DetailVisual detail={detail} />
        <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-black/50 dark:text-white/60">The One-liner</p>
              <pre className="rounded-2xl bg-slate-900 px-4 py-3 text-xs font-mono text-slate-100 whitespace-pre-wrap break-words overflow-hidden">
                {detail.snippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailVisual({ detail }) {
  return (
    <div className="w-full">
      {detail.visual}
    </div>
  );
}

function CustomerLogos({ logos = [] }) {
  if (!logos.length) return null;
  return (
    <div className="space-y-2 pt-2">
      <span className="text-xs uppercase tracking-[0.3em] text-black/50 dark:text-white/60 block">
        Used by
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {logos.map((logo) => (
          <img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            className="h-5 w-auto object-contain select-none grayscale opacity-60 hover:opacity-100 transition"
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}

function BrandMark({ src, label, className = "" }) {
  // Renders the SVG as a mask so the shape fills the box exactly
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={[
        // size: tweak these to taste
        "block h-8 sm:h-10 w-36 sm:w-40",
        // grayscale + subtle hover
        "opacity-70 hover:opacity-100 transition",
        // make the mask show a solid gray; in dark mode use white
        "bg-black/70 dark:bg-white/85",
        // the magic: scale the SVG shape to the box, no whitespace issues
        "[mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]",
        className,
      ].join(" ")}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
      }}
    />
  );
}

// ===== Animated bento tile visuals (Apptics-style live tiles) =====
function SearchViz() {
  const reduce = useReducedMotion();
  // Uses the site's own existing demo product data — no invented products.
  const results = [
    { img: "/media/prod-1.webp", name: "St. Bernard x Stark Maxi", price: "$98" },
    { img: "/media/prod-2.webp", name: "Lulus Bow Backless Maxi", price: "$55" },
    { img: "/media/prod-3.webp", name: "Maygel Coronel Cover-Up", price: "$178" },
  ];
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 p-3">
      <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 px-3 py-2 shadow-sm">
        <SearchIcon className="h-4 w-4 text-black/40 dark:text-white/40 shrink-0" />
        <span className="text-sm text-black/70 dark:text-white/70 truncate">red dress under $200</span>
        <motion.span
          className="h-4 w-px bg-blue-500 shrink-0"
          animate={reduce ? {} : { opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 px-2.5 py-1 text-xs font-semibold text-white shrink-0">
          <Sparkles className="h-3 w-3" /> Ask AI
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {results.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800 shadow-sm"
          >
            <img src={r.img} alt={r.name} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover" />
            <div className="px-1.5 py-1.5">
              <p className="truncate text-[11px] font-medium text-black/70 dark:text-white/70">{r.name}</p>
              <p className="text-[11px] font-semibold text-blue-600">{r.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QAViz() {
  const qs = [
    "Does this ship to Canada?",
    "Is the red dress true to size?",
    "Anything under $200 for a wedding?",
    "Do you have this in a size 8?",
  ];
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 p-3 space-y-2">
      {qs.map((q, i) => (
        <motion.div
          key={q}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: i * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 rounded-xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 px-3 py-2 shadow-sm"
        >
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </span>
          <span className="truncate text-sm text-black/70 dark:text-white/70">{q}</span>
        </motion.div>
      ))}
    </div>
  );
}

function LeadViz() {
  const rows = [
    { label: "Name", val: "Jordan Reyes" },
    { label: "Email", val: "jordan@maison.co" },
    { label: "Wants", val: "Beach wedding dress, size 8" },
  ];
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 p-3 space-y-2">
      {rows.map((r, i) => (
        <motion.div
          key={r.label}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: i * 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 rounded-xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 px-3 py-2"
        >
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
          </span>
          <span className="w-14 shrink-0 text-xs text-black/40 dark:text-white/40">{r.label}</span>
          <span className="truncate text-sm text-black/70 dark:text-white/70">{r.val}</span>
        </motion.div>
      ))}
    </div>
  );
}

function AgentViz() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-3 space-y-2">
      <div className="flex justify-start">
        <div className="rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 text-xs text-white/70 max-w-[80%]">
          Where can I buy boots like these?
        </div>
      </div>
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rounded-2xl rounded-br-sm bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 px-3 py-2 text-xs text-white max-w-[85%]">
          Lucchese carries them. Here's the exact pair and a link.
        </div>
      </motion.div>
    </div>
  );
}

function Features() {
  const tiles = [
    {
      icon: <SearchIcon className="h-5 w-5" />,
      title: "Finds anything on your site",
      stat: "+36% add-to-cart",
      desc: "Visitors search in plain language. Nobi surfaces the right product even when the exact words never appear in your catalog.",
      span: "md:col-span-3",
      tone: "gradient",
      Viz: SearchViz,
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Answers every question",
      stat: "6x more purchases",
      desc: "Pulls from your knowledge base, cites sources, and fact-checks before replying. Shoppers get an answer they can trust.",
      span: "md:col-span-3",
      tone: "plain",
      Viz: QAViz,
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Captures and qualifies leads",
      stat: "Higher-intent leads",
      desc: "Collects contact details mid-conversation and hands you a summary of exactly what each visitor wanted. No more cold follow-ups.",
      span: "md:col-span-3",
      tone: "plain",
      Viz: LeadViz,
    },
    {
      icon: <Bot className="h-5 w-5" />,
      title: "Answers AI agents too",
      stat: "New channel",
      desc: "When a shopper researches you through ChatGPT or Claude, Nobi responds as a callable endpoint, so you show up there as well.",
      span: "md:col-span-3",
      tone: "dark",
      Viz: AgentViz,
    },
  ];

  return (
    <section id="features" className="scroll-mt-20 py-24 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            One assistant. Everything a great salesperson does.
          </h2>
          <p className="mt-4 text-lg text-black/60 dark:text-white/60">
            Nobi greets every visitor, understands what they want, and helps them buy, all in one conversation.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-6 gap-4">
          {tiles.map((t, i) => {
            const Viz = t.Viz;
            return (
              <motion.div
                key={t.title}
                {...cardReveal(i)}
                className={[
                  "relative overflow-hidden rounded-3xl border p-6 flex flex-col gap-5",
                  t.span,
                  t.tone === "dark"
                    ? "border-white/10 bg-[#1b1740] text-white"
                    : t.tone === "gradient"
                    ? "border-blue-200/60 dark:border-blue-900/40 bg-gradient-to-br from-blue-50 via-white to-fuchsia-50 dark:from-blue-950/40 dark:via-zinc-900 dark:to-fuchsia-950/30"
                    : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5",
                ].join(" ")}
              >
                <Viz />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className={[
                      "p-2 rounded-xl shrink-0",
                      t.tone === "dark" ? "bg-white/10 text-blue-300" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
                    ].join(" ")}>
                      {t.icon}
                    </div>
                    <span className={[
                      "text-xs font-semibold rounded-full px-2.5 py-1 border",
                      t.tone === "dark"
                        ? "text-blue-200 bg-white/5 border-white/10"
                        : "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50",
                    ].join(" ")}>
                      {t.stat}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xl tracking-tight">{t.title}</h3>
                  <p className={t.tone === "dark" ? "text-sm text-white/70" : "text-sm text-black/60 dark:text-white/60"}>{t.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


// Results is now handled by the Numbers component above; this stub keeps old anchor links working
function Results() {
  return null;
}

function Testimonial() {
  const leftRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(0);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
  if (!leftRef.current) return;
  const el = leftRef.current;

  // If ResizeObserver isn't supported, measure once and exit
  if (typeof window === "undefined" || typeof window.ResizeObserver === "undefined") {
    setLeftHeight(el.getBoundingClientRect().height || 320);
    return;
  }

  const ro = new ResizeObserver(() => {
    setLeftHeight(el.getBoundingClientRect().height);
  });
  ro.observe(el);
  // Initial measure
  setLeftHeight(el.getBoundingClientRect().height);

  return () => ro.disconnect();
}, []);

  return (
    <section id="testimonial" className="pb-24 pt-2">
      <div className="mx-auto max-w-6xl px-6">
        {/* Do NOT stretch children; align them to the start */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {/* Quote card — natural height, not stretched */}
          <div
            ref={leftRef}
            className="lg:col-span-2 self-start rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-8 shadow-sm"
          >
            <Quote className="h-6 w-6 text-blue-600 mb-4" />
            <p className="text-2xl sm:text-3xl leading-snug font-medium tracking-tight text-black/90 dark:text-white">
              “We've seen great incremental results, where conversion rates have been significantly higher through Nobi than on our binary search.”
            </p>
            <div className="mt-6 flex items-center gap-4">
              {!avatarFailed ? (
                <img
                  src="/media/lourdes.png"
                  alt="Customer avatar"
                  className="h-10 w-10 rounded-full object-cover bg-black/10 dark:bg-white/10"
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-500" />
              )}
              <div>
                <div className="font-semibold">Lourdes Servin</div>
                <div className="text-sm text-black/60 dark:text-white/60">
                  Sr. Director, Digital and E-Commerce, Lucchese Bootmaker
                </div>
              </div>
            </div>
          </div>

          {/* Photo card — height follows the quote, no inner padding, image covers */}
          <div
            className="relative self-start rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden bg-white/70 dark:bg-white/5"
            style={{
              // Match the quote's height on desktop; give a safe minimum before we measure
              height: leftHeight || 320,
            }}
          >
            {!photoFailed ? (
              <img
                src="/media/lucchese-testimonial-image.webp"
                alt="Customer lifestyle"
                className="h-full w-full object-cover"
                onError={() => setPhotoFailed(true)}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-zinc-200 via-white to-zinc-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800" />
            )}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white text-center">
              <div className="text-3xl sm:text-4xl font-semibold leading-tight">
                $1M+ in revenue
              </div>
              <div className="text-lg sm:text-xl font-medium text-white/90">
                from Nobi in 2025
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonTable() {
  const cols = [
    { key: "nobi", label: "Nobi", accent: true },
    { key: "search", label: "Plain site search" },
    { key: "chatbot", label: "A basic chatbot" },
  ];
  const rows = [
    { f: "Understands plain-language questions", nobi: true, search: false, chatbot: "partial" },
    { f: "Finds products without exact keywords", nobi: true, search: false, chatbot: false },
    { f: "Answers from your knowledge base", nobi: true, search: false, chatbot: "partial" },
    { f: "Cites its sources and fact-checks", nobi: true, search: false, chatbot: false },
    { f: "Captures and qualifies leads", nobi: true, search: false, chatbot: false },
    { f: "Answers AI agents like ChatGPT and Claude", nobi: true, search: false, chatbot: false },
    { f: "Live in about 15 minutes", nobi: true, search: "partial", chatbot: true },
  ];
  const Mark = ({ v, accent }) => {
    if (v === true) return <CheckCircle2 className={`mx-auto h-5 w-5 ${accent ? "text-blue-600" : "text-zinc-400 dark:text-white/40"}`} />;
    if (v === "partial") return <span className="mx-auto block h-3.5 w-3.5 rounded-full border-2 border-zinc-300 dark:border-white/25" />;
    return <span className="mx-auto block h-0.5 w-3.5 rounded-full bg-zinc-200 dark:bg-white/15" />;
  };
  return (
    <section className="scroll-mt-20 py-24 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-2xl">
          What sets Nobi apart
        </h2>
        <p className="mt-3 text-lg text-zinc-500 dark:text-white/60 max-w-2xl">
          Search boxes match keywords. Basic chatbots read scripts. Nobi actually understands your shopper.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 overflow-hidden rounded-3xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5"
        >
          <div className="grid grid-cols-[1.6fr_repeat(3,1fr)]">
            <div className="px-6 py-4" />
            {cols.map((c) => (
              <div
                key={c.key}
                className={`px-4 py-4 text-center text-sm font-semibold ${
                  c.accent ? "bg-gradient-to-b from-blue-600 via-violet-600 to-fuchsia-600 text-white" : "text-zinc-500 dark:text-white/60"
                }`}
              >
                {c.label}
              </div>
            ))}
          </div>
          {rows.map((r, i) => (
            <div
              key={r.f}
              className={`grid grid-cols-[1.6fr_repeat(3,1fr)] items-center border-t border-black/5 dark:border-white/10 ${
                i % 2 ? "bg-zinc-50/60 dark:bg-white/[0.02]" : ""
              }`}
            >
              <div className="px-6 py-4 text-sm text-zinc-700 dark:text-white/80">{r.f}</div>
              {cols.map((c) => (
                <div key={c.key} className={`px-4 py-4 ${c.accent ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}>
                  <Mark v={r[c.key]} accent={c.accent} />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", h: "Connect your site", p: "Paste one script tag or install the Shopify app. Nobi reads your catalog, pages, and PDFs automatically." },
    { n: "02", h: "Customize and launch", p: "Pick where Nobi appears, set your brand voice, and go live. Your knowledge base refreshes twice a day, hands-free." },
    { n: "03", h: "Measure the lift", p: "Track conversions, revenue, and what visitors ask in one dashboard. A/B test configurations and see the impact directly." },
  ];
  return (
    <section id="how" className="scroll-mt-20 py-24 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-2xl">
          Live in 15 minutes. No engineers required.
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              {...cardReveal(i)}
              className="rounded-3xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5 p-7 transition-shadow hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.15)]"
            >
              <div className="font-mono text-sm font-semibold text-blue-600">{s.n}</div>
              <div className="mt-3 text-lg font-semibold tracking-tight">{s.h}</div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-white/60">{s.p}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-sm text-zinc-500 dark:text-white/60 max-w-3xl">
          Works with Shopify, WooCommerce, headless, and custom sites. Reads your pages, PDFs, and documents, connects to your existing forms and CRM, and refreshes automatically twice a day.
        </p>
      </div>
    </section>
  );
}

function Pricing() {
  const { onOpen } = useDemoForm();
  const tiers = [
    { name: "Standard", price: "$25", blurb: "Everything you need to get started", points: ["100 free messages/month to try in your dashboard", "2,500 searches and 250 messages included", "Up to 5,000 products and KB documents"], cta: "Start for Free", href: getSignupUrl(), highlighted: true },
    { name: "Enterprise", price: "Custom", blurb: "For high-volume brands with large catalogs", points: ["Volume discounts on usage", "Custom integrations and onboarding", "Dedicated support"], cta: "Contact Sales", onClick: onOpen },
  ];
  return (
    <section id="pricing" className="scroll-mt-20 py-24 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">Simple, usage-based pricing</h2>
        <p className="mt-3 text-lg text-zinc-500 dark:text-white/60 max-w-2xl">A low monthly base with per-use rates. Try it free in your dashboard, no credit card needed.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              {...cardReveal(i)}
              className={`flex flex-col rounded-3xl border p-8 transition-shadow ${
                t.highlighted
                  ? "border-blue-300 dark:border-blue-800 bg-white dark:bg-white/5 ring-1 ring-blue-200 dark:ring-blue-900 shadow-[0_8px_30px_rgba(37,99,235,0.10)] hover:shadow-[0_20px_50px_-16px_rgba(37,99,235,0.30)]"
                  : "border-black/8 dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.15)]"
              }`}
            >
              <div className="text-sm font-semibold tracking-wide text-blue-600">{t.name}</div>
              <div className="mt-3 text-4xl font-semibold tracking-tight">
                {t.price}{t.price !== "Custom" && <span className="text-base font-normal text-zinc-400"> / mo base</span>}
              </div>
              <div className="mt-2 text-sm text-zinc-500 dark:text-white/60">{t.blurb}</div>
              <div className="mt-6 flex-1 space-y-3 text-sm">
                {t.points.map((p) => (
                  <div key={p} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600 shrink-0" />
                    <span className="text-zinc-600 dark:text-white/70">{p}</span>
                  </div>
                ))}
              </div>
              {t.href ? (
                <a
                  href={t.href}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] h-11 px-5 text-base w-full ${
                    t.highlighted
                      ? "bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 text-white hover:opacity-95 shadow-lg shadow-fuchsia-500/25"
                      : "bg-zinc-900 text-white dark:bg-white dark:text-black hover:opacity-90"
                  }`}
                >
                  {t.cta}
                </a>
              ) : (
                <Button className="mt-8 w-full" variant="outline" onClick={t.onClick}>{t.cta}</Button>
              )}
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-sm text-zinc-400 dark:text-white/50">
          <a href="/pricing" className="underline hover:text-blue-600">See full pricing</a> · Overages: $0.10/message, $0.01/search
        </p>
      </div>
    </section>
  );
}

// Simple horizontal bar
function Bar({ value, maxValue }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / maxValue) * 100)));
  return (
    <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/10">
      <div
        className="h-2 rounded-full bg-blue-600"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// Heatmap cell (v is 0..1)
function HeatCell({ v = 0 }) {
  const bg = `rgba(139, 92, 246, ${0.15 + v * 0.45})`; // violet w/ variable opacity
  return (
    <div
      className="h-10 sm:h-12 md:h-14 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium"
      style={{ backgroundColor: bg, border: "1px solid rgba(0,0,0,0.06)" }}
      aria-label={`affinity ${Math.round(v * 100)}%`}
    >
      {Math.round(v * 100)}%
    </div>
  );
}

/* ========= Insights section ========= */
function InsightsBar({ value, maxValue }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / maxValue) * 100)));
  return (
    <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/10">
      <div
        className="h-2 rounded-full bg-blue-600"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function getSparklinePoints(series, width, height, padding = 6) {
  if (!series.length) return "";
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = Math.max(1, max - min);
  const step = (width - padding * 2) / (series.length - 1 || 1);
  return series
    .map((v, i) => {
      const x = padding + i * step;
      const y = height - padding - ((v - min) / span) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

function Sparkline({ series, label }) {
  const width = 160;
  const height = 48;
  const points = getSparklinePoints(series, width, height);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="w-full h-12 overflow-visible"
    >
      <defs>
        <linearGradient id="sparkline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="url(#sparkline)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getLinePath(series, width, height, min, max, padding = 10) {
  if (!series.length) return "";
  const span = Math.max(1, max - min);
  const step = (width - padding * 2) / (series.length - 1 || 1);
  return series
    .map((v, i) => {
      const x = padding + i * step;
      const y = height - padding - ((v - min) / span) * (height - padding * 2);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function MultiLineChart({ seriesList = [] }) {
  const width = 560;
  const height = 190;
  const allValues = seriesList.flatMap((s) => s.values);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52">
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="none" />
        <g stroke="#E5E7EB" strokeWidth="1">
          {[0.2, 0.4, 0.6, 0.8].map((p) => (
            <line key={p} x1="0" x2={width} y1={height * p} y2={height * p} />
          ))}
        </g>
        {seriesList.map((series, index) => {
          const path = getLinePath(series.values, width, height, min, max);
          return (
            <path
              key={series.label}
              d={path}
              fill="none"
              stroke={series.color}
              strokeWidth={index === 0 ? 3 : 2.5}
              strokeLinecap="round"
            />
          );
        })}
        {seriesList[0] && (
          <path
            d={`${getLinePath(seriesList[0].values, width, height, min, max)} L ${width - 10},${height - 10} L 10,${height - 10} Z`}
            fill="url(#lineFill)"
          />
        )}
      </svg>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-black/60 dark:text-white/60">
        {seriesList.map((series) => (
          <div key={series.label} className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: series.color }} />
            <span>{series.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Insights({ onOpenForm }) {
  // Illustrative dashboard using the site's existing example data.
  const intents = [
    { label: "Buying a gift", value: 124 },
    { label: "Shopping for an upcoming trip", value: 96 },
    { label: "Sizing and fit questions", value: 88 },
    { label: "Shopping by product type", value: 54 },
  ];
  const prompts = [
    "Shirts and pants for a boy going off to college (probably a large).",
    "Outfits for a trip to Puerto Vallarta for a girlfriend's 30th.",
    "Will the Legend shirt shrink in the wash?",
  ];
  const maxV = Math.max(...intents.map((d) => d.value));
  return (
    <section id="insights" className="scroll-mt-20 py-24 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-2xl">
          Every conversation becomes insight
        </h2>
        <p className="mt-3 text-lg text-zinc-500 dark:text-white/60 max-w-2xl">
          Nobi turns real shopper conversations into structured signals, so you see what customers actually want in their own words.
        </p>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5 p-7"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-white/60">
              <BarChart3 className="h-4 w-4 text-blue-600" /> Top customer intents
            </div>
            <div className="mt-6 space-y-4">
              {intents.map((d) => (
                <div key={d.label}>
                  <div className="mb-1.5 text-sm text-zinc-700 dark:text-white/80">{d.label}</div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-white/10">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.round((d.value / maxV) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5 p-7"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-white/60">
              <Quote className="h-4 w-4 text-blue-600" /> In their own words
            </div>
            <div className="mt-6 space-y-3">
              {prompts.map((p) => (
                <blockquote key={p} className="rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/10 px-4 py-3 text-sm text-zinc-700 dark:text-white/80">
                  “{p}”
                </blockquote>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function RequestDemoModal({ open, onClose }) {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    company: "",
    website: "",
    platform: "Shopify",
    message: "",
    botcheck: "", // honeypot
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // Web3Forms endpoint
      const accessKey = "c7a3fd79-0e4f-47ce-aa30-c141616d21e3";

      const formData = new FormData();
      formData.append("access_key", accessKey);
      formData.append("subject", "Nobi Demo Request: " + (form.company || form.name || "(no name)"));
      formData.append("from_name", "Nobi Website");
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("company", form.company);
      formData.append("website", form.website);
      formData.append("platform", form.platform);
      formData.append("message", form.message);
      formData.append("botcheck", form.botcheck);

      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Something went wrong.");
      setDone(true);
    } catch (err) {
      setError(err.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close form" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Try it on your store</h2>
          <button
            onClick={onClose}
            className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-2 py-1 hover:opacity-80"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {!done ? (
          <form onSubmit={submit} className="mt-4 space-y-4">
            {/* honeypot */}
            <input type="text" name="botcheck" value={form.botcheck} onChange={update} className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm block mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  required
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="text-sm block mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  required
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm block mb-1">Company</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={update}
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="text-sm block mb-1">Website</label>
                <input
                  name="website"
                  value={form.website}
                  onChange={update}
                  placeholder="https://yourstore.com"
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm block mb-1">Platform</label>
                <select
                  name="platform"
                  value={form.platform}
                  onChange={update}
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 outline-none"
                >
                  <option>Shopify</option>
                  <option>Headless</option>
                  <option>Magento</option>
                  <option>BigCommerce</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm block mb-1">Anything else?</label>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={update}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 outline-none"
                placeholder="Goal, timeline, questions…"
              />
            </div>

            {error && <div className="text-sm text-red-600 dark:text-rose-400">{error}</div>}

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending…" : "Submit"}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-4">
            <p className="text-black/80 dark:text-white/90">
              Thanks! We’ve received your request and will reach out shortly.
            </p>
            <p className="text-black/60 dark:text-white/70 mt-2 text-sm">
              Want to skip the wait? Book a time directly.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://calendly.com/shanif/nobi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] bg-black text-white dark:bg-white dark:text-black hover:opacity-90 shadow-sm h-10 px-5 text-base no-underline"
              >
                Book a Call
              </a>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LatestPosts() {
  const featured = posts.filter((p) => p.meta.featured);
  const nonFeatured = posts.filter((p) => !p.meta.featured);
  const ordered = [...featured, ...nonFeatured].slice(0, 3);
  const recent = ordered;
  if (!recent.length) return null;

  const articleLd = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://nobi.ai";
    return recent.map((post, index) => ({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.meta.title,
      "datePublished": post.meta.date,
      "image": post.meta.heroImage || undefined,
      "url": `${origin}/blog/${post.slug}`,
      "position": index + 1,
    }));
  }, [recent]);
  return (
    <section className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Thoughts</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">Latest from Nobi</h2>
            <p className="mt-2 text-black/70 dark:text-white/70 max-w-2xl">Playbooks and experiments for conversational shopping.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:-translate-y-1 hover:shadow-lg transition-all overflow-hidden"
            >
              {post.meta.heroImage && (
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={post.meta.heroImage}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="mt-2 text-xl font-semibold group-hover:text-blue-600 transition-colors">{post.meta.title}</h3>
                <p className="mt-2 text-sm text-black/70 dark:text-white/70 line-clamp-3">{post.meta.excerpt}</p>
                <div className="mt-3 text-xs text-black/50 dark:text-white/60">
                  {formatPostDate(post.meta.date, { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a href="/blog" className="text-sm font-semibold text-black hover:text-blue-600">
            View all →
          </a>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd.length === 1 ? articleLd[0] : articleLd) }}
        />
      </div>
    </section>
  );
}

function WorksWith() {
  const items = [
    "Shopify, WooCommerce, headless, or custom site",
    "Reads web pages, PDFs, and uploaded documents",
    "Connects to your existing forms and CRM",
    "Remarketing pixels for Facebook and Google Ads included",
    "Knowledge base refreshes automatically twice a day",
  ];
  return (
    <section className="py-24 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-2xl">
          Works with what you already have
        </h2>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-2xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-4 text-zinc-700 dark:text-white/80">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalCTA({ onOpenDemo }) {
  return (
    <section className="px-6 pb-24 pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 px-8 py-16 sm:px-16 sm:py-20 text-center">
          <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
              Turn more of your visitors into buyers
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Add Nobi to your site in about 15 minutes. Try it free, no credit card needed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getSignupUrl()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] bg-white text-blue-700 hover:bg-white/95 shadow-lg h-12 px-7 text-base w-full sm:w-auto"
              >
                Get started free
              </a>
              <button
                onClick={onOpenDemo}
                className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] border border-white/30 bg-white/10 text-white hover:bg-white/20 h-12 px-7 text-base w-full sm:w-auto"
              >
                Get a demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* ============ V3 — radical simplicity (Shanif's direction) ========= */
/* ================================================================== */

// Types, holds, deletes, and cycles through example queries in the hero search bar
function useTypedLoop(strings, enabled = true) {
  const [text, setText] = useState(enabled ? "" : strings[0]);
  useEffect(() => {
    if (!enabled) return;
    let i = 0;
    let char = 0;
    let deleting = false;
    let t;
    const tick = () => {
      const full = strings[i % strings.length];
      char += deleting ? -1 : 1;
      setText(full.slice(0, char));
      let delay = deleting ? 28 : 62;
      if (!deleting && char === full.length) {
        delay = 1700;
        deleting = true;
      } else if (deleting && char === 0) {
        deleting = false;
        i += 1;
        delay = 400;
      }
      t = setTimeout(tick, delay);
    };
    t = setTimeout(tick, 700);
    return () => clearTimeout(t);
  }, [enabled]);
  return text;
}

const HERO_QUERIES = [
  "noise-cancelling headphones",
  "red dress for a beach wedding",
  "boots that run wide",
  "do you ship to Canada?",
];

function HeroV2({ onOpenDemo }) {
  const reduce = useReducedMotion();
  const typed = useTypedLoop(HERO_QUERIES, !reduce);
  return (
    <section className="relative isolate overflow-hidden -mt-[68px] pt-[68px]">
      {/* Purple blob field (Shanif's hero) */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#7263d8] overflow-hidden">
        <motion.div
          className="absolute left-[-12%] top-[-25%] h-[720px] w-[720px] rounded-full blur-3xl bg-[radial-gradient(closest-side,#4f3fc0,transparent)]"
          animate={reduce ? {} : { x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[28%] top-[8%] h-[640px] w-[820px] rounded-full blur-3xl bg-[radial-gradient(closest-side,#a598f5,transparent)] opacity-90"
          animate={reduce ? {} : { x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-14%] top-[-18%] h-[560px] w-[560px] rounded-full blur-3xl bg-[radial-gradient(closest-side,#f09d63,transparent)]"
          animate={reduce ? {} : { x: [0, -30, 0], y: [0, 26, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute right-[2%] bottom-[-30%] h-[520px] w-[520px] rounded-full blur-3xl bg-[radial-gradient(closest-side,#e8935e,transparent)] opacity-70" />
        <div className="absolute left-[-6%] bottom-[-24%] h-[480px] w-[560px] rounded-full blur-3xl bg-[radial-gradient(closest-side,#c88fdd,transparent)] opacity-80" />
      </div>

      <motion.div
        variants={HERO_STAGGER}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-3xl px-6 pt-16 sm:pt-20 pb-24 sm:pb-28 text-center"
      >
        <motion.div variants={HERO_ITEM} className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            AI-native site search
          </span>
        </motion.div>

        <motion.h1
          variants={HERO_ITEM}
          className="mt-6 text-balance text-5xl sm:text-6xl lg:text-[4.5rem] font-semibold leading-[1.04] tracking-tight text-white"
        >
          Modern site search that converts
        </motion.h1>

        <motion.p variants={HERO_ITEM} className="mx-auto mt-5 max-w-xl text-lg sm:text-xl leading-relaxed text-white/85">
          Keyword search is outdated. Nobi understands what your visitors actually mean, so more of them convert.
        </motion.p>

        <motion.div variants={HERO_ITEM} className="mx-auto mt-8 max-w-xl">
          <a
            href="#try"
            className="flex items-center gap-3 rounded-2xl bg-white p-1.5 pl-4 text-left shadow-[0_24px_60px_-20px_rgba(30,20,90,0.45)]"
          >
            <SearchIcon className="h-4.5 w-4.5 h-[18px] w-[18px] shrink-0 text-slate-400" />
            <span className="flex-1 truncate text-[15px] text-slate-800">
              {typed}
              <span className="ml-px inline-block h-4 w-px translate-y-[3px] animate-pulse bg-slate-500" />
            </span>
            <span className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Search
            </span>
          </a>
        </motion.div>

        <motion.div variants={HERO_ITEM} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={getSignupUrl()}
            className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 active:scale-[.98]"
          >
            Start Completely Free
          </a>
          <button
            onClick={onOpenDemo}
            className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 active:scale-[.98]"
          >
            Book A Demo
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Proof bar — logos + one killer stat, one line
function ProofBar() {
  return (
    <section className="border-b border-violet-900/5 bg-[#f7f5ff] py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-6">
        {CUSTOMER_LOGOS.map((logo) => (
          <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-6 w-auto select-none object-contain opacity-50 grayscale" />
        ))}
        <span className="hidden h-5 w-px bg-violet-900/10 sm:block" />
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-violet-700">21.7% more conversions</span> in head-to-head A/B tests
        </p>
      </div>
    </section>
  );
}

// Try it live — the interactive demo is the centerpiece
function TryItLive() {
  return (
    <section id="try" className="relative isolate scroll-mt-20 overflow-hidden bg-[#f7f5ff] py-20 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[18%] h-[420px] w-[420px] rounded-full blur-3xl bg-[radial-gradient(closest-side,rgba(139,92,246,0.16),transparent)]" />
        <div className="absolute right-[6%] bottom-[4%] h-[380px] w-[380px] rounded-full blur-3xl bg-[radial-gradient(closest-side,rgba(240,157,99,0.14),transparent)]" />
      </div>
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">Try it live</h2>
        <p className="mt-3 text-lg text-slate-500">Search like a shopper would. Real store, real results.</p>
      </div>
      <div className="mx-auto mt-10 max-w-3xl px-6">
        <HeroDemo variant="default" />
      </div>
    </section>
  );
}

// The problem, sharply — one visual, no cards
function ProblemSharp() {
  const RESULTS = [
    { title: "St. Bernard x Stark Maxi", price: "$98", img: "/media/prod-1.webp" },
    { title: "Maygel Coronel Cover-Up", price: "$178", img: "/media/prod-2.webp" },
    { title: "Hunter Puff-Sleeve Mini", price: "$124", img: "/media/prod-3.webp" },
  ];
  const QUERY = "dress for a beach wedding under $200";
  return (
    <section className="border-t border-violet-900/5 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">Keyword search is dumb.</h2>
        <p className="mt-3 text-lg text-slate-500">It matches letters. Your shoppers speak in intent.</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-12 grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-violet-900/10 bg-white shadow-[0_32px_80px_-40px_rgba(76,50,180,0.45)] md:grid-cols-2"
      >
        {/* Before */}
        <div className="border-b border-black/5 bg-slate-50/80 p-6 sm:p-8 md:border-b-0 md:border-r">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your current search</div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600">
            <SearchIcon className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">{QUERY}</span>
          </div>
          <div className="flex flex-col items-center py-10 text-center">
            <div className="text-4xl font-semibold tracking-tight text-slate-300">0 results</div>
            <div className="mt-2 text-sm text-slate-400">Try different keywords</div>
          </div>
        </div>
        {/* After */}
        <div className="bg-gradient-to-br from-violet-50/70 via-white to-orange-50/40 p-6 sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-violet-600">With Nobi</div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/60 px-3.5 py-2.5 text-sm text-slate-800">
            <SearchIcon className="h-4 w-4 shrink-0 text-violet-500" />
            <span className="truncate">{QUERY}</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {RESULTS.map((p) => (
              <div key={p.title} className="overflow-hidden rounded-xl border border-black/5 bg-white">
                <div className="aspect-[5/6] bg-slate-100">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-2">
                  <div className="truncate text-[11px] font-medium text-slate-700">{p.title}</div>
                  <div className="text-[11px] text-slate-400">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Capability sequence — Search → Support → Leads, pinned with a dots rail
const CAPABILITIES = [
  { key: "search", n: "01", title: "Search", body: "Shoppers describe what they want. Nobi finds it.", href: "/why-nobi/better-search", Viz: SearchViz },
  { key: "support", n: "02", title: "Support", body: "Every question answered instantly, from your own content.", href: "/why-nobi/automated-support", Viz: QAViz },
  { key: "leads", n: "03", title: "Leads", body: "High-intent visitors leave their contact info in the conversation.", href: "/lead-capture", Viz: LeadViz },
];

function CapabilityRail() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useEffect(
    () =>
      scrollYProgress.on("change", (p) => {
        setActive(Math.max(0, Math.min(CAPABILITIES.length - 1, Math.floor(p * CAPABILITIES.length))));
      }),
    [scrollYProgress]
  );
  const cap = CAPABILITIES[active];
  return (
    <section ref={ref} className="relative bg-[#f7f5ff]" style={{ height: `${CAPABILITIES.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden border-t border-violet-900/5">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-8%] top-[10%] h-[560px] w-[560px] rounded-full blur-3xl bg-[radial-gradient(closest-side,rgba(139,92,246,0.14),transparent)]" />
          <div className="absolute left-[-10%] bottom-[-10%] h-[480px] w-[480px] rounded-full blur-3xl bg-[radial-gradient(closest-side,rgba(240,157,99,0.12),transparent)]" />
        </div>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Everything Nobi does</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={cap.key}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mt-5 font-mono text-sm font-semibold text-violet-600">{cap.n}</div>
                <h2 className="mt-2 text-5xl sm:text-6xl font-semibold tracking-tight">{cap.title}</h2>
                <p className="mt-4 max-w-sm text-lg text-slate-500">{cap.body}</p>
                <a href={cap.href} className="mt-6 inline-block text-sm font-semibold text-violet-600 hover:text-violet-800">
                  Learn more →
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={cap.key}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-violet-900/10 bg-white p-6 shadow-[0_32px_80px_-40px_rgba(76,50,180,0.5)]"
            >
              <cap.Viz />
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Dots rail */}
        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2.5 md:flex lg:right-8">
          {CAPABILITIES.map((c, i) => (
            <span
              key={c.key}
              className={`w-1.5 rounded-full transition-all duration-300 ${i === active ? "h-7 bg-violet-600" : "h-1.5 bg-slate-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Case study — Lucchese: one quote, real numbers
function CaseStudy() {
  const NUMBERS = [
    { number: "$1M+", label: "extra revenue in year one" },
    { number: "39x", label: "return on investment" },
    { number: "2.5x", label: "more likely to buy" },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-[#3d2f96] py-20 sm:py-28">
      {/* Echo the hero's blob field, deeper */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-30%] h-[560px] w-[560px] rounded-full blur-3xl bg-[radial-gradient(closest-side,#6d5ce0,transparent)]" />
        <div className="absolute right-[-8%] bottom-[-35%] h-[540px] w-[540px] rounded-full blur-3xl bg-[radial-gradient(closest-side,#e8935e,transparent)] opacity-60" />
        <div className="absolute left-[35%] bottom-[-20%] h-[420px] w-[520px] rounded-full blur-3xl bg-[radial-gradient(closest-side,#8b7cf0,transparent)] opacity-70" />
      </div>
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center text-xs font-semibold uppercase tracking-wider text-white/50">
          Case study · Lucchese Bootmaker
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <Quote className="h-6 w-6 text-orange-300" />
            <p className="mt-4 text-2xl sm:text-3xl font-medium leading-snug tracking-tight text-white">
              “We've seen great incremental results, where conversion rates have been significantly higher through Nobi than on our binary search.”
            </p>
            <div className="mt-6 flex items-center gap-3">
              <img src="/media/lourdes.png" alt="" className="h-10 w-10 rounded-full bg-white/10 object-cover" />
              <div>
                <div className="text-sm font-semibold text-white">Lourdes Servin</div>
                <div className="text-sm text-white/60">Sr. Director, Digital and E-Commerce</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center divide-y divide-white/10">
            {NUMBERS.map((s) => (
              <div key={s.number} className="flex items-baseline gap-3 py-4">
                <CountUp value={s.number} className="w-24 shrink-0 text-4xl font-semibold tracking-tight text-white" />
                <div className="text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Minimal homepage footer (shared Footer stays untouched for blog/glossary).
// One compact CTA line + links + legal — same simplicity standard as the page.
function FooterMin({ onOpenDemo }) {
  const LINKS = [
    { label: "Search", href: "/why-nobi/better-search" },
    { label: "Support", href: "/why-nobi/automated-support" },
    { label: "Leads", href: "/lead-capture" },
    { label: "FAQs", href: "/faqs" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Docs", href: "https://docs.nobi.ai" },
  ];
  return (
    <footer className="border-t border-violet-900/5 bg-[#f7f5ff]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="text-xl font-semibold tracking-tight">Ready when you are.</div>
            <div className="mt-1 text-sm text-slate-500">Live on your site in about 15 minutes.</div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={getSignupUrl()}
              className="inline-flex h-10 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[.98]"
            >
              Start Free
            </a>
            <button
              onClick={onOpenDemo}
              className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold transition hover:bg-black/5 active:scale-[.98]"
            >
              Book A Demo
            </button>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-violet-900/10 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-violet-700">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-5 text-sm text-slate-400">
            <a href="/terms" className="hover:text-slate-600">Terms</a>
            <a href="/privacy" className="hover:text-slate-600">Privacy</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600">LinkedIn</a>
            <span>© {new Date().getFullYear()} Nobi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { onOpen: onOpenForm } = useDemoForm();

  // Redesign: one clear message for everyone — no search-first personalization.
  const [variant, setVariant] = useState("default");

  useSEO({
    title: "Nobi: Conversational Website Assistant for Search and Support",
    description: CANONICAL_DESCRIPTION,
    path: "/",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Nobi",
        "url": "https://nobi.ai",
        "logo": "https://nobi.ai/og-image.png",
        "sameAs": [LINKEDIN_URL],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Nobi",
        "url": "https://nobi.ai",
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Nobi",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": CANONICAL_DESCRIPTION,
        "url": "https://nobi.ai",
        "offers": { "@type": "Offer", "price": "25", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
      },
    ],
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main>
        {/* Radical simplicity: hero → proof → try it → problem → capabilities → case study */}
        <HeroV2 onOpenDemo={onOpenForm} />
        <ProofBar />
        <TryItLive />
        <ProblemSharp />
        <CapabilityRail />
        <CaseStudy />
      </main>
      <FooterMin onOpenDemo={onOpenForm} />
    </div>
  );
}
