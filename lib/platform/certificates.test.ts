import { describe, expect, it } from "vitest";
import { issuedOnValue } from "./certificates";

describe("issuedOnValue", () => {
  it("reads the certificate's issue date", () => {
    expect(issuedOnValue("30 September 2026")).toBe(Date.UTC(2026, 8, 30));
    expect(issuedOnValue("9 April 2026")).toBeLessThan(issuedOnValue("21 May 2026"));
    expect(issuedOnValue("On completion")).toBe(0);
  });
});
