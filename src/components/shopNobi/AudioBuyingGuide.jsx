import React from "react";

/** Offer a relevant decision path without treating headphones as a replacement for home audio equipment. */
export default function AudioBuyingGuide() {
  return (
    <aside className="mt-8 max-w-3xl rounded-lg border border-black/10 p-4 dark:border-white/20" aria-labelledby="audio-gift-guide-heading">
      <h2 id="audio-gift-guide-heading" className="text-lg font-semibold">Buying headphones as a gift?</h2>
      <p className="mt-2 text-black/70 dark:text-white/70">
        Check their listening routine, devices, preferred fit and return options before choosing.
        Our <a href="/blog/headphones-as-a-gift" className="underline hover:no-underline">headphone gift guide: four checks before you buy</a> can help you decide.
        For speakers, amplifiers or another part of a home system, keep comparing the components on this page.
      </p>
    </aside>
  );
}
