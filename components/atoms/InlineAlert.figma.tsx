import figma from "figma";
import { InlineAlert } from "./InlineAlert";

/**
 * Code Connect for Alert (SKO Design System, base component) → InlineAlert.tsx.
 * https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=1130-81134
 *
 * NOTE: authored by hand — see Button.figma.tsx for why.
 *
 * Do NOT confuse with "LMS / Autosave Status" (renamed from "LMS / Inline
 * Alert" during this audit to remove a naming collision) — that component
 * is the Notes-editor "Saving…/Saved" pill, unrelated to this generic
 * dismissible banner.
 */
figma.connect(InlineAlert, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=1130-81134", {
  props: {
    tone: figma.enum("Color", {
      Brand: "info",
      Success: "success",
      Warning: "warning",
      Error: "error",
    }),
    title: figma.textContent("Text"),
    description: figma.textContent("Supporting text"),
  },
  example: ({ tone, title, description }) => (
    <InlineAlert tone={tone} title={title} description={description} />
  ),
});
