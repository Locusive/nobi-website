import React from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import { Bot, Globe, Sparkles, FileText, MessageSquare, ArrowRight } from "lucide-react";

function StoryDots({ active, total, dark }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`rounded-full transition-all ${i === active
          ? dark ? "h-1.5 w-8 bg-violet-400" : "h-1.5 w-8 bg-slate-800"
          : dark ? "h-1.5 w-1.5 bg-white/20" : "h-1.5 w-1.5 bg-slate-300"
        }`} />
      ))}
    </div>
  );
}

function StoryScroll({ to, dark }) {
  return (
    <button
      className="flex flex-col items-center gap-2 group"
      onClick={() => { const el = document.getElementById(to); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
    >
      <span className={`text-xs font-medium tracking-widest uppercase transition-colors ${dark ? "text-white/30 group-hover:text-white/60" : "text-slate-400 group-hover:text-slate-600"}`}>Continue</span>
      <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors animate-bounce ${dark ? "border-white/20 group-hover:border-violet-400" : "border-slate-200 group-hover:border-slate-400"}`}>
        <svg className={`w-5 h-5 transition-colors ${dark ? "text-white/30 group-hover:text-violet-400" : "text-slate-400 group-hover:text-slate-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
  );
}

export default function AgentEndpoint() {
  const { onOpen: openDemoForm } = useDemoForm();

  useSEO({
    title: "Reach AI Agents - Your Business, Inside Every AI Your Customers Use | Nobi",
    description: "Nobi makes your business findable and callable by AI agents. Structured content AI crawlers can index, plus a live endpoint they can call. Both automatic.",
    path: "/why-nobi/ai-agents",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nobi AI Agent Endpoint",
      "description": "Nobi makes your business findable and callable by AI agents automatically.",
      "brand": { "@type": "Brand", "name": "Nobi" },
      "url": "https://nobi.ai/why-nobi/ai-agents",
    },
  });

  return (
    <PageLayout>
      <div className="bg-white text-black min-h-screen">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-slate-100">
          <div className="absolute -left-40 -top-32 w-96 h-96 bg-violet-100/60 blur-3xl" aria-hidden />
          <div className="absolute right-[-160px] top-20 w-96 h-96 bg-indigo-100/60 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-7">
                <p className="text-sm font-semibold tracking-[0.2em] text-violet-600 uppercase">A new channel</p>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.05] text-slate-900 text-balance">
                  Your business,{" "}
                  <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">inside every AI</span>{" "}
                  your customers use
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                  When someone asks Claude or ChatGPT for a recommendation, Nobi makes sure your business shows up — and can answer follow-up questions directly. No extra setup. It comes with your existing Nobi assistant.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={getSignupUrl()} className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium bg-black text-white hover:opacity-90 h-12 px-6 text-base w-full sm:w-auto">
                    Get started free
                  </a>
                  <button onClick={openDemoForm} className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium border border-black/10 bg-white h-12 px-6 text-base w-full sm:w-auto hover:border-black/30">
                    Get a demo
                  </button>
                </div>
              </div>

              {/* Static two-panel mid-conversation */}
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-violet-100/80 to-indigo-100/80 rounded-[2rem] blur-2xl" aria-hidden />
                <div className="relative flex items-stretch gap-3">
                  {/* Left: Customer's AI */}
                  <div className="flex-1 rounded-2xl border border-black/10 bg-white shadow-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-black/5">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-black/60">Customer's AI</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-end">
                        <div className="bg-black/5 rounded-2xl rounded-br-sm px-3 py-2 text-sm text-black/80">
                          Find me a cashmere sweater gift
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 mt-0.5 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <p className="text-sm text-black/60">Summit Cashmere has great options:</p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { name: "Classic Crew",   price: "$265", img: "https://www.alpsandmeters.com/cdn/shop/products/Cashmere_Alpine_Guide_Sweater_Camel.jpg?v=1753426053&width=200" },
                              { name: "Rib Turtleneck", price: "$295", img: "https://www.alpsandmeters.com/cdn/shop/products/Ski_Race_Knit_Sports_Club_Navy.jpg?v=1753426053&width=200" },
                              { name: "Cable Knit",     price: "$245", img: "https://www.alpsandmeters.com/cdn/shop/products/Classic_Cable_Knit_IVORY_Front.jpg?v=1753426168&width=200" },
                            ].map((p) => (
                              <div key={p.name} className="rounded-lg overflow-hidden border border-black/5 shadow-sm bg-white">
                                <div className="aspect-[3/4]"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /></div>
                                <div className="px-1.5 py-1.5">
                                  <div className="text-[10px] font-semibold text-black/70 truncate">{p.name}</div>
                                  <div className="text-[10px] text-black/40">{p.price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-slate-50 border border-black/8 rounded-xl px-3 py-2 text-xs text-black/60">
                            They gift wrap — complimentary on all orders.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Wire */}
                  <div className="flex flex-col items-center justify-center gap-2 w-10 flex-shrink-0">
                    <div className="relative w-full" style={{ height: 16 }}>
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-300" />
                      {[0.1, 0.45, 0.78].map((pos, i) => (
                        <div key={i} className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_6px_2px_rgba(139,92,246,0.5)]"
                          style={{ left: `${pos * 100}%` }} />
                      ))}
                    </div>
                    <div className="font-mono text-[8px] text-violet-400">{"{}"}</div>
                  </div>
                  {/* Right: Business Nobi agent */}
                  <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
                      <svg className="h-4 w-auto flex-shrink-0" viewBox="0 0 22 18" fill="none">
                        <path d="M11 2L20 16H2L11 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M7.5 16L11 10.5L14.5 16" stroke="white" strokeWidth="1" strokeLinejoin="round" strokeOpacity="0.5"/>
                      </svg>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">Summit Cashmere</div>
                        <div className="text-[9px] text-slate-400">Powered by Nobi</div>
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    </div>
                    <div className="p-4 font-mono space-y-3 text-xs">
                      <div className="space-y-1">
                        <div className="text-slate-500">POST /mcp/query</div>
                        <div className="text-slate-300 pl-2">"cashmere sweater gift"</div>
                        <div className="text-emerald-400">200 OK · products: [3]</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-slate-500">POST /mcp/query</div>
                        <div className="text-slate-300 pl-2">"do you gift wrap?"</div>
                        <div className="text-emerald-400">200 OK · "Yes, complimentary"</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Story beat 1 ─────────────────────────────────────────────────── */}
        <section className="min-h-screen flex flex-col items-center justify-center border-b border-slate-100 bg-[#0a0a12] px-6 py-20 gap-12 relative overflow-hidden">

          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,40,217,0.15),transparent_70%)]" aria-hidden />

          {/* Big bold heading */}
          <div className="relative text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-1 w-8 rounded-full bg-violet-400" />
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <div className="h-1 w-1 rounded-full bg-white/20" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">
              Right now, <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">someone is searching.</span>
            </h2>
            <p className="text-lg text-white/50">Someone just asked their AI to find a business like yours.</p>
          </div>

          {/* Stylized AI interface */}
          <div className="relative w-full max-w-2xl">
            {/* Outer glow */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-violet-500/40 to-fuchsia-500/20" style={{ filter: "blur(1px)" }} aria-hidden />
            <div className="absolute -inset-8 bg-violet-500/10 rounded-[3rem] blur-3xl" aria-hidden />

            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#111118]">
              {/* Header bar */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-xs text-white/30 font-mono">chatgpt.com</span>
                </div>
              </div>

              {/* Chat body */}
              <div className="px-8 py-16 flex flex-col items-center gap-10">
                <p className="text-2xl font-semibold text-white/80">How can I help?</p>

                {/* Input */}
                <div className="w-full relative">
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-70" />
                  <div className="relative flex items-center gap-3 rounded-2xl bg-[#1a1a28] px-5 py-4">
                    <span className="text-white/30 text-xl flex-shrink-0">+</span>
                    <span className="flex-1 text-white text-lg font-light">Find me a luxury cashmere sweater gift</span>
                    <span className="w-0.5 h-6 bg-violet-400 animate-pulse flex-shrink-0" />
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/20">AI can make mistakes. Consider checking important information.</p>
              </div>
            </div>
          </div>

          {/* Big scroll button */}
          <button
            className="relative flex flex-col items-center gap-3 group"
            onClick={() => {
              const next = document.getElementById("beat-2");
              if (next) next.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="text-sm font-semibold tracking-[0.3em] uppercase text-white/40 group-hover:text-white/70 transition-colors">Scroll to see what happens</span>
            <div className="w-14 h-14 rounded-full border-2 border-white/20 group-hover:border-violet-400 flex items-center justify-center transition-colors animate-bounce">
              <svg className="w-6 h-6 text-white/40 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

        </section>

        {/* ── Beat 2: Your site had FAQs ───────────────────────────────────── */}
        <section id="beat-2" className="min-h-screen flex flex-col items-center justify-center border-b border-slate-100 bg-white px-6 py-20 gap-10">
          <StoryDots active={1} total={4} />
          <div className="text-center space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">Your site already had answers AI could read.</h2>
            <p className="text-lg text-slate-500">Every question your Nobi assistant answered became published FAQ content — on your pages, indexed by AI crawlers.</p>
          </div>

          {/* Product page mock with FAQ section */}
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">

            {/* Page URL bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border-b border-slate-200">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>
              <div className="flex-1 mx-3 bg-white rounded text-xs text-slate-400 px-3 py-1 border border-slate-200 text-center">
                summitcashmere.com/products/classic-crew
              </div>
            </div>

            {/* Product section */}
            <div className="flex gap-4 p-5 border-b border-slate-100">
              <div className="w-20 h-24 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                <img src="https://www.alpsandmeters.com/cdn/shop/products/Cashmere_Alpine_Guide_Sweater_Camel.jpg?v=1753426053&width=200" alt="Classic Crew" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="text-base font-semibold text-slate-900">Classic Crew</div>
                <div className="text-sm text-slate-500">Summit Cashmere · $265</div>
                <div className="text-xs text-slate-400">100% Grade-A Mongolian cashmere</div>
              </div>
            </div>

            {/* FAQ section — clearly on the page, from conversations */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-violet-500" />
                <span className="text-sm font-semibold text-slate-700">Questions customers have asked</span>
                <span className="ml-auto text-[10px] text-violet-500 font-medium bg-violet-50 border border-violet-100 rounded-full px-2 py-0.5">Generated by Nobi</span>
              </div>
              {[
                { q: "Do you ship internationally?",  a: "Yes — 40+ countries, free over $300." },
                { q: "Is gift wrapping available?",   a: "Yes, complimentary on all orders." },
                { q: "What is the return policy?",    a: "30 days, unworn, original packaging." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-violet-500 mt-0.5 flex-shrink-0">Q</span>
                    <p className="text-sm font-medium text-slate-800">{item.q}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-emerald-500 mt-0.5 flex-shrink-0">A</span>
                    <p className="text-sm text-slate-500">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400">Indexed by GPTBot · ClaudeBot · Perplexity</span>
            </div>
          </div>

          <StoryScroll to="beat-3" />
        </section>

        {/* ── Beat 3: Agent learns about your brand ─────────────────────────── */}
        <section id="beat-3" className="min-h-screen flex flex-col items-center justify-center border-b border-slate-100 bg-[#0a0a12] px-6 py-20 gap-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,40,217,0.12),transparent_70%)]" aria-hidden />
          <StoryDots active={2} total={4} dark />
          <div className="relative text-center space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">So their AI learned about you.</h2>
            <p className="text-lg text-white/50">The agent searched for cashmere brands. Your indexed content made you findable — and showed you had a live endpoint to call.</p>
          </div>
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111118] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono text-white/30">Agent · discovery phase</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />searching</span>
            </div>
            <div className="p-6 space-y-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <p className="text-xs text-white/30 font-mono mb-1">query</p>
                <p className="text-sm text-white/70">"luxury cashmere sweater gift"</p>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Summit Cashmere", url: "summitcashmere.com", note: "FAQ content indexed · agent endpoint found", highlight: true },
                  { name: "Other brand",     url: "otherbrand.com",     note: "No agent endpoint",                            highlight: false },
                  { name: "Another brand",   url: "anotherbrand.com",   note: "No structured content",                       highlight: false },
                ].map((r) => (
                  <div key={r.name} className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${r.highlight ? "border-violet-500/40 bg-violet-500/10" : "border-white/5 bg-white/3 opacity-30"}`}>
                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${r.highlight ? "bg-emerald-400" : "bg-white/20"}`} />
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-semibold ${r.highlight ? "text-white" : "text-white/40"}`}>{r.name}</span>
                      <span className="text-xs text-white/30 ml-2">{r.url}</span>
                    </div>
                    <span className={`text-xs flex-shrink-0 ${r.highlight ? "text-emerald-400" : "text-white/20"}`}>{r.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <StoryScroll to="beat-4" dark />
        </section>

        {/* ── Beat 4: Agent calls your endpoint ────────────────────────────── */}
        <section id="beat-4" className="min-h-screen flex flex-col items-center justify-center border-b border-slate-100 bg-white px-6 py-20 gap-10">
          <StoryDots active={3} total={4} />
          <div className="text-center space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">Then it called you directly.</h2>
            <p className="text-lg text-slate-500">Your Nobi assistant is a live agent endpoint. The AI called it and got real answers — products, policies, follow-ups.</p>
          </div>
          <div className="w-full max-w-2xl flex items-stretch gap-3">
            <div className="flex-1 rounded-2xl border border-black/10 bg-white shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-black/5">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-black/60">Customer's AI</span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-end">
                  <div className="bg-black/5 rounded-2xl rounded-br-sm px-3 py-2 text-sm text-black/80">Find me a luxury cashmere sweater gift</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-black/5 rounded-2xl rounded-br-sm px-3 py-2 text-sm text-black/80">Do they gift wrap?</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 w-10 flex-shrink-0">
              <div className="relative w-full" style={{ height: 16 }}>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-300" />
                {[0.1, 0.45, 0.78].map((pos, i) => (
                  <div key={i} className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_6px_2px_rgba(139,92,246,0.5)]" style={{ left: `${pos * 100}%` }} />
                ))}
              </div>
              <div className="font-mono text-[8px] text-violet-400">{"{}"}</div>
            </div>
            <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
                <svg className="h-3.5 w-auto" viewBox="0 0 22 18" fill="none">
                  <path d="M11 2L20 16H2L11 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M7.5 16L11 10.5L14.5 16" stroke="white" strokeWidth="1" strokeLinejoin="round" strokeOpacity="0.5"/>
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white">Summit Cashmere</div>
                  <div className="text-[9px] text-slate-400">Powered by Nobi</div>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="p-4 font-mono text-xs space-y-2">
                <div className="text-slate-500">POST /mcp/query</div>
                <div className="text-slate-300 pl-2">"cashmere sweater gift"</div>
                <div className="text-emerald-400">200 OK · products: [3]</div>
                <div className="text-slate-500 mt-2">POST /mcp/query</div>
                <div className="text-slate-300 pl-2">"do you gift wrap?"</div>
                <div className="text-emerald-400">200 OK · "Yes, complimentary"</div>
              </div>
            </div>
          </div>
          <StoryScroll to="beat-5" />
        </section>

        {/* ── Beat 5: Introduction made ─────────────────────────────────────── */}
        <section id="beat-5" className="min-h-screen flex flex-col items-center justify-center border-b border-slate-100 bg-[#0a0a12] px-6 py-20 gap-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)]" aria-hidden />
          <StoryDots active={4} total={4} dark />
          <div className="relative text-center space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">Your business got introduced.</h2>
            <p className="text-lg text-white/50">The customer met Summit Cashmere inside their own AI. No website visit. No ad. No effort on your part.</p>
          </div>
          <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#111118] overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-white/50">Customer's AI</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-end">
                <div className="bg-white/10 rounded-2xl rounded-br-sm px-3 py-2 text-sm text-white/80">Find me a luxury cashmere sweater gift</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-sm text-white/70">Summit Cashmere has exactly what you're looking for:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Classic Crew",   price: "$265", img: "https://www.alpsandmeters.com/cdn/shop/products/Cashmere_Alpine_Guide_Sweater_Camel.jpg?v=1753426053&width=200" },
                      { name: "Rib Turtleneck", price: "$295", img: "https://www.alpsandmeters.com/cdn/shop/products/Ski_Race_Knit_Sports_Club_Navy.jpg?v=1753426053&width=200" },
                      { name: "Cable Knit",     price: "$245", img: "https://www.alpsandmeters.com/cdn/shop/products/Classic_Cable_Knit_IVORY_Front.jpg?v=1753426168&width=200" },
                    ].map((p) => (
                      <div key={p.name} className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                        <div className="aspect-[3/4]"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /></div>
                        <div className="px-2 py-1.5">
                          <div className="text-[10px] font-medium text-white/70 truncate">{p.name}</div>
                          <div className="text-[10px] text-white/40">{p.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-400">
                    They also offer complimentary gift wrapping on all orders.
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-white/5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/30">This customer never visited summitcashmere.com</span>
            </div>
          </div>
        </section>

        {/* ── Real proof: Nobi's own agent ─────────────────────────────────── */}
        <section className="py-24 border-b border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Real example</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight">
                  This already happened to us
                </h2>
                <div className="space-y-4 text-lg text-slate-500 leading-relaxed">
                  <p>An AI agent called Nobi's own endpoint and asked whether we had automotive or dealership customers, and whether there was data on search performance.</p>
                  <p>Our Nobi agent answered with the Lucchese case study — $1M in incremental revenue, verified in an A/B test. A grounded, cited answer, returned automatically in seconds.</p>
                  <p>We didn't know the query was happening. We didn't set anything up for it. It just worked.</p>
                  <p className="font-medium text-slate-700">That's what this channel looks like in practice. And it's available to every Nobi customer right now.</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-slate-600">Recorded agent query · Nobi's own endpoint</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="rounded-xl bg-violet-50 border border-violet-100 px-4 py-3.5 space-y-2">
                    <div className="text-xs font-semibold text-violet-500 uppercase tracking-wider">Incoming query · via MCP</div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      "Does Nobi have any automotive or car dealership customers? Any data on search performance?"
                    </p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Nobi agent answered</div>
                      <span className="ml-auto text-xs font-medium text-emerald-600">Answered automatically</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      "Yes — Lucchese (Western boots, Shopify Plus) used Nobi for search and generated $1M+ in incremental revenue in year one, verified in an A/B test..."
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-slate-200 text-[9px] font-bold text-slate-600">1</span>
                      <span className="text-xs text-slate-400">nobi.ai/customers/lucchese</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 text-center">No one at Nobi was involved in this exchange.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
              Get in the channel before your competitors do
            </h2>
            <p className="text-lg text-slate-500">
              If you're already on Nobi, your agent endpoint is live. If you're not, now is the time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a href={getSignupUrl()} className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium bg-black text-white hover:opacity-90 h-12 px-6 text-base">
                Get started free
              </a>
              <button onClick={openDemoForm} className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium border border-black/10 bg-white h-12 px-6 text-base hover:border-black/30">
                Get a demo
              </button>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
