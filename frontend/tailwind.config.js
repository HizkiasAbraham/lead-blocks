/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#384571',
        accent: '#dc3144',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
      },
    },
  },
  plugins: [],
}

