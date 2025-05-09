module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}','./src/pages/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '450px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      colors: {
        // 여기에 brand 컬러 등 추가
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
