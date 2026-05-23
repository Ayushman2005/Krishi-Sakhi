export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', 
          dark: '#047857',    
          glow: 'rgba(16, 185, 129, 0.5)',
        },
        secondary: '#f59e0b', 
        accent: {
          DEFAULT: '#8b5cf6', 
          glow: 'rgba(139, 92, 246, 0.5)',
        },
        background: '#030712', 
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
