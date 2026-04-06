import React, { useState } from "react";
import { BookOpen, ChevronDown, Menu, Search as SearchIcon, UserPlus, X, ExternalLink, Sparkles, Zap } from "lucide-react";
import { useDemoForm } from "../context/DemoFormContext";
import { trackDemoFormOpened } from "../utils/eventTracker";
import { getSignupUrl } from "../utils/signupUrl";

const FEATURES = [
  { label: "Search",            href: "/why-nobi/better-search", desc: "Semantic search that understands natural language",  Icon: SearchIcon },
  { label: "Lead capture",      href: "/lead-capture",           desc: "Collect contact info through conversation",          Icon: UserPlus },
  { label: "Custom actions",    href: "/custom-actions",         desc: "Trigger any workflow from inside the chat",          Icon: Zap },
  { label: "Accurate answers",  href: "/knowledge-base",         desc: "Answers from your docs, cited and verified",         Icon: BookOpen },
];

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const { onOpen } = useDemoForm();

  const handleAskNobi = () => {
    if (window.Nobi) window.Nobi.openChat();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileFeaturesOpen(false);
  };

  const handleDemoClick = () => {
    trackDemoFormOpened();
    onOpen();
  };

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold flex-1 justify-center">

        {/* Features dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 hover:opacity-80 transition-opacity py-1">
            Why Nobi
            <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-transform group-hover:rotate-180" />
          </button>
          {/* Dropdown panel — pt-2 outer wrapper bridges the hover gap so mouse can reach the panel */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
            <div className="w-96 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl shadow-black/10 py-2">
              {FEATURES.map((f) => (
                <a
                  key={f.href}
                  href={f.href}
                  className="flex items-start gap-3 px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl mx-1 transition-colors"
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 shrink-0">
                    <f.Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="block font-semibold text-sm">{f.label}</span>
                    <span className="block text-xs text-black/50 dark:text-white/50 mt-0.5">{f.desc}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <a href="/pricing" className="hover:opacity-80">Pricing</a>
        <a href="/faqs" className="hover:opacity-80">FAQs</a>
        <a href="https://docs.nobi.ai" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 flex items-center gap-1">
          Docs <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="w-px h-4 bg-black/20 dark:bg-white/20" />

        <button
          className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          onClick={handleAskNobi}
        >
          <Sparkles className="w-4 h-4 text-fuchsia-500" />
          Ask Nobi
        </button>
      </nav>

      {/* Right side CTAs */}
      <div className="flex items-center gap-8 ml-auto">
        <button className="hidden md:block text-sm font-semibold hover:opacity-80 transition-opacity" onClick={handleDemoClick}>
          Get a Demo
        </button>
        <a href="https://dashboard.nobi.ai/login" className="hidden md:block text-sm font-semibold hover:opacity-80 transition-opacity">
          Log in
        </a>
        <a href={getSignupUrl()} className="hidden md:inline-flex items-center justify-center gap-2 rounded-xl font-medium transition active:scale-[.98] bg-black text-white dark:bg-white dark:text-black hover:opacity-90 shadow-sm h-10 px-5 text-sm">
          Sign Up Free
        </a>
        <button className="md:hidden p-2 hover:opacity-80" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile menu">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/10 dark:border-white/10 absolute top-16 left-0 right-0 bg-white dark:bg-black z-50">
          <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-1">
            {/* Features expandable */}
            <button
              className="text-sm font-semibold hover:opacity-80 py-2 flex items-center justify-between w-full"
              onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
            >
              Why Nobi
              <ChevronDown className={`w-4 h-4 opacity-60 transition-transform ${mobileFeaturesOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileFeaturesOpen && (
              <div className="pl-3 flex flex-col gap-1 mb-1">
                {FEATURES.map((f) => (
                  <a key={f.href} href={f.href} onClick={closeMobileMenu} className="text-sm font-medium text-black/70 dark:text-white/70 hover:opacity-80 py-1.5">
                    {f.label}
                  </a>
                ))}
              </div>
            )}
            <a href="/pricing" onClick={closeMobileMenu} className="text-sm font-semibold hover:opacity-80 py-2">Pricing</a>
            <a href="/faqs" onClick={closeMobileMenu} className="text-sm font-semibold hover:opacity-80 py-2">FAQs</a>
            <a href="https://docs.nobi.ai" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="text-sm font-semibold hover:opacity-80 py-2 flex items-center gap-1">
              Docs <ExternalLink className="w-4 h-4" />
            </a>
            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-col gap-3 mt-2">
              <button className="flex items-center gap-1 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent" onClick={() => { handleAskNobi(); closeMobileMenu(); }}>
                <Sparkles className="w-4 h-4 text-fuchsia-500" />
                Ask Nobi
              </button>
              <a href="https://dashboard.nobi.ai/login" onClick={closeMobileMenu} className="text-sm font-semibold hover:opacity-80 py-2">Log in</a>
              <a href={getSignupUrl()} onClick={closeMobileMenu} className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] bg-black text-white hover:opacity-90 shadow-sm h-10 px-5 text-base w-full">
                Sign Up Free
              </a>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] bg-white text-black border border-black hover:bg-black/5 shadow-sm h-10 px-5 text-base w-full" onClick={() => { handleDemoClick(); closeMobileMenu(); }}>
                Get a Demo
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
