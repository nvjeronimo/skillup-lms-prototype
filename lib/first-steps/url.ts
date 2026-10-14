/**
 * The test link: any prototype address with `?first-steps=restart` starts the first steps
 * again, as for a learner who has just arrived (e.g. /platform/dashboard?first-steps=restart).
 * Prototype only: it lets anyone test them at any moment, from a shared link.
 */
const PARAM = "first-steps";

export function wantsRestart(search: string): boolean {
  return new URLSearchParams(search).get(PARAM)?.toLowerCase() === "restart";
}

/** The address without the test parameter, so a reload does not restart again. */
export function withoutRestart(pathname: string, search: string): string {
  const params = new URLSearchParams(search);
  params.delete(PARAM);
  const rest = params.toString();
  return rest ? `${pathname}?${rest}` : pathname;
}
