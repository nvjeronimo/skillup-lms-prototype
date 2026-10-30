import { describe, expect, it } from "vitest";
import { enrolments } from "./certificate-enrolments";
import { earnedCertificates } from "./certificates";

// The Certificates ledger (Nelson, 30 Oct 2026): every certificate once, a program never split.
describe("enrolments", () => {
  it("holds every earned certificate exactly once", () => {
    const placed = enrolments.flatMap((e) => [
      ...(e.kind === "program" && e.issued ? [e.issued.id] : []),
      ...e.courses.flatMap((c) => (c.earned ? [c.earned.id] : [])),
    ]);
    expect(new Set(placed).size).toBe(placed.length);
    expect(placed.sort()).toEqual(earnedCertificates.map((c) => c.id).sort());
  });

  it("lists every course of a program, in order, whatever its state", () => {
    for (const e of enrolments.filter((x) => x.kind === "program")) {
      const numbers = e.courses.map((c) => c.number);
      expect(numbers).toEqual([...numbers].sort((a, b) => (a ?? 0) - (b ?? 0)));
      expect(e.complete).toBeLessThanOrEqual(e.courses.length);
    }
  });

  it("makes a course of no program an enrolment of one course", () => {
    for (const e of enrolments.filter((x) => x.kind === "course"))
      expect(e.courses).toHaveLength(1);
  });
});
