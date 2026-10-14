import { describe, expect, it } from "vitest";
import { nextPresence } from "./presence";

describe("nextPresence", () => {
  it("mounts and opens", () => expect(nextPresence("unmounted", "open")).toBe("open"));
  it("starts closing when open", () => expect(nextPresence("open", "close")).toBe("closing"));
  it("unmounts when the exit finishes", () =>
    expect(nextPresence("closing", "exited")).toBe("unmounted"));
  it("reopens during an exit", () => expect(nextPresence("closing", "open")).toBe("open"));
  it("ignores close when already unmounted", () =>
    expect(nextPresence("unmounted", "close")).toBe("unmounted"));
  it("ignores a stray animationend from an entrance", () =>
    expect(nextPresence("open", "exited")).toBe("open"));
});
