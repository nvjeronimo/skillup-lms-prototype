import figma from "figma";
import { InlineAlert } from "./InlineAlert";

/**
 * Code Connect for `LMS / Inline Alert` (SKO Design System) → InlineAlert.tsx.
 * https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=20328-3296
 *
 * NOTE: authored by hand — see Button.figma.tsx for why.
 *
 * Tones as of 23 Sep 2026: Info, Success, Warning, Error, Hint, Answer (fill bg/faint with a
 * 2px top rule in the tone colour; Hint = bg/primary-soft, no rule; Answer = bg/subtle with a
 * border/default rule). The Untitled UI `Alert` (node 1130-81134) is a different, dismissible
 * banner and is not what this component renders.
 */
figma.connect(InlineAlert, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=20328-3296", {
  props: {
    tone: figma.enum("Tone", {
      Info: "info",
      Success: "success",
      Warning: "warning",
      Error: "error",
      Hint: "hint",
      Answer: "answer",
    }),
    title: figma.textContent("Title"),
    description: figma.textContent("Description"),
  },
  example: ({ tone, title, description }) => (
    <InlineAlert tone={tone} title={title} description={description} />
  ),
});
