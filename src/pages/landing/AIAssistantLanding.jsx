import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  ShoppingBag,
  Zap,
  Package,
  HelpCircle,
  Clock,
  Code,
  Sparkles,
} from "lucide-react";
import Marquee from "react-fast-marquee";
import { getSignupUrl } from "../../utils/signupUrl";

const CUSTOMER_LOGOS = [
  { alt: "UNTUCKit", src: "/media/logos/untuckit.svg" },
  { alt: "Lucchese", src: "/media/logos/lucchese.svg" },
  { alt: "Faherty", src: "/media/logos/faherty.svg" },
  { alt: "TOOLUP", src: "/media/logos/toolup.svg" },
  { alt: "Kilte", src: "/media/logos/kilte.svg" },
  { alt: "Alps and Meters", src: "/media/logos/alps_meters.png" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

function CTAButton({ children = "Start Free Trial", className = "", size = "lg" }) {
  const sizes = {
    md: "h-11 px-5 text-[15px]",
    lg: "h-12 px-7 text-base",
  };
  return (
    <a
      href={getSignupUrl()}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[.98] bg-black text-white hover:opacity-90 shadow-sm ${sizes[size]} ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function StickyBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-14">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/media/nobi-logo.png"
            srcSet="/media/nobi-logo.png 1x, /media/nobi-logo@2x.png 2x"
            alt="Nobi"
            className="h-7 w-auto"
          />
        </a>
        <CTAButton size="md">Start Free Trial</CTAButton>
      </div>
    </header>
  );
}

function LogoStrip() {
  return (
    <section className="border-t border-slate-200/60 bg-slate-50/50 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-sm text-slate-500 mb-5">
          Powering AI shopping experiences for leading brands
        </p>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden py-4 px-2">
          <Marquee speed={36} gradient={false} pauseOnHover>
            {[...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS].map((logo, idx) => (
              <img
                key={`${logo.alt}-${idx}`}
                src={logo.src}
                alt={logo.alt}
                className="h-5 w-auto object-contain grayscale opacity-60 hover:opacity-100 transition mx-6"
                loading="lazy"
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

/* ─── Conversation Demo ─── */

function ChatBubble({ from = "user", children, delay = 0 }) {
  const isUser = from === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={[
          "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-6",
          isUser
            ? "bg-black text-white"
            : "bg-slate-100 text-slate-800 border border-slate-200",
        ].join(" ")}
      >
        {children}
      </div>
    </motion.div>
  );
}

function ProductCard({ title, price, img }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[5/6] bg-slate-50">
        <img src={img} alt={title} className="w-full h-full object-cover object-top" loading="lazy" />
      </div>
      <div className="p-2.5">
        <div className="text-[13px] font-medium text-slate-900 line-clamp-1">{title}</div>
        <div className="text-[13px] text-slate-500">{price}</div>
      </div>
    </div>
  );
}

function ConversationDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_22px_60px_-30px_rgba(15,23,42,0.35)] overflow-hidden max-w-lg mx-auto">
      {/* Chat header */}
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="text-sm font-semibold text-slate-700">Nobi AI Assistant</span>
      </div>

      {/* Chat body */}
      <div className="px-4 py-5 space-y-3 min-h-[340px]">
        {step >= 1 && (
          <ChatBubble from="user" delay={0}>
            Red dress for a beach wedding. I'm 5'5" and want something under $200.
          </ChatBubble>
        )}

        {step >= 2 && (
          <ChatBubble from="ai" delay={0}>
            Here are some red dresses perfect for a beach wedding — warm-weather friendly, available in your size (M), and under $200:
          </ChatBubble>
        )}

        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-3 gap-2 pt-1"
          >
            <ProductCard title="St. Bernard Maxi" price="$98" img="/media/prod-1.png" />
            <ProductCard title="Lulus Backless Maxi" price="$55" img="/media/prod-2.png" />
            <ProductCard title="Coronel Cover-Up" price="$178" img="/media/prod-3.png" />
          </motion.div>
        )}
      </div>

      {/* Chat input */}
      <div className="border-t border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <Sparkles className="h-4 w-4 text-fuchsia-400" />
          <span className="text-sm text-slate-400">Ask anything about our products...</span>
        </div>
      </div>
    </div>
  );
}

export default function AIAssistantLanding() {
  useEffect(() => {
    document.title = "Bring the ChatGPT Experience to Your Site | Nobi";
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <StickyBar />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute -left-40 -top-32 w-96 h-96 bg-fuchsia-200/40 blur-3xl" aria-hidden />
        <div className="absolute right-[-140px] top-10 w-[28rem] h-[28rem] bg-indigo-200/40 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-4xl px-6 pt-20 sm:pt-28 pb-16 text-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase mb-4"
          >
            AI shopping assistant
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] tracking-tight text-balance"
          >
            Your Customers Already Use{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              ChatGPT
            </span>
            . Why Not On Your Site?
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Shoppers don't want to browse 50 pages and read fine print. They want to ask a question
            and get an answer. Nobi makes that happen — powered by your own product data.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <CTAButton>Start Free Trial</CTAButton>
            <span className="text-sm text-slate-500">No credit card required</span>
          </motion.div>
        </div>
      </section>

      <LogoStrip />

      {/* ─── What shoppers actually want ─── */}
      <section className="bg-gradient-to-b from-white via-slate-50/50 to-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              What your shoppers actually want
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              The browsing experience hasn't kept up with how people expect to interact online.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "They want to ask, not browse",
                desc: "Shoppers want to describe what they need in natural language — \"running shoes for wide feet under $120\" — and get results instantly.",
                accent: "bg-fuchsia-100 text-fuchsia-600",
              },
              {
                icon: HelpCircle,
                title: "They want answers, not links",
                desc: "\"Is this true to size?\" \"Does it come in navy?\" \"How long does shipping take?\" They want real answers — not to dig through product descriptions.",
                accent: "bg-violet-100 text-violet-600",
              },
              {
                icon: Clock,
                title: "They want it now",
                desc: "No waiting for support to reply. No reading 200-word product descriptions. Just instant, conversational help that gets them to checkout faster.",
                accent: "bg-indigo-100 text-indigo-600",
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_36px_-20px_rgba(15,23,42,0.25)]"
                >
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.accent} mb-4`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Conversation Demo ─── */}
      <section className="bg-gradient-to-b from-white via-slate-50/50 to-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-5">
              <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
                Like ChatGPT, but for{" "}
                <span className="bg-gradient-to-r from-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                  your products
                </span>
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Nobi uses your product catalog, reviews, and content to answer shoppers' questions
                in real-time. No training required — it works out of the box.
              </p>
              <ul className="space-y-3">
                {[
                  "Understands complex, natural-language queries",
                  "Recommends products based on stated needs",
                  "Answers sizing, shipping, and product questions",
                  "Learns your catalog automatically",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1 h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ConversationDemo />
          </div>
        </div>
      </section>

      {/* ─── Capabilities ─── */}
      <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Everything your shoppers need, in one assistant
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: MessageCircle,
                title: "Conversational search",
                desc: "Shoppers describe what they need in their own words and get relevant products instantly.",
              },
              {
                icon: HelpCircle,
                title: "Product Q&A",
                desc: "Answers fit, materials, shipping, and availability questions using your actual product data.",
              },
              {
                icon: ShoppingBag,
                title: "Smart recommendations",
                desc: "Cross-sells and upsells based on what the shopper is actually looking for — not just browsing history.",
              },
              {
                icon: Code,
                title: "Works in minutes",
                desc: "One script tag, one line of HTML. Works with Shopify, headless, or any platform.",
              },
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  custom={idx}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-300 mb-4">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-semibold mb-2">{cap.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{cap.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Metrics ─── */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-10">
            The numbers speak for themselves
          </h2>
          <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
            {[
              { stat: "30%", label: "Conversion lift (A/B proven)", palette: "purple" },
              { stat: "35%", label: "More add-to-carts", palette: "blue" },
              { stat: "56%", label: "Higher average order value", palette: "purple" },
              { stat: "33x", label: "ROI for Lucchese", palette: "blue" },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={idx}
                className={`relative overflow-hidden rounded-xl border text-white shadow-[0_18px_42px_-24px_rgba(64,41,153,0.45)] ${
                  item.palette === "blue"
                    ? "border-[#3f6bff] bg-gradient-to-br from-[#3fb7ff] via-[#4f7dff] to-[#6b52d9]"
                    : "border-[#4c3ab8] bg-gradient-to-br from-[#4a47a8] via-[#6b52d9] to-[#7f4ff0]"
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.16),transparent_40%)]" aria-hidden />
                <div className="relative px-5 py-6 sm:py-7 text-center">
                  <div className="text-3xl sm:text-4xl font-bold tracking-tight drop-shadow-sm">
                    {item.stat}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-medium text-white/85">
                    {item.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="bg-gradient-to-b from-white via-slate-50/50 to-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">
            Live in minutes, not months
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Add one script tag",
                desc: "Drop a single line of code into your site. Works with Shopify, headless, or any platform.",
              },
              {
                step: "2",
                title: "Nobi learns your catalog",
                desc: "We automatically ingest your products, content, and policies to power accurate answers.",
              },
              {
                step: "3",
                title: "Customers ask and buy",
                desc: "Shoppers get instant, AI-powered help. You get higher conversion and real-time insights.",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={idx}
                className="text-center"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 text-white text-lg font-bold shadow-md mb-4">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Closing CTA ─── */}
      <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Give your shoppers what they already expect
          </h2>
          <p className="text-base text-slate-300 mb-8 max-w-xl mx-auto">
            Your customers use AI every day. Bring that same experience to your site
            with Nobi. 30-day free trial, no credit card required.
          </p>
          <CTAButton className="text-lg h-14 px-8">
            Start Free Trial
          </CTAButton>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-[#17122f] border-t border-white/10 py-6">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <span>&copy; {new Date().getFullYear()} Nobi AI, Inc.</span>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition">Privacy</a>
            <a href="/terms" className="hover:text-white transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
