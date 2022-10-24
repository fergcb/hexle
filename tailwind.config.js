/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fira Code', ...defaultTheme.fontFamily.mono]
      },
      colors: {
        ...Object.fromEntries(
          Array.from(Array(20).keys())
            .map(n => (n + 1) * 5)
            .map(n => [`tint/${n}`, `var(--tint-${n.toString().padStart(2, '0')})`]),
        ),
        ...defaultTheme.colors
      },
      screens: {
        'hover-supported': {'raw': '(hover: hover)'},
      }
    },
  },
  plugins: [],
}
