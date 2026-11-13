import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        card: "var(--sk-radius-card)",
        pill: "var(--sk-radius-pill)", // a comment, with "quotes" and { braces
      },
      transitionDuration: {
        DEFAULT: "var(--motion-x)",
        short2: "var(--motion-short2)",
      },
      colors: {
        sko: {
          "text-default": "var(--color-text-default)",
          "bg-page": "var(--color-bg-page)",
        },
      },
      fontSize: { big: ["20px", { lineHeight: "1" }] },
    },
  },
};
export default config;
