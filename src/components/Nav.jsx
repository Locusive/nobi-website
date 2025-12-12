import React, { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import Button from "./Button";

const SHOW_PRICING = false;

export default function Nav({ onDemoClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "How Nobi Helps", href: "#use-cases" },
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    ...(SHOW_PRICING ? [{ label: "Pricing", href: "#pricing" }] : []),
    { label: "FAQ", href: "#faq" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Desktop nav (hidden on mobile) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:opacity-80"
          >
            {link.label}
          </a>
        ))}
        <a
          href="https://docs.nobi.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 flex items-center gap-1"
        >
          Docs
          <ExternalLink className="w-4 h-4" />
        </a>
      </nav>

      {/* Right side: Demo button (desktop only) + Mobile menu button */}
      <div className="flex items-center gap-3 ml-auto">
        <Button
          variant="outline"
          className="hidden md:flex bg-white text-black border-black hover:bg-black/5"
          onClick={onDemoClick}
        >
          Get a Demo
        </Button>

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
                className="text-sm font-semibold hover:opacity-80 py-2"
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://docs.nobi.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold hover:opacity-80 py-2 flex items-center gap-1"
              onClick={closeMobileMenu}
            >
              Docs
              <ExternalLink className="w-4 h-4" />
            </a>
            <div className="pt-2 border-t border-black/10 dark:border-white/10">
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black/5"
                onClick={() => {
                  onDemoClick();
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
