/**
 * Spread on an element to make it `inert` (out of the tab order and the accessibility
 * tree) while `on`. React 19 takes `inert` as a boolean prop.
 */
export function inertProps(on: boolean): { inert?: boolean } {
  return on ? { inert: true } : {};
}
