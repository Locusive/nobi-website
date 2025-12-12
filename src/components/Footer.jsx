import React from "react";
import Logo from "./Logo";

const SHOW_PRICING = false; // Feature flag from App.jsx

export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-12">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Logo />
        <div className="text-sm text-black/60 dark:text-white/60">
          © {new Date().getFullYear()} Nobi: a site assistant to help you grow
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="#features" className="hover:opacity-80">
            Features
          </a>
          <a href="#how" className="hover:opacity-80">
            How it Works
          </a>
          {SHOW_PRICING && (
            <a href="#pricing" className="hover:opacity-80">
              Pricing
            </a>
          )}
          <a href="#faq" className="hover:opacity-80">
            FAQ
          </a>
          <a href="/terms" className="hover:opacity-80">
            Terms
          </a>
          <a href="/privacy" className="hover:opacity-80">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
