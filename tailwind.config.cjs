/***** Tailwind CSS Configuration *****/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#2E7D32',
        background: '#F5F7FA',
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};
