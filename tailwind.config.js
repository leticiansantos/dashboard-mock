/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7C3AED',
          'purple-light': '#8B5CF6',
          'purple-dark': '#5B21B6',
        },
      },
    },
  },
  plugins: [],
}
