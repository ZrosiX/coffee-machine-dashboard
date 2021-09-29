module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        secondary: '#2f3136',
        background: '#202225',
        primary: '#5865F2'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
