import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "text-strong": "var(--text-strong)",
        "text-body": "var(--text-body)",
        "text-primary": "hsl(var(--foreground))",
        "text-secondary": "hsl(var(--foreground-secondary))",
        "text-muted": "hsl(var(--muted-foreground))",
        "bg-base": "hsl(var(--background))",
        "bg-soft": "hsl(var(--background-secondary))",
        "bg-paper": "hsl(var(--card))",
        "bg-primary": "hsl(var(--background))",
        "bg-secondary": "hsl(var(--secondary))",
        "border-subtle": "hsl(var(--border))",
        "accent-primary": "hsl(var(--accent-primary))",
        "accent-primary-hover": "hsl(var(--accent-primary-hover))",
        "accent-secondary": "hsl(var(--accent-secondary))",
        "accent-rule": "var(--accent-rule)",
        emphasis: "hsl(var(--emphasis))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        button: "6px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in": "slide-in 0.6s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "tech-pattern": "linear-gradient(45deg, transparent 30%, hsl(214 24% 87% / 0.4) 50%, transparent 70%)",
        "hero-whisper": "linear-gradient(120deg, rgba(58,110,165,0.08), rgba(184,155,122,0.06))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
