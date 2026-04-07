import React, { useEffect } from "react";
import { useSEO } from "../../hooks/useSEO";
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

// Small color swatch dot
const Swatch = ({ hex }) => (
  <span className="inline-block w-3 h-3 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: hex }} />
);

// Color mapping row used in the normalization illustration
const ColorRow = ({ brandName, hex, standardName, matched = false }) => (
  <div className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg ${matched ? "bg-violet-50 ring-1 ring-violet-200" : "bg-slate-50"}`}>
    <Swatch hex={hex} />
    <span className={`text-xs font-medium flex-1 ${matched ? "text-violet-900" : "text-slate-600"}`}>{brandName}</span>
    <svg className="w-3 h-3 text-slate-300 shrink-0" fill="none" viewBox="0 0 16 16"><path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    <span className={`text-xs font-semibold ${matched ? "text-violet-700" : "text-slate-400"}`}>{standardName}</span>
    {matched && <span className="text-[9px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full shrink-0">matched</span>}
  </div>
);

// Small product result row
const ResultRow = ({ pos, name, sub, colorHex, highlight = false }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${highlight ? "bg-emerald-50 ring-2 ring-emerald-200" : "bg-slate-50"}`}>
    <span className={`text-xs font-mono font-bold w-4 shrink-0 ${highlight ? "text-emerald-600" : "text-slate-400"}`}>{pos}</span>
    <div className="w-8 h-10 rounded-lg shrink-0 border border-black/8" style={{ backgroundColor: colorHex }} />
    <div className="flex-1 min-w-0 space-y-0.5">
      <div className={`text-xs font-semibold truncate ${highlight ? "text-emerald-900" : "text-slate-700"}`}>{name}</div>
      <div className={`text-[11px] ${highlight ? "text-emerald-600" : "text-slate-400"}`}>{sub}</div>
    </div>
    {highlight && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full shrink-0">Purchased</span>}
  </div>
);

export default function KilteCustomer() {
  const { onOpen } = useDemoForm();

  useSEO({
    title: "Kilte + Nobi: 21.7% More Conversions | Case Study",
    description: "Kilte uses evocative color names like Cappuccino and Ivory. Nobi maps them to what shoppers actually search for. Result: 21.7% more conversions.",
    path: "/customers/kilte",
  });

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
                <img src="/media/logos/kilte.webp" alt="Kilte" className="h-7 w-auto" />
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">Customer story</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  How Kilte made their beautiful catalog{" "}
                  <span className={GRADIENT}>searchable</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Kilte's product descriptions are evocative and on-brand. "Cappuccino," "Ivory," "Midnight." The problem: shoppers don't search that way. Nobi bridges the gap, and beat Shopify search by 21.7% in the process.
                </p>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-2 gap-4 max-w-md">
                {[
                  { value: "+21.7%", label: "Conversion rate", note: "Nobi vs. Shopify default in A/B test" },
                  { value: "3", label: "Placements", note: "Search, collection filters, and discovery" },
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

        {/* Narrative intro */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">About Kilte</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  Kilte is a fashion brand selling directly to consumers online. Their catalog leans into evocative, editorial naming — the kind that builds a brand identity and tells a story. Colors have names like Cappuccino, Ivory, Écru, and Midnight. It looks beautiful in a lookbook. It's a problem in a search bar.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">The problem</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  Shoppers search for "brown boots," not "cappuccino boots." Keyword search has no way to know that Cappuccino is brown, or that Ivory is close enough to white, or that Midnight is black. It can only match what the shopper typed to what's in the product record. If those words don't match, the shopper gets nothing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Color normalization section */}
        <section className="bg-slate-50 border-t border-slate-100 py-20">
          <div className="mx-auto max-w-5xl px-6 space-y-10">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">What Nobi does differently</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">AI-powered color normalization</h2>
              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                Nobi builds a semantic layer on top of Kilte's catalog that maps brand color names to the standard colors shoppers actually use. "Cappuccino" becomes searchable as brown. "Ivory" becomes white. "Midnight" becomes black. When a shopper searches "brown boots," Nobi knows to surface the Cappuccino Boot even though the word "brown" never appears in the product description.
              </p>
            </div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            >
              <div className="grid sm:grid-cols-2 gap-5 select-none">
                {/* Before */}
                <div className="rounded-2xl border border-red-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-red-50 border-b border-red-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400 shrink-0" />
                    <span className="text-sm font-semibold text-red-700">Shopify keyword search</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <SearchBar query="brown boots" />
                    <div className="py-4 text-center space-y-1.5 border border-dashed border-red-100 rounded-xl bg-red-50/50">
                      <div className="text-xs font-semibold text-red-600">Few or no results for "brown boots"</div>
                      <div className="text-[11px] text-slate-400">No product description contains the word "brown"</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest px-1">What's actually in the catalog</div>
                      <ColorRow brandName="Cappuccino" hex="#b5854a" standardName="brown" />
                      <ColorRow brandName="Ivory" hex="#f5f0e8" standardName="white" />
                      <ColorRow brandName="Midnight" hex="#1a1a2e" standardName="black" />
                      <ColorRow brandName="Écru" hex="#e8dcc8" standardName="cream" />
                    </div>
                    <p className="text-xs text-center text-red-600 font-semibold pt-1">Cappuccino Boot not surfaced. Sale at risk.</p>
                  </div>
                </div>
                {/* After */}
                <div className="rounded-2xl border border-emerald-100 bg-white shadow-[0_18px_46px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-emerald-700">Nobi semantic search</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <SearchBar query="brown boots" />
                    <div className="space-y-1.5">
                      <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest px-1">Nobi's color mapping layer</div>
                      <ColorRow brandName="Cappuccino" hex="#b5854a" standardName="brown" matched />
                      <ColorRow brandName="Ivory" hex="#f5f0e8" standardName="white" />
                      <ColorRow brandName="Midnight" hex="#1a1a2e" standardName="black" />
                      <ColorRow brandName="Écru" hex="#e8dcc8" standardName="cream" />
                    </div>
                    <ResultRow pos={1} name="Cappuccino Boot" sub="Leather, Ankle Height" colorHex="#b5854a" highlight />
                    <ResultRow pos={2} name="Tan Suede Chelsea" sub="Suede, Pull-On" colorHex="#c4956a" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Result */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-4xl px-6 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-600">The result</p>
              <h2 className="text-2xl font-semibold text-slate-900">21.7% more conversions in a direct A/B test</h2>
            </div>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Kilte ran a straightforward head-to-head: Nobi against Shopify's default search, measured on conversion rate. The result was a <strong>21.7% improvement</strong>. They didn't need more convincing. They moved to Nobi across their entire site and haven't looked back.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] text-white py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="space-y-8 text-center max-w-2xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-semibold">See what Nobi can do for your brand</h2>
                <p className="text-lg text-white/70">Set up takes minutes. Results show up in weeks.</p>
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
