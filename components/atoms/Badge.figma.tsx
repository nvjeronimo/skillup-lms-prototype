import figma from "figma";
import { Badge } from "./Badge";

/**
 * Code Connect for Badge (SKO Design System, base component).
 * https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=1046-3819
 *
 * NOTE: authored by hand — see Button.figma.tsx for why.
 *
 * Color options as of 23 Sep 2026: Gray, Brand, Error, Warning, Success, Teal, Red, Yellow
 * (the DS merged its Untitled UI hues into Teal / Red / Yellow). The "outline" tone is the
 * DS Type="Badge modern" treatment (bg/page + border/default + text/muted).
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
      Teal: "teal",
      Red: "red",
      Yellow: "yellow",
    }),
    label: figma.textContent("Text"),
  },
  example: ({ tone, label }) => <Badge tone={tone}>{label}</Badge>,
});
