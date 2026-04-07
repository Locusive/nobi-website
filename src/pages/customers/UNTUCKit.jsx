import React, { useEffect } from "react";
import { motion } from "framer-motion";
import PageLayout from "../../components/PageLayout";
import { getSignupUrl } from "../../utils/signupUrl";
import { useDemoForm } from "../../context/DemoFormContext";

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const SearchBar = ({ query }) => (
  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 16 16">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    <span className="text-xs text-slate-500 font-mono">{query}</span>
  </div>
);

// SVG clothing silhouettes — renders inside a colored gradient container
function ShirtSVG({ variant = "buttondown", className = "" }) {
  if (variant === "tshirt") return (
    <svg viewBox="0 0 32 40" fill="currentColor" className={className} aria-hidden>
      <path d="M10,4 C12,9 20,9 22,4 L29,8 L27,16 L23,14 L23,38 L9,38 L9,14 L5,16 L3,8Z" />
    </svg>
  );
  if (variant === "vest") return (
    <svg viewBox="0 0 28 40" fill="currentColor" className={className} aria-hidden>
      <path d="M9,2 L14,14 L19,2 L24,6 L23,38 L5,38 L4,6Z" />
    </svg>
  );
  if (variant === "chino") return (
    <svg viewBox="0 0 28 40" fill="currentColor" className={className} aria-hidden>
      <rect x="5" y="2" width="18" height="10" rx="1.5" />
      <path d="M5,12 L9,38 L14,38 L14,24 L14,38 L19,38 L23,12Z" />
    </svg>
  );
  // buttondown — pointed collar, button placeholders
  return (
    <svg viewBox="0 0 32 40" fill="currentColor" className={className} aria-hidden>
      <path d="M11,3 L16,11 L21,3 L29,7 L27,15 L23,13 L23,38 L9,38 L9,13 L5,15 L3,7Z" />
      <circle cx="16" cy="15" r="0.75" fill="rgba(0,0,0,0.3)" />
      <circle cx="16" cy="19" r="0.75" fill="rgba(0,0,0,0.3)" />
      <circle cx="16" cy="23" r="0.75" fill="rgba(0,0,0,0.3)" />
    </svg>
  );
}

// Mini product card for grid layouts (tall image + name + price below)
function ProductCard({ name, price, gradient, variant = "buttondown", badge, badgeRed = false, faded = false }) {
  return (
    <div className={`rounded-xl overflow-hidden border ${faded ? "border-slate-100 opacity-60" : badge && !badgeRed ? "border-emerald-200 ring-2 ring-emerald-200" : "border-slate-200"}`}>
      <div className={`aspect-[3/4] bg-gradient-to-br ${gradient} relative overflow-hidden flex items-center justify-center`}>
        <ShirtSVG variant={variant} className="absolute inset-0 w-full h-full p-3 text-white opacity-20" />
        {badge && (
          <span className={`absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${badgeRed ? "text-white bg-red-500" : "text-white bg-emerald-500"}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="bg-white px-1.5 py-1.5 space-y-0.5">
        <div className="text-[10px] font-semibold text-slate-800 leading-tight truncate">{name}</div>
        <div className="text-[9px] text-slate-400">{price}</div>
      </div>
    </div>
  );
}

// List row with shirt thumbnail — for the rankings illustration
function ResultRow({ pos, name, sub, gradient, variant = "buttondown", badge, isWrong = false, highlight = false }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${highlight ? "bg-emerald-50 ring-2 ring-emerald-200" : isWrong ? "bg-red-50 ring-1 ring-red-100" : "bg-slate-50"}`}>
      <span className={`text-xs font-mono w-4 shrink-0 font-bold ${highlight ? "text-emerald-600" : isWrong ? "text-red-500" : "text-slate-400"}`}>{pos}</span>
      <div className={`w-8 h-10 rounded-lg bg-gradient-to-br ${gradient} shrink-0 relative overflow-hidden border ${isWrong ? "border-slate-300" : highlight ? "border-emerald-200" : "border-slate-200"}`}>
        <ShirtSVG variant={variant} className={`absolute inset-0 w-full h-full p-0.5 opacity-40 ${isWrong ? "text-slate-500" : highlight ? "text-emerald-600" : "text-slate-500"}`} />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className={`text-xs font-semibold truncate ${highlight ? "text-emerald-900" : "text-slate-700"}`}>{name}</div>
        <div className={`text-[11px] ${isWrong ? "text-red-500 font-medium" : highlight ? "text-emerald-600" : "text-slate-400"}`}>{sub}</div>
      </div>
      {badge && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full shrink-0">{badge}</span>}
    </div>
  );
}

function StatCallout({ value, label }) {
  return (
    <span className="inline-flex flex-col items-center bg-violet-50 border border-violet-200 rounded-xl px-3 py-1.5 mx-1 align-middle">
      <span className="text-lg font-bold text-violet-700 leading-none">{value}</span>
      <span className="text-[10px] text-violet-500 font-medium leading-none mt-0.5">{label}</span>
    </span>
  );
}

export default function UNTUCKitCustomer() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "UNTUCKit + Nobi | Customer Story";
  }, []);

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen">

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -left-32 -top-24 w-80 h-80 bg-purple-200/50 blur-3xl" aria-hidden />
          <div className="absolute right-[-120px] top-16 w-96 h-96 bg-blue-200/50 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-16 sm:pt-20 lg:pt-24">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <img src="/media/logos/untuckit.svg" alt="UNTUCKit" className="h-5 w-auto" />
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">Customer story</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  How UNTUCKit turned a{" "}
                  <span className={GRADIENT}>two-month pilot</span>{" "}
                  into a long-term partnership
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  UNTUCKit wanted more shoppers engaging with search. They ran a two-month A/B test, saw the numbers, dropped the split, and went all in.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
                {[
                  { value: "+17.1%", label: "Conversion rate", note: "17.6% Nobi vs. 15.0% on their prior search tool" },
                  { value: "+21.3%", label: "Revenue per searcher", note: "$39.17 vs. $32.30 on their prior tool" },
                  { value: "+3.3%", label: "Average order value", note: "$222 vs. $215 on their prior tool" },
                ].map((s) => (
                  <div key={s.value} className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.15)]">
                    <div className="text-3xl font-bold text-slate-900">{s.value}</div>
                    <div className="text-sm font-semibold text-slate-700 mt-1">{s.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About + Why they started */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">About UNTUCKit</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  UNTUCKit is a men's and women's clothing brand known for shirts designed to be worn untucked. Built around a simple idea (that casual dress clothes should actually fit and look good), they've grown into a major direct-to-consumer brand with a strong online presence.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Why they started</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  UNTUCKit knew that shoppers who search convert at a much higher rate than those who don't, so getting more visitors to engage with search was a real business lever. One of the first things Nobi did was add an "Ask AI" button to their nav bar, giving shoppers a new way to engage with the site. Then they ran a two-month A/B test to see what the results actually looked like.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three examples */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="mx-auto max-w-5xl px-6 space-y-24">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">What the test found</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">Three places Nobi pulled ahead</h2>
            </div>

            {/* 01 — Misspellings */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              className="space-y-8 pb-20 border-b border-slate-200"
            >
              <div className="space-y-4 max-w-2xl">
                <div className="text-5xl font-bold text-slate-200 leading-none">01</div>
                <h3 className="text-2xl font-semibold text-slate-900">Fixing misspellings</h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  A shopper typed "smiths sirt." Their existing search returned no results and fell back to top sellers. Nobi figured out they meant the Smithson Shirt. It was the first result, and the shopper bought it.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 select-none">
                {/* Before */}
                <div className="rounded-2xl border border-red-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-red-50 border-b border-red-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400 shrink-0" />
                    <span className="text-sm font-semibold text-red-700">Keyword search</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <SearchBar query="smiths sirt" />
                    <div className="py-4 text-center space-y-1.5 border border-dashed border-red-100 rounded-xl bg-red-50/50">
                      <div className="text-2xl font-light text-red-300">∅</div>
                      <div className="text-xs font-semibold text-red-600">No results for "smiths sirt"</div>
                      <div className="text-[11px] text-slate-400">Showing top sellers instead</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <ProductCard name="Polo Oxford" price="$79" gradient="from-slate-200 to-slate-300" variant="buttondown" faded />
                      <ProductCard name="Henley Shirt" price="$65" gradient="from-zinc-200 to-zinc-300" variant="tshirt" faded />
                      <ProductCard name="Canvas Chino" price="$89" gradient="from-stone-200 to-stone-300" variant="chino" faded />
                    </div>
                    <p className="text-xs text-center text-red-600 font-semibold">Smithson Shirt not found. Sale lost.</p>
                  </div>
                </div>
                {/* After */}
                <div className="rounded-2xl border border-emerald-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-emerald-700">Nobi semantic search</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <SearchBar query="smiths sirt" />
                    <div className="flex items-center gap-2 rounded-lg bg-violet-50 border border-violet-100 px-3 py-2">
                      <svg className="w-3.5 h-3.5 text-violet-400 shrink-0" fill="none" viewBox="0 0 16 16"><path d="M8 2l1.5 3 3.5.5-2.5 2.5.6 3.5L8 10l-3.1 1.5.6-3.5L3 5.5 6.5 5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                      <span className="text-xs text-violet-700">Did you mean: <span className="font-semibold">Smithson Shirt</span>?</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <ProductCard name="Smithson Shirt" price="$98" gradient="from-sky-300 to-sky-500" variant="buttondown" badge="Purchased" />
                      <ProductCard name="Smithson Slim" price="$98" gradient="from-sky-400 to-indigo-500" variant="buttondown" faded />
                      <ProductCard name="Hartford Classic" price="$86" gradient="from-slate-300 to-slate-500" variant="buttondown" faded />
                    </div>
                    <p className="text-xs text-center text-emerald-600 font-semibold">Smithson Shirt surfaced. Sale saved.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 02 — Better rankings */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              className="space-y-8 pb-20 border-b border-slate-200"
            >
              <div className="space-y-4 max-w-2xl">
                <div className="text-5xl font-bold text-slate-200 leading-none">02</div>
                <h3 className="text-2xl font-semibold text-slate-900">Better product rankings</h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  A search for "white button down" returned a t-shirt as the first result. Nobi returned only actual button-downs. The shopper bought the Gironde.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 select-none">
                {/* Before */}
                <div className="rounded-2xl border border-red-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-red-50 border-b border-red-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400 shrink-0" />
                    <span className="text-sm font-semibold text-red-700">Keyword search</span>
                  </div>
                  <div className="p-4 space-y-2">
                    <SearchBar query="white button down" />
                    <ResultRow pos={1} name="Classic Crew T-Shirt" sub="Not a button-down" gradient="from-slate-100 to-slate-200" variant="tshirt" isWrong />
                    <ResultRow pos={2} name="Weekend Henley" sub="Pullover, no collar" gradient="from-zinc-100 to-zinc-200" variant="tshirt" />
                    <ResultRow pos={3} name="Slub Cotton Tee" sub="Crew neck" gradient="from-stone-100 to-stone-200" variant="tshirt" />
                    <ResultRow pos={4} name="Essential Polo" sub="Button placket" gradient="from-slate-100 to-slate-200" variant="tshirt" />
                  </div>
                </div>
                {/* After */}
                <div className="rounded-2xl border border-emerald-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-emerald-700">Nobi semantic search</span>
                  </div>
                  <div className="p-4 space-y-2">
                    <SearchBar query="white button down" />
                    <ResultRow pos={1} name="Gironde Shirt" sub="White, Button-Down" gradient="from-slate-50 to-slate-200" variant="buttondown" badge="Purchased" highlight />
                    <ResultRow pos={2} name="Hartford Shirt" sub="White, Classic Fit" gradient="from-slate-100 to-slate-200" variant="buttondown" />
                    <ResultRow pos={3} name="Burford Oxford" sub="White, Slim Fit" gradient="from-zinc-50 to-zinc-200" variant="buttondown" />
                    <ResultRow pos={4} name="Carmel Shirt" sub="Off-White, Relaxed" gradient="from-stone-50 to-stone-200" variant="buttondown" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 03 — Semantic search */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              className="space-y-8"
            >
              <div className="space-y-4 max-w-2xl">
                <div className="text-5xl font-bold text-slate-200 leading-none">03</div>
                <h3 className="text-2xl font-semibold text-slate-900">Semantic search</h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  A search for "navy vest" (a product UNTUCKit didn't carry in navy) returned t-shirts. Nobi confirmed no navy vests were available but surfaced vests in other colors and other navy items. The shopper stayed on the site.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 select-none">
                {/* Before */}
                <div className="rounded-2xl border border-red-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-red-50 border-b border-red-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400 shrink-0" />
                    <span className="text-sm font-semibold text-red-700">Keyword search</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <SearchBar query="navy vest" />
                    <div className="grid grid-cols-3 gap-2">
                      <ProductCard name="Crew Tee" price="$54" gradient="from-slate-200 to-slate-400" variant="tshirt" faded />
                      <ProductCard name="V-Neck Tee" price="$54" gradient="from-zinc-300 to-zinc-500" variant="tshirt" faded />
                      <ProductCard name="Polo Shirt" price="$79" gradient="from-slate-300 to-slate-500" variant="tshirt" faded />
                    </div>
                    <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600 text-center font-semibold">
                      No vests shown at all
                    </div>
                  </div>
                </div>
                {/* After */}
                <div className="rounded-2xl border border-emerald-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-emerald-700">Nobi semantic search</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <SearchBar query="navy vest" />
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                      <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 16 16"><path d="M8 2l1.5 3 3.5.5-2.5 2.5.6 3.5L8 10l-3.1 1.5.6-3.5L3 5.5 6.5 5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                      <span className="text-xs text-amber-700 leading-snug">No navy vests available. Showing vests in other colors and navy tops.</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <ProductCard name="Vest, Olive" price="$110" gradient="from-green-600 to-green-800" variant="vest" />
                      <ProductCard name="Vest, Black" price="$110" gradient="from-zinc-600 to-zinc-900" variant="vest" />
                      <ProductCard name="Navy Chino" price="$98" gradient="from-blue-700 to-blue-900" variant="chino" />
                    </div>
                    <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs text-emerald-700 text-center font-semibold">
                      Shopper stayed on site
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Results — stats woven into narrative */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-4xl px-6 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">The result</p>
              <h2 className="text-2xl font-semibold text-slate-900">The A/B test ran for two months. Then they stopped splitting.</h2>
            </div>
            <div className="space-y-4 text-base text-slate-600 leading-relaxed max-w-2xl">
              <p>
                Nobi's conversion rate came in at <strong>17.6%</strong> against their existing tool's <strong>15.0%</strong> — a <strong>+17.1% lift</strong>. Revenue per searcher climbed from <strong>$32.30</strong> to <strong>$39.17</strong>, a <strong>+21.3% improvement</strong>. Average order value moved from <strong>$215</strong> to <strong>$222</strong>.
              </p>
              <p>
                The numbers were clear enough that UNTUCKit didn't need to keep running the test. They moved Nobi from a split to 100% of their traffic and started looking at what else they could do with it.
              </p>
            </div>

            {/* Paid tool head-to-head */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden max-w-2xl">
              <div className="px-6 pt-5 pb-3 border-b border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Head to head — separate test</p>
                <p className="text-sm text-slate-500 mt-1">In a direct head-to-head against their existing search tool, Nobi came out ahead.</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-100">
                <div className="px-6 py-5 space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Paid incumbent</p>
                  <p className="text-3xl font-bold text-slate-500">16.5%</p>
                  <p className="text-sm text-slate-400">conversion rate</p>
                </div>
                <div className="px-6 py-5 space-y-1 bg-emerald-50/60">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">Nobi</p>
                  <p className="text-3xl font-bold text-slate-900">17.4%</p>
                  <p className="text-sm text-slate-500">conversion rate</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* What happened next — dark section with images */}
        <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-20 text-white">
          <div className="mx-auto max-w-4xl px-6 space-y-10">
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">After the pilot</p>
              <h2 className="text-3xl font-semibold text-white">They went all in, and started shaping the product</h2>
              <p className="text-base text-slate-300">
                Once they committed fully, UNTUCKit pushed deeper into Nobi than almost any other customer. Some of what they asked for became features every Nobi customer uses today.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Panel 1: Query channel report */}
              <div className="rounded-2xl border border-white/15 bg-white/8 overflow-hidden">
                <div className="aspect-[16/9] bg-[#0d1117] p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Queries by Channel</div>
                    <div className="text-[10px] text-white/30 font-mono">Last 30 days</div>
                  </div>
                  <div className="space-y-3 flex-1 flex flex-col justify-center">
                    {[
                      { label: "Organic", revenue: "$34.2k", conv: "18.2%", w: "100%", color: "from-violet-500 to-fuchsia-500" },
                      { label: "Paid", revenue: "$18.1k", conv: "16.8%", w: "53%", color: "from-violet-500 to-fuchsia-500" },
                      { label: "Email", revenue: "$12.7k", conv: "19.1%", w: "37%", color: "from-violet-500 to-fuchsia-500" },
                      { label: "Direct", revenue: "$8.3k", conv: "15.9%", w: "24%", color: "from-violet-500 to-fuchsia-500" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-3">
                        <div className="text-[11px] text-white/50 w-12 shrink-0">{row.label}</div>
                        <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${row.color} rounded-full`} style={{ width: row.w }} />
                        </div>
                        <div className="text-[11px] text-white/70 font-mono w-12 text-right shrink-0">{row.revenue}</div>
                        <div className="text-[10px] text-violet-300 font-semibold w-10 text-right shrink-0">{row.conv}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2 pt-2 border-t border-white/10">
                    <div className="text-[10px] text-white/30">Revenue</div>
                    <div className="text-[10px] text-violet-300/60">Conv. rate</div>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-semibold text-white">They asked for a query channel report</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">UNTUCKit wanted to understand which channels their search traffic was coming from and which queries drove revenue. Nobi built it. That report is now in every customer's dashboard.</p>
                </div>
              </div>

              {/* Panel 2: Hooks API */}
              <div className="rounded-2xl border border-white/15 bg-white/8 overflow-hidden">
                <div className="aspect-[16/9] bg-[#0d1117] flex overflow-hidden">
                  {/* Code editor */}
                  <div className="flex-1 p-4 border-r border-white/8 flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-400/60" />
                      <div className="w-2 h-2 rounded-full bg-amber-400/60" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400/60" />
                      <div className="ml-2 text-[9px] text-white/25 font-mono">nobi-hooks.js</div>
                    </div>
                    <pre className="text-[9px] text-violet-300 leading-[1.6] font-mono overflow-hidden flex-1 select-none">
{`window.NobiFeatureHooks = {
  onProductDisplay(product) {
    return {
      badge: getBadge(product),
      subtitle: product.fit,
    };
  },
  onResultsRender(results) {
    return sortByInventory(results);
  },
};`}
                    </pre>
                  </div>
                  {/* Live preview */}
                  <div className="w-28 p-3 flex flex-col items-center justify-center gap-2 bg-white/3">
                    <div className="text-[8px] text-white/25 uppercase tracking-wider mb-0.5">Preview</div>
                    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white/5">
                      <div className="aspect-square bg-gradient-to-br from-sky-400 to-sky-600 relative">
                        <div className="absolute top-1.5 right-1.5 text-[7px] font-bold text-amber-900 bg-amber-300 px-1.5 py-0.5 rounded-full">New</div>
                      </div>
                      <div className="p-2 space-y-1">
                        <div className="text-[9px] font-semibold text-white leading-tight">Gironde Shirt</div>
                        <div className="text-[8px] text-white/40">Classic Fit</div>
                        <div className="text-[9px] text-white/70">$98</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-semibold text-white">They inspired Nobi's Hooks API</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">UNTUCKit's team wanted to control how Nobi displayed products, customizing each card to match their experience. That request became Nobi's Hooks capability, which lets any developer inject custom logic into the assistant without touching Nobi's code directly.</p>
                </div>
              </div>

              {/* Panel 3: Weekly insights */}
              <div className="rounded-2xl border border-white/15 bg-white/8 overflow-hidden">
                <div className="aspect-[16/9] bg-[#0d1117] p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Weekly Insights</div>
                    <div className="text-[10px] text-white/30 font-mono">Apr 1 – 7</div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Top searches this week</div>
                    {[
                      { q: "wrinkle-free shirts", delta: "+12%", w: "90%" },
                      { q: "blue oxford", delta: "+8%", w: "70%" },
                      { q: "gift for dad", delta: "new", w: "55%" },
                      { q: "linen casual shirt", delta: "+42%", w: "80%" },
                    ].map((item) => (
                      <div key={item.q} className="flex items-center gap-2">
                        <svg className="w-2.5 h-2.5 text-white/20 shrink-0" fill="none" viewBox="0 0 16 16"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50 rounded-full" style={{ width: item.w }} />
                        </div>
                        <span className="text-[10px] text-white/60 w-24 truncate">{item.q}</span>
                        <span className={`text-[9px] font-semibold w-8 text-right shrink-0 ${item.delta === "new" ? "text-emerald-400" : "text-violet-300"}`}>{item.delta}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 shrink-0">
                    <span className="text-[9px] text-red-400 font-medium">⚑ Zero results: "navy vest" — 47 searches this week</span>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-semibold text-white">They run Nobi insights in weekly meetings</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">UNTUCKit's team reviews Nobi's search insights every week as part of their regular business review, looking at query trends, zero-result searches, and what shoppers are actually asking for. It became a standing part of how they think about their catalog.</p>
                </div>
              </div>

              {/* Panel 4: Search history timeline */}
              <div className="rounded-2xl border border-white/15 bg-white/8 overflow-hidden">
                <div className="aspect-[16/9] bg-[#0d1117] p-5 flex flex-col gap-3">
                  <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Search History</div>
                  <div className="flex-1 relative">
                    {/* SVG line chart */}
                    <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* 12-month limit marker */}
                      <line x1="200" y1="0" x2="200" y2="70" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
                      <text x="202" y="8" fontSize="6" fill="rgba(255,255,255,0.25)" fontFamily="monospace">12mo limit</text>
                      {/* Fill area */}
                      <path d="M0,72 C30,68 60,64 90,58 C120,52 150,46 180,39 C210,32 240,24 270,18 C285,15 295,13 300,12 L300,80 L0,80Z" fill="url(#fillGrad)" />
                      {/* Line */}
                      <path d="M0,72 C30,68 60,64 90,58 C120,52 150,46 180,39 C210,32 240,24 270,18 C285,15 295,13 300,12" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" />
                      {/* Dot at current */}
                      <circle cx="300" cy="12" r="3" fill="#d946ef" />
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-white/25 font-mono px-0.5">
                      <span>2+ years ago</span>
                      <span>12 months ago</span>
                      <span>Today</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-2 shrink-0">
                    <svg className="w-3 h-3 text-violet-400 shrink-0" fill="none" viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <span className="text-[10px] text-violet-300">Every search stored since day one — not just the last 12 months</span>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-semibold text-white">They now have full search history</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">Before Nobi, UNTUCKit's search data only went back 12 months. Nobi stores everything from day one, so they can track long-term trends, compare seasons, and build a real picture of how search behavior changes over time.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] text-white py-20 border-t border-white/5">
          <div className="mx-auto max-w-4xl px-6">
            <div className="space-y-8 text-center max-w-2xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-semibold">See what Nobi can do for your brand</h2>
                <p className="text-lg text-white/70">Start with a two-month test. Keep going if it works.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={getSignupUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-white text-black hover:bg-white/90 shadow-sm h-12 px-6 text-base"
                >
                  Sign up free
                </a>
                <button
                  onClick={onOpen}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-white/30 bg-white/10 text-white h-12 px-6 text-base hover:border-white/50"
                >
                  Get a demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
