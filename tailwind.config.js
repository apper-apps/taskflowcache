/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
extend: {
      colors: {
        primary: "var(--accent-primary)",
        secondary: "var(--accent-secondary)",
        accent: "#10B981",
        surface: "var(--bg-secondary)",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
        'bg-primary': "var(--bg-primary)",
        'bg-secondary': "var(--bg-secondary)",
        'text-primary': "var(--text-primary)",
        'text-secondary': "var(--text-secondary)",
        'border-color': "var(--border-color)",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        "scale-up": "scale-up 0.2s ease-out",
        "fade-out": "fade-out 0.3s ease-in-out forwards",
        "slide-in": "slide-in 0.2s ease-out",
      },
      keyframes: {
        "scale-up": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.05)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
        "slide-in": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};