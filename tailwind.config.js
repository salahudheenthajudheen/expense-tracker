/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media', // Use system preference
  theme: {
    extend: {
      colors: {
        'et-background': '#f8fafc',
        'et-card': '#ffffff',
        'et-muted': '#e2e8f0',
        'et-primary': '#4f46e5',
      },
    },
  },
  plugins: [],
}

