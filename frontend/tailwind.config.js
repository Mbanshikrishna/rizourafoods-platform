/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: "#173D34",
          forest: "#0E2A24",
          gold: "#C9A55C",
          sand: "#F4E9D8",
          ivory: "#FFFDF8",
          clay: "#B98E55",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ['"Manrope"', "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(9, 33, 28, 0.28)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(201, 165, 92, 0.2), transparent 35%), radial-gradient(circle at right, rgba(244, 233, 216, 0.22), transparent 25%)",
      },
    },
  },
  plugins: [],
};
