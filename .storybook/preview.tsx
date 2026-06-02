import type { Preview } from "@storybook/react";
import React from "react";
import { Inter, Montserrat } from "next/font/google";
import "../tokens/colors.css";
import "../tokens/typography.css";
import "./storybook.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
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
      default: "lms-primary",
      values: [
        { name: "lms-primary", value: "#ffffff" },
        { name: "lms-secondary", value: "#f3f5fa" },
        { name: "lms-brand-section", value: "#ebf8ff" },
      ],
    },
    a11y: {
      // Surface violations in the a11y addon panel without failing the build.
      config: {},
    },
  },
  decorators: [
    (Story) => (
      <div className={`${inter.variable} ${montserrat.variable}`} style={{ fontFamily: "var(--lms-font-body)" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
