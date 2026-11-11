/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        earth: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ebdccb',
          300: '#dec2a7',
          400: '#cda180',
          500: '#bc835f',
          600: '#a66b4d',
          700: '#87533f',
          800: '#6d4336',
          900: '#5a382e'
        }
      }
    },
  },
  plugins: [],
}

