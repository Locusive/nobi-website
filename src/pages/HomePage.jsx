import React, {useEffect, useMemo, useRef, useState} from "react";
import { useSEO } from "../hooks/useSEO";
import {AnimatePresence, motion} from "framer-motion";
import {
    BarChart3,
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
import {posts} from "../content/utils/mdxPostLoader";
import HeroDemo from "../components/HeroDemo";
import {VideoModal} from "../components/VideoModal";
import {useDemoForm} from "../context/DemoFormContext";
import DemoCTAButton from "../components/DemoCTAButton";
import {getSignupUrl} from "../utils/signupUrl";


// ===== feature flags (hide sections/links without deleting code) =====
// Build trigger for Cloudflare Pages preview.
const SHOW_LOGOS = true;
const SHOW_PRICING = true;

// …

// Demo sentence that should be typed into the search bar for both modes
const DEMO_QUERY =
  `Red dress for a beach wedding. I'm 5'5" and want something under $200.`;

const PLACEMENTS = [
  {
    id: "search",
    label: "My search and discovery is lacking",
    icon: SearchIcon,
    heading: "Improve search results fast",
    why: "Add the AI + native toggle search bar so shoppers get semantic answers without leaving your header.",
    outcome: "Search results that understand natural language and surface the right SKUs instantly.",
    snippet:
      '<script src="https://assistant-script.nobi.ai/nobi.bundle.js" onload="window.Nobi.initialize({ merchantId: \'460cbe82-9195-424f-a616-b1cb3e3caca0\' });"></script>\n<nobi-search-bar default-mode="ai" size="regular" cta-variant="auto" show-mode-toggle="true" show-hint-row="true"></nobi-search-bar>',
    liveMarkup: (
      <div className="placement-search-bar">
        <div className="placement-search-toggle">
          <span className="placement-search-toggle-pill placement-search-toggle-pill--active">AI</span>
          <span className="placement-search-toggle-pill">Site</span>
        </div>
        <div className="placement-search-input">Search for “red dresses under $200”</div>
        <div className="placement-search-hint">Hints + quick filters appear as soon as you type.</div>
      </div>
    ),
    customer: "Untuckit uses this to lift search conversion.",
  },
  {
    id: "engagement",
    label: "My engagement is low",
    icon: LayoutGrid,
    heading: "Keep collection shoppers exploring",
    why: "Place Nobi suggestion pills on PLPs/collections to nudge deeper browsing.",
    outcome: "Longer sessions and more viewed products per visit.",
    snippet:
      '<nobi-suggestion-pills pill-count="3"></nobi-suggestion-pills>',
    liveMarkup: (
      <div className="placement-suggestion-shell">
        <div className="placement-suggestion-pill">Beach wedding looks</div>
        <div className="placement-suggestion-pill">Under $200</div>
        <div className="placement-suggestion-pill">Red + size M</div>
      </div>
    ),
    customer: "Kilte uses AI prompts beside filters to keep shoppers clicking.",
  },
  {
    id: "pdp",
    label: "My visitors have lots of product doubts",
    icon: MessageCircleQuestion,
    heading: "Answer product Q&A on-page",
    why: "Drop the PDP assistant so fit, materials, and shipping questions get answered without support tickets.",
    outcome: "Confident add‑to‑carts and fewer pre‑purchase tickets.",
    snippet:
      '<nobi-pdp-assistant product-id="{{ product.id }}"></nobi-pdp-assistant>',
    liveMarkup: (
      <div className="placement-badge-shell">
        <div className="placement-badge-avatar">?</div>
        <div>
          <p className="text-base font-semibold text-slate-900">Ask Nobi</p>
          <p className="text-xs text-slate-500">“Is this true to size?” “How fast is shipping?”</p>
        </div>
      </div>
    ),
    customer: "Lucchese surfaces sizing answers on every boot PDP.",
  },
  {
    id: "recover",
    label: "Recover searchers who don't convert",
    icon: MousePointerClick,
    heading: "Recapture bouncers from search/PLP",
    why: "Trigger a modal or inline prompt when searchers stall, summarizing top picks and offers.",
    outcome: "Redirects high‑intent visitors before they leave.",
    snippet:
      '<nobi-exit-assistant threshold="inactivity"></nobi-exit-assistant>',
    liveMarkup: (
      <div className="placement-modal-shell">
        <p className="text-sm font-semibold text-slate-900">Don’t leave yet</p>
        <p className="text-xs text-slate-600">Here are 3 red dresses in your size + free shipping code.</p>
      </div>
    ),
    customer: "Toolup recovers stalled searchers with AI exit prompts.",
  },
  {
    id: "api",
    label: "Launch an AI assistant on demand",
    icon: Sparkles,
    heading: "Trigger the agent wherever you want",
    why: "Use the JS API to open Nobi from any button or menu item, returns, sizing help, concierge.",
    outcome: "Assistant appears exactly where visitors need help, without page reloads.",
    snippet:
      '<button onclick="Nobi.openChat()">Open site assistant</button>',
    liveMarkup: (
      <button className="placement-program-btn" type="button">Open Nobi assistant</button>
    ),
    customer: "Kilte launches Nobi from its help hub to handle returns.",
  },
];

// ===== Personalization variant content =====
const CHIPS = [
  { id: "search",  label: "Better search" },
  { id: "default", label: "More conversions" },
  { id: "answers", label: "Answer every question" },
  { id: "leads",   label: "More leads" },
];

const PREVIEW_SECTIONS = [
  { id: "results",  label: "Real results" },
  { id: "features", label: "What Nobi does" },
  { id: "how",      label: "How it works" },
  { id: "pricing",  label: "Pricing" },
];

const VARIANT_CONTENT = {
  default: {
    headline: "Turn your website into your best sales associate",
    subline:  "An AI assistant that answers questions, finds products, and captures leads. Works on ecommerce, services, real estate, and more.",
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
  answers: {
    headline: "Your visitors have questions your website isn't answering",
    subline:  "Nobi pulls answers from your content, cites its sources, and checks facts before responding. No guessing, no hallucinations.",
    problemHeading: "Visitors leave with the same question they arrived with",
    problemBody:    "They dig through your site, find nothing clear, and go to a competitor who gives them a straight answer.",
    problemPoints: [
      { Icon: MessageCircleQuestion, label: "Questions go unanswered", desc: "Visitors search your FAQ, find nothing useful, and leave with the same doubt they arrived with." },
      { Icon: LayoutGrid,            label: "Scattered information",   desc: "Your answers are spread across product pages, blog posts, and PDFs. Visitors can't piece it together themselves." },
      { Icon: MousePointerClick,     label: "One chance lost",         desc: "A visitor who leaves with an unanswered question rarely comes back. Your competitor answers it instead." },
    ],
    numbersHeading: "What happens when every question gets a real answer",
    stats: [
      { number: "6x",    label: "more purchases",       desc: "Visitors who click a suggested question and get an answer are 6x more likely to buy than those who don't engage." },
      { number: "2.5x",  label: "higher conversion",    desc: "Nobi-assisted visitors convert at 2.5x the rate of unassisted visitors, measured across Lucchese and UNTUCKit in A/B tests." },
      { number: "Zero",  label: "hallucinations",        desc: "Before sending, Nobi runs a second AI pass that verifies every claim against your knowledge base. It won't say what it can't prove." },
    ],
  },
  leads: {
    headline: "Stop letting interested visitors leave without a trace",
    subline:  "Nobi collects contact info naturally through conversation and routes it wherever you need it.",
    problemHeading: "Most visitors leave and you have no way to reach them",
    problemBody:    "They browse, get interested, and disappear. No contact info, no follow-up, no second chance.",
    problemPoints: [
      { Icon: MousePointerClick, label: "Silent exits",        desc: "High-intent visitors land, browse, and bounce. You have no idea they were there and no way to reach them." },
      { Icon: Heart,             label: "No follow-up window", desc: "Pop-up forms interrupt at the wrong moment. Most visitors dismiss them without a second thought." },
      { Icon: BarChart3,         label: "Invisible pipeline",  desc: "Without contact info, you can't attribute revenue to campaigns or optimize what's working." },
    ],
    numbersHeading: "What happens when your website actually captures leads",
    stats: [
      { number: "17.6%", label: "conversion rate",        desc: "UNTUCKit Nobi users vs. 15.0% on Shopify default. More engaged visitors convert to customers at a higher rate." },

      { number: "100%",   label: "of leads attributed",   desc: "Every lead tagged with the conversation and campaign that drove it, routed directly to your CRM or form handler." },
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

function HeroPlacementPills({ interactive = false, activeId, onSelect }) {
  const pills = PLACEMENTS;
  return (
    <div
      className={[
        "inline-flex flex-wrap justify-center gap-2 sm:gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 py-3 shadow-lg",
        interactive ? "" : "pointer-events-none",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {pills.map((pill) => {
        const Icon = pill.icon;
        const isActive = activeId === pill.id;
        return (
          <button
            type="button"
            key={pill.id}
            onClick={() => interactive && onSelect?.(pill.id)}
            className={[
              "group inline-flex items-center gap-2 rounded-full border bg-white/80 dark:bg-white/10 px-4 py-2 text-sm font-medium text-black dark:text-white transition",
              "border-black/10 dark:border-white/10 hover:border-fuchsia-200 hover:bg-fuchsia-50/60 dark:hover:bg-white/20",
              isActive ? "border-fuchsia-200 bg-fuchsia-50/70 dark:bg-white/20" : "",
              interactive ? "cursor-pointer" : "cursor-default",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300">
              <Icon className="h-3.5 w-3.5" />
            </span>
            {pill.label}
          </button>
        );
      })}
    </div>
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


const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

function renderHeadline(variant) {
  switch (variant) {
    case "search":
      return <>Visitors who can't find it{" "}<span className={GRADIENT}>won't buy it.</span></>;
    case "answers":
      return <>Your visitors have questions your website{" "}<span className={GRADIENT}>isn't answering</span></>;
    case "leads":
      return <>Stop letting interested visitors{" "}<span className={GRADIENT}>leave quietly</span></>;
    default:
      return <>Turn your website into your best{" "}<span className={GRADIENT}>sales associate</span></>;
  }
}

function Hero({ onOpenVideo, onOpenDemo, variant, setVariant }) {
  const content = VARIANT_CONTENT[variant] || VARIANT_CONTENT.default;

  const handleChip = (id) => {
    if (id === "default") {
      setVariant("default");
      try { localStorage.setItem("nobi_hero_variant", "default"); } catch (_) {}
      return;
    }
    const next = id === variant ? "default" : id;
    setVariant(next);
    try { localStorage.setItem("nobi_hero_variant", next); } catch (_) {}
  };

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-4 sm:pt-6 lg:pt-8 pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">

          {/* Personalization chips */}
          <div className="pb-6">
            <p className="text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-widest mb-3">
              What matters most to you?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => handleChip(chip.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    variant === chip.id
                      ? "border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-700"
                      : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-black/70 dark:text-white/70 hover:border-fuchsia-300 hover:bg-fuchsia-50 hover:text-fuchsia-700 dark:hover:border-fuchsia-700 dark:hover:bg-fuchsia-900/20"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.h1
              key={content.headline}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-5xl sm:text-6xl font-semibold tracking-tight text-balance"
            >
              {renderHeadline(variant)}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={content.subline}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg text-black/70 dark:text-white/70 max-w-2xl mx-auto"
            >
              {content.subline}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] bg-black text-white hover:opacity-90 shadow-sm h-12 px-6 text-base w-full sm:w-auto"
            >
              Get a demo
            </button>
            <a
              href={getSignupUrl()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 h-12 px-6 text-base w-full sm:w-auto hover:border-black/30 dark:hover:border-white/30"
            >
              Get started free
            </a>
          </div>

        </div>

        {/* Hero animation */}
        <div className="mt-10 max-w-3xl mx-auto">
          <HeroDemo variant={variant} />
        </div>

        {/* Logo strip */}
        <div className="mt-16 max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-fuchsia-600">
            Trusted by leading brands
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
            {CUSTOMER_LOGOS.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="h-8 w-28 object-contain select-none grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100"
                loading="lazy"
                decoding="async"
              />
            ))}
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
            <p className="text-sm font-semibold text-fuchsia-600 uppercase tracking-widest mb-3">
              Sound familiar?
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance max-w-3xl mx-auto">
              {content.problemHeading}
            </h2>
            <p className="mt-4 text-lg text-black/70 dark:text-white/70 max-w-2xl mx-auto">
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

// ===== Numbers section =====
function Numbers({ variant }) {
  const content = VARIANT_CONTENT[variant] || VARIANT_CONTENT.default;
  return (
    <section id="results" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={content.numbersHeading}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              {content.numbersHeading}
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {content.stats.map((stat) => (
                <div
                  key={stat.number + stat.label}
                  className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-8 shadow-sm"
                >
                  <div className="text-4xl font-semibold bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-base font-semibold text-black/80 dark:text-white/80">
                    {stat.label}
                  </div>
                  <p className="mt-3 text-sm text-black/60 dark:text-white/60">{stat.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-black/50 dark:text-white/50">
              Results measured in A/B tests with a one-day conversion window.
            </p>
          </motion.div>
        </AnimatePresence>
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
                    "border-black/10 dark:border-white/10 hover:border-fuchsia-200 hover:bg-fuchsia-50/60 dark:hover:bg-white/20",
                    isActive ? "border-fuchsia-200 bg-fuchsia-50/70 dark:bg-white/20" : "",
                  ].join(" ")}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300">
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
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black hover:border-fuchsia-200 hover:bg-fuchsia-50 transition"
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

function Features() {
  const capabilities = [
    {
      icon: <SearchIcon className="h-5 w-5" />,
      title: "Find anything on your site",
      stat: "+36% add-to-cart",
      desc: "Visitors search in plain language and Nobi finds the right match even when the exact words don't appear in your content. No more dead-end searches.",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Answer every question accurately",
      stat: "6x more purchases",
      desc: "Pulls from your knowledge base, cites its sources, and runs a fact-check before responding. Visitors get a straight answer they can trust.",
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Capture and qualify leads",
      stat: "Higher-intent leads",
      desc: "Collects contact info naturally through conversation. Every lead includes a summary of what the visitor was asking about, so follow-ups aren't cold.",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Know what's working",
      stat: "A/B tested",
      desc: "See what visitors are asking, where they get stuck, and which conversations led to conversions. A/B test configurations and measure results directly in Nobi's dashboard.",
    },
  ];

  return (
    <section id="features" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
          One assistant for everything your visitors need
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-8 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 shrink-0">
                    {cap.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{cap.title}</h3>
                </div>
                <span className="shrink-0 text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300 bg-fuchsia-50 dark:bg-fuchsia-900/30 border border-fuchsia-200 dark:border-fuchsia-800/50 rounded-full px-2.5 py-1">
                  {cap.stat}
                </span>
              </div>
              <p className="text-black/70 dark:text-white/70">{cap.desc}</p>
            </div>
          ))}
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
    <section id="testimonial" className="py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        {/* Do NOT stretch children; align them to the start */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Quote card — natural height, not stretched */}
          <div
            ref={leftRef}
            className="lg:col-span-2 self-start rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-8 shadow-sm"
          >
            <Quote className="h-6 w-6 text-fuchsia-600 mb-4" />
            <p className="text-2xl leading-snug font-medium text-black/90 dark:text-white">
              “If you want to learn and be inspired, you should look to implement a tool like Nobi. We've seen great incremental results, where conversion rates have been significantly higher through Nobi than on our binary search. But I think the biggest reason a brand should implement a tool like this is that you have the opportunity to apply more information towards optimizing broader campaigns and your broader e-comm goals.”
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
                $1m+ in revenue
              </div>
              <div className="text-lg sm:text-xl font-medium text-white/90">
                from Nobi in 2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { h: "Connect your site", p: "Paste one script tag or install the Shopify app. Nobi reads your catalog, pages, and PDFs automatically." },
    { h: "Customize and launch", p: "Pick where Nobi appears, configure your brand voice, and go live. Knowledge base refreshes twice a day with no maintenance needed." },
    { h: "Measure the results", p: "Track conversions, revenue, and what visitors are asking in a simple dashboard. A/B test configurations and see the lift directly." },
  ];
  return (
    <section id="how" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold mb-8">Low code setup in 15 minutes</h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 list-decimal list-inside">
          {steps.map((s) => (
            <li key={s.h} className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6">
              <div className="font-medium">{s.h}</div>
              <p className="mt-2 text-sm text-black/70 dark:text-white/70">{s.p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing() {
  const { onOpen } = useDemoForm();
  const tiers = [
    { name: "Standard", price: "$25", blurb: "Everything you need to get started", points: ["2,500 searches and 250 messages included", "Up to 5,000 products and KB documents", "30-day free trial"], cta: "Start Free Trial", href: getSignupUrl(), highlighted: true },
    { name: "Enterprise", price: "Custom", blurb: "For high-volume brands with large catalogs", points: ["Volume discounts on usage", "Custom integrations and onboarding", "Dedicated support"], cta: "Contact Sales", onClick: onOpen },
  ];
  return (
    <section id="pricing" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold mb-2">Simple, usage-based pricing</h2>
        <p className="text-black/60 dark:text-white/60 mb-8">A low monthly base with per-use rates. Start with a free 30-day trial.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {tiers.map((t) => (
            <div key={t.name} className={`flex flex-col rounded-3xl border bg-white/70 dark:bg-white/5 p-8 ${t.highlighted ? "border-purple-300 ring-2 ring-purple-200" : "border-black/10 dark:border-white/10"}`}>
              <div className="text-sm font-semibold tracking-wide text-indigo-600">{t.name}</div>
              <div className="mt-2 text-3xl font-semibold">
                {t.price}{t.price !== "Custom" && <span className="text-base font-normal opacity-70"> monthly base</span>}
              </div>
              <div className="text-sm opacity-80 mt-1">{t.blurb}</div>
              <div className="mt-4 flex-1 text-sm space-y-2">
                {t.points.map((p) => (<div key={p} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {p}</div>))}
              </div>
              {t.href ? (
                <a
                  href={t.href}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] bg-black text-white dark:bg-white dark:text-black hover:opacity-90 shadow-sm h-10 px-5 text-base w-full"
                >
                  {t.cta}
                </a>
              ) : (
                <Button className="mt-6 w-full" variant="outline" onClick={t.onClick}>{t.cta}</Button>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-black/50 dark:text-white/50">
          <a href="/pricing" className="underline hover:text-purple-600">See full pricing</a> &middot; Overages: $0.10/message, $0.01/search
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
        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
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
        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
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
  const intents = [
    { label: "Buying a Gift", value: 124 },
    { label: "Shopping for an upcoming trip", value: 96 },
    { label: "Requesting sizing/fit", value: 88 },
    { label: "Shopping by product type", value: 54 },
  ];

  const objections = [
    { label: "Unsure about sizing/fit", value: 63 },
    { label: "Shipping cost/timing", value: 49 },
    { label: "Material care/durability", value: 31 },
    { label: "Out of stock / color", value: 24 },
  ];

  const products = ["Button downs", "Polos", "Dresses"];
  const attrs = ["Linen", "Gauze", "Terry"];
  const affinity = {
    "Button downs": { Linen: 0.78, "Gauze": 0.32, "Terry": 0.55 },
    Polos: { Linen: 0.22, "Gauze": 0.81, "Terry": 0.08 },
    "Dresses": { Linen: 0.93, "Gauze": 0.05, "Terry": 0.06 },
  };

  const max = (arr) => Math.max(...arr.map((d) => d.value));

  return (
    <section id="insights" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-fuchsia-600">Insights</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">
              Hear your customers in their own words.
            </h2>
            <p className="mt-3 text-black/70 dark:text-white/70">
              Nobi turns real conversations into structured signals. Your merchandising, creative, and CX teams have never moved faster.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left column */}
          <div className="space-y-6">
            {/* Intents */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 shadow-sm">
              <div className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-fuchsia-600" />
                Top customer intents
              </div>
              <div className="mt-4 space-y-3">
                {intents.map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-black/80 dark:text-white/90">{d.label}</span>
                      <span className="tabular-nums text-black/60 dark:text-white/60">{d.value}</span>
                    </div>
                    <InsightsBar value={d.value} maxValue={max(intents)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Attribute affinity by product (heatmap) */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 shadow-sm">
              <div className="font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-fuchsia-600" aria-hidden="true" />
                Attribute affinity by product
              </div>
              <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                Likelihood a shopper will request an attribute when browsing a product type.
              </p>

              <div className="mt-4 overflow-x-auto [-webkit-overflow-scrolling:touch]">
                <div className="w-full">
                  <div
                    className="grid gap-2 sm:gap-3"
                    style={{
                      gridTemplateColumns: `clamp(112px, 20vw, 140px) repeat(${attrs.length}, minmax(clamp(58px, 8vw, 84px), 1fr))`,
                    }}
                  >
                    <div />
                    {attrs.map((a) => (
                      <div key={a} className="px-2 py-1 text-xs sm:text-sm text-center text-black/70 dark:text-white/70">
                        {a}
                      </div>
                    ))}
                    {products.map((p) => (
                      <React.Fragment key={p}>
                        <div className="px-2 py-2 text-sm font-medium text-black/80 dark:text-white/90 flex items-center">
                          {p}
                        </div>
                        {attrs.map((a) => (
                          <HeatCell key={`${p}-${a}`} v={affinity[p][a] || 0} />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Objections */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 shadow-sm">
              <div className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-fuchsia-600" />
                Common objections & barriers
              </div>
              <div className="mt-4 space-y-3">
                {objections.map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-black/80 dark:text-white/90">{d.label}</span>
                      <span className="tabular-nums text-black/60 dark:text-white/60">{d.value}</span>
                    </div>
                    <InsightsBar value={d.value} maxValue={max(objections)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Voice of customer */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 shadow-sm">
              <div className="font-semibold flex items-center gap-2">
                <Quote className="h-4 w-4 text-fuchsia-600" />
                Example Prompts
              </div>
              <div className="mt-3 space-y-3 text-sm text-black/80 dark:text-white/90">
                <blockquote className="rounded-xl p-3 bg-black/5 dark:bg-white/10">
                  “Shirts and pants for a boy going off to college (probably a large).”
                </blockquote>
                <blockquote className="rounded-xl p-3 bg-black/5 dark:bg-white/10">
                  “Outfits for a trip to Puerto Vallarta for a girlfriend's 30th.”
                </blockquote>
                <blockquote className="rounded-xl p-3 bg-black/5 dark:bg-white/10">
                  “Will the Legend shirt shrink in the wash?”
                </blockquote>
                <blockquote className="rounded-xl p-3 bg-black/5 dark:bg-white/10">
                  “Men's sale items in sizes small and medium and pants size 32.”
                </blockquote>
              </div>
            </div>
          </div>
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
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("company", form.company);
      formData.append("website", form.website);
      formData.append("platform", form.platform);
      formData.append("message", form.message);
      formData.append("botcheck", form.botcheck);

      // Optional: Add your email to receive notifications
      // formData.append("from_name", "Nobi Website");
      // formData.append("subject", "New Demo Request from " + (form.company || form.name));

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
                href="https://calendly.com/nobi"
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
            <p className="text-sm font-semibold text-fuchsia-600">Thoughts</p>
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
                <h3 className="mt-2 text-xl font-semibold group-hover:text-purple-600 transition-colors">{post.meta.title}</h3>
                <p className="mt-2 text-sm text-black/70 dark:text-white/70 line-clamp-3">{post.meta.excerpt}</p>
                <div className="mt-3 text-xs text-black/50 dark:text-white/60">
                  {new Date(post.meta.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a href="/blog" className="text-sm font-semibold text-black hover:text-purple-600">
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
    <section className="py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Works with what you already have
        </h2>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-black/80 dark:text-white/80">
              <CheckCircle2 className="h-5 w-5 text-fuchsia-600 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { onOpen: onOpenForm } = useDemoForm();

  const [variant, setVariant] = useState(() => {
    try { return localStorage.getItem("nobi_hero_variant") || "search"; } catch (_) { return "search"; }
  });

  useSEO({
    title: "Nobi: Your Website's AI Sales Associate",
    description: "Lucchese generated $1M+ in year one. Add Nobi to your website in minutes and start converting more visitors.",
    path: "/",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Nobi",
        "url": "https://nobi.ai",
        "logo": "https://nobi.ai/og-image.png",
        "sameAs": ["https://www.linkedin.com/company/heynobi"],
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
        "description": "AI-powered website assistant. Understands natural language queries and helps visitors find what they need, answer questions, and take action.",
        "url": "https://nobi.ai",
        "offers": { "@type": "Offer", "price": "25", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
      },
    ],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-black text-black dark:text-white">
      <Header />
      <main>
        <Hero onOpenVideo={() => setIsVideoOpen(true)} onOpenDemo={onOpenForm} variant={variant} setVariant={setVariant} />
        <Problem variant={variant} />
        <Numbers variant={variant} />
        <Features />
        <Testimonial />
        <HowItWorks />
        <WorksWith />
        <Insights onOpenForm={onOpenForm} />
        <LatestPosts />
        {SHOW_PRICING && <Pricing />}
        <FAQList
          limit={4}
          showBorderTop
          padding="py-20"
          columns={2}
          headingAlign="center"
        />
        <div className="mx-auto max-w-6xl px-6 -mt-6 mb-14 flex justify-center">
          <a
            href="/faqs"
            className="text-sm font-semibold text-black hover:text-purple-600 transition-colors underline"
          >
            See all FAQs
          </a>
        </div>
      </main>
      <Footer />
      <VideoModal
        open={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        youtube="https://www.youtube.com/watch?v=RKqGC3CVZd0"
      />
      <ScrollPreview sections={PREVIEW_SECTIONS} label="Next up" side="right" />
    </div>
  );
}
