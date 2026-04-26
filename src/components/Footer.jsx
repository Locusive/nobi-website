import React from "react";
import Logo from "./Logo";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-12">
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
              <a href="/blog" className="hover:opacity-80">Thoughts</a>
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
  );
}
