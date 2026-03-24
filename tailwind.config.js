/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",
        secondary: "#E3F2FD",
        tertiary: "#E8F5E9",
        neutral: "#37474F"
      }
    }
  },
  plugins: []
};

