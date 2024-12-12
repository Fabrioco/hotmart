/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Abril Fatface", "serif"],
        secondary: ["Taviraj", "serif"],
        tertiary: ["Alegreya Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
