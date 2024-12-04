/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust according to your file structure
  ],
  theme: {
    extend: {
      screens: {
        'lg-custom': '1091px', // Custom breakpoint for 1091px
      },
    },
  },
  plugins: [],
}

