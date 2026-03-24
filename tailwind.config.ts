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
        avante: {
          primary: "#2c6eff",
          "primary-light": "#8abaff",
          "primary-hover": "#1a5ce6",
          dark: "#282e3f",
          bg: "#edf2f7",
          surface: "#ffffff",
          border: "#e4e8eb",
          "border-dark": "#d0d5dc",
          muted: "#95a7b5",
          body: "#313131",
        },
        meioo: {
          DEFAULT: "#282e3f",
          accent: "#2c6eff",
        },
        status: {
          success: "#22c55e",
          "success-bg": "#dcfce7",
          warning: "#f59e0b",
          "warning-bg": "#fef3c7",
          danger: "#ef4444",
          "danger-bg": "#fee2e2",
          info: "#3b82f6",
          "info-bg": "#dbeafe",
        },
      },
      fontFamily: {
        sans: ["Neue Haas Grotesk Display Pro", "Inter", "sans-serif"],
      },
      fontSize: {
        "2xs": ["10px", "14px"],
        xs: ["12px", "16px"],
        sm: ["13px", "18px"],
        base: ["14px", "20px"],
        md: ["16px", "22px"],
        lg: ["18px", "24px"],
        xl: ["20px", "28px"],
      },
      boxShadow: {
        panel: "0 4px 24px rgba(40,46,63,0.08)",
        card: "0 1px 4px rgba(40,46,63,0.06)",
        dropdown: "0 8px 32px rgba(40,46,63,0.12)",
      },
      borderRadius: {
        DEFAULT: "6px",
        lg: "10px",
        xl: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
