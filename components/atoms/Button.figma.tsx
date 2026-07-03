import figma from "figma";
import { Button } from "./Button";

/**
 * Code Connect for Buttons/Button (SKO Design System).
 * https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=3287-427074
 *
 * NOTE: authored by hand — this Figma file's plan does not include Code
 * Connect, so this could not be generated/validated via the Figma MCP tools.
 * Re-run through the official flow once the plan supports it.
 *
 * Figma's "State" variant (Default/Hover/Focused/Disabled/Loading) has no
 * direct prop — Hover/Focused are CSS pseudo-classes in code. Disabled maps
 * to the native `disabled` attribute. Loading has NO code implementation yet
 * (see dev-readiness audit) — mapped here as a TODO.
 */
figma.connect(Button, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=3287-427074", {
  props: {
    hierarchy: figma.enum("Hierarchy", {
      Primary: "primary",
      Secondary: "secondary",
      Tertiary: "tertiary",
      Destructive: "destructive",
      Utility: "utility",
      // "Link color" / "Link gray" have no matching code variant yet.
    }),
    size: figma.enum("Size", {
      sm: "sm",
      md: "md",
      lg: "lg",
      xl: "xl",
    }),
    iconOnly: figma.boolean("Icon only"),
    disabled: figma.enum("State", { Disabled: true }),
    label: figma.textContent("Text"),
  },
  example: ({ hierarchy, size, iconOnly, disabled, label }) => (
    <Button variant={hierarchy} size={size} iconOnly={iconOnly} disabled={disabled}>
      {label}
    </Button>
  ),
});
