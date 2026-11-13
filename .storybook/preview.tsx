import type { Preview } from "@storybook/react-vite";
import React from "react";
import { MemoryRouter } from "react-router";
// Import the Tailwind-built global stylesheet so every `bg-sko-*` / `text-sko-*` /
// layout utility is available in Storybook exactly as in the app. globals.css also
// @imports the color + typography token stylesheets.
import "../app/globals.css";
import "./storybook.css";

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
    // Components link and navigate through React Router (lib/router): a memory router stands in
    // for the app's browser router in every story.
    (Story) => (
      <MemoryRouter>
        <div style={{ fontFamily: "var(--sk-font-body)" }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default preview;
