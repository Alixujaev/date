import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Asos — sovuq, chuqur plum/slate. Pushti faqat urg'u sifatida.
        ink: {
          900: "#0b0713",
          800: "#130c1f",
          700: "#1c1430",
        },
        plum: {
          300: "#d7c4ff",
          400: "#b99dff",
          500: "#9b76f5",
          600: "#7c52d8",
        },
        blush: {
          300: "#ffc2da",
          400: "#ff96be",
          500: "#f86ea3",
          600: "#dc4a83",
        },
        ember: {
          400: "#ffcf9b",
          500: "#f7a96b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(248, 110, 163, 0.55)",
        card: "0 30px 80px -40px rgba(0, 0, 0, 0.9)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(6%, -8%, 0) scale(1.12)" },
          "66%": { transform: "translate3d(-7%, 5%, 0) scale(0.94)" },
        },
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
