import { describe, expect, it } from "vitest";
import {
  certificatesInProgress,
  earnedCertificates,
  earnedIssuedValue,
  groupCertificates,
  issuedOnValue,
  type CertificateProgram,
} from "./certificates";

// The Certificates page groups by program (Nelson, 26 Oct 2026).
type Item = { id: string; kind: "course" | "program"; program?: CertificateProgram; at?: number };
const A = { slug: "a", title: "Program A", total: 7 };
const B = { slug: "b", title: "Program B", total: 5 };
const course = (id: string, p: CertificateProgram | undefined, number?: number, at = 0): Item => ({
  id,
  kind: "course",
  program: p ? { ...p, number } : undefined,
  at,
});

describe("groupCertificates", () => {
  it("puts each course under its program, in course order, and keeps the others apart", () => {
    const items = [course("a3", A, 3), course("solo", undefined), course("a1", A, 1), course("b2", B, 2)];
    const { programs, standalone } = groupCertificates(items);
    expect(programs.map((g) => g.program.slug)).toEqual(["a", "b"]);
    expect(programs[0].courses.map((c) => c.id)).toEqual(["a1", "a3"]);
    expect(programs[0].program).toEqual(A);
    expect(standalone.map((c) => c.id)).toEqual(["solo"]);
  });

  it("sorts the blocks with a program certificate first, then by the most recent", () => {
    const items: Item[] = [
      course("a1", A, 1, 10),
      course("b1", B, 1, 30),
      course("c1", { slug: "c", title: "C", total: 3 }, 1, 20),
      { id: "program-a", kind: "program", program: A, at: 5 },
    ];
    const { programs } = groupCertificates(items, (i) => i.at ?? 0);
    expect(programs.map((g) => g.program.slug)).toEqual(["a", "b", "c"]);
    expect(programs[0].programItem?.id).toBe("program-a");
    expect(programs[1].programItem).toBeUndefined();
  });

  it("makes no block for a program with nothing in the list", () => {
    expect(groupCertificates([course("solo", undefined)]).programs).toEqual([]);
    expect(groupCertificates([]).standalone).toEqual([]);
  });

  it("keeps every certificate once (the tab counts stay certificates)", () => {
    for (const list of [earnedCertificates, certificatesInProgress] as Item[][]) {
      const { programs, standalone } = groupCertificates(list);
      const placed = programs.flatMap((g) => [...(g.programItem ? [g.programItem] : []), ...g.courses]).length;
      expect(placed + standalone.length).toBe(list.length);
    }
  });

  it("puts the earned program certificate's block first on the sample data", () => {
    const { programs } = groupCertificates(earnedCertificates, earnedIssuedValue);
    expect(programs[0].programItem?.kind).toBe("program");
  });
});

describe("issuedOnValue", () => {
  it("reads the certificate's issue date", () => {
    expect(issuedOnValue("30 September 2026")).toBe(Date.UTC(2026, 8, 30));
    expect(issuedOnValue("9 April 2026")).toBeLessThan(issuedOnValue("21 May 2026"));
    expect(issuedOnValue("On completion")).toBe(0);
  });
});
