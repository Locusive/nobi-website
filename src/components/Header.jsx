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
    // Floating pill island over the hero (Shanif's design); total height 68px = mt-3 + h-14
    <header className="sticky top-0 z-40 px-3 sm:px-4">
      <div
        className={[
          "mx-auto flex items-center gap-5 relative max-w-5xl mt-3 h-14 px-4 sm:px-6",
          "rounded-full border border-black/[0.05] bg-white/95 backdrop-blur-xl",
          "transition-shadow duration-300",
          scrolled
            ? "shadow-[0_16px_40px_-14px_rgba(0,0,0,0.28)]"
            : "shadow-[0_12px_36px_-16px_rgba(30,20,90,0.35)]",
        ].join(" ")}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 shrink-0">
          <Logo className="h-8" />
        </a>

        {/* Navigation */}
        <Nav />
      </div>
    </header>
  );
}
