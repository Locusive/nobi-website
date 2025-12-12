import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function PageLayout({ children, onDemoClick }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onDemoClick={onDemoClick} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
