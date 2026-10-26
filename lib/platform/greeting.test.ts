import { describe, expect, it } from "vitest";
import { salutationFor } from "./greeting";

describe("salutationFor", () => {
  it("greets by the hour, with the edges on the hour", () => {
    expect(salutationFor(0)).toBe("Good evening,");
    expect(salutationFor(4)).toBe("Good evening,");
    expect(salutationFor(5)).toBe("Good morning,");
    expect(salutationFor(11)).toBe("Good morning,");
    expect(salutationFor(12)).toBe("Good afternoon,");
    expect(salutationFor(17)).toBe("Good afternoon,");
    expect(salutationFor(18)).toBe("Good evening,");
    expect(salutationFor(23)).toBe("Good evening,");
  });
});
