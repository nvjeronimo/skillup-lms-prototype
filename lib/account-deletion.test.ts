import { describe, expect, it } from "vitest";
import { deletionDate, formatDay, parseDeletionRequest } from "./account-deletion";

describe("account deletion cookie", () => {
  it("reads a pending request and ignores anything else", () => {
    expect(parseDeletionRequest("pending:2026-10-30")?.getDate()).toBe(30);
    expect(parseDeletionRequest(encodeURIComponent("pending:2026-10-30"))?.getMonth()).toBe(9);
    expect(parseDeletionRequest("")).toBeNull();
    expect(parseDeletionRequest("active")).toBeNull();
    expect(parseDeletionRequest(undefined)).toBeNull();
  });

  it("deletes 14 days after the request", () => {
    const requested = parseDeletionRequest("pending:2026-10-30")!;
    expect(formatDay(deletionDate(requested))).toBe("13 November 2026");
  });
});
