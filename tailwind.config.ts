import type { Config } from "tailwindcss";

/**
 * The `sk` color scale (SkillUp Design System — one namespace for all brands)
 * references the CSS custom properties defined in `tokens/colors.css`. Since v4
 * (2026-09-23) the canonical names are the element-first `--color-*` tokens under
 * the `sko` namespace (bg-sko-bg-page, text-sko-text-muted, border-sko-border-subtle).
 * Colour is never hardcoded as hex in components.
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
      boxShadow: {
        "sk-card": "var(--sk-shadow-card)",
      },
      colors: {
        /* ── v4 element-first tokens, exported from the DS on 2026-09-23 ─────────
           One flat namespace, the second word is the element:
             bg-sko-bg-page   text-sko-text-muted   text-sko-icon-muted
             border-sko-border-subtle   ring-sko-border-primary
           The v3.2 `sk` colour namespace was removed on 2026-09-23 once no
           component used it; the --sk-* CSS aliases in tokens/colors.css stay
           until engineering sets their retire date. Lint rejects new uses.     */
        sko: {
          "text-default": "var(--color-text-default)",
          "text-muted": "var(--color-text-muted)",
          "text-subtle": "var(--color-text-subtle)",
          "text-on-primary-soft": "var(--color-text-on-primary-soft)",
          "text-primary": "var(--color-text-primary)",
          "text-on-primary": "var(--color-text-on-primary)",
          "text-success": "var(--color-text-success)",
          "text-warning": "var(--color-text-warning)",
          "text-error": "var(--color-text-error)",
          "text-on-media": "var(--color-text-on-media)",
          "icon-faint": "var(--color-icon-faint)",
          "bg-page": "var(--color-bg-page)",
          "bg-subtle": "var(--color-bg-subtle)",
          "bg-faint": "var(--color-bg-faint)",
          "bg-muted": "var(--color-bg-muted)",
          "bg-primary-soft": "var(--color-bg-primary-soft)",
          "bg-primary": "var(--color-bg-primary)",
          "bg-warning-soft": "var(--color-bg-warning-soft)",
          "bg-success-soft": "var(--color-bg-success-soft)",
          "bg-error-soft": "var(--color-bg-error-soft)",
          "border-default": "var(--color-border-default)",
          "border-subtle": "var(--color-border-subtle)",
          "bg-primary-hover": "var(--color-bg-primary-hover)",
          "bg-info": "var(--color-bg-info)",
          "bg-error": "var(--color-bg-error)",
          "text-on-error": "var(--color-text-on-error)",
          "bg-overlay": "var(--color-bg-overlay)",
          "bg-overlay-soft": "var(--color-bg-overlay-soft)",
          "bg-success": "var(--color-bg-success)",
          "text-on-success": "var(--color-text-on-success)",
          "bg-warning": "var(--color-bg-warning)",
          "text-on-warning": "var(--color-text-on-warning)",
          "border-primary-muted": "var(--color-border-primary-muted)",
          "icon-success-strong": "var(--color-icon-success-strong)",
          "border-error-soft": "var(--color-border-error-soft)",
          "border-warning-soft": "var(--color-border-warning-soft)",
          "border-success-soft": "var(--color-border-success-soft)",
          "text-disabled": "var(--color-text-disabled)",
          "border-disabled": "var(--color-border-disabled)",
          "text-placeholder": "var(--color-text-placeholder)",
          "bg-strong": "var(--color-bg-strong)",
          "border-inverse": "var(--color-border-inverse)",
          "text-on-primary-hover": "var(--color-text-on-primary-hover)",
          "bg-fixed": "var(--color-bg-fixed)",
          "bg-fixed-subtle": "var(--color-bg-fixed-subtle)",
          "text-on-fixed": "var(--color-text-on-fixed)",
          "text-on-inverse": "var(--color-text-on-inverse)",
          "border-focus-gap": "var(--color-border-focus-gap)",
          "bg-inverse": "var(--color-bg-inverse)",
          "bg-on-media": "var(--color-bg-on-media)",
          "bg-on-media-soft": "var(--color-bg-on-media-soft)",
          "border-strong": "var(--color-border-strong)",
          "border-primary": "var(--color-border-primary)",
          "border-primary-soft": "var(--color-border-primary-soft)",
          "border-error": "var(--color-border-error)",
          "border-success": "var(--color-border-success)",
          "border-warning": "var(--color-border-warning)",
          "border-info": "var(--color-border-info)",
          "icon-default": "var(--color-icon-default)",
          "icon-muted": "var(--color-icon-muted)",
          "icon-subtle": "var(--color-icon-subtle)",
          "icon-primary": "var(--color-icon-primary)",
          "icon-on-primary": "var(--color-icon-on-primary)",
          "icon-on-media": "var(--color-icon-on-media)",
          "icon-on-fixed": "var(--color-icon-on-fixed)",
          "icon-error": "var(--color-icon-error)",
          "icon-success": "var(--color-icon-success)",
          "icon-on-success": "var(--color-icon-on-success)",
          "icon-warning": "var(--color-icon-warning)",
          "icon-info": "var(--color-icon-info)",
          "bg-accent-teal": "var(--color-bg-accent-teal)",
          "bg-accent-teal-soft": "var(--color-bg-accent-teal-soft)",
          "text-accent-teal": "var(--color-text-accent-teal)",
          "text-on-accent-teal": "var(--color-text-on-accent-teal)",
          "bg-accent-green": "var(--color-bg-accent-green)",
          "bg-accent-green-soft": "var(--color-bg-accent-green-soft)",
          "text-accent-green": "var(--color-text-accent-green)",
          "text-on-accent-green": "var(--color-text-on-accent-green)",
          "bg-accent-red": "var(--color-bg-accent-red)",
          "bg-accent-red-soft": "var(--color-bg-accent-red-soft)",
          "text-accent-red": "var(--color-text-accent-red)",
          "text-on-accent-red": "var(--color-text-on-accent-red)",
          "bg-accent-yellow": "var(--color-bg-accent-yellow)",
          "bg-accent-yellow-soft": "var(--color-bg-accent-yellow-soft)",
          "text-accent-yellow": "var(--color-text-accent-yellow)",
          "text-on-accent-yellow": "var(--color-text-on-accent-yellow)",
          "shadow-default": "var(--color-shadow-default)",
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
