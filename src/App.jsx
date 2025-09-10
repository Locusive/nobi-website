import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

 import {
   Sparkles,
   Search as SearchIcon,
   ArrowRight,
   CheckCircle2,
   ShoppingCart,
   Filter,
   MousePointerClick,
   BarChart3,
   Quote,
  PlayCircle,
 ChevronDown,
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
    primary: "bg-black text-white dark:bg:white dark:text:black hover:opacity-90 shadow-sm",
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

function useTypingDemo({ mode, setQuery, setPlaceholder, enabled = true }) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const initialPlaceholder =
      mode === "ai" ? "Describe what you want..." : "Search products...";
    const toType = "Linen shirt for a wedding";

    setPlaceholder(initialPlaceholder);
    setQuery("");

    const startDelay = 800;     // wait before typing starts
    const baseSpeed = 30;       // ms per char
    const jitter = 32;          // randomness

    let startTimer;
    const timers = [];

    startTimer = setTimeout(() => {
      let i = 0;
      const step = () => {
        if (cancelled) return;
        setQuery(toType.slice(0, i + 1));
        i++;
        if (i < toType.length) {
          const t = setTimeout(step, baseSpeed + Math.random() * jitter);
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
  }, [mode, enabled, setQuery, setPlaceholder]);
}

function DualModeSearchBar({
  defaultMode = "ai",
  size = "regular",
  mode: controlledMode,
  onModeChange,
}) {
  // controlled/uncontrolled support
  const [internalMode, setInternalMode] = useState(defaultMode);
  const mode = controlledMode ?? internalMode;

  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(
    mode === "ai" ? "Describe what you want..." : "Search products..."
  );
  const [submitted, setSubmitted] = useState(null);

  // demo typing: replays when mode changes unless the user has interacted
  const [demoEnabled, setDemoEnabled] = useState(true);
  useTypingDemo({ mode, setQuery, setPlaceholder, enabled: demoEnabled });

  // when user toggles mode, replay the demo
  const setMode = (m) => {
    if (controlledMode === undefined) setInternalMode(m);
    onModeChange?.(m);
    setDemoEnabled(true);
  };

  // cancel demo on any user interaction
  const stopDemoAnd = (next) => (e) => {
    if (demoEnabled) setDemoEnabled(false);
    next?.(e);
  };

  const ctaLabel = mode === "ai" ? "Ask AI" : "Search";
  const height = size === "regular" ? "h-14" : "h-11";

  // thumb animation setup (unchanged from your version)
  const toggleRef = useRef(null);
  const siteBtnRef = useRef(null);
  const aiBtnRef = useRef(null);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  const measureThumb = () => {
    const btn = mode === "ai" ? aiBtnRef.current : siteBtnRef.current;
    if (!btn) return;
    setThumb({ left: btn.offsetLeft, width: btn.offsetWidth });
  };
  useEffect(() => {
    measureThumb();
    const ro = new ResizeObserver(measureThumb);
    if (toggleRef.current) ro.observe(toggleRef.current);
    window.addEventListener("resize", measureThumb);
    const raf = requestAnimationFrame(measureThumb);
    return () => {
      try { ro.disconnect(); } catch {}
      window.removeEventListener("resize", measureThumb);
      cancelAnimationFrame(raf);
    };
  }, [mode]);

  function submit() {
    if (!query.trim()) return;
    setSubmitted({ mode, query });
    setTimeout(() => setSubmitted(null), 2000);
  }

  return (
    <div className="w-full max-w-3xl">
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
            className={`relative z-[1] rounded-lg px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium transition-colors duration-300 ${mode === "site" ? "text-black dark:text-white" : "text-black/60 dark:text-white/60"}`}
            onClick={() => setMode("site")}
          >
            Default
          </button>
          <button
            ref={aiBtnRef}
            className={`relative z-[1] rounded-lg px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium transition-colors duration-300 ${mode === "ai" ? "text-black dark:text-white" : "text-black/60 dark:text-white/60"}`}
            onClick={() => setMode("ai")}
          >
            AI
          </button>
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={`absolute inset-y-1 rounded-full shadow-sm ${mode === "ai" ? "bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20" : "bg-black/10 dark:bg-white/20"}`}
            style={{ left: thumb.left, width: thumb.width }}
          />
        </div>

        {/* Input */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <input
            value={query}
            onChange={stopDemoAnd((e) => setQuery(e.target.value))}
            onFocus={stopDemoAnd()}
            onKeyDown={stopDemoAnd((e) => e.key === "Enter" && submit())}
            placeholder={placeholder}
            className="min-w-0 w-full bg-transparent outline-none text-[15px] placeholder:text-black/40 dark:placeholder:text-white/40"
            aria-label={mode === "ai" ? "Ask AI" : "Search"}
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

      {/* Little toast after submit (optional) */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-black/90 text-white px-3 py-1 text-xs"
        >
          <span className="inline-flex items-center gap-1">
            {submitted.mode === "ai" ? <Sparkles className="h-4 w-4" /> : <SearchIcon className="h-4 w-4" />} {submitted.mode === "ai" ? "AI" : "Default"}
          </span>
          <span className="opacity-80">•</span>
          <span className="truncate max-w-[60ch]">{submitted.query}</span>
        </motion.div>
      )}
    </div>
  );
}

function PreviewCard({ mode = "ai" }) {
  const [videoFailed, setVideoFailed] = useState(false);

  const src = mode === "ai"
    ? "/media/preview-ai.mp4"
    : "/media/preview-default.mp4";

  return (
    <div className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 overflow-hidden relative">
      <AspectBox ratio={16/9}>
        {!videoFailed ? (
          <video
            key={mode}                 // remount when mode changes so it restarts
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-top"
            onError={() => setVideoFailed(true)}
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlaceholderSVG label="" className="w-full h-full" />
          </div>
        )}
      </AspectBox>
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

function Hero({ onOpenVideo, onOpenForm }) {
  const [searchMode, setSearchMode] = useState("ai"); // default = AI

  return (
    <section id="home" className="relative overflow-hidden mb-3">
      <div className="mx-auto max-w-6xl px-6 pt-16 sm:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
              Turn product search into a{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                conversation
              </span>
            </h1>
            <p className="mt-4 text-lg text-black/70 dark:text-white/70 max-w-xl">
              Nobi gets your customers the right products faster with conversational AI.
            </p>

            <div className="mt-8">
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Button size="lg" className="w-full sm:w-auto" onClick={onOpenForm}>
                  Try it on your store <ArrowRight className="h-4 w-4 shrink-0" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={onOpenVideo}
                  type="button"
                >
                  <PlayCircle className="h-5 w-5" />
                  <span className="ml-1">How it works in 60 seconds</span>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-black/60 dark:text-white/60">
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> 15-minute install
                </div>
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Shopify & headless
                </div>
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> A/B testing & reporting
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="mb-4 p-4 rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-pink-50 shadow-md">
              <DualModeSearchBar
                size="compact"
                mode={searchMode}
                onModeChange={setSearchMode}
              />
            </div>

            <PreviewCard mode={searchMode} />
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

function Logos() {
  // Put these SVGs in /public/media (or update the paths)
  const small = "max-h-6 sm:max-h-7";  // smaller (Lucchese, UNTUCKit)
  const base  = "max-h-8 sm:max-h-9";  // default (Faherty, Toolup, St. Bernard)

  const brands = [
    { src: "/media/logos/lucchese.svg", alt: "Lucchese Bootmaker", h: small },
    { src: "/media/logos/untuckit.svg", alt: "UNTUCKit",           h: small },
    { src: "/media/logos/faherty.svg",  alt: "Faherty",            h: base  },
    { src: "/media/logos/toolup.svg",   alt: "Toolup",             h: base  },
    { src: "/media/logos/stbernard.svg", alt: "St. Bernard",        h: base  },
  ];

  return (
    <section id="logos" className="py-14 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-sm font-semibold text-fuchsia-600 mb-6">
          Trusted by modern commerce
        </p>

        {/* Even spacing on all breakpoints */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-10 gap-y-8 place-items-center">
          {brands.map(({ src, alt, h }) => (
            <li key={alt} className="opacity-70 hover:opacity-90 transition">
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className={`w-auto ${h} object-contain filter grayscale`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: "AI Mode your Search",
      desc:
        "Let users who want the ChatGPT experience from your search 'Ask AI'. Keep your default keyword search for everyone else.",
      icon: <Sparkles className="h-4 w-4" />,
      media: { src: "/media/feature-ai-mode.mp4", alt: "" },
    },
    {
      title: "Simplify Collections Pages",
      desc:
        "Empower customers to drill down from 100s of SKUs to the perfect fit in seconds, simply by asking.",
      icon: <Filter className="h-4 w-4" />,
      media: { src: "/media/feature-collections.mp4", alt: "Collections assistant demo" },
    },
    {
      title: "Capture Bouncers",
      desc:
        "Prevent customers from leaving your search result pages by offering them the ability to try again with Nobi.",
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
          One seamless experience, anywhere in your store.
        </h2>
        <p className="mt-3 text-black/70 dark:text-white/70 max-w-3xl">
          Test conversational AI on your PLPs, search, PDPs and anywhere else you think is right for your brand.
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
    { metric: "Product Viewed", defaultVal: "60.9%", nobiVal: "64.1%", impact: "+6.0%" },
    { metric: "Add to Cart", defaultVal: "8.5%", nobiVal: "11.5%", impact: "+35.3%" },
    { metric: "Checkout Completed", defaultVal: "2.4%", nobiVal: "3.1%", impact: "+29.2%" },
    { metric: "Average Order Value", defaultVal: "$231", nobiVal: "$360", impact: "+55.8%" },
  ];

  return (
    <section id="results" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold text-fuchsia-600">Results</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">
          Conversational shopping works.
        </h2>
        <p className="mt-3 text-black/70 dark:text-white/70 max-w-2xl">
          Nobi has outperformed the default shopping experience in every A/B test we've ever run.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm font-semibold text-black/70 dark:text-white/70">
                <th className="py-3 px-4"></th>
                <th className="py-3 px-4 text-center">Default</th>
                <th className="py-3 px-4 text-center">Nobi</th>
                <th className="py-3 px-4 text-center bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
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
                  <td className="py-4 px-4 font-medium text-black/80 dark:text-white/90">{r.metric}</td>
                  <td className="py-4 px-4 text-center text-2xl font-semibold tabular-nums">{r.defaultVal}</td>
                  <td className="py-4 px-4 text-center text-2xl font-semibold tabular-nums">{r.nobiVal}</td>
                  <td className="py-4 px-4 text-center text-2xl font-bold tabular-nums bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                    {r.impact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-black/50 dark:text-white/50">
          Impact = relative lift vs. Default. A/B frameworks available for on-site validation.
        </p>
      </div>
    </section>
  );
}

// make sure you already import useState/useEffect/useRef at the top of App.jsx
// import React, { useState, useEffect, useRef } from "react";

function Testimonial() {
  const leftRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(0);

  useEffect(() => {
    if (!leftRef.current) return;

    const el = leftRef.current;
    // Measure now and whenever the quote changes size
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
              “If you want to learn and be inspired, you should look to implement a tool like Nobi.
              We've seen great results, where conversion rates have been significantly higher than
              on our binary search. But the biggest reason a brand should implement a tool like this
              is that you have the opportunity to apply more information towards optimizing broader
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
                  Senior Dr. Digital & E-Commerce, Lucchese
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
    { h: "Install the code", p: "Paste two snippets of code in your store. Nobi reads your catalog and adopts your branding." },
    { h: "Ramp up traffic", p: "Pick entry points (i.e. PLPs, search) and set what percent of traffic you want to see Nobi." },
    { h: "Measure the lift", p: "Track conversion, AOV and qualitative insights in a simple dashboard." },
  ];
  return (
    <section id="how" className="scroll-mt-20 py-20 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold mb-8">How it works</h2>
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
    { name: "Starter", price: "$0", blurb: "Kick the tires", points: ["Up to 500 queries/mo", "Default + AI search bar", "Email support"], cta: "Get started" },
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
    { q: "Does Nobi replace my current search?", a: "No. Nobi layers on top so you can keep your existing keyword engine and optionally enable AI." },
    { q: "How long does install take?", a: "Typically ~15 minutes for Shopify themes. Headless installs depend on your stack." },
    { q: "Can we A/B test it?", a: "Yes. The snippet includes an A/B framework to measure impact vs your default shop experience." },
  ];

  return (
    <section id="faq" className="py-20 border-t border-black/5 dark:border-white/5">
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
          © {new Date().getFullYear()} Nobi — Conversational commerce
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="#features" className="hover:opacity-80">Features</a>
         <a href="#how" className="hover:opacity-80">How it Works</a>
          <a href="#pricing" className="hover:opacity-80">Pricing</a>
          <a href="#faq" className="hover:opacity-80">FAQ</a>
        </div>
      </div>
    </footer>
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

function InsightsHeatCell({ v = 0 }) {
  const bg = `rgba(139, 92, 246, ${0.15 + v * 0.45})`;
  const border = `rgba(0,0,0,0.06)`;
  return (
    <div
      className="h-9 sm:h-10 md:h-11 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
      aria-label={`affinity ${Math.round(v * 100)}%`}
    >
      {Math.round(v * 100)}%
    </div>
  );
}

function Insights() {
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
              Insights your team can act on.
            </h2>
            <p className="mt-3 text-black/70 dark:text-white/70 max-w-2xl">
              Nobi turns real conversations into structured signals. Your merchandising, creative, and growth teams have never moved faster.
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
              <div className="font-semibold">Attribute affinity by product</div>
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
                          <InsightsHeatCell key={`${p}-${a}`} v={affinity[p][a] || 0} />
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
                Voice of customer
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

        {/* CTA row */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button size="lg" className="w-full sm:w-auto">See how insights are generated</Button>
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
    honey: "", // honeypot
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
      const r = await fetch("/api/request-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || "Something went wrong.");
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
            <input type="text" name="honey" value={form.honey} onChange={update} className="hidden" tabIndex={-1} autoComplete="off" />

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
  <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
    <a href="#home" className="flex items-center gap-3">
      <Logo className="h-8 md:h-9 lg:h-10" />            {/* bigger on desktop */}
    </a>

    {/* Nav (unchanged) */}
    <nav className="hidden md:flex items-center gap-6 text-sm">
      <a href="#features" className="hover:opacity-80">Features</a>
      <a href="#how" className="hover:opacity-80">How it works</a>
      <a href="#pricing" className="hover:opacity-80">Pricing</a>
      <a href="#faq" className="hover:opacity-80">FAQ</a>
    </nav>

    <div className="hidden md:flex items-center gap-3">
      <Button variant="ghost"><ShoppingCart className="h-4 w-4" /> Install Nobi</Button>
    </div>
  </div>
</header>

     <Hero onOpenForm={() => setIsFormOpen(true)} onOpenVideo={() => setIsVideoOpen(true)} />
      <Logos />
      <Features />
      <Results />
     <Insights />
      <Testimonial />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
{/* Video modal */}
      <RequestDemoModal open={isFormOpen} onClose={() => setIsFormOpen(false)} />
<VideoModal
  open={isVideoOpen}
  onClose={() => setIsVideoOpen(false)}
  youtube="https://www.youtube.com/watch?v=RKqGC3CVZd0"
/>
    </div>
  );
}

// tests (basic vnodes)
export function runSmokeTests() {
  try {
    const page = React.createElement(App, null);
    if (!page || typeof page !== "object") throw new Error("App vnode");
    const features = React.createElement(Features, null);
    const results = React.createElement(Results, null);
    const footer = React.createElement(Footer, null);
    if (![features, results, footer].every(x => x && typeof x === "object")) throw new Error("child vnodes");
    console.log("Smoke tests passed.");
  } catch (e) { console.error("Smoke tests failed", e); }
}
