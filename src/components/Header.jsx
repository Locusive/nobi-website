import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import Nav from "./Nav";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 32);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-4">
      <div
        className={[
          "mx-auto flex items-center gap-4 relative",
          "transition-all duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]",
          scrolled
            ? "max-w-6xl mt-3 h-14 px-4 sm:px-5 rounded-2xl border border-black/[0.06] bg-white/85 backdrop-blur-xl shadow-[0_16px_40px_-16px_rgba(0,0,0,0.22)]"
            : "max-w-7xl mt-0 h-16 px-4 sm:px-6 rounded-2xl border border-transparent bg-transparent shadow-none",
        ].join(" ")}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 shrink-0">
          <Logo
            className={`transition-all duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${
              scrolled ? "h-8 md:h-10" : "h-10 md:h-12 lg:h-14"
            }`}
          />
        </a>

        {/* Navigation */}
        <Nav />
      </div>
    </header>
  );
}
