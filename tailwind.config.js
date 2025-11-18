/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
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

