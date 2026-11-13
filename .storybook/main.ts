import type { StorybookConfig } from "@storybook/react-vite";

// Storybook 10 on Vite, the same framework the development team's Storybook runs on
// (@storybook/react-vite). Essentials and interactions are built into Storybook since 9.
const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)", "../components/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  staticDirs: ["../public"],
};

export default config;
