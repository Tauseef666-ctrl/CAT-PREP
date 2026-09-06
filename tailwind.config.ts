import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          50: "#eef4ff",
          100: "#dce7fd",
          200: "#c0d5fc",
          300: "#94b9f9",
          400: "#6194f4",
          500: "#3d6fee",
          600: "#274ee3",
          700: "#1f3cd0",
          800: "#1f33a9",
          900: "#1f3085",
          950: "#172051",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
        glow: "0 0 0 1px rgba(61, 111, 238, 0.15), 0 8px 30px -10px rgba(61, 111, 238, 0.45)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.35s ease-out both",
        fadeIn: "fadeIn 0.3s ease-out both",
        slideIn: "slideIn 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;