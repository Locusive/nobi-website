import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  MessageSquare,
  SlidersHorizontal,
  Zap,
  ChevronRight,
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

const METRICS = [
  { stat: "30%", label: "Conversion lift (A/B proven)", palette: "blue" },
  { stat: "35%", label: "More add-to-carts", palette: "purple" },
  { stat: "56%", label: "Higher average order value", palette: "blue" },
  { stat: "0", label: "Dead-end searches", palette: "purple" },
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
          Trusted by ecommerce teams who take search seriously
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

export default function SearchEngineLanding() {
  useEffect(() => {
    document.title = "Better Site Search That Converts | Nobi";
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <StickyBar />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute -left-40 -top-32 w-96 h-96 bg-purple-200/40 blur-3xl" aria-hidden />
        <div className="absolute right-[-140px] top-10 w-[28rem] h-[28rem] bg-blue-200/40 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-4xl px-6 pt-20 sm:pt-28 pb-16 text-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-sm font-semibold tracking-[0.2em] text-purple-600 uppercase mb-4"
          >
            Semantic search for ecommerce
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] tracking-tight text-balance"
          >
            Your Site Search Is{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Costing You Sales
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Nobi's semantic search understands what shoppers mean — not just what they type.
            A/B proven to convert up to 30% better than legacy search engines.
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

      {/* ─── Before / After ─── */}
      <section className="bg-gradient-to-b from-white via-slate-50/50 to-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              See the difference in one search
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Traditional keyword search returns zero results for anything slightly off.
              Nobi understands intent and always surfaces relevant products.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Before */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.3)] overflow-hidden">
              <div className="bg-red-50 border-b border-red-100 px-5 py-3 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="text-sm font-semibold text-red-700">Traditional keyword search</span>
              </div>
              <div className="p-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                  <img
                    src="https://storage.googleapis.com/nobi-public/docs_and_marketing_websites/features/better-search/terlingua-no-results.png"
                    alt="Keyword search showing zero results for 'terlingua'"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm text-slate-500 text-center">
                  "terlingua" → <span className="font-semibold text-red-600">0 results</span>. Sale lost.
                </p>
              </div>
            </div>

            {/* After */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.3)] overflow-hidden">
              <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700">Nobi semantic search</span>
              </div>
              <div className="p-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                  <img
                    src="https://storage.googleapis.com/nobi-public/docs_and_marketing_websites/features/better-search/terlingua-nobi.png"
                    alt="Nobi showing relevant boots for 'terlingua'"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm text-slate-500 text-center">
                  "terlingua" → <span className="font-semibold text-emerald-600">relevant boots surfaced</span>. Sale saved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Metrics ─── */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
            {METRICS.map((item, idx) => (
              <motion.div
                key={item.stat}
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
                    {item.stat !== "0" && <span className="text-lg">%</span>}
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

      {/* ─── Value Blocks ─── */}
      <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Why semantic search converts more
            </h2>
            <p className="text-base text-slate-300">
              Three ways Nobi turns frustrated searchers into buyers.
            </p>
          </div>

          {[
            {
              icon: Search,
              title: "Understands intent, not just keywords",
              body: "\"Breathable gym shirt\" maps to ventilated performance tops on the first try. Nobi's semantic + RAG ranking closes the language gap between how shoppers think and how your catalog is tagged.",
            },
            {
              icon: Zap,
              title: "Zero-result pages are gone",
              body: "Even when there's no exact keyword match, Nobi always surfaces relevant alternatives. No more dead ends — every search leads somewhere useful.",
            },
            {
              icon: SlidersHorizontal,
              title: "Conversational filtering replaces dropdown fatigue",
              body: "Shoppers type \"trail runners, waterproof, under $150\" and Nobi applies the filters instantly. No clicking through 12 dropdowns to narrow down a collection.",
            },
          ].map((block, idx) => {
            const Icon = block.icon;
            return (
              <motion.div
                key={block.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={idx}
                className="grid md:grid-cols-[auto_1fr] gap-5 items-start max-w-3xl mx-auto"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-fuchsia-300 shrink-0">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">{block.title}</h3>
                  <p className="text-base text-slate-300 leading-relaxed">{block.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Case Study ─── */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_22px_60px_-30px_rgba(15,23,42,0.3)] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-slate-200 px-6 sm:px-8 py-4 flex items-center gap-3">
              <img
                src="/media/logos/lucchese.svg"
                alt="Lucchese"
                className="h-6 w-auto object-contain"
              />
              <span className="text-sm font-semibold text-slate-600">Case Study</span>
            </div>
            <div className="px-6 sm:px-8 py-8 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                Lucchese hit 33x ROI with Nobi AI search
              </h3>
              <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
                Traffic and speed were up, but conversions were down. Keyword search forced constant copy edits
                and still missed what shoppers meant. Nobi replaced guesswork with semantic search,
                lifting conversion and revenue within weeks.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Conversion lift", value: "21%" },
                  { label: "Revenue in 90 days", value: "$148k" },
                  { label: "Return on investment", value: "33x" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4"
                  >
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {stat.label}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 pt-2">
                <img
                  src="/media/lourdes.png"
                  alt="Lourdes headshot"
                  className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <blockquote className="text-sm text-slate-600 italic leading-relaxed">
                  "If you want to learn and be inspired, you should implement a tool like Nobi. We've seen great incremental results...
                  the biggest reason a brand should implement this is that you have the opportunity to apply more information towards
                  optimizing campaigns and your broader brand and e-comm goals."
                  <cite className="block mt-1 not-italic font-semibold text-slate-800">
                    Lourdes, "Make it Smart" lead at Lucchese
                  </cite>
                </blockquote>
              </div>
            </div>
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
                desc: "Drop a single line of code into your site — works with Shopify, headless, or any platform.",
              },
              {
                step: "2",
                title: "Nobi indexes your catalog",
                desc: "We automatically ingest your products and content, building semantic vectors that understand relationships.",
              },
              {
                step: "3",
                title: "Shoppers search and buy",
                desc: "Visitors get relevant results from day one. You get conversion data and insights in your dashboard.",
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
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-lg font-bold shadow-md mb-4">
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
            See the lift on your own site
          </h2>
          <p className="text-base text-slate-300 mb-8 max-w-xl mx-auto">
            Launch Nobi alongside your current search and measure the conversion lift.
            30-day free trial, no credit card required.
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
