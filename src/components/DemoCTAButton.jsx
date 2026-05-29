import React from "react";

export default function DemoCTAButton({ children = "Get started free", className = "", ...props }) {
  return (
    <a
      href="https://dashboard.nobi.ai"
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[.98] bg-black text-white hover:opacity-90 shadow-sm h-12 px-6 text-base w-full sm:w-auto ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
