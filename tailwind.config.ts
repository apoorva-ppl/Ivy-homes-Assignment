import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF9F5",
        ink: "#161B18",
        ivy: {
          50: "#EEF3EE",
          100: "#D7E4DA",
          200: "#B0C9B6",
          300: "#84A990",
          400: "#5C8B6E",
          500: "#2F6B4F",
          600: "#255740",
          700: "#1D4633",
          800: "#163427",
          900: "#0F241B",
        },
        clay: "#B5563C",
        sand: "#E8E3D5",
        line: "#E1DED3",
        muted: "#6E7268",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,27,24,0.04), 0 4px 14px rgba(22,27,24,0.05)",
        lift: "0 8px 28px rgba(22,27,24,0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
