/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Gupta: "'Gupter', serif",
        teko: '"Teko", sans-serif',
        roboto:'"Roboto", sans-serif'
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

