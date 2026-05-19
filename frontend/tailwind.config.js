/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // emerald-500
          dark: '#047857',    // emerald-700
          glow: 'rgba(16, 185, 129, 0.5)',
        },
        secondary: '#f59e0b', // amber-500
        accent: {
          DEFAULT: '#8b5cf6', // violet-500
          glow: 'rgba(139, 92, 246, 0.5)',
        },
        background: '#030712', // gray-950 for deeper contrast
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
