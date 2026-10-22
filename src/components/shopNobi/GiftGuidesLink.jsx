import React from "react";
import { ChevronRight, Gift } from "lucide-react";

/**
 * A small centered badge at the top of /shop that leads shoppers to the gift guides, styled like the homepage's
 * conversion badge so it reads as part of the page.
 */
export default function GiftGuidesLink() {
  return (
    <nav aria-label="Shopping guides" className="flex justify-center px-4 pt-6">
      <a
        href="/gift-guides"
        className="inline-flex items-center gap-2 rounded-full border border-[rgba(109,59,255,0.2)] bg-white py-2 pl-3 pr-3.5 text-[13.5px] font-medium text-[#57536a] shadow-[0_10px_28px_-14px_rgba(76,40,130,0.45)] transition-colors hover:border-[#6d3bff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d3bff] dark:border-white/15 dark:bg-white/5 dark:text-white/75"
      >
        <Gift size={15} color="#6d3bff" strokeWidth={2.3} aria-hidden="true" />
        <span>
          Looking for a gift?{" "}
          <span className="bg-gradient-to-r from-[#6d3bff] to-[#d541b3] bg-clip-text font-semibold text-transparent">Explore our gift guides</span>
        </span>
        <ChevronRight size={15} className="text-[#a49dba]" strokeWidth={2.3} aria-hidden="true" />
      </a>
    </nav>
  );
}
