import figma from "figma";
import { Button } from "./Button";

/**
 * Code Connect for Button V2 (SKO Design System, "Buttons (WIP)" page):
 * - Button_def       https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=21851-7608
 * - Icon Button_def  https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=21851-7720
 * - Link Button_def  https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=21851-7679
 * The legacy Buttons/Button (3287:427074) is no longer connected.
 *
 * NOTE: authored by hand — this Figma file's plan does not include Code
 * Connect, so this could not be generated/validated via the Figma MCP tools.
 * Re-run through the official flow once the plan supports it.
 *
 * Type and Hierarchy sit on the set; Size, Label and the icon booleans/swaps sit on the
 * nested, exposed `._Button_Structure` instance (the swap names start with four spaces).
 * State: Hover/Focused are CSS pseudo-classes in code, Disabled is the native `disabled`
 * attribute and Loading is the `loading` prop. The Tooltip boolean has no code prop.
 * The icon swaps come through as instances; in code `leftIcon`/`rightIcon` take the
 * lucide component itself (e.g. `rightIcon={ArrowRight}`).
 */
figma.connect(Button, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=21851-7608", {
  props: {
    tone: figma.enum("Type", {
      Brand: "brand",
      Destructive: "destructive",
      Success: "success",
    }),
    hierarchy: figma.enum("Hierarchy", {
      Primary: "primary",
      Secondary: "secondary",
      Tertiary: "tertiary",
    }),
    disabled: figma.enum("State", { Disabled: true }),
    loading: figma.enum("State", { Loading: true }),
    structure: figma.nestedProps("._Button_Structure", {
      size: figma.enum("Size", { sm: "sm", md: "md", lg: "lg", xl: "xl" }),
      label: figma.string("Label"),
      leftIcon: figma.boolean("Icon leading", { true: figma.instance("    Icon leading swap") }),
      rightIcon: figma.boolean("Icon trailing", { true: figma.instance("    Icon trailing swap") }),
    }),
  },
  example: ({ tone, hierarchy, disabled, loading, structure }) => (
    <Button
      tone={tone}
      hierarchy={hierarchy}
      size={structure.size}
      leftIcon={structure.leftIcon}
      rightIcon={structure.rightIcon}
      disabled={disabled}
      loading={loading}
    >
      {structure.label}
    </Button>
  ),
});

/** Icon Button_def: the same Type × Hierarchy × State, Size on `._Icon Button_Structure`. */
figma.connect(Button, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=21851-7720", {
  props: {
    tone: figma.enum("Type", {
      Brand: "brand",
      Destructive: "destructive",
      Success: "success",
    }),
    hierarchy: figma.enum("Hierarchy", {
      Primary: "primary",
      Secondary: "secondary",
      Tertiary: "tertiary",
    }),
    disabled: figma.enum("State", { Disabled: true }),
    loading: figma.enum("State", { Loading: true }),
    structure: figma.nestedProps("._Icon Button_Structure", {
      size: figma.enum("Size", { sm: "sm", md: "md", lg: "lg", xl: "xl" }),
      icon: figma.instance("    Icon leading swap"),
    }),
  },
  example: ({ tone, hierarchy, disabled, loading, structure }) => (
    <Button
      iconOnly
      tone={tone}
      hierarchy={hierarchy}
      size={structure.size}
      disabled={disabled}
      loading={loading}
      aria-label="Describe the action"
    >
      {structure.icon}
    </Button>
  ),
});

/**
 * Link Button_def: Hierarchy=Primary is the tone-coloured link, Hierarchy=Secondary the grey
 * link (Brand only). `._Link Button_Structure` has md and lg sizes.
 */
figma.connect(Button, "https://www.figma.com/design/c7EUDrQwP8si08aPipDSIV?node-id=21851-7679", {
  props: {
    tone: figma.enum("Type", {
      Brand: "brand",
      Destructive: "destructive",
      Success: "success",
    }),
    hierarchy: figma.enum("Hierarchy", {
      Primary: "link",
      Secondary: "link-subtle",
    }),
    disabled: figma.enum("State", { Disabled: true }),
    loading: figma.enum("State", { Loading: true }),
    structure: figma.nestedProps("._Link Button_Structure", {
      size: figma.enum("Size", { md: "md", lg: "lg" }),
      label: figma.string("Label"),
      leftIcon: figma.boolean("Icon leading", { true: figma.instance("    Icon leading swap") }),
      rightIcon: figma.boolean("Icon trailing", { true: figma.instance("    Icon trailing swap") }),
    }),
  },
  example: ({ tone, hierarchy, disabled, loading, structure }) => (
    <Button
      tone={tone}
      hierarchy={hierarchy}
      size={structure.size}
      leftIcon={structure.leftIcon}
      rightIcon={structure.rightIcon}
      disabled={disabled}
      loading={loading}
    >
      {structure.label}
    </Button>
  ),
});
