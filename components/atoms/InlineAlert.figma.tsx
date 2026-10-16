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
 *
 * The tones do not share one layer set, so there is one connect per Tone:
 * - Info / Success / Warning / Error: Title + Description, plus `Show secondary-text`
 *   → `secondary` (layer `alert-secundary-text`).
 * - Hint: no Title/Description; the Copy frame holds Hint 1 / Hint 2 / Hint 3
 *   (`Show hint 2`, `Show hint 3`) and the `Next Hint` nav (`Show hint nav`), passed
 *   as `children` and `action`. Each Hint layer already carries its "Hint (n of m):"
 *   lead-in.
 * - Answer: Title + Description only (its secondary-text layer is hidden and not
 *   bound to the boolean).
 */

figma.connect(InlineAlert, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=20328-3296", {
  variant: { Tone: "Info" },
  props: {
    title: figma.textContent("Title"),
    description: figma.textContent("Description"),
    secondary: figma.boolean("Show secondary-text", {
      true: figma.textContent("alert-secundary-text"),
      false: undefined,
    }),
  },
  example: ({ title, description, secondary }) => (
    <InlineAlert tone="info" title={title} description={description} secondary={secondary} />
  ),
});

figma.connect(InlineAlert, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=20328-3296", {
  variant: { Tone: "Success" },
  props: {
    title: figma.textContent("Title"),
    description: figma.textContent("Description"),
    secondary: figma.boolean("Show secondary-text", {
      true: figma.textContent("alert-secundary-text"),
      false: undefined,
    }),
  },
  example: ({ title, description, secondary }) => (
    <InlineAlert tone="success" title={title} description={description} secondary={secondary} />
  ),
});

figma.connect(InlineAlert, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=20328-3296", {
  variant: { Tone: "Warning" },
  props: {
    title: figma.textContent("Title"),
    description: figma.textContent("Description"),
    secondary: figma.boolean("Show secondary-text", {
      true: figma.textContent("alert-secundary-text"),
      false: undefined,
    }),
  },
  example: ({ title, description, secondary }) => (
    <InlineAlert tone="warning" title={title} description={description} secondary={secondary} />
  ),
});

figma.connect(InlineAlert, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=20328-3296", {
  variant: { Tone: "Error" },
  props: {
    title: figma.textContent("Title"),
    description: figma.textContent("Description"),
    secondary: figma.boolean("Show secondary-text", {
      true: figma.textContent("alert-secundary-text"),
      false: undefined,
    }),
  },
  example: ({ title, description, secondary }) => (
    <InlineAlert tone="error" title={title} description={description} secondary={secondary} />
  ),
});

figma.connect(InlineAlert, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=20328-3296", {
  variant: { Tone: "Hint" },
  props: {
    hint1: figma.textContent("Hint 1"),
    hint2: figma.boolean("Show hint 2", { true: figma.textContent("Hint 2"), false: undefined }),
    hint3: figma.boolean("Show hint 3", { true: figma.textContent("Hint 3"), false: undefined }),
    nextHint: figma.boolean("Show hint nav", {
      true: (
        <button type="button" className="sk-text-body-medium-semibold text-sko-text-primary underline">
          Next Hint
        </button>
      ),
      false: undefined,
    }),
  },
  example: ({ hint1, hint2, hint3, nextHint }) => (
    <InlineAlert tone="hint" title="" action={nextHint}>
      <ol className="flex flex-col gap-0.5">
        <li className="sk-text-body-medium-regular text-sko-text-default">{hint1}</li>
        <li className="sk-text-body-medium-regular text-sko-text-default">{hint2}</li>
        <li className="sk-text-body-medium-regular text-sko-text-default">{hint3}</li>
      </ol>
    </InlineAlert>
  ),
});

figma.connect(InlineAlert, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=20328-3296", {
  variant: { Tone: "Answer" },
  props: {
    title: figma.textContent("Title"),
    description: figma.textContent("Description"),
  },
  example: ({ title, description }) => (
    <InlineAlert tone="answer" title={title} description={description} />
  ),
});
