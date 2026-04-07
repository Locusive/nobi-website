import React from "react";
import nobiLogo from "../assets/nobi-logo.webp";
import nobiLogo2x from "../assets/nobi-logo@2x.webp";

export default function Logo({ className = "h-8 md:h-9 lg:h-10" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={nobiLogo}
        srcSet={`${nobiLogo} 1x, ${nobiLogo2x} 2x`}
        alt="Nobi"
        className="h-full w-auto"
      />
    </div>
  );
}
