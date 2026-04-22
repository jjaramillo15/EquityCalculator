import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        felt: {
          950: "#07140f",
          900: "#0c2017",
          800: "#133224",
        },
        brass: {
          300: "#d4b06a",
          400: "#c69845",
        },
      },
      boxShadow: {
        table: "0 30px 80px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
