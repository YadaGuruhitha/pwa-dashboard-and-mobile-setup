/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f1f8e9',
          100: '#dcedc8',
          200: '#c5e1a5',
          300: '#aed581',
          400: '#9ccc65',
          500: '#8bc34a',
          600: '#689f38',
          700: '#4caf50',
          800: '#2e7d32',
          900: '#1b4d3e',
          950: '#0d281e',
        },
        earth: {
          light: '#fdfbf7',
          soil: '#6d4c41',
          sand: '#e0d5be',
          clay: '#b06d48',
          accent: '#c7823e',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Noto Sans Kannada', 'Noto Sans Devanagari', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
