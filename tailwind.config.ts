import {
  accent,
  accentForeground,
  background,
  border,
  card,
  cardForeground,
  destructive,
  destructiveForeground,
  foreground,
  input,
  muted,
  mutedForeground,
  popover,
  popoverForeground,
  primary,
  primaryForeground,
  ring,
  secondary,
  secondaryForeground,
} from "./src/themes";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: border,
        input: input,
        ring: ring,
        background: background,
        foreground: foreground,
        primary: {
          DEFAULT: primary,
          foreground: primaryForeground,
        },
        secondary: {
          DEFAULT: secondary,
          foreground: secondaryForeground,
        },
        destructive: {
          DEFAULT: destructive,
          foreground: destructiveForeground,
        },
        muted: {
          DEFAULT: muted,
          foreground: mutedForeground,
        },
        accent: {
          DEFAULT: accent,
          foreground: accentForeground,
        },
        popover: {
          DEFAULT: popover,
          foreground: popoverForeground,
        },
        card: {
          DEFAULT: card,
          foreground: cardForeground,
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
