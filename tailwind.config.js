/**
 * Tailwind 3 build config for dericBI.
 * Rebuild the stylesheet after adding or changing any Tailwind classes:
 *   npm run build:css
 * Output: assets/css/tailwind.css (commit it - the site and the GitHub Pages copy both serve it).
 */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js', './journey-data.json'],
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};
