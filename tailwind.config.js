const plugin = require("tailwindcss/plugin");

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderWidth: ['hover'],
      brightness: ['hover']
    },
  },
  plugins: [
    plugin(function({addUtilities}) {
      const newUtilities = {
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          "display": "none"
        }
      };

      addUtilities(newUtilities);
    })
  ],
}
