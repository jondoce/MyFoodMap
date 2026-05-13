import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FEF7EE",
          100: "#FDECD7",
          200: "#FAD5AE",
          300: "#F6B77A",
          400: "#F19044",
          500: "#EE7A24",
          600: "#DF601A",
          700: "#B94917",
          800: "#933B1B",
          900: "#773319",
        },
        olive: {
          50: "#F4F7F4",
          100: "#E5EBE3",
          200: "#CCD8C8",
          300: "#A4BDA0",
          400: "#7A9D74",
          500: "#5A8053",
          600: "#466741",
          700: "#395336",
          800: "#30442E",
          900: "#293927",
        },
        cream: {
          50: "#FDFCFA",
          100: "#FAF8F4",
          200: "#F5F0E8",
          300: "#EDE5D8",
          400: "#DDD2C0",
          500: "#C9BBAA",
        },
        bark: {
          50: "#FAF8F6",
          100: "#F0ECE8",
          200: "#DDD6CF",
          300: "#C4B9AE",
          400: "#A89A8D",
          500: "#8F7F71",
          600: "#7A6B5D",
          700: "#65584D",
          800: "#544A42",
          900: "#1C1917",
          950: "#0F0D0B",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        warm: "0 4px 20px -2px rgba(238, 122, 36, 0.15)",
        "warm-lg": "0 10px 40px -4px rgba(238, 122, 36, 0.2)",
        soft: "0 2px 16px -1px rgba(0, 0, 0, 0.06)",
        "soft-lg": "0 8px 32px -2px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
