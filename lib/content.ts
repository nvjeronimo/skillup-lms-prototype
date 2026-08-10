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
  /**
   * Answer cardinality (CAPA). false/undefined = single-select
   * (`multiplechoiceresponse` → radio); true = multi-select
   * (`choiceresponse` → checkbox). Drives the option marker (BR-3).
   */
  multiSelect?: boolean;
  /** Revealed by "Show answer" — the platform's <solution> block. */
  explanation?: string;
  /** Authored `<demandhint>` list. The platform accumulates them, 1..N. */
  hints?: string[];
  /** The block's `display_name`, printed above the question in mode A. */
  platformPrompt?: string;
  /** Topic this question draws on, for the "review lesson" link after a wrong answer. */
  reviewTopicId?: string;
  reviewTopicTitle?: string;
}

/**
 * Quiz configuration. On Open edX this is NOT part of the problem — graded /
 * attempts / weight live on the subsection, and the same problem blocks are
 * reused across Practice, Graded and Final Exam. We mirror that here.
 */
/**
 * Which of the two experiences a quiz runs (quizzes/08-two-modes.md).
 *
 * A — how the platform behaves today: one scrolling page, no entry screen, no
 *     results, no explanations, and Previous/Next that leave the quiz.
 * B — the proposal: a stepper with an entry screen, explanations and a results
 *     surface rendered in place.
 *
 * The mode belongs to the quiz, not the question and not the course. The
 * prototype defaults to A so an unconfigured quiz behaves as production does;
 * the design system defaults the other way because it is a design tool.
 */
export type QuizMode = "A" | "B";

export interface QuizConfig {
  variant: "practice" | "graded" | "final";
  label: string;
  mode: QuizMode;
  /**
   * Maximum Attempts as the platform stores it, per problem.
   * `undefined` = blank, which means **unlimited on an ordinary problem** and
   * **one on a timed exam** — never render "unlimited" when `isTimed`.
   */
  maxAttempts?: number;
  /** A timed exam reads a blank attempts field as one attempt, not unlimited. */
  isTimed?: boolean;
  /** % of the final grade; undefined for practice */
  weightPct?: number;
  passThresholdPct: number;
  estMinutes: number;
  /** Graded quizzes warn that a submitted answer cannot be changed. */
  submitIsFinal: boolean;
  /** Shuffled questions need Reset before a second submit — the retry owns both steps. */
  rerandomize?: boolean;
  /** `show_correctness: never` — submitted, but the result is masked. */
  resultsWithheld?: boolean;
  /**
   * Authoring model (spec §11). `false` = one `problem` per question, which is
   * what mode A-1 renders. `true` = the bucket: every question lives in ONE
   * CAPA problem, so the platform gives one Submit, one pooled attempt count
   * and one score, with partial credit per correct question.
   */
  bucket?: boolean;
  /** The bucket's own `display_name`, printed once above the whole set. */
  bucketPrompt?: string;
}

export interface ActivityContent {
  /**
   * How the activity is delivered. In our production courses these are SCORM
   * packages (Articulate) rendered in an iframe; the checklist is the fallback
   * for activities authored as plain HTML.
   */
  kind: "scorm" | "checklist";
  intro: string;
  steps: { title: string; detail: string }[];
  /** SCORM only — shown so the learner knows what they are about to open. */
  packageLabel?: string;
  packageSizeLabel?: string;
}

export interface DiscussionThread {
  author: string;
  timestamp: string;
  content: string;
  replies: number;
  upvotes: number;
}

/**
 * ADDING A NEW TOPIC CONTENT TYPE — READ THIS FIRST
 *
 * A type is not one definition; it is an entry in every list that describes
 * topics. Miss one and the type still renders, so nothing looks broken — it
 * just behaves differently from every other type, and the defect only shows up
 * when two types are compared side by side. Every item below was found broken
 * in this codebase after adding a type:
 *
 *   1. TopicType union .................. lib/types.ts
 *   2. TopicFamily union ................ below
 *   3. topicFamily() .................... below            (else: falls back to Reading)
 *   4. topicDescription() ............... below            (else: echoes the topic title)
 *   5. getDownloads() ................... below            (else: shows a generic file)
 *   6. PRIMARY_LABEL .................... PlayerShell.tsx  (else: unlabelled first tab)
 *   7. hasInFrameAction ................. PlayerShell.tsx  (else: two Mark-as-Complete)
 *   8. the view switch .................. TopicBody.tsx
 *   9. topicTypeIcon() .................. lib/icons.tsx
 *  10. SHORT_LABELS ..................... lib/utils.ts     (else: truncates in sidebar)
 *  11. ALL_TOPIC_TYPES .................. TopicTypeBadge.tsx
 *
 * Worth converting into a test that fails on an unregistered family rather
 * than relying on memory. See LMS-HANDOFF/topic-types-inventory.md section 6.
 */
/** High-level family used to pick the right player view. */
export type TopicFamily =
  | "video"
  | "reading"
  | "assessment"
  | "graded"
  | "activity"
  | "lab"
  | "ora"
  | "lessonPage"
  | "podcast"
  | "vilt"
  | "blocked";

export function topicFamily(type: TopicType): TopicFamily {
  switch (type) {
    case "Video":
      return "video";
    case "Reading":
      return "reading";
    case "Lesson Page":
      return "lessonPage";
    case "Quiz":
    case "Practice Assignment":
      return "assessment";
    case "Peer-graded":
    case "Peer Review":
    case "Project":
      // Open Response Assessment — submit, review a peer, receive a grade.
      return "ora";
    case "Graded Assignment":
      return "graded";
    case "Activity":
      return "activity";
    case "Lab":
      // A Lab is not an Activity: SCORM runs interactively in an iframe,
      // whereas a Lab is a notebook you download and run offline.
      return "lab";
    case "Podcast":
      return "podcast";
    case "VILT-Live Session":
    case "VILT-Recording":
      return "vilt";
    case "Programming Assignment":
    case "Role Play":
    case "Dialogue":
      // Coursera-native types with no stock Open edX path — represented as a
      // "needs a platform decision" state rather than a working topic.
      return "blocked";
    default:
      return "reading";
  }
}

/** Short description shown in the Topic Header for non-video topics. */
export function topicDescription(topic: FlatTopic): string {
  const fam = topicFamily(topic.type);
  switch (fam) {
    case "video":
      return `A short video lesson, with a synced transcript you can search and take notes from.`;
    case "reading":
      return `A short read on “${topic.title}”, with the key ideas you need before moving on.`;
    case "assessment": {
      // A 3-level course has an implicit module with no title, so there may be
      // no lesson or module name to refer to.
      const context = topic.lessonLabel || topic.moduleTitle;
      return context
        ? `Check your understanding of ${context}. You can retake this as many times as you like.`
        : `Check your understanding before moving on. You can retake this as many times as you like.`;
    }
    case "graded":
      return `Apply what you've learned and submit your work. This assignment counts toward your final grade.`;
    case "activity":
      return topic.moduleTitle
        ? `An interactive exercise to practise the concepts from ${topic.moduleTitle}.`
        : `An interactive exercise to practise the concepts from this course.`;
    case "ora":
      return `A peer-reviewed project. You'll submit your work, review a peer, and receive a grade.`;
    case "lessonPage":
      return `A guided page that brings together everything on this topic: video, notes, diagrams and downloads.`;
    case "lab":
      return `A hands-on lab you run on your own machine. Nothing is submitted and it isn't graded.`;
    case "podcast":
      return `A conversation you can listen to on the move, with transcript and chapters included.`;
    case "vilt":
      return `A live, instructor-led session with your cohort.`;
    case "blocked":
      return `This content type isn't available on the platform yet. It needs a build-or-buy decision first.`;
    default:
      return topic.title;
  }
}

/**
 * Footer-meta contract (topic-types-inventory §175). The Author & Updated Date
 * row is kept only on authored content that changes over time and dropped on
 * assessment / interactive / live types (no single author, no meaningful
 * "updated"). Video is excluded here because it carries its own chrome footer.
 * The feedback row (Like/Dislike/Report) stays on every type — handled in the shell.
 */
export const FOOTER_AUTHOR_FAMILIES: TopicFamily[] = ["reading", "lessonPage", "lab", "podcast"];

export interface TopicByline {
  author: string;
  role: string;
  /** "Updated {updated}" — e.g. "May 2026". */
  updated: string;
}

export function getByline(_topic: FlatTopic): TopicByline {
  return {
    author: "Dr. Sarah Chen",
    role: "Lead instructor · ASQ-Certified Six Sigma Black Belt",
    updated: "May 2026",
  };
}

export interface BlockedInfo {
  /** Short badge label, e.g. "No edX equivalent". */
  badge: string;
  what: string;
  whyBlocked: string;
  possiblePath: string;
  note?: string;
}

/** Per-type detail for the blocked content types (Coursera-native, no stock edX path). */
export function getBlockedInfo(topic: FlatTopic): BlockedInfo {
  switch (topic.type) {
    case "Programming Assignment":
      return {
        badge: "Needs infrastructure",
        what: "An in-browser, auto-graded coding notebook. The learner writes and runs code and it's graded on the spot, across languages.",
        whyBlocked: "Open edX has no stock in-browser auto-grader; the grading happens off-platform.",
        possiblePath: "External Grader via XQueue (provisional), or an LTI bridge to JupyterHub.",
        note: "Not a duplicate of Lab: a Lab is downloaded and run offline, ungraded; this runs and grades in the browser. If Labs migrate here, 24 topics are affected.",
      };
    case "Role Play":
      return {
        badge: "No edX equivalent",
        what: "An AI-driven scenario where the learner holds a conversation in a role: rehearsing a negotiation, an interview, a difficult conversation.",
        whyBlocked: "There is no Open edX component for a live LLM conversation.",
        possiblePath: "A custom XBlock with LLM integration, or an LTI launch to an external AI tool.",
        note: "Same engine as Dialogue in a different mode, so one build-or-buy decision covers both.",
      };
    case "Dialogue":
      return {
        badge: "No edX equivalent",
        what: "Free-form AI conversational practice: a back-and-forth with an AI partner to rehearse a skill until it sticks.",
        whyBlocked: "Like Role Play, it needs an LLM in the loop, which Open edX doesn't provide.",
        possiblePath: "Most likely the same component as Role Play, in a different mode.",
      };
    default:
      return {
        badge: "Not available yet",
        what: "This content type isn't available on the platform yet.",
        whyBlocked: "No stock Open edX path.",
        possiblePath: "To be decided.",
      };
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
    `Let's start with the why. Getting ${subject} right is what keeps the rest of the workflow from drifting.`,
    `Here's the core idea: keep it concrete, measurable, and tied to what the customer actually cares about.`,
    `A common pitfall is jumping straight to a fix before the problem is properly defined, and we'll avoid that.`,
    `Notice how each step feeds the next: define the problem, measure the baseline, then act on what the data says.`,
    `Let's walk through a quick example so the concept sticks before you try it yourself in the activity.`,
    `That's the essence of ${subject}. In the next topic we build on it, so jot down anything you want to revisit.`,
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
          "In process improvement, clarity beats cleverness. Before optimising anything, you need a shared, measurable definition of the problem, otherwise teams optimise different things and progress stalls.",
          "Six Sigma gives us a disciplined way to define, measure and reduce variation. The goal is not perfection; it is predictability: outcomes you can rely on, batch after batch.",
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
      text: "You can't improve what you can't measure, and you can't measure what you haven't defined.",
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
      // The block display_name the platform prints above every question. The
      // same generic line repeats down the page — that repetition is the point.
      platformPrompt: "Choose the correct option",
      hints: [
        "Think about what varies between two units coming off the same line.",
        "Speed and headcount are outcomes of a stable process, not the target.",
        "The goal is predictability: the same result, batch after batch.",
      ],
      explanation:
        "Six Sigma is a data-driven methodology for reducing variation. Fewer defects follow from a more predictable process; speed and headcount are outcomes, never the goal.",
      reviewTopicId: "m3-t1",
      reviewTopicTitle: "Introduction to the DMAIC methodology",
      options: [
        {
          id: "a",
          label: "Reduce process variation and defects",
          correct: true,
          feedback: "Correct. Controlling variation is what makes a process predictable and defect-free.",
        },
        {
          id: "b",
          label: "Increase production speed at any cost",
          feedback: "Speed gained by ignoring quality creates rework, which raises variation rather than lowering it.",
        },
        {
          id: "c",
          label: "Eliminate all documentation",
          feedback: "The opposite. Six Sigma depends on documented baselines and control plans to prove improvement.",
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
      platformPrompt: "Choose the correct option",
      explanation:
        "Measure comes second precisely so you can quantify the current state before changing anything. Without a baseline there is nothing to compare an improvement against.",
      reviewTopicId: "m3-t2",
      reviewTopicTitle: "The define phase",
      options: [
        { id: "a", label: "Define", feedback: "Define frames the problem and the customer requirements. It does not yet quantify performance." },
        { id: "b", label: "Measure", correct: true, feedback: "Correct. Measure captures the baseline you will improve against." },
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
        { id: "a", label: "The customer's requirements", correct: true, feedback: "Correct. CTQs always start from the voice of the customer." },
        { id: "b", label: "The finance department", feedback: "Budget shapes what you can do, but it does not define quality for the customer." },
        { id: "c", label: "Competitor pricing", feedback: "Useful market context, but pricing is not a quality characteristic." },
        { id: "d", label: "Random sampling", feedback: "Sampling is how you measure a CTQ. It is not where the CTQ comes from." },
      ],
    },
  ];
}

/**
 * Quiz configuration for a topic. Mirrors Open edX: these values come from the
 * SUBSECTION (grading policy + assignment type), not from the problem blocks.
 */
export function getQuizConfig(topic: FlatTopic, mode?: QuizMode): QuizConfig {
  const title = topic.title.toLowerCase();
  const isFinal = title.includes("final") || title.includes("exam");
  const isGraded = isFinal || topic.type === "Graded Assignment" || title.includes("graded");

  // A is what the platform does today, so every quiz opens in A. B is reached
  // only by asking for it in the demo menu — a reviewer should have to choose
  // the proposal, never wander into it.
  const resolved: QuizMode = mode ?? "A";
  // The authoring model is a property of the quiz, not of the mode: a bucket
  // quiz stays a bucket in either. Seeded per topic because it is authoring.
  const bucket = BUCKET_QUIZZES[topic.id];

  if (isFinal) {
    return {
      variant: "final",
      ...(bucket ? { bucket: true, bucketPrompt: bucket } : {}),
      label: "Final exam",
      mode: resolved,
      maxAttempts: 1,
      weightPct: 40,
      passThresholdPct: 70,
      estMinutes: 20,
      submitIsFinal: true,
      rerandomize: true,
    };
  }
  if (isGraded) {
    return {
      variant: "graded",
      ...(bucket ? { bucket: true, bucketPrompt: bucket } : {}),
      label: "Graded quiz",
      mode: resolved,
      maxAttempts: 2,
      weightPct: 20,
      passThresholdPct: 70,
      estMinutes: 10,
      submitIsFinal: true,
      rerandomize: true,
    };
  }
  return {
    variant: "practice",
      ...(bucket ? { bucket: true, bucketPrompt: bucket } : {}),
    label: "Practice quiz",
    mode: resolved,
    // Blank Maximum Attempts. On an ordinary problem that means unlimited, and
    // the catalogue audit confirms it is what practice quizzes actually carry:
    // 31 questions at 2 attempts (graded/final), the rest with no limit. An
    // earlier note here claimed the platform cannot express unlimited — that
    // came from over-reading one vendor sentence and is retracted (spec §9.4).
    maxAttempts: undefined,
    weightPct: undefined,
    passThresholdPct: 60,
    estMinutes: 4,
    submitIsFinal: false,
  };
}

/** Quizzes authored as one CAPA problem holding every question. */
const BUCKET_QUIZZES: Record<string, string> = {
  "m1-t3": "Knowledge check",
  "m3-t4k": "Final assessment",
};

/**
 * Above this an attempts count stops being a meaningful constraint, so the
 * pill is hidden rather than printing noise like "100 attempts". Never
 * substitute the word "unlimited" for a high number: say the number, or
 * nothing (spec §9.4).
 */
export const ATTEMPTS_DISPLAY_CEILING = 10;

/**
 * How the attempts allowance should read, or undefined to render nothing.
 *
 * An attempt is one run through the WHOLE quiz, not a retry of one question
 * (spec §9.3) — so this is quiz-level information, and the copy must never
 * scope it to the question in front of the learner.
 */
export function attemptsLabel(config: QuizConfig): string | undefined {
  if (typeof config.maxAttempts === "number") {
    return config.maxAttempts <= ATTEMPTS_DISPLAY_CEILING
      ? `${config.maxAttempts} ${config.maxAttempts === 1 ? "attempt" : "attempts"}`
      : undefined;
  }
  // Blank means one attempt on a timed exam and unlimited elsewhere. Telling a
  // learner they have unlimited tries at a one-shot exam is the dangerous
  // direction of this mistake, so the timed case never says "unlimited".
  return config.isTimed ? "1 attempt" : "Unlimited attempts";
}

export function getActivity(topic: FlatTopic): ActivityContent {
  // Branching / scenario activities are authored as SCORM packages.
  const isScorm = /scenario|match|connect|simulat/i.test(topic.title);
  return {
    kind: isScorm ? "scorm" : "checklist",
    packageLabel: "Articulate Storyline package",
    packageSizeLabel: "8.4 MB",
    intro: `Work through the steps below. Tick each one as you go and your progress is saved automatically. This activity should take about ${topic.duration.replace(/^approx\.\s*/, "")}.`,
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
        "Great prompt. In my team the hardest part was agreeing what counted as a defect. Once we nailed that, the metrics fell into place.",
      replies: 3,
      upvotes: 12,
    },
    {
      author: "Aisha R.",
      timestamp: "Yesterday",
      content:
        "We baselined before changing anything and it saved us. Turns out the “obvious” fix would have made variation worse.",
      replies: 1,
      upvotes: 8,
    },
  ];
}

/** Per-topic downloads. Uses the seeded files when present, else type-appropriate dummies. */
/** File-type chip derived from the extension — one source of truth per file. */
function extType(name: string): DownloadFile["type"] {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, DownloadFile["type"]> = {
    pdf: "PDF",
    doc: "DOCX",
    docx: "DOCX",
    xls: "XLSX",
    xlsx: "XLSX",
    csv: "CSV",
    ppt: "PPTX",
    pptx: "PPTX",
    zip: "ZIP",
    txt: "TXT",
    srt: "SRT",
    ipynb: "IPYNB",
    mp3: "MP3",
  };
  return map[ext] ?? "TXT";
}

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

  // Blocked types aren't real topics — no files.
  if (fam === "blocked") return [];

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
    case "lessonPage": {
      // Derive from the page's own file blocks, so the Downloads tab and the
      // content agree instead of advertising a file that isn't on the page.
      files = getLessonPage(topic)
        .blocks.filter((b): b is Extract<LessonBlock, { kind: "file" }> => b.kind === "file")
        .map((b) => make(extType(b.name), b.name, b.size));
      break;
    }
    case "lab":
      // Same principle: the lab's own assets are what the learner needs.
      files = getLab(topic).files.map((f) => make(extType(f.name), f.name, f.size));
      break;
    case "ora":
      files = [
        make("PDF", "project-brief.pdf", "180 KB"),
        make("DOCX", "submission-template.docx", "62 KB"),
      ];
      break;
    case "podcast":
      files = [make(extType("episode-audio.mp3"), "episode-audio.mp3", "18 MB")];
      break;
    case "vilt":
      files = [make("PDF", "session-slides.pdf", "2.1 MB")];
      break;
    default:
      files = [make("PDF", "resources.pdf", "110 KB")];
  }
  return [...files, ...transcriptFile];
}

/* ---------------------------------------------------------------- VILT --- */

/**
 * VILT is one Topic Content Type whose underlying asset changes over time:
 * pre-live has no asset at all (only scheduling metadata), live is an external
 * stream, and the recording is a Video asset. The player therefore renders one
 * row that changes stage, not three separate types.
 */
export type ViltStage = "pre-live" | "live" | "recording";

export interface ViltSession {
  stage: ViltStage;
  title: string;
  /** Human date/time as the learner sees it. */
  whenLabel: string;
  durationLabel: string;
  host: string;
  platform: "Zoom" | "Teams";
  /** Minutes until start — drives the countdown and the Join unlock. */
  minutesUntilStart: number;
  /** Join unlocks this many minutes before the session. */
  joinUnlocksMinutesBefore: number;
  agenda: string[];
  attendees: { live: number; total: number };
  /** Completion rule differs per stage — attendance vs watched. */
  completionRule: string;
}

export function getViltSession(topic: FlatTopic): ViltSession {
  const isRecording = topic.type === "VILT-Recording";
  if (isRecording) {
    return {
      stage: "recording",
      title: topic.title,
      whenLabel: "Recorded Tue 15 Jul · 15:00 WEST",
      durationLabel: topic.duration,
      host: "Dr. Marta Silva",
      platform: "Zoom",
      minutesUntilStart: 0,
      joinUnlocksMinutesBefore: 15,
      agenda: [
        "Gauge R&R walkthrough",
        "Common measurement pitfalls",
        "Open Q&A from the cohort",
      ],
      attendees: { live: 0, total: 30 },
      completionRule: "Completes automatically once you have watched 90%.",
    };
  }
  return {
    stage: "pre-live",
    title: topic.title,
    whenLabel: "Thu 24 Jul · 15:00–16:00 WEST",
    durationLabel: "60 min",
    host: "Dr. Marta Silva",
    platform: "Zoom",
    minutesUntilStart: 12,
    joinUnlocksMinutesBefore: 15,
    agenda: [
      "Bring one process from your own work",
      "Live DMAIC framing in breakout groups",
      "Feedback round with the cohort",
    ],
    attendees: { live: 24, total: 30 },
    completionRule: "Attend live (join + at least 50% of the session) or watch the recording to 90%.",
  };
}

/* ----------------------------------------------------------------- Lab --- */

export interface LabContent {
  intro: string;
  /** What the learner needs before starting. */
  prerequisites: string[];
  steps: string[];
  files: { name: string; kind: "notebook" | "pdf" | "data"; size: string }[];
  estimatedMinutes: number;
}

/**
 * A Lab is authored as an HTML block plus downloadable assets — the learner
 * runs it offline in their own Jupyter install, so there is no grading and
 * completion is manual. That is why it is not an Activity (SCORM).
 */
export function getLab(topic: FlatTopic): LabContent {
  return {
    intro:
      "In this lab you'll run pre-written Python against a sample process dataset to calculate capability indices and spot the drivers of variation. Everything runs locally and nothing is submitted.",
    prerequisites: [
      "Python 3.10+ with Jupyter Notebook installed",
      "pandas and matplotlib available in your environment",
    ],
    steps: [
      "Download the notebook and the dataset below.",
      "Place both files in the same folder and open the notebook in Jupyter.",
      "Run each cell in order; the comments explain what to expect.",
      "Compare your Cp / Cpk output against the worked example in the PDF.",
    ],
    files: [
      { name: "process_capability_lab.ipynb", kind: "notebook", size: "24 KB" },
      { name: "sample_process_data.csv", kind: "data", size: "112 KB" },
      { name: "Lab_instructions.pdf", kind: "pdf", size: "1.2 MB" },
    ],
    estimatedMinutes: 45,
  };
}

/* ------------------------------------------------------------- Podcast --- */

export interface PodcastContent {
  host: string;
  guest?: string;
  episodeLabel: string;
  summary: string;
  chapters: { ts: string; label: string }[];
}

/** Podcast uses an audio asset — same player chrome as Video, audio surface. */
export function getPodcast(topic: FlatTopic): PodcastContent {
  return {
    host: "Dr. Marta Silva",
    guest: "Ana Ferreira, Head of Quality at Northwind",
    episodeLabel: "Episode 4",
    summary:
      "A conversation about what actually changes on the shop floor when a Six Sigma programme lands, and the three mistakes that stall most rollouts in the first ninety days.",
    chapters: [
      { ts: "0:00", label: "Why most programmes stall early" },
      { ts: "4:12", label: "Getting operators to trust the data" },
      { ts: "11:40", label: "Choosing the first project" },
      { ts: "18:05", label: "What good sponsorship looks like" },
    ],
  };
}

/* ----------------------------------------------------------------- ORA --- */

/**
 * Open Response Assessment. Our courses enable 3 of the 6 edX steps —
 * Response → Peer → Grade (no Learner Training, no Self Assessment) — which is
 * 12 learner-facing states. This is the only topic type where the learner
 * returns over days or weeks, so waiting and empty states matter as much as
 * the forms.
 */
export type OraStep = "response" | "peer" | "grade";

export interface OraCriterion {
  id: string;
  label: string;
  maxPoints: number;
  options: { points: number; label: string }[];
}

export interface OraContent {
  brief: string;
  deliverable: string;
  dueLabel: string;
  requiredReviews: number;
  acceptedTypes: string[];
  criteria: OraCriterion[];
  /** Prompt shown on the peer-review form. */
  overallCommentPrompt: string;
}

export function getOra(topic: FlatTopic): OraContent {
  return {
    brief:
      "Define a control plan for a process of your choice. Identify the critical-to-quality characteristics, the metrics you'll monitor, the control limits, and the response plan when a measurement falls out of range.",
    deliverable:
      "Submit your plan as a PDF or DOCX, 1–2 pages, including at least one control chart sketch.",
    dueLabel: "Due 1 Sep 2026",
    requiredReviews: 1,
    acceptedTypes: [".pdf", ".docx", ".png", ".jpg"],
    overallCommentPrompt: "What did you like most about your peer's submission?",
    criteria: [
      {
        id: "c1",
        label: "Task 1 · Identify the CTQ characteristics",
        maxPoints: 3,
        options: [
          { points: 3, label: "All CTQs identified and traced to a customer need" },
          { points: 2, label: "Most CTQs identified, tracing is partial" },
          { points: 0, label: "Not attempted or incorrect" },
        ],
      },
      {
        id: "c2",
        label: "Task 2 · Define the metrics and control limits",
        maxPoints: 6,
        options: [
          { points: 6, label: "Metrics and limits are specific, measurable and justified" },
          { points: 4, label: "Metrics defined, limits weakly justified" },
          { points: 2, label: "Metrics present but no limits" },
          { points: 0, label: "Not attempted" },
        ],
      },
      {
        id: "c3",
        label: "Task 3 · Include a control chart",
        maxPoints: 5,
        options: [
          { points: 5, label: "Correct chart type with limits drawn and labelled" },
          { points: 3, label: "Chart present but limits missing or mislabelled" },
          { points: 0, label: "No chart" },
        ],
      },
      {
        id: "c4",
        label: "Task 4 · Define the response plan",
        maxPoints: 6,
        options: [
          { points: 6, label: "Clear owner, trigger and action for each out-of-range case" },
          { points: 4, label: "Actions defined but ownership unclear" },
          { points: 2, label: "Vague or generic response plan" },
          { points: 0, label: "Not attempted" },
        ],
      },
    ],
  };
}

export function oraMaxPoints(content: OraContent): number {
  return content.criteria.reduce((sum, c) => sum + c.maxPoints, 0);
}

/* --------------------------------------------------------- Lesson Page --- */

/**
 * A Lesson Page is a topic composed of several assets stacked vertically —
 * exactly how an Open edX unit already works ("A unit can contain one or more
 * components"). Two things follow:
 *
 *  1. ANY topic can carry extra blocks: a Video topic often has an intro and a
 *     recap around the player. The renderer must handle that regardless of type.
 *  2. When there is no dominant asset, the topic is authored as a Lesson Page
 *     so it isn't mislabelled as "Video" in the outline.
 */
export type LessonBlock =
  | { kind: "text"; heading?: string; paragraphs: string[] }
  | { kind: "video"; title: string; durationLabel: string }
  | { kind: "image"; caption: string; alt: string }
  | { kind: "file"; name: string; fileKind: "pdf" | "doc" | "data"; size: string }
  | { kind: "callout"; tone: "info" | "warning"; title: string; body: string }
  | { kind: "knowledge-check"; question: string; options: QuizOption[] };

export interface LessonPageContent {
  intro?: string;
  blocks: LessonBlock[];
}

export function getLessonPage(topic: FlatTopic): LessonPageContent {
  return {
    intro:
      "This page pulls together everything you need on control charts: the theory, a worked example, the template you'll use, and a quick check before you move on.",
    blocks: [
      {
        kind: "text",
        heading: "Why control charts matter",
        paragraphs: [
          "A control chart separates the variation that is inherent to a process from the variation that signals something has changed. Without that distinction, teams react to noise and make the process worse.",
          "The chart itself is simple: a centre line at the process mean, and control limits three standard deviations either side. What takes practice is reading it.",
        ],
      },
      {
        kind: "video",
        title: "Reading a control chart in 4 minutes",
        durationLabel: "4m 12s",
      },
      {
        kind: "image",
        caption: "An in-control process (left) versus one showing a shift in the mean (right).",
        alt: "Two control charts side by side, the second showing seven consecutive points above the centre line",
      },
      {
        kind: "callout",
        tone: "warning",
        title: "The most common mistake",
        body: "Control limits are not specification limits. Limits come from the process itself; specs come from the customer. Plotting specs on a control chart hides real signals.",
      },
      {
        kind: "text",
        heading: "The rules you'll actually use",
        paragraphs: [
          "Most teams need only three: a single point beyond the limits, seven consecutive points on one side of the centre line, and a run of seven rising or falling. Each points to a different kind of cause.",
        ],
      },
      {
        kind: "file",
        name: "Control_chart_template.xlsx",
        fileKind: "data",
        size: "48 KB",
      },
      {
        kind: "knowledge-check",
        question: "Seven consecutive points above the centre line most likely indicates…",
        options: [
          {
            id: "a",
            label: "Normal random variation",
            feedback: "A run that long is very unlikely by chance. It is a signal, not noise.",
          },
          {
            id: "b",
            label: "A shift in the process mean",
            correct: true,
            feedback: "Correct. A sustained run on one side points to a shift with an assignable cause.",
          },
          {
            id: "c",
            label: "That the control limits are too wide",
            feedback: "Wide limits would make signals harder to see, not create a sustained run.",
          },
        ],
      },
    ],
  };
}
