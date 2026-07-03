import figma from "figma";
import { Avatar } from "./Avatar";

/**
 * Code Connect for Avatar (SKO Design System, base component).
 * https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=19-1012
 *
 * NOTE: authored by hand — see Button.figma.tsx for why.
 *
 * `name`/`src` are runtime data, not static design content — left as
 * placeholders in the example. Figma's xl/2xl sizes have no code match.
 * "offline" status has no distinct Figma variant (only Online indicator
 * on/off) — mapped to the same "False" state as "none".
 */
figma.connect(Avatar, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=19-1012", {
  props: {
    size: figma.enum("Size", {
      xs: "xs",
      sm: "sm",
      md: "md",
      lg: "lg",
    }),
    status: figma.enum("Status icon", {
      "Online indicator": "online",
      False: "none",
    }),
  },
  example: ({ size, status }) => <Avatar name="Olivia Rhye" size={size} status={status} />,
});
