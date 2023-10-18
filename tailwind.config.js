/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#F5F6F8',
      }
    },
  },
  corePlugins: {
    // preflight: false,
  },
  plugins: [],
}

