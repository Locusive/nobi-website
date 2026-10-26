import React from "react";

/** Keeps company and privacy information reachable without interrupting shopping. */
export default function ShopNobiFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-black/60 dark:text-white/60">
      <nav aria-label="Shop Nobi information" className="flex flex-wrap justify-center gap-x-6 gap-y-3">
        <a href="/shop/mcp" className="underline-offset-4 hover:underline focus-visible:underline">Use Shop Nobi with AI agents</a>
        <a href="/about" className="underline-offset-4 hover:underline focus-visible:underline">About Us</a>
        <a href="/privacy" className="underline-offset-4 hover:underline focus-visible:underline">Privacy Policy</a>
      </nav>
    </footer>
  );
}
