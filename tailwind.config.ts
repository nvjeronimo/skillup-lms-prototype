import type { Config } from "tailwindcss";

/**
 * The `lms` color scale references the CSS custom properties defined in
 * `tokens/colors.css`. Tailwind utilities (bg-lms-*, text-lms-*, border-lms-*)
 * resolve to `var(--lms-*)` so color is never hardcoded as hex in components.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./stories/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lms: {
          bg: {
            primary: "var(--lms-bg-primary)",
            secondary: "var(--lms-bg-secondary)",
            "secondary-subtle": "var(--lms-bg-secondary-subtle)",
            tertiary: "var(--lms-bg-tertiary)",
            "brand-primary": "var(--lms-bg-brand-primary)",
            "brand-section": "var(--lms-bg-brand-section)",
            "brand-solid": "var(--lms-bg-brand-solid)",
            "brand-hover": "var(--lms-bg-brand-hover)",
            "success-primary": "var(--lms-bg-success-primary)",
            "warning-primary": "var(--lms-bg-warning-primary)",
            "error-primary": "var(--lms-bg-error-primary)",
          },
          border: {
            primary: "var(--lms-border-primary)",
            secondary: "var(--lms-border-secondary)",
            brand: "var(--lms-border-brand)",
          },
          fg: {
            white: "var(--lms-fg-white)",
            quaternary: "var(--lms-fg-quaternary)",
            brand: "var(--lms-fg-brand)",
            "brand-primary": "var(--lms-fg-brand-primary)",
            progress: "var(--lms-fg-progress)",
          },
          text: {
            primary: "var(--lms-text-primary)",
            secondary: "var(--lms-text-secondary)",
            tertiary: "var(--lms-text-tertiary)",
            "primary-on-brand": "var(--lms-text-primary-on-brand)",
            brand: "var(--lms-text-brand)",
            "brand-primary": "var(--lms-text-brand-primary)",
            "brand-secondary": "var(--lms-text-brand-secondary)",
            "success-primary": "var(--lms-text-success-primary)",
            "warning-primary": "var(--lms-text-warning-primary)",
            "error-primary": "var(--lms-text-error-primary)",
          },
        },
      },
      fontFamily: {
        body: "var(--lms-font-body)",
        display: "var(--lms-font-display)",
      },
      transitionDuration: {
        "200": "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
