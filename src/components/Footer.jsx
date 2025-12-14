import React from "react";
import Logo from "./Logo";
import { ExternalLink } from "lucide-react";

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
          <a href="/" className="hover:opacity-80">
            Home
          </a>
          <a href="/faqs" className="hover:opacity-80">
            FAQs
          </a>
          <a href="https://docs.nobi.ai" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 flex items-center gap-1">
            Docs <ExternalLink className="w-4 h-4" />
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
