import type { Config } from "tailwindcss";
import { colorPrimary } from "./src/themes";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colorPrimary,
      },
    },
  },
  plugins: [],
} satisfies Config;
