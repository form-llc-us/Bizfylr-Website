import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1160px"
      }
    },
    extend: {
      colors: {
        background: "#050E1D",
        surface: "#081428",
        panel: "#0C1C38",
        primary: "#1C6BFF",
        "primary-light": "#4D8FFF",
        emerald: "#00C48C",
        gold: "#F5A623",
        foreground: "#F0F4FF",
        muted: "#8FA3C0",
        border: "rgba(255,255,255,0.12)"
      },
      fontFamily: {
        heading: ["var(--font-sora)"],
        body: ["var(--font-nunito-sans)"]
      },
      boxShadow: {
        glow: "0 20px 60px rgba(0,0,0,0.4)",
        blue: "0 18px 50px rgba(28,107,255,0.22)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(143,163,192,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(143,163,192,0.08) 1px, transparent 1px)",
        noise:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0, transparent 28%), radial-gradient(circle at 80% 20%, rgba(28,107,255,0.08) 0, transparent 26%), radial-gradient(circle at 20% 80%, rgba(0,196,140,0.08) 0, transparent 24%)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        marquee: "marquee 36s linear infinite",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: [typography]
};

export default config;
