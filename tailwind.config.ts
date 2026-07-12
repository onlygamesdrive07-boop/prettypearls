import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F7F4",
        charcoal: "#111111",
        beige: "#EDE6D9",
        pearl: "#F2EEE9",
        gold: {
          DEFAULT: "#C9A961",
          light: "#E4CE8E",
          dark: "#9C7E3F",
        },
        glass: "rgba(255,255,255,0.06)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E4CE8E 0%, #C9A961 45%, #9C7E3F 100%)",
        "charcoal-fade": "linear-gradient(180deg, #111111 0%, #1a1a1a 100%)",
      },
      boxShadow: {
        luxe: "0 30px 80px -20px rgba(0,0,0,0.25)",
        gold: "0 20px 60px -15px rgba(201,169,97,0.35)",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
