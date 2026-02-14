import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
    "./scripts/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        muted: "var(--muted)",
        status: {
          available: "var(--status-available)",
          occupied: "var(--status-occupied)",
          reserved: "var(--status-reserved)",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
