import figma from "figma";
import { Toast } from "./Toast";

/**
 * Code Connect for `Toast` (SKO Design System, page "Toast Notifications") →
 * Toast.tsx, the ephemeral, auto-dismissing, screen-anchored notification.
 * https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=21089-1214
 *
 * NOTE: authored by hand — see Button.figma.tsx for why.
 *
 * Color maps to `tone` (Critical → `error`). Each tone is a soft surface with a
 * 1px soft border, radius 12, padding 16 and Elevation/level2; the 20px glyph
 * carries the tone. `Show title` / `Title` map to the optional `title`,
 * `Supporting text` to `message`, `Show action` to `actionLabel` (the action under the text),
 * and `Show close button` to `showClose`. The Untitled UI `Notification`
 * (node 1135-618) is a different white card and is not what Toast.tsx renders.
 * `actionLabel` is runtime data, a placeholder in the example.
 */
figma.connect(Toast, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=21089-1214", {
  props: {
    tone: figma.enum("Color", {
      Neutral: "neutral",
      Success: "success",
      Warning: "warning",
      Critical: "error",
      Info: "info",
    }),
    title: figma.boolean("Show title", {
      true: figma.string("Title"),
      false: undefined,
    }),
    message: figma.string("Supporting text"),
    actionLabel: figma.boolean("Show action", { true: "Undo", false: undefined }),
    showClose: figma.boolean("Show close button"),
  },
  example: ({ tone, title, message, actionLabel, showClose }) => (
    <Toast
      showClose={showClose}
      toast={{
        tone,
        title,
        message,
        actionLabel,
      }}
    />
  ),
});
