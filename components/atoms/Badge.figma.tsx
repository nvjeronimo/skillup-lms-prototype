import figma from "figma";
import { Badge } from "./Badge";

/**
 * Code Connect for Badge (SKO Design System, base component).
 * https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=1046-3819
 *
 * NOTE: authored by hand — see Button.figma.tsx for why.
 *
 * "outline" tone has no confirmed Color match — mapped tentatively via
 * Type="Badge modern" (bordered treatment). Verify against the actual
 * component before relying on this mapping.
 */
figma.connect(Badge, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=1046-3819", {
  variant: { Type: "Badge color" },
  props: {
    tone: figma.enum("Color", {
      Brand: "brand",
      Gray: "neutral",
      Success: "success",
      Warning: "warning",
      Error: "error",
    }),
    label: figma.textContent("Text"),
  },
  example: ({ tone, label }) => <Badge tone={tone}>{label}</Badge>,
});
