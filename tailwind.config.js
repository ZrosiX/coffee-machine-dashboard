module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        secondary: '#2f3136',
        moredark: '#0F1012',
        background: '#202225',
        primary: '#5865F2',
        primarydark: '#4954CC'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
