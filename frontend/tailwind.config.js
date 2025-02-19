/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sanskrit: ["Noto Serif", "serif"],
      },
      colors: {
        saffron: "#FF9933",
        gold: "#FFD700",
        deepred: "#8B0000",
        cream: "#FAF3E0",
      },
    },
  },
  plugins: [],
}