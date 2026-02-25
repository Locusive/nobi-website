import React, { useState } from "react";
import { Menu, X, ExternalLink, Sparkles } from "lucide-react";
import Button from "./Button";
import { useDemoForm } from "../context/DemoFormContext";
import { trackDemoFormOpened } from "../utils/eventTracker";
import { getSignupUrl } from "../utils/signupUrl";

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { onOpen } = useDemoForm();

  const handleAskNobi = () => {
    if (window.Nobi) {
      window.Nobi.openChat();
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: "Why Nobi", href: "/why-nobi/better-search" },
    { label: "FAQs", href: "/faqs" },
    { label: "Docs", href: "https://docs.nobi.ai", external: true },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleDemoClick = () => {
    trackDemoFormOpened();
    onOpen();
  };

  return (
    <>
      {/* Desktop nav (hidden on mobile) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold flex-1 justify-center">
        {navLinks.map((link) => {
          const className = "hover:opacity-80 flex items-center gap-1";
          return link.external ? (
            <a key={link.href} className={className} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <a key={link.href} className={className} href={link.href}>
              {link.label}
            </a>
          );
        })}
        {/* Divider */}
        <div className="w-px h-4 bg-black/20 dark:bg-white/20" />
        {/* Ask Nobi */}
        <button
          className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          onClick={handleAskNobi}
        >
          <Sparkles className="w-4 h-4 text-fuchsia-500" />
          Ask Nobi
        </button>
      </nav>

      {/* Right side: Demo link + Sign Up button (desktop only) + Mobile menu button */}
      <div className="flex items-center gap-8 ml-auto">
        <button
          className="hidden md:block text-sm font-semibold hover:opacity-80 transition-opacity"
          onClick={handleDemoClick}
        >
          Get a Demo
        </button>
        <a
          href="https://dashboard.nobi.ai/login"
          className="hidden md:block text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          Log in
        </a>
        <a
          href={getSignupUrl()}
          className="hidden md:inline-flex items-center justify-center gap-2 rounded-xl font-medium transition active:scale-[.98] bg-black text-white dark:bg-white dark:text-black hover:opacity-90 shadow-sm h-10 px-5 text-sm"
        >
          Sign Up Free
        </a>

        {/* Hamburger menu (visible on mobile) */}
        <button
          className="md:hidden p-2 hover:opacity-80"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu (drawer) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/10 dark:border-white/10 absolute top-16 left-0 right-0 bg-white dark:bg-black">
          <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold hover:opacity-80 py-2 flex items-center gap-1"
                onClick={closeMobileMenu}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.label}
                {link.external && <ExternalLink className="w-4 h-4" />}
              </a>
            ))}
            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-col gap-3">
              <button
                className="flex items-center gap-1 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent"
                onClick={() => {
                  handleAskNobi();
                  closeMobileMenu();
                }}
              >
                <Sparkles className="w-4 h-4 text-fuchsia-500" />
                Ask Nobi
              </button>
              <a
                href="https://dashboard.nobi.ai/login"
                onClick={closeMobileMenu}
                className="text-sm font-semibold hover:opacity-80 py-2"
              >
                Log in
              </a>
              <a
                href={getSignupUrl()}
                onClick={closeMobileMenu}
                className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] bg-black text-white hover:opacity-90 shadow-sm h-10 px-5 text-base w-full"
              >
                Sign Up Free
              </a>
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black/5"
                onClick={() => {
                  handleDemoClick();
                  closeMobileMenu();
                }}
              >
                Get a Demo
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
