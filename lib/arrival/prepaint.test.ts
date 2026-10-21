import { describe, expect, it } from "vitest";
import { ARRIVAL_INIT_SCRIPT } from "./prepaint";
import { LOAD_MODE_KEY } from "./loadMode";
import { VISITED_KEY } from "./visits";

/** Runs the inline script against a fake page and returns what it set on <html>, its timers and window. */
function run(opts: { path: string; visited?: string[]; raw?: string; mode?: string; sessionThrows?: boolean }) {
  const attrs: Record<string, string> = {};
  const timers: (() => void)[] = [];
  const win: Record<string, unknown> = {};
  const setTimeout = (fn: () => void) => (timers.push(fn), 1);
  const document = {
    documentElement: {
      setAttribute: (k: string, v: string) => (attrs[k] = v),
      removeAttribute: (k: string) => delete attrs[k],
    },
  };
  const location = { pathname: opts.path };
  const local = { getItem: (k: string) => (k === LOAD_MODE_KEY ? (opts.mode ?? null) : null) };
  const session = {
    getItem: (k: string) => {
      if (opts.sessionThrows) throw new Error("blocked");
      if (k !== VISITED_KEY) return null;
      return opts.raw ?? (opts.visited ? JSON.stringify(opts.visited) : null);
    },
  };
  new Function("document", "location", "localStorage", "sessionStorage", "window", "setTimeout", ARRIVAL_INIT_SCRIPT)(
    document,
    location,
    local,
    session,
    win,
    setTimeout,
  );
  return { attrs, timers, win };
}

describe("ARRIVAL_INIT_SCRIPT", () => {
  it("flags a platform page the session has not seen", () => {
    expect(run({ path: "/platform/dashboard" }).attrs).toEqual({ "data-arrival": "pending" });
  });
  it("leaves a page already visited alone (no skeleton flash)", () => {
    expect(run({ path: "/platform/dashboard/", visited: ["/platform/dashboard"] }).attrs).toEqual({});
  });
  it("never flags with the load off", () => {
    expect(run({ path: "/platform/dashboard", mode: "off" }).attrs).toEqual({});
  });
  it("treats blocked storage as a revisit", () => {
    expect(run({ path: "/platform/dashboard", sessionThrows: true }).attrs).toEqual({});
  });
  it("keys an encoded slug as the controller does (decoded)", () => {
    expect(run({ path: "/platform/course/caf%C3%A9", visited: ["/platform/course/café"] }).attrs).toEqual({});
    expect(run({ path: "/platform/course/caf%C3%A9" }).attrs).toEqual({ "data-arrival": "pending" });
  });
  it("reads junk in the visited list as a first visit, as the controller does", () => {
    expect(run({ path: "/platform/dashboard", raw: "{oops" }).attrs).toEqual({ "data-arrival": "pending" });
    expect(run({ path: "/platform/dashboard", raw: '{"a":1}' }).attrs).toEqual({ "data-arrival": "pending" });
  });
  it("arms a failsafe that shows the content if the page never takes over", () => {
    const r = run({ path: "/platform/dashboard" });
    expect(r.win.__skArrivalFs).toBe(1);
    r.timers.forEach((fn) => fn());
    expect(r.attrs).toEqual({});
  });
  it("does nothing outside the platform pages and the player topics", () => {
    expect(run({ path: "/course/six-sigma/certificate" }).attrs).toEqual({});
    expect(run({ path: "/platformish" }).attrs).toEqual({});
  });
  it("flags a player topic not seen yet, keyed by the topic (its tabs included)", () => {
    expect(run({ path: "/course/six-sigma/topic/m3-t1" }).attrs).toEqual({ "data-arrival": "pending" });
    expect(run({ path: "/course/six-sigma/topic/m3-t1/notes", visited: ["/course/six-sigma/topic/m3-t1"] }).attrs).toEqual({});
  });
});
