import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";


// ===== feature flags (hide sections/links without deleting code) =====
const SHOW_LOGOS = false;
const SHOW_PRICING = false;

// …

// Demo sentence that should be typed into the search bar for both modes
const DEMO_QUERY =
   `Red dress for a beach wedding. I'm 5'5" and want something under $200.`;


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



// --- one script builder used by the preview ---
function makeScript(mode, q = "red dress for a wedding") {
  if (mode === "ai") {
    return {
      userText: `Red dress for a beach wedding. I'm 5'5" and want something under $200.`,
      aiText:
        "Got it! Here are some red dresses that are warm-weather appropriate and comfortable on sand / in a slight breeze (rather than a formal ballroom). These are all available in your size (M) and under $200.",
     products: [
     { title: "St. Bernard x Stark Maxi",        price: "$98", img: "/media/prod-1.png" },
      { title: "Lulus Bow Backless Maxi",        price: "$55", img: "/media/prod-2.png" },
        { title: "Maygel Coronel Cover-Up",        price: "$178", img: "/media/prod-3.png" },
      { title: "Hunter Puff-Sleeve Mini",        price: "$124", img: "/media/prod-4.png" },
     { title: "Banjanan Cotton Maxi",   price: "$172", img: "/media/prod-5.png" },
     { title: "Majestic Coconut Maxi",        price: "$189", img: "/media/prod-6.png" },
   ],
    };
  }
  return {
    userText: "",
    aiText: "",
    products: [
   { title: "Efrain Mogollon Chau Rosa",   price: "$499", img: "/media/prod-default-1.png" },
   { title: "Loeffler Red Dress Sandal",        price: "$138", img: "/media/prod-default-2.png" },
   { title: "Anna Quan Penelope Dress",  price: "$148", img: "/media/prod-default-3.png" },
   { title: "Nadia Red Dress Heel",  price: "$119", img: "/media/prod-default-4.png" },
   { title: "Mayoral Girl's Red Dress",     price: "$89", img: "/media/prod-default-5.png" },
   { title: "MVG Brie Dress",      price: "$228", img: "/media/prod-default-6.png" },
    ],
  };
}


function BrandsRow() {
  const brands = [
    { alt: "Lucchese", src: lucchese },
    { alt: "UNTUCKit", src: untuckit },
    { alt: "Faherty", src: faherty },
    { alt: "TOOLUP", src: toolup },
    { alt: "St. Bernard", src: stbernard },
  ];

  return (
    <section id="logos" className="py-12 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-sm font-semibold text-fuchsia-600 mb-6">
          Trusted by modern commerce
        </p>

        {/* Even spacing, consistent height, grayscale */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-10 gap-y-8 items-center justify-items-center">
          {brands.map((b) => (
            <img
              key={b.alt}
              src={b.src}
              alt={b.alt}
              height={28}
              className="block h-7 w-auto object-contain select-none grayscale opacity-60 hover:opacity-100"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                // helpful fallback so a missing asset doesn't disappear silently
                e.currentTarget.replaceWith(
                  Object.assign(document.createElement("span"), {
                    textContent: b.alt,
                    className:
                      "text-sm text-black/40 dark:text-white/40 tracking-wide",
                  })
                );
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


import {
  Sparkles,
  Search as SearchIcon,
  ArrowRight,
  Heart,
  CheckCircle2,
  ShoppingCart,
  Filter,
  MousePointerClick,
  BarChart3,
  Quote,
  PlayCircle,
  ChevronDown,
  GraduationCap,
  AlertTriangle,
  ClipboardList,
  MapPin,
} from "lucide-react";


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
function AspectBox({ ratio = 16 / 9, className = "", children }) {
  return (
    <div className={`relative w-full ${className}`} style={{ paddingTop: `${100 / ratio}%` }}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

function isVideoSource(src = "") {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
}

function MediaBox({ src, alt = "", restartKey }) {
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
        className="w-full h-full object-cover object-top"
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
    primary: "bg-black text-white dark:bg-white dark:text-black hover:opacity-90 shadow-sm",
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
          src="/media/nobi-logo.png"                     // your PNG route
          srcSet="/media/nobi-logo.png 1x, /media/nobi-logo@2x.png 2x"
          alt="Nobi"
          className="h-full w-auto"                      // ← scale to wrapper height
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


function HeroSkeletonLine({ w = "60%" }) {
  return (
    <div
      className="h-3 rounded bg-black/5 dark:bg-white/10"
      style={{ width: w }}
    />
  );
}

/** Small “…” typing indicator */
function HeroTypingDots() {
  return (
    <div className="inline-flex gap-[3px] items-center">
      <span className="w-1.5 h-1.5 rounded-full bg-black/50 dark:bg-white/60 animate-bounce [animation-delay:-120ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-black/50 dark:bg-white/60 animate-bounce [animation-delay:-60ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-black/50 dark:bg-white/60 animate-bounce" />
    </div>
  );
}

function VideoModal({ open, onClose, youtube, src, poster = "" }) {
  // Accept either a full YouTube URL or just the ID
  function getYouTubeId(input = "") {
    if (!input) return "";
    // If it's already an ID, return it
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    // Try to parse common YouTube URL formats
    const m =
      input.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/) ||
      input.match(/^([a-zA-Z0-9_-]{11})$/);
    return m ? m[1] : "";
  }

  const ytId = getYouTubeId(youtube);
  const ytSrc = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : "";

  // Close on ESC and lock background scroll
  const dialogRef = React.useRef(null);
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="howitworks-title"
    >
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close video"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-3xl rounded-2xl bg-black overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()} // don't close when clicking inside
      >
        <div className="relative w-full aspect-video">
          {ytSrc ? (
            <iframe
              title="How it works video"
              src={ytSrc}
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={src}
              poster={poster}
              autoPlay
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-contain bg-black"
            />
          )}
        </div>

        {/* Header / title row */}


        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <h2 id="howitworks-title" className="sr-only">
            How it works video
          </h2>
          <span className="pointer-events-none" />
          <button
            onClick={onClose}
            className="pointer-events-auto inline-flex items-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-[.98] p-2"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// --- HERO PREVIEW HELPERS (names are unique to avoid clashes) ---


function Hero({ onOpenForm, onOpenVideo }) {
  const [searchMode, setSearchMode] = React.useState("ai");
  const [playKey, setPlayKey] = React.useState(-1);
  const [lastQuery, setLastQuery] = React.useState(DEMO_QUERY);
  const hasKickedRef = React.useRef(false);

  const kickOffPreview = ({ mode, query }) => {
    if (hasKickedRef.current) return;
    hasKickedRef.current = true;
    setSearchMode(mode);
    setLastQuery(query || DEMO_QUERY);
    setPlayKey((k) => k + 1);
  };

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:pt-24 pb-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-balance">
            Turn prospective students into{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              excited applicants
            </span>
          </h1>

          <p className="mt-4 text-lg text-black/70 dark:text-white/70">
            Nobi helps universities attract the <strong>right applicants</strong> with conversational AI.
          </p>

          {/* Same-row CTAs (works on mobile too) */}
         <div className="grid grid-cols-[1fr_auto] items-center gap-3 max-w-xl mx-auto justify-center">
  <Button
  size="lg"
  onClick={onOpenForm}
  className="inline-block w-fit whitespace-nowrap px-6 py-3 mx-auto"
>
  <span>Try on your .edu site</span>
  <ArrowRight className="h-5 w-5 -mr-1" aria-hidden="true" />
</Button>
</div>

        </div>        
      </div>
    </section>
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
  const items = [
    {
      title: "'AI Mode' your site",
      desc:
        "Deliver the same powerful search & discovery experience as ChatGPT and other AI platforms—right within your site.",
      icon: <Sparkles className="h-4 w-4" />,
      media: { src: "/media/feature-ai-mode.mp4", alt: "" },
    },
    {
      title: "Funnel quality applicants to the right place",
      desc:
        "Re-route applicants directly to Admissions Counselors, financial aid forms, or anywhere else based on the criteria you set.",
      icon: <Filter className="h-4 w-4" />,
      media: { src: "/media/feature-collections.mp4", alt: "Collections assistant demo" },
    },
    {
      title: "Simplify mountains of information",
      desc:
        "Empower applicants with the information and resources they need so that they don't bounce from your site.",
      icon: <MousePointerClick className="h-4 w-4" />,
      media: { src: "/media/feature-capture.mp4", alt: "Capture bouncers demo" },
    },
  ];

  const [active, setActive] = useState(0);
  const [restartKey, setRestartKey] = useState(0);

  // Cache-bust so we always refresh the video source
  const rawSrc = items[active]?.media?.src || "";
  const bustSrc = rawSrc && `${rawSrc}${rawSrc.includes("?") ? "&" : "?"}r=${restartKey}`;

  return (
    <section id="features" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold text-fuchsia-600">Features</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2 text-balance">
          Empower applicants with the information they need in seconds.
        </h2>
        <p className="mt-3 text-black/70 dark:text-white/70">
          Nobi answers questions on academic programs, admissions, life on campus, and anything else you may have on your site.
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Preview first on mobile */}
          <div
            className="order-1 lg:order-2 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 shadow-inner overflow-hidden aspect-[4/3] sm:aspect-video lg:aspect-auto lg:h-full"
            role="tabpanel"
            id="feature-preview"
            aria-labelledby={`feature-tab-${active}`}
          >
            <MediaBox
              key={restartKey}
              restartKey={restartKey}
              src={bustSrc}
              alt={items[active]?.media?.alt || ""}
            />
          </div>

          {/* Bullets second on mobile */}
          <div className="order-2 lg:order-1 space-y-4" role="tablist" aria-controls="feature-preview">
            {items.map((f, i) => (
              <button
                key={f.title}
                id={`feature-tab-${i}`}
                role="tab"
                aria-selected={i === active}
                onClick={() => { setActive(i); setRestartKey(k => k + 1); }}
                className={`w-full text-left rounded-2xl border p-5 transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/20 ${
                  i === active
                    ? "border-fuchsia-200 bg-fuchsia-50/70 dark:bg-white/5"
                    : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-fuchsia-600">{f.icon}</span>
                  <div>
                    <div className="font-semibold">{f.title}</div>
                    <p className="mt-1 text-sm text-black/70 dark:text-white/70">{f.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Results() {
  const rows = [
    { metric: "Product Viewed",       defaultVal: "60.9%", nobiVal: "64.1%", impact: "+6.0%" },
    { metric: "Add to Cart",          defaultVal: "8.5%",  nobiVal: "11.5%", impact: "+35.3%" },
    { metric: "Checkout Completed",   defaultVal: "2.4%",  nobiVal: "3.1%",  impact: "+29.2%" },
    { metric: "Average Order Value",  defaultVal: "$231",  nobiVal: "$360",  impact: "+55.8%" },
  ];

  return (
    <section id="results" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold text-fuchsia-600">Results</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">
          Convert more traffic and drive more revenue.
        </h2>
        <p className="mt-3 text-black/70 dark:text-white/70">
          Nobi has outperformed the default web conversion experience in every A/B test we've ever run.
        </p>

       <div className="mt-8">
  <table className="w-full text-left border-collapse table-fixed">
    {/* Force sane column widths on mobile so nothing gets clipped */}
    <colgroup>
      <col style={{ width: "40%" }} />  {/* Metric */}
      <col style={{ width: "20%" }} />  {/* Default */}
      <col style={{ width: "20%" }} />  {/* Nobi */}
      <col style={{ width: "20%" }} />  {/* Impact */}
    </colgroup>

    <thead>
      <tr className="text-xs sm:text-sm font-semibold text-black/70 dark:text-white/70">
        <th className="py-2 px-2 sm:px-4"></th>
        <th className="py-2 px-2 sm:px-4 text-center">Default</th>
        <th className="py-2 px-2 sm:px-4 text-center">Nobi</th>
        <th className="py-2 px-2 sm:px-4 text-center bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Impact
        </th>
      </tr>
    </thead>

    <tbody>
      {rows.map((r, i) => (
        <tr
          key={r.metric}
          className={i !== rows.length - 1 ? "border-b border-dashed border-black/20 dark:border-white/15" : ""}
        >
          <td className="py-3 px-2 sm:px-4 font-medium text-black/80 dark:text-white/90 leading-snug">
            {r.metric}
          </td>

          <td className="py-3 px-2 sm:px-4 text-center text-xl sm:text-2xl font-semibold tabular-nums">
            {r.defaultVal}
          </td>
          <td className="py-3 px-2 sm:px-4 text-center text-xl sm:text-2xl font-semibold tabular-nums">
            {r.nobiVal}
          </td>
          <td className="py-3 px-2 sm:px-4 text-center text-xl sm:text-2xl font-bold tabular-nums whitespace-nowrap bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            {r.impact}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        <p className="mt-3 text-xs text-black/50 dark:text-white/50">
          Impact = relative lift vs. Default. Above are the total results we've seen across all of our clients comparing Nobi to the default.
        </p>
      </div>
    </section>
  );
}

function Testimonial() {
  const leftRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(0);

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
              “If you want to learn and be inspired, you should implement a tool like Nobi. We've seen great incremental results... but the biggest reason a brand should implement this is that you have the opportunity to apply more information towards optimizing
              campaigns and your broader brand and e-comm goals.”
            </p>
            <div className="mt-6 flex items-center gap-4">
              <img
                src="/media/avatar-placeholder.png"
                alt="Customer avatar"
                className="h-10 w-10 rounded-full object-cover bg-black/10 dark:bg-white/10"
              />
              <div>
                <div className="font-semibold">Lourdes Servin</div>
                <div className="text-sm text-black/60 dark:text-white/60">
                  Senior Dr. Digital & E-Commerce, Lucchese Bootmaker
                </div>
              </div>
            </div>
          </div>

          {/* Photo card — height follows the quote, no inner padding, image covers */}
          <div
            className="self-start rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden bg-white/70 dark:bg-white/5"
            style={{
              // Match the quote's height on desktop; give a safe minimum before we measure
              height: leftHeight || 320,
            }}
          >
            <img
              src="/media/lucchese-testimonial-image.png" // <-- put your photo here
              alt="Customer lifestyle"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { h: "Install the code", p: "Paste two snippets of code in your site. Nobi reads your data and adopts your branding." },
    { h: "Train and launch", p: "Train Nobi on how to answer FAQs and customize how you want the tool to look." },
    { h: "Measure the lift", p: "Track conversion and qualitative insights in a simple dashboard." },
  ];
  return (
    <section id="how" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold mb-8">Low code setup in minutes</h2>
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
  const tiers = [
    { name: "Starter", price: "$0", blurb: "Kick the tires", points: ["Up to 500 queries", "Dual Mode search bar", "Email support"], cta: "Get started" },
    { name: "Growth", price: "$499", blurb: "Best for DTC brands", points: ["5k queries/mo", "Collections assistant", "Analytics Dashboard"], cta: "Start trial" },
    { name: "Enterprise", price: "Custom", blurb: "Scale & SSO", points: ["Unlimited queries", "Priority SLAs", "Custom models"], cta: "Talk to sales" },
  ];
  return (
    <section id="pricing" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold mb-8">Simple plans that scale with you</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((t) => (
            <div key={t.name} className="flex flex-col rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6">
              <div className="text-sm font-semibold tracking-wide text-indigo-600">{t.name}</div>
              <div className="mt-2 text-3xl font-semibold">
                {t.price}<span className="text-base font-normal opacity-70">/mo</span>
              </div>
              <div className="text-sm opacity-80 mt-1">{t.blurb}</div>
              <div className="mt-4 flex-1 text-sm space-y-2">
                {t.points.map((p) => (<div key={p} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {p}</div>))}
              </div>
              <Button className="mt-6 w-full">{t.cta}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const qas = [
    { q: "How long does install take?", a: "Typically less than an hour for a working prototype and then it depends on how much you want to customize. Our team can do the install for you if you prefer." },
    { q: "Can we A/B test it?", a: "Yes. Nobi easily hooks into your A/B testing solution or we can build something custom for you." },
   { q: "What can I do with Nobi?", a: "Nobi is really good at understanding natural language and showing relevant results quickly. So we recommend defining what common questions you get from applicants and how you'd ideally like Nobi to respond." },
   { q: "Does Nobi replace my current search?", a: "Up to you. Nobi can become your default search bar experience or a separate, AI-only bar at the bottom of the page." },
  ];

  return (
    <section id="faq" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold mb-8">You're not the first to ask</h2>

        <div className="space-y-4">
          {qas.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-sm"
            >
              {/* summary row */}
              <summary
                className="list-none cursor-pointer flex items-center justify-between gap-4 px-5 py-4 font-medium"
              >
                <span>{f.q}</span>
                <ChevronDown
                  className="h-5 w-5 text-black/40 dark:text-white/60 transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>

              {/* answer */}
              <div className="px-5 pb-5 -mt-1">
                <p className="text-sm text-black/70 dark:text-white/70">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-12">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Logo />
        <div className="text-sm text-black/60 dark:text-white/60">
          © {new Date().getFullYear()} Nobi — Conversational search
        </div>
       <div className="flex items-center gap-4 text-sm">
  <a href="#features" className="hover:opacity-80">Features</a>
  <a href="#how" className="hover:opacity-80">How it Works</a>
  {SHOW_PRICING && <a href="#pricing" className="hover:opacity-80">Pricing</a>}
  <a href="#faq" className="hover:opacity-80">FAQ</a>
  <a href="/terms" className="hover:opacity-80">Terms</a>
  <a href="/privacy" className="hover:opacity-80">Privacy</a>
</div>
      </div>
    </footer>
  );
}

// Simple horizontal bar
function Bar({ value, max, maxValue }) {
  const m = typeof max !== "undefined" ? max : maxValue || 100;
  const pct = Math.max(0, Math.min(100, Math.round((value / m) * 100)));
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

/* ========= Insights (University edition) ========= */
function Insights({ onOpenForm }) {
  const INSIGHTS = {
    intents: [
      { label: "Find a Major/Program", value: 182 },
      { label: "Tuition & Financial Aid", value: 149 },
      { label: "Application Help & Deadlines", value: 121 },
      { label: "Campus Life & Housing", value: 97 },
      { label: "Transfer Credit & Prereqs", value: 64 },
    ],
    barriers: [
      { label: "Tuition/aid clarity", value: 88 },
      { label: "Deadline confusion", value: 72 },
      { label: "Prereqs / test policy", value: 51 },
      { label: "Housing availability", value: 37 },
      { label: "Online vs on-campus options", value: 29 },
    ],
    funnel: [
      { stage: "Explored programs", value: 100 },
      { stage: "Viewed requirements", value: 76 },
      { stage: "Tuition/aid details", value: 58 },
      { stage: "Started application", value: 33 },
      { stage: "Requested info/visit", value: 25 },
    ],
    prompts: [
      "Is the BSN direct-entry or do I apply after prerequisites?",
      "What’s the application deadline for Fall transfer students?",
      "Average class size for Computer Science?",
      "Total cost after typical merit aid for a 3.6 GPA?",
    ],
    geo: [
      { region: "Mid-Atlantic", value: 29 },
      { region: "Southeast", value: 24 },
      { region: "Midwest", value: 18 },
      { region: "West", value: 15 },
      { region: "Northeast", value: 14 },
    ],
    segments: [
      { label: "First-gen", value: 22 },
      { label: "Transfer", value: 19 },
      { label: "International", value: 16 },
      { label: "Adult/returning", value: 13 },
    ],
  };

  const maxI = Math.max(...INSIGHTS.intents.map((x) => x.value));
  const maxB = Math.max(...INSIGHTS.barriers.map((x) => x.value));

  return (
    <section id="insights" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-fuchsia-600">Insights</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">
              What students ask for — in their own words.
            </h2>
            <p className="mt-3 text-black/70 dark:text-white/70">
              Nobi turns live conversations into structured signals your Admissions and MarCom teams can act on immediately.
            </p>
          </div>
        </div>

        {/* Top row */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Intents */}
          <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 shadow-sm">
            <div className="font-semibold flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-fuchsia-600" />
              Top student intents
            </div>
            <div className="mt-4 space-y-3">
              {INSIGHTS.intents.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/80 dark:text-white/90">{d.label}</span>
                    <span className="tabular-nums text-black/60 dark:text-white/60">{d.value}</span>
                  </div>
                  <Bar value={d.value} max={maxI} />
                </div>
              ))}
            </div>
          </section>

          {/* Barriers */}
          <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 shadow-sm">
            <div className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-fuchsia-600" />
              Common objections & barriers
            </div>
            <div className="mt-4 space-y-3">
              {INSIGHTS.barriers.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/80 dark:text-white/90">{d.label}</span>
                    <span className="tabular-nums text-black/60 dark:text-white/60">{d.value}</span>
                  </div>
                  <Bar value={d.value} max={maxB} />
                </div>
              ))}
            </div>
          </section>

          {/* Example prompts */}
          <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 shadow-sm">
            <div className="font-semibold flex items-center gap-2">
              <Quote className="h-4 w-4 text-fuchsia-600" />
              Example prompts
            </div>
            <div className="mt-3 space-y-3 text-sm text-black/80 dark:text-white/90">
              {INSIGHTS.prompts.map((p, i) => (
                <blockquote key={i} className="rounded-xl p-3 bg-black/5 dark:bg-white/10">“{p}”</blockquote>
              ))}
            </div>
          </section>
        </div>

        {/* Funnel + Geo/Segments */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Funnel */}
          <section className="lg:col-span-2 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 shadow-sm">
            <div className="font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-fuchsia-600" />
              Assistant → Apply funnel
            </div>
            <ol className="mt-4 space-y-3">
              {INSIGHTS.funnel.map((f, i) => (
                <li key={f.stage} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs grid place-items-center">{i + 1}</div>
                  <div className="w-full">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{f.stage}</span>
                      <span className="text-black/60 dark:text-white/60">{f.value}%</span>
                    </div>
                    <Bar value={f.value} max={100} />
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-black/60 dark:text-white/60">
              * Largest drop-offs: Tuition/Aid details → Start application
            </p>
          </section>

          {/* Geo + Segments */}
          <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 shadow-sm">
            <div className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-fuchsia-600" />
              Where prospects are from
            </div>
            <ul className="mt-4 space-y-3">
              {INSIGHTS.geo.map((g) => (
                <li key={g.region} className="flex items-center justify-between text-sm">
                  <span>{g.region}</span>
                  <div className="flex items-center gap-2 w-1/2">
                    <Bar value={g.value} max={40} />
                    <span className="text-black/60 dark:text-white/60 w-10 text-right">{g.value}%</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 font-semibold">Segments</div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {INSIGHTS.segments.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 border border-black/10 dark:border-white/10 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-zinc-900 dark:to-zinc-900/60"
                >
                  <div className="text-sm text-black/60 dark:text-white/70">{s.label}</div>
                  <div className="text-2xl font-semibold mt-1">{s.value}%</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

      <footer className="mt-10 text-xs text-zinc-500 flex items-center gap-2">
        <CalendarClock className="w-4 h-4"/> Rolling 30‑day window • Synthetic demo data • Replace via API
      </footer>
    </div>
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
            <div className="mt-4">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-black text-black dark:text-white">
      <header className="sticky top-0 z-40 border-b backdrop-blur bg-white/70 dark:bg-black/40">
<div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-4 relative">
  <a href="#home" className="flex items-center gap-3 shrink-0">
    <Logo className="h-8 md:h-9 lg:h-10" />
  </a>

  {/* Mobile nav inline with logo */}
  <nav className="flex md:hidden items-center gap-4 text-sm overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch] flex-1">
    <a href="#features" className="py-2">Features</a>
    <a href="#how" className="py-2">How it works</a>
  {SHOW_PRICING && <a href="#pricing" className="py-2">Pricing</a>}
    <a href="#faq" className="py-2">FAQ</a>
  </nav>

  {/* Desktop nav + CTA (pushed right) */}
<nav className="hidden md:flex items-center gap-6 text-sm font-semibold absolute left-1/2 -translate-x-1/2">
    <a href="#features" className="hover:opacity-80">Features</a>
    <a href="#how" className="hover:opacity-80">How it works</a>
  {SHOW_PRICING && <a href="#pricing" className="hover:opacity-80">Pricing</a>}
    <a href="#faq" className="hover:opacity-80">FAQ</a>
  </nav>
  <div className="hidden md:flex items-center gap-3 ml-auto">
  <Button
    variant="outline"
    className="bg-white text-black border-black hover:bg-black/5"
    onClick={() => setIsFormOpen(true)}
  >
    Get a Demo
  </Button>
</div>
</div>
      </header>

     <Hero onOpenForm={() => setIsFormOpen(true)} onOpenVideo={() => setIsVideoOpen(true)} />

{SHOW_LOGOS && <Logos />}

<Features />
<Results />
<Insights onOpenForm={() => setIsFormOpen(true)} />
<Testimonial />
<HowItWorks />

{SHOW_PRICING && <Pricing />}

<FAQ />
<Footer />

      {/* Modals */}
      <RequestDemoModal open={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <VideoModal
        open={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        youtube="https://www.youtube.com/watch?v=RKqGC3CVZd0"
      />
    </div>
  );
}
