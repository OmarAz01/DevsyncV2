/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E6F9AF",
        secondary: "#F4F4ED",
        background: "#121212",
      },
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
        Noto: ["Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
