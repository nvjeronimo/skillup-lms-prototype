import { describe, expect, it } from "vitest";
import { PERSONAS, getPersona, parsePersonaId } from "./personas";
import { ctaFor, overlayCard, overlayProgramCourse } from "./persona-overlay";
import { applyPlan, personaCookie, settingsFor, type PersonaSettings } from "./persona-settings";
import { programsFor } from "./programs";
import { catalogFor, getIssuedCertificate, getProgramCertificate } from "./platform/catalog";
import { myLearningCoursesFor } from "./platform/my-learning";
import { myLearningCourseRowsFor } from "./platform/my-learning-rows";
import { dashboardResumeFor } from "./platform/dashboard";
import { getCourseDetailBySlug } from "./platform/course-detail";

/* The synthetic personas' overlay (Nelson, 25 Oct 2026). With no persona the data is as written. */

const BASE: PersonaSettings = {
  deviceMode: "auto",
  textSize: "md",
  largeTargetsChoice: null,
  underlineLinks: false,
  reduceMotion: false,
};

describe("persona data", () => {
  it("maps every persona onto the prototype's actual programs and courses", () => {
    const programs = programsFor(null);
    const courseIds = myLearningCoursesFor(null).map((c) => c.id);
    for (const p of PERSONAS) {
      for (const [slug, pcts] of Object.entries(p.programs)) {
        const program = programs.find((x) => x.slug === slug);
        expect(program, `${p.id} ${slug}`).toBeDefined();
        expect(pcts.length).toBe(program?.courses.length);
      }
      expect(Object.keys(p.programs).sort()).toEqual(programs.map((x) => x.slug).sort());
      expect(Object.keys(p.courses).sort()).toEqual([...courseIds].sort());
    }
  });

  it("parses the cookie: one persona, and the first known id of an old multi-id cookie", () => {
    expect(parsePersonaId("P07")).toBe("P07");
    expect(parsePersonaId("P02,P06")).toBe("P02");
    expect(parsePersonaId(encodeURIComponent("X9,P06,P02"))).toBe("P06");
    expect(parsePersonaId("%E0%A4%A")).toBeNull();
    expect(parsePersonaId(undefined)).toBeNull();
    expect(personaCookie("P02")).toContain("sk-persona=P02;");
    expect(personaCookie(null)).toContain("max-age=0");
  });
});

describe("persona overlay", () => {
  it("leaves the data as written without a persona", () => {
    expect(programsFor(null)).toBe(programsFor(undefined));
    expect(catalogFor(null).find((c) => c.slug === "leadership-in-remote-teams")?.percent).toBe(52);
    expect(dashboardResumeFor(null).map((c) => c.slug)).toContain("leadership-in-remote-teams");
  });

  it("gives a card the action and the line of its state", () => {
    const card = myLearningCoursesFor(null).find((c) => c.id === "leadership-in-remote-teams")!;
    const done = overlayCard(card, 100, card.id);
    expect(done.cta).toBe("Review");
    expect(done.href).toBe("/platform/course/leadership-in-remote-teams");
    expect("certificate" in done.upNext).toBe(true);
    expect(overlayCard(card, null, card.id).cta).toBe("Start");
    expect(overlayCard(card, 52, card.id)).toBe(card);
    expect(ctaFor(30)).toBe("Resume");
  });

  it("moves a program course's modules bar with the percentage", () => {
    const pc = programsFor(null)[0].courses[2];
    const row = overlayProgramCourse(pc, 60);
    const n = pc.modules?.length ?? 0;
    expect(row.modules?.filter((m) => m.complete).length).toBe(Math.floor(0.6 * n));
    expect(row.modules?.filter((m) => m.current).length).toBe(1);
    expect(row.position).toMatch(/^Module \d of \d$/);
    expect(overlayProgramCourse(pc, 100).detail).toMatch(/^All complete · \d+ topics$/);
  });

  it("puts Maya (P02) on her portfolio", () => {
    const catalog = catalogFor("P02");
    const ai = catalog.filter((c) => c.program?.slug === "ai-driven-digital-marketing").map((c) => c.percent);
    expect(ai).toEqual([100, 55, null, null, null, null, null]);
    expect(catalog.find((c) => c.slug === "leadership-in-remote-teams")?.percent).toBe(100);
    expect(dashboardResumeFor("P02").map((c) => c.progressPct)).toEqual([55]);
    const row = myLearningCourseRowsFor("P02").find((r) => r.card.id === "leadership-in-remote-teams");
    expect(row?.card.cta).toBe("Review");
    // A finished single course gets a certificate printed for her; none without the persona.
    expect(getIssuedCertificate("leadership-in-remote-teams", "P02")?.certificate.document.learner).toBe("Maya Ferreira");
    expect(getIssuedCertificate("leadership-in-remote-teams", null)).toBeUndefined();
    // The Data Analytics program is not started: no program certificate.
    expect(getProgramCertificate("data-analytics-foundations", "P02")?.certificate.status).toBe("not-earned");
    const program = programsFor("P02").find((p) => p.slug === "ai-driven-digital-marketing")!;
    expect(program.progress.footer).toBe("1 of 7 courses complete");
    expect(program.progress.status).toBe("Course 2 of 7 · in progress");
    expect(program.certificates.map((c) => c.status)).toEqual(["issued", "not-earned"]);
  });

  it("gives Priya (P04) the completed program and its certificate in her name", () => {
    const state = getProgramCertificate("data-analytics-foundations", "P04");
    expect(state?.complete).toBe(5);
    expect(state?.certificate.status).toBe("issued");
    const program = programsFor("P04").find((p) => p.slug === "ai-driven-digital-marketing")!;
    const issued = program.certificates.filter((c) => c.status === "issued");
    expect(issued).toHaveLength(2);
    expect(issued.every((c) => c.status === "issued" && c.document.learner === "Priya Nair")).toBe(true);
  });

  it("keeps Noah (P01) mostly not started", () => {
    const started = catalogFor("P01").filter((c) => (c.percent ?? 0) > 0);
    expect(started.map((c) => c.slug).sort()).toEqual(["intro-to-product-analytics", "project-management-with-ai-tools"]);
    expect(programsFor("P01").every((p) => p.programCertificate === undefined)).toBe(true);
  });

  it("follows the catalogue on a course page with content of its own", () => {
    const page = getCourseDetailBySlug("ux-research-and-design-thinking", "P04");
    expect(page?.progress.percent).toBe(100);
    expect(page?.progress.cta).toBe("Review course");
  });
});

describe("persona settings", () => {
  it("takes one persona's conditions only", () => {
    expect(settingsFor(getPersona("P06")!.conditions, BASE)).toEqual({ ...BASE, deviceMode: "mobile" });
    expect(settingsFor(getPersona("P07")!.conditions, BASE)).toEqual({
      deviceMode: "auto",
      textSize: "xl",
      largeTargetsChoice: true,
      underlineLinks: true,
      reduceMotion: true,
    });
    expect(applyPlan("P02", BASE, null).settings).toEqual(BASE);
  });

  it("applies over the settings from before any persona and keeps them for Clear", () => {
    const mine = { ...BASE, textSize: "lg" as const };
    const first = applyPlan("P07", mine, null);
    expect(first.before).toEqual(mine);
    expect(first.settings.textSize).toBe("xl");
    // Switching from Helena to Maya restores the baseline first: no large text leaks into P02.
    const second = applyPlan("P02", first.settings, first.before);
    expect(second.settings).toEqual(mine);
    expect(second.before).toEqual(mine);
    // And on to Sara: the baseline plus the mobile preview only.
    const third = applyPlan("P06", second.settings, second.before);
    expect(third.settings).toEqual({ ...mine, deviceMode: "mobile" });
  });
});
