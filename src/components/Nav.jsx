import React, { useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import { useDemoForm } from "../context/DemoFormContext";
import { trackDemoFormOpened, trackEvent } from "../utils/eventTracker";
import { getSignupUrl } from "../utils/signupUrl";
import { summarizeCurrentPageWithNobi } from "../utils/pageSummaryPrompt";
import { EVENTS } from "../constants/events";

// Flat, simple links (Shanif's direction — no dropdown)
const LINKS = [
  { label: "Search", href: "/why-nobi/better-search" },
  { label: "Support", href: "/why-nobi/automated-support" },
  { label: "Leads", href: "/lead-capture" },
  { label: "FAQs", href: "/faqs" },
  { label: "Pricing", href: "/pricing" },
];

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { onOpen } = useDemoForm();

  const handleSummarizePage = async () => {
    const result = await summarizeCurrentPageWithNobi();
    trackEvent(EVENTS.PAGE_SUMMARY_REQUESTED, {
      source: "navigation",
      path: window.location.pathname,
      method: result.method,
    });
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleDemoClick = () => {
    trackDemoFormOpened();
    onOpen();
  };

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold flex-1 justify-center">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">
            {l.label}
          </a>
        ))}

        <div className="w-px h-4 bg-black/15" />

        <button
          className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          onClick={handleSummarizePage}
        >
          <FileText className="w-4 h-4 text-fuchsia-500" />
          Summarize With Nobi
        </button>
      </nav>

      {/* Right side CTAs */}
      <div className="flex items-center gap-5 ml-auto">
        <button className="hidden md:block text-sm font-semibold hover:opacity-70 transition-opacity" onClick={handleDemoClick}>
          Book A Demo
        </button>
        <a href="https://dashboard.nobi.ai/login" className="hidden md:block text-sm font-semibold hover:opacity-70 transition-opacity">
          Log in
        </a>
        <a
          href={getSignupUrl()}
          className="hidden md:inline-flex items-center justify-center rounded-full font-semibold transition active:scale-[.98] bg-violet-600 text-white hover:bg-violet-700 h-9 px-4 text-sm"
        >
          Start Free
        </a>
        <button className="md:hidden p-2 hover:opacity-70" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile menu">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full mt-2 left-0 right-0 rounded-2xl border border-black/[0.06] bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)] overflow-hidden z-50">
          <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-1">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={closeMobileMenu} className="text-sm font-semibold hover:opacity-70 py-2">
                {l.label}
              </a>
            ))}
            <div className="pt-2 border-t border-black/10 flex flex-col gap-3 mt-2">
              <button
                className="flex items-center gap-1 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent"
                onClick={() => {
                  handleSummarizePage();
                  closeMobileMenu();
                }}
              >
                <FileText className="w-4 h-4 text-fuchsia-500" />
                Summarize With Nobi
              </button>
              <a href="https://dashboard.nobi.ai/login" onClick={closeMobileMenu} className="text-sm font-semibold hover:opacity-70 py-2">
                Log in
              </a>
              <a
                href={getSignupUrl()}
                onClick={closeMobileMenu}
                className="inline-flex items-center justify-center rounded-full font-semibold transition active:scale-[.98] bg-violet-600 text-white hover:bg-violet-700 h-10 px-5 text-base w-full"
              >
                Start Free
              </a>
              <button
                className="inline-flex items-center justify-center rounded-full font-semibold transition active:scale-[.98] border border-black/15 bg-white text-black hover:bg-black/5 h-10 px-5 text-base w-full"
                onClick={() => {
                  handleDemoClick();
                  closeMobileMenu();
                }}
              >
                Book A Demo
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
