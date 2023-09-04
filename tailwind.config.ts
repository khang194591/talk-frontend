import type { Config } from "tailwindcss";
import { colorPrimary, background } from "./src/themes";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colorPrimary,
        background,
      },
    },
  },
  plugins: [],
} satisfies Config;
