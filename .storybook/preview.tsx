import type { Preview } from "@storybook/react";
import React from "react";
import { Montserrat } from "next/font/google";
// Import the Tailwind-built global stylesheet so every `bg-sko-*` / `text-sko-*` /
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
      // DS tokens, so the canvas follows the theme/skin like the app does.
      default: "bg/page",
      values: [
        { name: "bg/page", value: "var(--color-bg-page)" },
        { name: "bg/subtle", value: "var(--color-bg-subtle)" },
        { name: "bg/primary-soft", value: "var(--color-bg-primary-soft)" },
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
