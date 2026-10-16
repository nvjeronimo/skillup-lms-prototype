/**
 * Spread on an element to make it `inert` (out of the tab order and the accessibility
 * tree) while `on`. React 18 has no `inert` prop yet, so it goes through as a plain
 * attribute; an empty string is how the attribute is switched on.
 */
export function inertProps(on: boolean): Record<string, string> {
  return on ? { inert: "" } : {};
}
