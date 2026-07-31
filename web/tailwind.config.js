/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#11C5C9',
        'primary-dark': '#0EA8AC',
        'primary-light': '#E0FAFB',
        secondary: '#FF8A00',
        'secondary-dark': '#CC6E00',
        'app-bg': '#F5F7FF',
        card: '#FFFFFF',
        surface: '#EEF1FB',
        'app-border': '#E3E8F5',
        muted: '#97A8C4',
        'text-primary': '#1A1A2E',
        'text-secondary': '#5A6480',
        'text-muted': '#97A8C4',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
