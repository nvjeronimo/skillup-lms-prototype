import type { Preview } from "@storybook/react-vite";
import React from "react";
import { MemoryRouter } from "react-router";
// The global stylesheet (tokens, the base reset, the sk-* helpers), as in the app; each
// component brings its own CSS Module.
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
