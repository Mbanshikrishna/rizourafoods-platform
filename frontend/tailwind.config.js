/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: "#173D34",
          forest: "#0E2A24",
          dark: "#091A16",
          gold: "#C9A55C",
          "gold-light": "#D4B96E",
          sand: "#F4E9D8",
          ivory: "#FFFDF8",
          clay: "#B98E55",
          cream: "#F8F0E3",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ['"Manrope"', "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(9, 33, 28, 0.28)",
        "gold-glow": "0 8px 40px rgba(201, 165, 92, 0.2)",
        "card-hover": "0 24px 48px rgba(9, 33, 28, 0.18)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 20% 30%, rgba(201, 165, 92, 0.12), transparent 40%), radial-gradient(circle at 80% 20%, rgba(14, 42, 36, 0.08), transparent 35%)",
        "premium-gradient":
          "linear-gradient(135deg, #0E2A24 0%, #173D34 40%, #1e4a3f 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #B98E55 0%, #C9A55C 40%, #D4B96E 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
