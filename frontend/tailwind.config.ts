import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: {
          50: "#F8FCFF",
          100: "#F3F9FF",
          200: "#EEF7FF",
          300: "#D9EEFF",
          400: "#E5F4FF",
          500: "#74C0FC",
          600: "#68B8F7",
          700: "#4FA9EE",
        },
        cirra: {
          ink: "#16324F",
          muted: "#536A7D",
          soft: "#8092A2",
          sun: "#FFD98A",
          sunSoft: "#FFE5AD",
        },
      },
      boxShadow: {
        glass: "0 12px 40px rgba(70, 130, 180, 0.10)",
        soft: "0 10px 30px rgba(70, 130, 180, 0.08)",
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -14px, 0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-60%)" },
          "100%": { transform: "translateX(160%)" },
        },
      },
      animation: {
        float: "float 24s ease-in-out infinite",
        shimmer: "shimmer 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;