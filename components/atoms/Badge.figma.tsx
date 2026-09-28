import figma from "figma";
import { Badge } from "./Badge";

/**
 * Code Connect for Badge v2 (SKO Design System).
 * https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=21889-541076
 *
 * NOTE: authored by hand — see Button.figma.tsx for why.
 *
 * Badge v2 has three variant axes: Style (Soft | Outline | Modern | Plain | Soft Light),
 * Size (sm | md | lg) and Color (Gray, Brand, Error, Warning, Success, Teal, Green, Red,
 * Yellow, Info + 8 provisional hues). The label is the TEXT property "Text" on the nested,
 * exposed `_Badge base` instance. Not mapped yet (no code counterpart): Style=Soft Light
 * (bound to primitives) and the provisional hues Cyan…Orange. The legacy set
 * "Badge-V1-to-remove" (1046:3819) is no longer connected.
 */
figma.connect(Badge, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=21889-541076", {
  props: {
    color: figma.enum("Color", {
      Gray: "gray",
      Brand: "brand",
      Info: "info",
      Success: "success",
      Warning: "warning",
      Error: "error",
      Teal: "teal",
      Green: "green",
      Red: "red",
      Yellow: "yellow",
    }),
    variant: figma.enum("Style", {
      Soft: "soft",
      Outline: "outline",
      Modern: "modern",
      Plain: "plain",
    }),
    size: figma.enum("Size", {
      sm: "sm",
      md: "md",
      lg: "lg",
    }),
    base: figma.nestedProps("_Badge base", {
      label: figma.string("Text"),
    }),
  },
  example: ({ color, variant, size, base }) => (
    <Badge color={color} variant={variant} size={size}>
      {base.label}
    </Badge>
  ),
});
