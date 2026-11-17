import { describe, expect, it } from "vitest";
import { getQuizConfig, quizPattern } from "./content";
import { getTopic } from "./data";

function config(topicId: string, mode?: "A" | "B") {
  const topic = getTopic(topicId);
  if (!topic) throw new Error(`missing topic ${topicId}`);
  return getQuizConfig(topic, mode);
}

describe("practice quizzes use A-2", () => {
  it("renders Practice Quiz: Define and measure (m3-t4) as one Knowledge check", () => {
    const quiz = config("m3-t4");
    expect(quiz.variant).toBe("practice");
    expect(quiz.bucket).toBe(true);
    expect(quiz.bucketPrompt).toBe("Knowledge check");
    expect(quizPattern(quiz)).toBe("A-2");
  });

  it("keeps Quick check (m1-t3) on the same A-2 prompt", () => {
    const quiz = config("m1-t3");
    expect(quiz.variant).toBe("practice");
    expect(quiz.bucketPrompt).toBe("Knowledge check");
    expect(quizPattern(quiz)).toBe("A-2");
  });

  it("defaults other courses' practice quizzes to A-2 as well", () => {
    const quiz = config("seo-m1-t10");
    expect(quiz.variant).toBe("practice");
    expect(quizPattern(quiz)).toBe("A-2");
    expect(quiz.bucketPrompt).toBe("Knowledge check");
  });

  it("leaves the preview stepper as B even when the quiz is a bucket", () => {
    const quiz = config("m3-t4", "B");
    expect(quiz.mode).toBe("B");
    expect(quiz.bucket).toBe(true);
    expect(quizPattern(quiz)).toBe("B");
  });
});

describe("graded and final quizzes stay A-1 unless authored as one problem", () => {
  it("keeps a graded quiz on one Submit per question", () => {
    for (const id of ["m3-t4j", "seo-m1-t12", "sec1-m1-t9"]) {
      const quiz = config(id);
      expect(quiz.variant).toBe("graded");
      expect(quiz.bucket).toBeUndefined();
      expect(quizPattern(quiz)).toBe("A-1");
    }
  });

  it("keeps the final exam that was already one problem on A-2", () => {
    const quiz = config("m3-t4k");
    expect(quiz.variant).toBe("final");
    expect(quiz.bucket).toBe(true);
    expect(quiz.bucketPrompt).toBe("Final assessment");
    expect(quizPattern(quiz)).toBe("A-2");
  });

  it("does not turn an unlisted final assessment into A-2", () => {
    const quiz = config("seo-m4-t5");
    expect(quiz.variant).toBe("final");
    expect(quiz.bucket).toBeUndefined();
    expect(quizPattern(quiz)).toBe("A-1");
  });
});
