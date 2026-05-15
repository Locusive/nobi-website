import React from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import { Bot, Globe, MessageSquare, Code2, ArrowRight, Sparkles } from "lucide-react";

export default function AgentEndpoint() {
  const { onOpen: openDemoForm } = useDemoForm();

  useSEO({
    title: "Nobi as an MCP Server - Your Business, Discoverable by AI Agents | Nobi",
    description: "Every Nobi assistant is also an MCP endpoint. AI agents can discover and query your business automatically - no extra setup required.",
    path: "/why-nobi/ai-agents",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nobi MCP Agent Endpoint",
      "description": "Every Nobi assistant doubles as an MCP endpoint, making your business discoverable and queryable by AI agents automatically.",
      "brand": { "@type": "Brand", "name": "Nobi" },
      "url": "https://nobi.ai/why-nobi/agent-endpoint",
    },
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen">

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -left-32 -top-24 w-80 h-80 bg-violet-200/50 blur-3xl" aria-hidden />
          <div className="absolute right-[-120px] top-16 w-96 h-96 bg-indigo-200/50 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 pb-14 pt-16 sm:pt-20 lg:pt-24">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="space-y-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-violet-600 uppercase">
                  A new channel for your business
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  AI agents can now find and talk to your business
                </h1>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                  Your Nobi assistant is already an MCP endpoint. AI agents - Claude, ChatGPT, Gemini, and any MCP-compatible agent - can discover your business and get answers from it, automatically. No extra setup.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={getSignupUrl()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-black text-white hover:opacity-90 shadow-sm h-12 px-6 text-base w-full sm:w-auto"
                  >
                    Get started free
                  </a>
                  <button
                    onClick={openDemoForm}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-black/10 bg-white/70 h-12 px-6 text-base w-full sm:w-auto hover:border-black/30"
                  >
                    Get a demo
                  </button>
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-violet-200/70 via-white to-indigo-200/70 rounded-[34px] blur-3xl opacity-90" aria-hidden />
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-[0_28px_80px_-30px_rgba(15,23,42,0.45)]">

                  <div className="grid grid-cols-2 divide-x divide-slate-100">

                    {/* Left: the customer's AI */}
                    <div className="p-5 space-y-3">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Their AI</div>
                      <div className="flex justify-end">
                        <div className="bg-slate-100 rounded-2xl rounded-br-sm px-3 py-2 text-xs text-slate-700">
                          Find me a cashmere sweater gift
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <div className="space-y-2 flex-1 min-w-0">
                          <p className="text-xs text-slate-600 leading-relaxed">Summit Cashmere has a great selection:</p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { name: "Classic Crew",   img: "https://www.alpsandmeters.com/cdn/shop/products/Cashmere_Alpine_Guide_Sweater_Camel.jpg?v=1753426053&width=200" },
                              { name: "Turtleneck",     img: "https://www.alpsandmeters.com/cdn/shop/products/Ski_Race_Knit_Sports_Club_Navy.jpg?v=1753426053&width=200" },
                              { name: "Cable Knit",     img: "https://www.alpsandmeters.com/cdn/shop/products/Classic_Cable_Knit_IVORY_Front.jpg?v=1753426168&width=200" },
                            ].map((p) => (
                              <div key={p.name} className="rounded-lg overflow-hidden border border-slate-100 bg-white shadow-sm">
                                <div className="aspect-[3/4]"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /></div>
                                <div className="px-1.5 py-1"><div className="text-[9px] font-medium text-slate-600 truncate">{p.name}</div></div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500">They also gift wrap — complimentary.</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: the store's end */}
                    <div className="p-5 bg-violet-50/40 space-y-3">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">Your store · Nobi agent</div>
                      <div className="space-y-2">
                        <div className="rounded-xl bg-white border border-violet-100 px-3 py-2.5 shadow-sm">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold text-slate-700">Query answered automatically</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">"Find me a cashmere sweater gift"</p>
                        </div>
                        <div className="rounded-xl bg-white border border-violet-100 px-3 py-2.5 shadow-sm">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold text-slate-700">3 products surfaced</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">No website visit · no human in the loop</p>
                        </div>
                        <div className="rounded-xl bg-white border border-violet-100 px-3 py-2.5 shadow-sm">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold text-slate-700">Gift wrap confirmed</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">Follow-up handled in the same session</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-center">
                    <span className="text-xs text-slate-400">Connected through your Nobi agent endpoint · no setup required</span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What it means */}
        <section className="border-t border-slate-200/70 bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-violet-600 font-semibold">Why this matters</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                AI agents are becoming how people discover businesses
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                When someone asks Claude to find the best AI search tool for their ecommerce store, Claude visits websites, reads llms.txt files, and calls MCP endpoints to get answers. Businesses with a discoverable agent endpoint get found. Businesses without one don't.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  Icon: Globe,
                  title: "Automatic discovery",
                  body: "Nobi registers your assistant in your site's llms.txt file. Any AI agent that does MCP discovery finds your business and knows how to talk to it.",
                  color: "text-violet-600 bg-violet-50 border-violet-200",
                },
                {
                  Icon: MessageSquare,
                  title: "Grounded, cited answers",
                  body: "When an agent asks a question about your products, policies, or pricing, Nobi answers from your connected knowledge base - the same way it answers human visitors.",
                  color: "text-indigo-600 bg-indigo-50 border-indigo-200",
                },
                {
                  Icon: Code2,
                  title: "No extra setup",
                  body: "Every Nobi assistant is already an MCP endpoint. If you're live on Nobi, you're already discoverable. Nothing to configure, nothing to deploy separately.",
                  color: "text-blue-600 bg-blue-50 border-blue-200",
                },
              ].map(({ Icon, title, body, color }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_-26px_rgba(15,23,42,0.25)] space-y-4">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-20 text-white">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-violet-300 font-semibold">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                The same assistant, now reachable by agents
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Agent discovers your business",
                  body: "The AI agent reads your site's llms.txt file or finds your MCP endpoint through its discovery process. It learns that your Nobi assistant is available.",
                },
                {
                  step: "02",
                  title: "Agent calls the MCP endpoint",
                  body: "The agent sends a question to your Nobi assistant - about your products, pricing, policies, or any topic your knowledge base covers.",
                },
                {
                  step: "03",
                  title: "Nobi answers with citations",
                  body: "Nobi responds with a grounded answer pulled from your connected sources, with citations back to the specific documents it used.",
                },
              ].map(({ step, title, body }) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
                  <div className="text-2xl font-bold text-violet-400">{step}</div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3 max-w-2xl mx-auto text-center">
              <p className="text-sm text-slate-300">Your MCP endpoint is already live at:</p>
              <div className="rounded-lg bg-slate-900 border border-white/10 px-4 py-3 font-mono text-sm text-violet-300 break-all">
                https://api.nobi.ai/mcp/{"<your-merchant-id>"}/rpc
              </div>
              <p className="text-xs text-slate-400">Listed in your site's llms.txt automatically</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-20">
          <div className="mx-auto max-w-5xl px-6 text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
              Be findable before your competitors are
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto">
              Get started with Nobi and your business is immediately reachable by human visitors and AI agents alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={getSignupUrl()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-black text-white hover:opacity-90 shadow-sm h-12 px-6 text-base"
              >
                Get started free
              </a>
              <button
                onClick={openDemoForm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-black/10 bg-white/70 h-12 px-6 text-base hover:border-black/30"
              >
                Get a demo
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
