/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
    "./index.html", 
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        bg: '#FEFBF8',
        'btn-text': '#FEFBF8',
        comp: '#FFFFFF',
        primary: '#8C593D',
        text: '#56433C',
        content: '#595959',
        sub: '#939393',
        border: '#C7B39C',

        'dark-bg': '#121212',
        'dark-btn-text': '#F5F5F5',
        'dark-comp': '#2C2C2C',
        'dark-primary': '#8B522B',
        'dark-text': '#F5F5F5',
        'dark-content': '#D1D1D1',
        'dark-sub': '#AAAAAA',
        'dark-border': '#C7B39C',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
