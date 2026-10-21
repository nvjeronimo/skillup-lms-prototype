import { describe, expect, it } from "vitest";
import { ARRIVAL_INIT_SCRIPT } from "./prepaint";
import { LOAD_MODE_KEY } from "./loadMode";
import { VISITED_KEY } from "./visits";

/** Runs the inline script against a fake page and returns the attributes it set on <html>. */
function run(opts: { path: string; visited?: string[]; mode?: string; sessionThrows?: boolean }) {
  const attrs: Record<string, string> = {};
  const document = { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } };
  const location = { pathname: opts.path };
  const local = { getItem: (k: string) => (k === LOAD_MODE_KEY ? (opts.mode ?? null) : null) };
  const session = {
    getItem: (k: string) => {
      if (opts.sessionThrows) throw new Error("blocked");
      return k === VISITED_KEY && opts.visited ? JSON.stringify(opts.visited) : null;
    },
  };
  new Function("document", "location", "localStorage", "sessionStorage", ARRIVAL_INIT_SCRIPT)(
    document,
    location,
    local,
    session,
  );
  return attrs;
}

describe("ARRIVAL_INIT_SCRIPT", () => {
  it("flags a platform page the session has not seen", () => {
    expect(run({ path: "/platform/dashboard" })).toEqual({ "data-arrival": "pending" });
  });
  it("leaves a page already visited alone (no skeleton flash)", () => {
    expect(run({ path: "/platform/dashboard/", visited: ["/platform/dashboard"] })).toEqual({});
  });
  it("never flags with the load off", () => {
    expect(run({ path: "/platform/dashboard", mode: "off" })).toEqual({});
  });
  it("treats blocked storage as a revisit", () => {
    expect(run({ path: "/platform/dashboard", sessionThrows: true })).toEqual({});
  });
  it("does nothing outside the platform pages", () => {
    expect(run({ path: "/course/six-sigma/topic/m3-t1" })).toEqual({});
    expect(run({ path: "/platformish" })).toEqual({});
  });
});
