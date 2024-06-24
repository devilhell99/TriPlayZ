/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#eae8d6',
        'primary-text': '#0871E1',
        'primary-500': '#eae8d680',
        secondary: '#fe63da',
        thirst: '#ff8ec9',
        four: '#1e1e1e',
        five: '#68624d',
        green: '#507F56',
        'green-300': '#81A593',
        warning: '#d2b669',
        violet: '#7D6E91',
        'violet-500': '#7d6e9180',
        gold: '#d2b66980',
        black: '#000000',
        gray: '#848484',
        'gray-500': '#4F4F4F',
      },
      spacing: {
        '70px': '70px',
        '120px': '120px',
      },
      margin: {
        '30px': '30px',
      },
      screens: {
        sm: '640px',
        // => @media (min-width: 640px) { ... }

        lg: '1024px',
        // => @media (min-width: 1024px) { ... }

        xl: '1360px',
        // => @media (min-width: 1360px) { ... }

        '2xl': '1660px',
        // => @media (min-width: 1660px) { ... }
      },
    },
  },
  plugins: [],
}
