import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0F6E56",
          dark: "#0b5240",
          light: "#12876a"
        }
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)'],
        mono: ['var(--font-dm-mono)'],
      }
    },
  },
  plugins: [],
};
export default config;
