// The homepage's panel colors, so feature pages reuse them instead of inventing new ones.
// bg is the panel color, glow the light layered over it, text the paragraph color and shadow the sample card's shadow.

export const PanelTheme = {
  Violet: {
    bg: "#4a2fb8",
    glow: "radial-gradient(70% 60% at 85% 15%, rgba(255,255,255,0.14), rgba(255,255,255,0) 70%), radial-gradient(60% 55% at 5% 95%, rgba(20,6,70,0.5), rgba(20,6,70,0) 70%)",
    text: "rgba(255,247,255,0.84)",
    shadow: "0 50px 100px -40px rgba(20,6,60,0.7)",
  },
  Navy: {
    bg: "#152a5c",
    glow: "radial-gradient(70% 60% at 12% 15%, rgba(150,190,255,0.22), rgba(150,190,255,0) 70%), radial-gradient(60% 55% at 92% 92%, rgba(8,16,44,0.55), rgba(8,16,44,0) 70%)",
    text: "rgba(238,244,255,0.84)",
    shadow: "0 50px 100px -40px rgba(6,12,38,0.85)",
  },
  Magenta: {
    bg: "#b81e6a",
    glow: "radial-gradient(70% 60% at 12% 18%, rgba(255,255,255,0.14), rgba(255,255,255,0) 70%), radial-gradient(60% 55% at 92% 92%, rgba(40,6,60,0.5), rgba(40,6,60,0) 70%)",
    text: "rgba(255,247,255,0.86)",
    shadow: "0 50px 100px -40px rgba(40,6,30,0.8)",
  },
  Amber: {
    bg: "#9a4a0c",
    glow: "radial-gradient(70% 60% at 88% 15%, rgba(255,214,150,0.24), rgba(255,214,150,0) 70%), radial-gradient(60% 55% at 6% 92%, rgba(60,20,4,0.55), rgba(60,20,4,0) 70%)",
    text: "rgba(255,248,240,0.86)",
    shadow: "0 50px 100px -40px rgba(50,18,2,0.8)",
  },
  Teal: {
    bg: "#0c4f46",
    glow: "radial-gradient(70% 60% at 88% 15%, rgba(120,255,220,0.22), rgba(120,255,220,0) 70%), radial-gradient(60% 55% at 6% 92%, rgba(6,40,34,0.55), rgba(6,40,34,0) 70%)",
    text: "rgba(240,255,250,0.84)",
    shadow: "0 50px 100px -45px rgba(4,30,26,0.75)",
  },
};
