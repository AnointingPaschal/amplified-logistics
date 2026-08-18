/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          50:  '#e8eef7',
          100: '#c5d4e8',
          200: '#9eb6d6',
          300: '#7097c4',
          400: '#4a7ab2',
          500: '#2f619e',
          600: '#224b88',
          700: '#163770',
          800: '#0e2555',
          900: '#0A1628',
          950: '#060d17',
        },
      },
      screens: { xs: '375px' },
    },
  },
  plugins: [],
}
