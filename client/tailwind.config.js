/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at 50% 50%,rgba(243,115,33,.21836485) 0,rgba(245,246,246,.38559174) 35%,#f5f6f6 100%),radial-gradient(circle at 50% 50%,rgba(144,37,142,.12343312) 0,rgba(245,246,246,.38559174) 47%,#f5f6f6 100%)',
        'gradient-linear': 'linear-gradient(to left top, #1f1f1f, #2A2438)',
      },
    },
  },
  plugins: [],
}

