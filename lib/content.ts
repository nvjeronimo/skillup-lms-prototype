import { topicDownloads as seedDownloads } from "./data";
import type { DownloadFile, FlatTopic, TopicType, TranscriptLine } from "./types";

/**
 * Dummy content for every topic type so the prototype feels complete when you
 * navigate the whole course. Deterministic, Six-Sigma-themed, derived from the
 * topic's title/type. The Video topic keeps its real transcript (lib/data).
 */

export interface ArticleContent {
  byline: { author: string; date: string; readingTime: string };
  lede: string;
  sections: { heading: string; paragraphs: string[] }[];
  pullQuote: { text: string; attribution: string };
  takeaways: string[];
}

export interface QuizOption {
  id: string;
  label: string;
  correct?: boolean;
  /** Answer-specific feedback, shown after submit for the chosen option. */
  feedback?: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  /** Revealed by "Show answer" — the platform's <solution> block. */
  explanation?: string;
  /** Topic this question draws on, for the "review lesson" link after a wrong answer. */
  reviewTopicId?: string;
  reviewTopicTitle?: string;
}

/**
 * Quiz configuration. On Open edX this is NOT part of the problem — graded /
 * attempts / weight live on the subsection, and the same problem blocks are
 * reused across Practice, Graded and Final Exam. We mirror that here.
 */
export interface QuizConfig {
  variant: "practice" | "graded" | "final";
  label: string;
  /** undefined = unlimited */
  maxAttempts?: number;
  /** % of the final grade; undefined for practice */
  weightPct?: number;
  passThresholdPct: number;
  estMinutes: number;
  /** Graded quizzes warn that a submitted answer cannot be changed. */
  submitIsFinal: boolean;
}

export interface ActivityContent {
  intro: string;
  steps: { title: string; detail: string }[];
}

export interface DiscussionThread {
  author: string;
  timestamp: string;
  content: string;
  replies: number;
  upvotes: number;
}

/** High-level family used to pick the right player view. */
export type TopicFamily =
  | "video"
  | "reading"
  | "assessment"
  | "graded"
  | "activity"
  | "discussion"
  | "vilt";

export function topicFamily(type: TopicType): TopicFamily {
  switch (type) {
    case "Video":
      return "video";
    case "Reading":
      return "reading";
    case "Quiz":
    case "Practice Assignment":
    case "Peer-graded":
    case "Peer Review":
      return "assessment";
    case "Graded Assignment":
      return "graded";
    case "Activity":
    case "Lab":
      return "activity";
    case "Discussion Prompt":
      return "discussion";
    case "VILT-Live Session":
    case "VILT-Recording":
      return "vilt";
    default:
      return "reading";
  }
}

/** Short description shown in the Topic Header for non-video topics. */
export function topicDescription(topic: FlatTopic): string {
  const fam = topicFamily(topic.type);
  switch (fam) {
    case "reading":
      return `A short read on “${topic.title}”, with the key ideas you need before moving on.`;
    case "assessment":
      return `Check your understanding of ${topic.lessonLabel ?? topic.moduleTitle}. You can retake this as many times as you like.`;
    case "graded":
      return `Apply what you've learned and submit your work. This assignment counts toward your final grade.`;
    case "activity":
      return `An interactive exercise to practise the concepts from ${topic.moduleTitle}.`;
    case "discussion":
      return `Share your perspective and learn from your cohort.`;
    case "vilt":
      return `A live, instructor-led session with your cohort.`;
    default:
      return topic.title;
  }
}

/**
 * Transcript for a video topic. Returns the real seeded transcript when present
 * (m3-t1), otherwise a deterministic dummy so every video topic has captions to
 * read + anchor notes to. Non-video topics return [] (no transcript tab body).
 */
export function getTranscript(topic: FlatTopic): TranscriptLine[] {
  if (topic.transcript && topic.transcript.length) return topic.transcript;
  if (topicFamily(topic.type) !== "video") return [];

  const subject = topic.title.replace(/[.\s]+$/, "");
  const mod = topic.moduleTitle;
  const lines = [
    `Welcome back. In this lesson we work through ${subject} and where it fits within ${mod}.`,
    `Let's start with the why — getting ${subject} right is what keeps the rest of the workflow from drifting.`,
    `Here's the core idea: keep it concrete, measurable, and tied to what the customer actually cares about.`,
    `A common pitfall is jumping straight to a fix before the problem is properly defined — we'll avoid that.`,
    `Notice how each step feeds the next: define the problem, measure the baseline, then act on what the data says.`,
    `Let's walk through a quick example so the concept sticks before you try it yourself in the activity.`,
    `That's the essence of ${subject}. In the next topic we build on it — jot down anything you want to revisit.`,
  ];
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return lines.map((text, i) => ({ id: `${topic.id}-l${i + 1}`, ts: fmt(i * 18), text }));
}

export function getArticle(topic: FlatTopic): ArticleContent {
  return {
    byline: { author: "Dr. Sarah Chen", date: "Updated May 2026", readingTime: topic.duration },
    lede: `${topic.title} is a cornerstone of the ${topic.moduleTitle} module. This reading distils the essentials so you can apply them with confidence in the assignments that follow.`,
    sections: [
      {
        heading: "Why it matters",
        paragraphs: [
          "In process improvement, clarity beats cleverness. Before optimising anything, you need a shared, measurable definition of the problem — otherwise teams optimise different things and progress stalls.",
          "Six Sigma gives us a disciplined way to define, measure and reduce variation. The goal is not perfection; it is predictability — outcomes you can rely on, batch after batch.",
        ],
      },
      {
        heading: "The core idea",
        paragraphs: [
          "Start from the customer. A defect is anything the customer would consider a failure, so the first job is to translate vague expectations into specific, measurable requirements (the “critical to quality” characteristics).",
          "With requirements in hand, you can baseline current performance, find the vital few causes of variation, and put controls in place so improvements actually stick.",
        ],
      },
    ],
    pullQuote: {
      text: "You can't improve what you can't measure — and you can't measure what you haven't defined.",
      attribution: "Six Sigma Black Belt handbook",
    },
    takeaways: [
      "Define the problem in the customer's terms before touching the process.",
      "Baseline current performance so improvement is provable, not anecdotal.",
      "Target the vital few causes of variation, not the trivial many.",
      "Lock in gains with controls, or the process will drift back.",
    ],
  };
}

export function getQuiz(topic: FlatTopic): QuizQuestion[] {
  return [
    {
      question: "What is the primary goal of Six Sigma?",
      explanation:
        "Six Sigma is a data-driven methodology for reducing variation. Fewer defects follow from a more predictable process — speed and headcount are outcomes, never the goal.",
      reviewTopicId: "m3-t1",
      reviewTopicTitle: "Introduction to the DMAIC methodology",
      options: [
        {
          id: "a",
          label: "Reduce process variation and defects",
          correct: true,
          feedback: "Correct — controlling variation is what makes a process predictable and defect-free.",
        },
        {
          id: "b",
          label: "Increase production speed at any cost",
          feedback: "Speed gained by ignoring quality creates rework, which raises variation rather than lowering it.",
        },
        {
          id: "c",
          label: "Eliminate all documentation",
          feedback: "The opposite — Six Sigma depends on documented baselines and control plans to prove improvement.",
        },
        {
          id: "d",
          label: "Replace staff with automation",
          feedback: "Automation may be an improvement you choose, but it is not the objective of the methodology.",
        },
      ],
    },
    {
      question: "In DMAIC, which phase establishes the baseline performance?",
      explanation:
        "Measure comes second precisely so you can quantify the current state before changing anything. Without a baseline there is nothing to compare an improvement against.",
      reviewTopicId: "m3-t2",
      reviewTopicTitle: "The define phase",
      options: [
        { id: "a", label: "Define", feedback: "Define frames the problem and the customer requirements — it does not yet quantify performance." },
        { id: "b", label: "Measure", correct: true, feedback: "Correct — Measure captures the baseline you will improve against." },
        { id: "c", label: "Improve", feedback: "Improve comes after you already know the baseline and the root causes." },
        { id: "d", label: "Control", feedback: "Control locks in the gain at the end; the baseline is set much earlier." },
      ],
    },
    {
      question: "\u201cCritical to Quality\u201d characteristics are derived from\u2026",
      explanation:
        "CTQs translate the voice of the customer into measurable requirements. If a characteristic cannot be traced back to a customer need, it is not a CTQ.",
      reviewTopicId: "m3-t3",
      reviewTopicTitle: "The measure phase",
      options: [
        { id: "a", label: "The customer's requirements", correct: true, feedback: "Correct — CTQs always start from the voice of the customer." },
        { id: "b", label: "The finance department", feedback: "Budget shapes what you can do, but it does not define quality for the customer." },
        { id: "c", label: "Competitor pricing", feedback: "Useful market context, but pricing is not a quality characteristic." },
        { id: "d", label: "Random sampling", feedback: "Sampling is how you measure a CTQ — it is not where the CTQ comes from." },
      ],
    },
  ];
}

/**
 * Quiz configuration for a topic. Mirrors Open edX: these values come from the
 * SUBSECTION (grading policy + assignment type), not from the problem blocks.
 */
export function getQuizConfig(topic: FlatTopic): QuizConfig {
  const title = topic.title.toLowerCase();
  const isFinal = title.includes("final") || title.includes("exam");
  const isGraded = isFinal || topic.type === "Graded Assignment" || title.includes("graded");

  if (isFinal) {
    return {
      variant: "final",
      label: "Final exam",
      maxAttempts: 1,
      weightPct: 40,
      passThresholdPct: 70,
      estMinutes: 20,
      submitIsFinal: true,
    };
  }
  if (isGraded) {
    return {
      variant: "graded",
      label: "Graded quiz",
      maxAttempts: 2,
      weightPct: 20,
      passThresholdPct: 70,
      estMinutes: 10,
      submitIsFinal: true,
    };
  }
  return {
    variant: "practice",
    label: "Practice quiz",
    maxAttempts: undefined,
    weightPct: undefined,
    passThresholdPct: 60,
    estMinutes: 4,
    submitIsFinal: false,
  };
}

export function getActivity(topic: FlatTopic): ActivityContent {
  return {
    intro: `Work through the steps below. Tick each one as you go — your progress is saved automatically. This activity should take about ${topic.duration.replace(/^approx\.\s*/, "")}.`,
    steps: [
      {
        title: "Map the process",
        detail: "Sketch the current process as a simple flow of steps, from trigger to outcome.",
      },
      {
        title: "Mark the pain points",
        detail: "Highlight where defects, delays or rework most often occur.",
      },
      {
        title: "Pick one improvement",
        detail: "Choose the single change with the best effort-to-impact ratio and note why.",
      },
      {
        title: "Define a metric",
        detail: "Decide how you'll measure whether the change actually worked.",
      },
    ],
  };
}

export function getDiscussionThreads(topic: FlatTopic): DiscussionThread[] {
  return [
    {
      author: "Carlos M.",
      timestamp: "2 hours ago",
      content:
        "Great prompt. In my team the hardest part was agreeing what counted as a defect — once we nailed that, the metrics fell into place.",
      replies: 3,
      upvotes: 12,
    },
    {
      author: "Aisha R.",
      timestamp: "Yesterday",
      content:
        "We baselined before changing anything and it saved us — turns out the “obvious” fix would have made variation worse.",
      replies: 1,
      upvotes: 8,
    },
  ];
}

/** Per-topic downloads. Uses the seeded files when present, else type-appropriate dummies. */
export function getDownloads(topic: FlatTopic): DownloadFile[] {
  const base = topic.id;
  const make = (type: DownloadFile["type"], name: string, size: string): DownloadFile => ({
    id: `${base}-${name}`,
    topicId: topic.id,
    type,
    name,
    size,
    addedAt: "2026-05-15T00:00:00Z",
  });

  const fam = topicFamily(topic.type);

  // Video topics expose their transcript as a downloadable resource here
  // (rather than a separate "download transcript" control on the player).
  const transcriptFile: DownloadFile[] =
    fam === "video" ? [make("TXT", "Transcript (English).txt", "14 KB")] : [];

  const seeded = seedDownloads(topic.id);
  if (seeded.length) return [...seeded, ...transcriptFile];

  let files: DownloadFile[];
  switch (fam) {
    case "reading":
      files = [
        make("PDF", "reading-notes.pdf", "120 KB"),
        make("PDF", "further-reading.pdf", "88 KB"),
      ];
      break;
    case "assessment":
    case "graded":
      files = [
        make("PDF", "assignment-brief.pdf", "96 KB"),
        make("DOCX", "submission-template.docx", "54 KB"),
      ];
      break;
    case "activity":
      files = [make("XLSX", "activity-worksheet.xlsx", "32 KB")];
      break;
    case "discussion":
      files = [make("PDF", "discussion-guidelines.pdf", "40 KB")];
      break;
    default:
      files = [make("PDF", "resources.pdf", "110 KB")];
  }
  return [...files, ...transcriptFile];
}
