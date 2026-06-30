import type { Config } from "tailwindcss";

/**
 * The `sk` color scale (SkillUp Design System — one namespace for all brands)
 * references the CSS custom properties defined in `tokens/colors.css`. Tailwind
 * utilities (bg-sk-*, text-sk-*, border-sk-*) resolve to `var(--sk-*)` so color
 * is never hardcoded as hex in components.
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
        sk: {
          bg: {
            primary: "var(--sk-bg-primary)",
            secondary: "var(--sk-bg-secondary)",
            "secondary-subtle": "var(--sk-bg-secondary-subtle)",
            tertiary: "var(--sk-bg-tertiary)",
            "brand-primary": "var(--sk-bg-brand-primary)",
            "brand-section": "var(--sk-bg-brand-section)",
            "brand-solid": "var(--sk-bg-brand-solid)",
            "brand-hover": "var(--sk-bg-brand-hover)",
            "brand-stage": "var(--sk-bg-brand-stage)",
            overlay: "var(--sk-bg-overlay)",
            "success-primary": "var(--sk-bg-success-primary)",
            "warning-primary": "var(--sk-bg-warning-primary)",
            "error-primary": "var(--sk-bg-error-primary)",
            "success-solid": "var(--sk-bg-success-solid)",
            "warning-solid": "var(--sk-bg-warning-solid)",
            "error-solid": "var(--sk-bg-error-solid)",
          },
          border: {
            primary: "var(--sk-border-primary)",
            secondary: "var(--sk-border-secondary)",
            brand: "var(--sk-border-brand)",
          },
          fg: {
            white: "var(--sk-fg-white)",
            quaternary: "var(--sk-fg-quaternary)",
            brand: "var(--sk-fg-brand)",
            "brand-primary": "var(--sk-fg-brand-primary)",
            progress: "var(--sk-fg-progress)",
            like: "var(--sk-fg-like)",
          },
          text: {
            primary: "var(--sk-text-primary)",
            secondary: "var(--sk-text-secondary)",
            tertiary: "var(--sk-text-tertiary)",
            "primary-on-brand": "var(--sk-text-primary-on-brand)",
            brand: "var(--sk-text-brand)",
            "brand-primary": "var(--sk-text-brand-primary)",
            "brand-secondary": "var(--sk-text-brand-secondary)",
            "success-primary": "var(--sk-text-success-primary)",
            "warning-primary": "var(--sk-text-warning-primary)",
            "error-primary": "var(--sk-text-error-primary)",
          },
        },
      },
      fontFamily: {
        body: "var(--sk-font-body)",
        display: "var(--sk-font-display)",
      },
      transitionDuration: {
        "200": "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
