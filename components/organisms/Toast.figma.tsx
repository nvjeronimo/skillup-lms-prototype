import figma from "figma";
import { Toast } from "./Toast";

/**
 * Code Connect for Notification (SKO Design System, base component) →
 * maps to Toast.tsx (bookmark feedback + inline-action ephemeral toast).
 * https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=1135-618
 *
 * NOTE: authored by hand — see Button.figma.tsx for why.
 *
 * Toast.tsx only ever renders a fixed "Type=Success icon" style (a plain
 * check on `bg-sk-bg-overlay`) — it does not yet support the Notification
 * component's other icon types (Error/Warning/Progress indicator/Avatar/
 * Image). If those are needed, Toast.tsx needs a `tone` prop added first.
 * `message`/`actionLabel` are runtime data — placeholders in the example.
 */
figma.connect(Toast, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=1135-618", {
  variant: { Type: "Success icon" },
  props: {
    hasAction: figma.boolean("Actions"),
  },
  example: ({ hasAction }) => (
    <Toast
      toast={{
        message: "Added to your bookmarks",
        actionLabel: hasAction ? "Undo" : undefined,
      }}
    />
  ),
});
