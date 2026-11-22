/**
 * Vendor prefixes only. Tailwind left on 14 Nov 2026 (styles are CSS Modules; the base reset
 * is app/reset.css).
 * @type {import('postcss-load-config').Config}
 */
const config = {
  plugins: {
    autoprefixer: {},
  },
};

export default config;
