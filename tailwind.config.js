module.exports = {
  purge: {
    content: ['./src/**/*.{html,js,svelte,ts}']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  }
}
