import React from "react";
import Logo from "./Logo";
import { ArrowRight, CheckCircle2, ExternalLink, Search, ShoppingBag, Sparkles } from "lucide-react";
import { useDemoForm } from "../context/DemoFormContext";
import { trackDemoFormOpened } from "../utils/eventTracker";
import { getSignupUrl } from "../utils/signupUrl";

export default function Footer() {
  const { onOpen } = useDemoForm();

  const handleDemoClick = () => {
    trackDemoFormOpened();
    onOpen();
  };

  return (
    <>
      <section className="relative overflow-hidden border-t border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#fff7ff_42%,#f8fafc_100%)]">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" aria-hidden />
        <div className="mx-auto grid min-h-[690px] max-w-6xl place-items-center px-6 py-20 pb-0 sm:py-24 sm:pb-0">
          <div className="relative z-10 max-w-3xl pb-72 text-center sm:pb-80">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-fuchsia-600">
              Built for visitors who should have converted
            </div>
            <h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Stop making ready-to-buy visitors figure it out alone.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Nobi understands what visitors mean, surfaces the right products and answers, and captures high-intent leads when they're ready for help.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={getSignupUrl()}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-black px-6 text-base font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[.98] sm:w-auto"
              >
                Try Nobi free
                <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={handleDemoClick}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-base font-semibold text-slate-950 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[.98] sm:w-auto"
              >
                Get a demo
              </button>
            </div>
            <div className="mt-5 flex flex-col items-center justify-center gap-2 text-sm text-slate-500 sm:flex-row sm:gap-4">
              {["100 free messages monthly", "No credit card", "Go live when ready"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-fuchsia-500" />
                  {item}
                </span>
              ))}
            </div>

          </div>

          <div className="pointer-events-none absolute bottom-[-92px] left-1/2 w-[min(980px,calc(100%-2rem))] -translate-x-1/2">
            <div className="relative mx-auto">
              <div className="absolute -left-2 top-16 hidden w-56 rotate-[-5deg] rounded-2xl border border-rose-100 bg-white p-4 shadow-[0_18px_60px_-34px_rgba(15,23,42,0.45)] sm:block">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Search className="h-4 w-4 text-rose-500" />
                  Before Nobi
                </div>
                <p className="mt-3 text-sm font-medium text-slate-800">"dress for outdoor wedding"</p>
                <div className="mt-3 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600">
                  Old search: 0 useful results
                </div>
              </div>

              <div className="absolute -right-2 top-12 hidden w-56 rotate-[5deg] rounded-2xl border border-violet-100 bg-white p-4 shadow-[0_18px_60px_-34px_rgba(15,23,42,0.45)] sm:block">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  Visitor intent
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  Occasion, budget, fit, weather, and urgency.
                </p>
              </div>

              <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_26px_90px_-42px_rgba(15,23,42,0.65)]">
                <div className="overflow-hidden rounded-[1.45rem] border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-500 text-xs font-bold text-white">
                        N
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-950">Nobi</div>
                        <div className="text-[11px] text-slate-500">On-site assistant</div>
                      </div>
                    </div>
                    <div className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:block">
                      Answered from your site
                    </div>
                  </div>

                  <div className="grid gap-4 p-4 sm:grid-cols-[1fr,1.1fr]">
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-white p-3 text-sm leading-relaxed text-slate-700 shadow-sm">
                        I need a red dress for a beach wedding. I'm 5'5" and want something under $200.
                      </div>
                      <div className="rounded-2xl border border-fuchsia-100 bg-white p-3 text-sm leading-relaxed text-slate-700 shadow-sm">
                        I found warm-weather options under $200 and filtered out anything too formal or heavy.
                        <div className="mt-3 inline-flex rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700">
                          Sources: catalog + product pages
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { src: "/media/prod-1.webp", name: "Cherry wrap", price: "$118" },
                        { src: "/media/prod-2.webp", name: "Satin slip", price: "$168" },
                        { src: "/media/prod-3.webp", name: "Sequin mini", price: "$130" },
                      ].map((product, index) => (
                        <div
                          key={product.name}
                          className={[
                            "rounded-2xl border bg-white p-1.5 shadow-sm",
                            index === 0 ? "border-fuchsia-300" : "border-slate-200",
                          ].join(" ")}
                        >
                          <div className="aspect-[3/4] overflow-hidden rounded-xl bg-slate-100">
                            <img src={product.src} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
                          </div>
                          <div className="px-1.5 pb-1 pt-2">
                            <div className="truncate text-[11px] font-semibold text-slate-900">{product.name}</div>
                            <div className="text-[11px] text-slate-500">{product.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 translate-y-full items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.55)] sm:flex">
                <ShoppingBag className="h-4 w-4 text-fuchsia-500" />
                Search, support, product answers, and lead capture in one assistant
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-white py-12 dark:border-white/10 dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 grid gap-10 sm:grid-cols-[1fr,2fr] sm:items-start">
          <div className="space-y-4">
            <Logo />
            <div className="text-sm text-black/60 dark:text-white/60">
              © {new Date().getFullYear()} Nobi: a conversational site assistant to help you grow
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
            <div className="space-y-2">
              <div className="font-semibold text-black dark:text-white">Product</div>
              <div className="flex flex-col gap-2">
                <a href="/" className="hover:opacity-80">Home</a>
                <a href="/pricing" className="hover:opacity-80">Pricing</a>
                <a href="/faqs" className="hover:opacity-80">FAQs</a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-black dark:text-white">Capabilities</div>
              <div className="flex flex-col gap-2">
                <a href="/why-nobi/better-search" className="hover:opacity-80">Better search</a>
                <a href="/why-nobi/automated-support" className="hover:opacity-80">Automated support</a>
                <a href="/lead-capture" className="hover:opacity-80">Lead capture</a>
                <a href="/custom-actions" className="hover:opacity-80">Custom actions</a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-black dark:text-white">Resources</div>
              <div className="flex flex-col gap-2">
                <a href="/customers" className="hover:opacity-80">Case studies</a>
                <a href="/blog" className="hover:opacity-80">Blog</a>
                <a href="https://docs.nobi.ai" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 flex items-center gap-1">
                  Docs <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-black dark:text-white">Legal</div>
              <div className="flex flex-col gap-2">
                <a href="/terms" className="hover:opacity-80">Terms</a>
                <a href="/privacy" className="hover:opacity-80">Privacy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
