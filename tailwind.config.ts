import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Next.js App Router (Revisa todas las carpetas que contienen código)
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;