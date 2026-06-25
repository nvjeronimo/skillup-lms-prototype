import type { Preview } from "@storybook/react";
import React from "react";
import { Montserrat } from "next/font/google";
// Import the Tailwind-built global stylesheet so every `bg-sk-*` / `text-sk-*` /
// layout utility is available in Storybook exactly as in the app. globals.css also
// @imports the color + typography token stylesheets.
import "../app/globals.css";
import "./storybook.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "sk-primary",
      values: [
        { name: "sk-primary", value: "#ffffff" },
        { name: "sk-secondary", value: "#f3f5fa" },
        { name: "sk-brand-section", value: "#ebf8ff" },
      ],
    },
    a11y: {
      // Surface violations in the a11y addon panel without failing the build.
      config: {},
    },
  },
  decorators: [
    (Story) => (
      <div className={montserrat.variable} style={{ fontFamily: "var(--sk-font-body)" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
