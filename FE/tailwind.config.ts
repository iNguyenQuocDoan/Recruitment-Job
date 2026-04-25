import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1216px",
      "2xl": "1216px",
    },
    extend: {
      colors: {
        primary: {
          50: "#EEF1FF",
          100: "#D9E0FF",
          200: "#B3C0FF",
          300: "#8095FF",
          400: "#4D6BFF",
          500: "#1A41FF",
          600: "#0026E6",
          700: "#0020B8",
          800: "#000071",
          900: "#000056",
          950: "#00003E",
        },
        accent: {
          50: "#E6F4FF",
          100: "#CCE9FF",
          200: "#99D3FF",
          300: "#66BCFF",
          400: "#33A6FF",
          500: "#0088FF",
          600: "#006FD1",
          700: "#0057A3",
          800: "#003D75",
          900: "#002347",
        },
        neutral: {
          0: "#FFFFFF",
          50: "#FAFAFA",
          100: "#F4F5F7",
          200: "#E4E7EB",
          300: "#CBD2D9",
          400: "#9AA5B1",
          500: "#7B8794",
          600: "#52606D",
          700: "#3E4C59",
          800: "#1F2933",
          900: "#121212",
        },
        success: {
          500: "#10B981",
          600: "#059669",
        },
        warning: {
          500: "#F59E0B",
        },
        danger: {
          500: "#EF4444",
          600: "#DC2626",
        },
      },
      fontFamily: {
        sans: ['"Lexend"', "sans-serif"],
      },
      fontSize: {
        "display-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-lg": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "heading-md": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "heading-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px" }],
        "body-md": ["16px", { lineHeight: "24px" }],
        "body-sm": ["14px", { lineHeight: "20px" }],
        caption: ["12px", { lineHeight: "16px" }],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(18, 18, 18, 0.05), 0 1px 2px 0 rgba(18, 18, 18, 0.04)",
        "card-hover": "0 8px 24px 0 rgba(0, 0, 113, 0.10), 0 2px 6px 0 rgba(18, 18, 18, 0.05)",
        "card-floating": "0 12px 32px 0 rgba(0, 0, 113, 0.12)",
        focus: "0 0 0 4px rgba(0, 136, 255, 0.20)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
