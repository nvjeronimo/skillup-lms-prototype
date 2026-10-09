import { aiContentCourse, getCourseForTopic, topicDownloads as seedDownloads, uxResearchCourse } from "./data";
import type { DownloadFile, FlatTopic, TopicType, TranscriptLine } from "./types";

/**
 * Dummy content for every topic type so the prototype feels complete when you
 * navigate the whole course. Deterministic, Six-Sigma-themed, derived from the
 * topic's title/type. The Video topic keeps its real transcript (lib/data).
 *
 * The two platform courses with an outline of their own never print the Six Sigma
 * sample: a few of their topics have a body written for them and the rest get
 * wording that names no subject (see "Courses with their own content" at the end).
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
      return (
        getPartnerLab(topic)?.description ??
        `A hands-on lab you run on your own machine. Nothing is submitted and it isn't graded.`
      );
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

export function getByline(topic: FlatTopic): TopicByline {
  const own = ownContent(topic);
  if (own) return own.byline;
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
  const spoken = ownContent(topic) ? plainTranscript(subject, mod) : lines;
  return spoken.map((text, i) => ({ id: `${topic.id}-l${i + 1}`, ts: fmt(i * 18), text }));
}

export function getArticle(topic: FlatTopic): ArticleContent {
  const own = ownContent(topic);
  if (own) {
    return {
      byline: { author: own.byline.author, date: `Updated ${own.byline.updated}`, readingTime: topic.duration },
      ...(own.articles[topic.id] ?? plainArticle(topic)),
    };
  }
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
  const own = ownContent(topic);
  if (own) return own.quizzes[topic.id] ?? own.quiz;
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
  const activity: ActivityContent = {
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
  return ownContent(topic) ? { ...activity, steps: PLAIN_ACTIVITY_STEPS } : activity;
}

export function getDiscussionThreads(topic: FlatTopic): DiscussionThread[] {
  if (ownContent(topic)) return PLAIN_DISCUSSION_THREADS;
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
      // A partner lab has no files of ours: everything is on the partner's platform.
      {
        const lab = getLab(topic);
        files = lab.kind === "download" ? lab.files.map((f) => make(extType(f.name), f.name, f.size)) : [];
      }
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

/** The download lab: a notebook the learner runs on their own machine. */
export interface DownloadLabContent {
  kind: "download";
  intro: string;
  /** What the learner needs before starting. */
  prerequisites: string[];
  steps: string[];
  files: { name: string; kind: "notebook" | "pdf" | "data"; size: string }[];
  estimatedMinutes: number;
}

/**
 * The partner lab (lab-third-party-platforms.md): it runs on the partner's own platform
 * and the learner leaves ours to do it. What differs per partner is what comes back.
 *
 * - Google is an LTI component (`lti_consumer`) with a score: the topic completes when
 *   Google sends the score, so there is no manual action.
 * - Microsoft is a link in a Text component: nothing comes back, so the learner marks
 *   the topic complete.
 */
export interface PartnerLabContent {
  kind: "partner";
  partner: "google" | "microsoft";
  /** DS `LMS / Provider-Partner Badge` on the launch card. */
  provider: "Google Cloud" | "Microsoft";
  /** The partner's lab platform, as the learner knows it. */
  platform: string;
  /** True when the partner sends a score back (LTI, graded). */
  scored: boolean;
  description: string;
  intro: string;
  prerequisites: string[];
}

export type LabContent = DownloadLabContent | PartnerLabContent;

const PARTNER_LABS: Record<string, PartnerLabContent> = {
  "m3-t4e2": {
    kind: "partner",
    partner: "google",
    provider: "Google Cloud",
    platform: "Google Skills",
    scored: true,
    description:
      "A hands-on lab on Google Cloud: create a virtual machine, connect to it and deploy a web server.",
    intro:
      "This lab runs on Google Skills, Google's own lab platform. You work in a real Google Cloud project with temporary credentials, so you don't need your own Google Cloud account or a credit card.",
    prerequisites: [
      "A desktop or laptop: this lab is not supported in the mobile app",
      "Chrome, in an Incognito window, so your personal Google account stays out of the lab",
      "About 45 minutes in one sitting: the lab timer can't be paused",
    ],
  },
  "m3-t4e3": {
    kind: "partner",
    partner: "microsoft",
    provider: "Microsoft",
    platform: "Microsoft Learn",
    scored: false,
    description:
      "A Microsoft Learn module with hands-on exercises on Azure Service Bus and Queue Storage.",
    intro:
      "This lab is a module on Microsoft Learn. You read the units and do the exercises on Microsoft's site, then come back here to mark the topic as complete.",
    prerequisites: [
      "A Microsoft account, to sign in to Microsoft Learn and save your progress there",
      "A desktop or laptop is recommended for the exercises",
      "About 50 minutes",
    ],
  },
};

/**
 * A download Lab is authored as an HTML block plus downloadable assets — the learner
 * runs it offline in their own Jupyter install, so there is no grading and
 * completion is manual. That is why it is not an Activity (SCORM).
 */
export function getLab(topic: FlatTopic): LabContent {
  const partner = PARTNER_LABS[topic.id];
  if (partner) return partner;
  return {
    kind: "download",
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

/** The partner lab behind a topic, or null for every other topic (download labs included). */
export function getPartnerLab(topic: FlatTopic): PartnerLabContent | null {
  return PARTNER_LABS[topic.id] ?? null;
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
  const own = ownContent(topic);
  if (own) return own.ora[topic.id] ?? plainOra(topic);
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

/* --------------------------------------------------- Graded assignment --- */

/** The brief of a Graded Assignment (a file submission): a paragraph and its short list. */
export interface AssignmentBrief {
  brief: string;
  requirements: string[];
}

export function getAssignmentBrief(topic: FlatTopic): AssignmentBrief {
  const own = ownContent(topic);
  if (own) return own.assignments[topic.id] ?? plainAssignmentBrief(topic);
  return {
    brief:
      "Define a control plan for a process of your choice. Identify the critical-to-quality characteristics, the metrics you’ll monitor, the control limits, and the response plan when a measurement falls out of range. Submit your plan as a PDF or DOCX.",
    requirements: ["1–2 pages", "Include at least one control chart sketch", "Counts toward your final grade"],
  };
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

/* ------------------------------------------- Courses with their own content --- */

/**
 * What a platform course with its own outline (lib/data) says in place of the Six Sigma
 * sample. Written for the topics a learner is most likely to open: the one the course
 * resumes on, one reading, one practice quiz and the assignment the Dashboard lists as due.
 * A video's own transcript sits on the topic itself (lib/data). Every other topic of the
 * course gets the plain wording below, which names no subject.
 */
interface OwnCourseContent {
  byline: TopicByline;
  /** The questions of every quiz of the course that has none of its own. */
  quiz: QuizQuestion[];
  /** By topic id. */
  articles: Record<string, Omit<ArticleContent, "byline">>;
  quizzes: Record<string, QuizQuestion[]>;
  assignments: Record<string, AssignmentBrief>;
  ora: Record<string, OraContent>;
}

const AI_CONTENT: OwnCourseContent = {
  byline: {
    author: "Rajesh Menon",
    role: "Lead instructor · AI Augmented Digital Marketing",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "What is a brand voice guide for?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A voice guide describes how the brand sounds, with traits and examples, so that copy stays recognisable whoever drafts it: a colleague, an agency or an AI assistant.",
      options: [
        {
          id: "a",
          label: "Keeping copy recognisable as the same brand, whoever or whatever drafts it",
          correct: true,
          feedback: "Correct. The guide is what a writer, or a prompt, is checked against.",
        },
        { id: "b", label: "Listing the brand's colours and logo sizes", feedback: "That is the visual identity guide. The voice guide is about words." },
        { id: "c", label: "Removing the need to edit AI drafts", feedback: "A guide improves the first draft. Someone still has to check and edit it." },
        { id: "d", label: "Describing the target audience", feedback: "The audience belongs in the content brief. The voice guide describes how the brand speaks." },
      ],
    },
    {
      question: "Which of these belongs in a content brief?",
      platformPrompt: "Choose the correct option",
      explanation:
        "The brief describes the job: the reader, the single action, the one message, the voice and the format. The copy itself comes after.",
      options: [
        { id: "a", label: "The finished copy", feedback: "The brief comes before the copy. It describes the job, not the result." },
        { id: "b", label: "The single action you want the reader to take", correct: true, feedback: "Correct. One reader, one action, one message." },
        { id: "c", label: "Every feature of the product", feedback: "A brief that lists everything gives the draft nothing to lead with." },
        { id: "d", label: "The name of the AI tool you will use", feedback: "The brief should work with any tool, or with a human writer." },
      ],
    },
    {
      question: "Who is responsible for the accuracy of copy drafted with an AI assistant?",
      explanation:
        "The assistant drafts; it does not check facts about your product or your market. Whoever publishes the copy answers for every claim in it.",
      options: [
        { id: "a", label: "The assistant", feedback: "An assistant can state things that are not true of your product. It cannot answer for them." },
        { id: "b", label: "The provider of the tool", feedback: "The provider supplies the tool. What you publish with it is yours." },
        { id: "c", label: "The person or team that publishes it", correct: true, feedback: "Correct. Publishing a claim makes it yours to support." },
        { id: "d", label: "Nobody, if the copy is labelled as AI-assisted", feedback: "A label tells the reader how the copy was made. It does not make a claim true." },
      ],
    },
  ],
  articles: {
    "acb-m2-t4": {
      lede: "An ad has a few seconds and a few words. A prompt that only says “write an ad for our product” leaves every decision that matters to the assistant. This reading shows how to make those decisions yourself and put them in the prompt.",
      sections: [
        {
          heading: "Start from the brief, not from the ad",
          paragraphs: [
            "Ad copy fails for the same reasons with or without AI: it speaks to everyone, it promises several things at once, or it sounds like any other brand. The content brief from the first video of this module answers those three points before a word is drafted: one reader, one action, one message.",
            "Put the brief into the prompt in that order. Name the reader as a person in a situation (“a shop owner who does the accounts on Sunday evening”), not as a demographic. State the single action you want. Give the one message in a plain sentence, the way you would say it aloud.",
          ],
        },
        {
          heading: "Give the assistant the limits of the format",
          paragraphs: [
            "Every ad placement has limits: a headline of a few words, a description of one or two lines, a call to action chosen from a short list. Put the limits in the prompt as numbers, and ask for the output in a labelled layout (Headline, Description, Call to action) so you can compare variants line by line.",
            "Add the voice traits from your voice guide, with one example of copy that is on voice and one that is not. Examples steer an assistant further than adjectives do: “friendly” says little, a sentence you would actually publish says a lot.",
          ],
        },
        {
          heading: "Ask for variants, then edit",
          paragraphs: [
            "Ask for five to ten variants that differ in angle, not in wording: one that leads with the problem, one with the outcome, one with proof, one with a question. Variants that differ only in synonyms give you nothing to test.",
            "Then do the part the assistant cannot. Check every claim against something you can show. Remove anything a competitor could say unchanged. Read the headline alone, since many people will not read further. Keep two or three variants worth testing, and record which prompt produced them.",
          ],
        },
      ],
      pullQuote: {
        text: "What you leave out of a prompt, the assistant decides for you.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Decide one reader, one action and one message before you prompt.",
        "State the format limits as numbers and ask for a labelled layout.",
        "Show the voice with one on-voice and one off-voice example.",
        "Ask for variants that differ in angle, then check every claim yourself.",
      ],
    },
  },
  quizzes: {
    "acb-m2-t5": [
      {
        question: "Which prompt gives an AI assistant the most to work with for a social ad?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Look for the prompt that says who the ad is for.",
          "A format limit stated as a number is a good sign.",
        ],
        explanation:
          "A useful prompt carries the brief: one reader, one action, the format limits and the voice. The other three leave those decisions to the assistant.",
        reviewTopicId: "acb-m2-t2",
        reviewTopicTitle: "Anatomy of an effective prompt",
        options: [
          { id: "a", label: "Write a great ad for our accounting app.", feedback: "No reader, no action and no limits: the assistant has to guess all three." },
          {
            id: "b",
            label: "Write 5 headlines of up to 30 characters for shop owners who do their accounts on Sunday evening. Goal: start a free trial. Voice: plain and direct.",
            correct: true,
            feedback: "Correct. It names the reader, the action, the format limit and the voice.",
          },
          { id: "c", label: "Write an ad that will go viral with our target audience.", feedback: "“Viral” is a hope, not an instruction, and the audience is not described." },
          { id: "d", label: "Write the best possible ad. Be creative.", feedback: "Without a reader or a message, the result is copy any brand could use." },
        ],
      },
      {
        question: "You ask for ten ad variants and get ten that differ only in wording. What is the best next prompt?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Variants are worth testing when they differ in angle: the problem, the outcome, proof, a question. Ask for the angles by name.",
        reviewTopicId: "acb-m2-t4",
        reviewTopicTitle: "Creating impactful ad copy with effective prompts",
        options: [
          { id: "a", label: "Ask for twenty more.", feedback: "More of the same gives you more synonyms, not more ideas." },
          {
            id: "b",
            label: "Ask for variants that each take a different angle: the problem, the outcome, proof, a question.",
            correct: true,
            feedback: "Correct. Naming the angles is what makes the variants different.",
          },
          { id: "c", label: "Ask the assistant to pick the best one.", feedback: "It cannot know which will work with your audience. A test can." },
          { id: "d", label: "Raise the word limit.", feedback: "Longer copy does not change the angle." },
        ],
      },
      {
        question: "An AI draft says your product is “the fastest on the market”. What do you do before publishing?",
        explanation:
          "An assistant writes what sounds plausible. A comparative claim needs evidence you hold; without it, remove the claim or reword it to something you can show.",
        reviewTopicId: "acb-m1-t10",
        reviewTopicTitle: "Responsible use: claims, sources and disclosure",
        options: [
          {
            id: "a",
            label: "Check that you can support the claim, and remove or reword it if you cannot.",
            correct: true,
            feedback: "Correct. A claim you publish is a claim you have to support.",
          },
          { id: "b", label: "Keep it: the assistant must have found it somewhere.", feedback: "An assistant can state things that are not true of your product." },
          { id: "c", label: "Make it stronger with an exclamation mark.", feedback: "Punctuation does not make a claim true." },
          { id: "d", label: "Ask the assistant whether the claim is true.", feedback: "It cannot verify facts about your product. You can." },
        ],
      },
    ],
  },
  assignments: {
    "acb-m2-t10": {
      brief:
        "Choose a brand you know, or use the case-study brand from Module 1. Split its audience into three segments by need or situation, not by age or location alone. For each segment, write the content brief and the prompt you would give an AI assistant for one social post, then add the draft you would publish after editing. Submit your work as a PDF or DOCX.",
      requirements: [
        "One page per segment: who they are, what they need and the one message for them",
        "The prompt and the edited draft for each segment",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
};

const UX_RESEARCH: OwnCourseContent = {
  byline: {
    author: "Dr. Marta Silva",
    role: "Lead instructor · UX Research and Design Thinking",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "What is the purpose of the Empathize stage in design thinking?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Empathize comes first so that the problem you define is one real people have. Ideas, prototypes and tests all come after it.",
      options: [
        {
          id: "a",
          label: "To understand people's needs and context before defining the problem",
          correct: true,
          feedback: "Correct. The later stages build on what you learn here.",
        },
        { id: "b", label: "To test a finished prototype", feedback: "That is the Test stage, at the other end of the process." },
        { id: "c", label: "To generate as many ideas as possible", feedback: "That is Ideate. It needs a defined problem to work on." },
        { id: "d", label: "To choose the visual style", feedback: "Visual style is a design decision made much later." },
      ],
    },
    {
      question: "Which of these is the strongest evidence for a design decision?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Observed behaviour across several participants is stronger than opinion, prediction or what another product does.",
      options: [
        { id: "a", label: "What one stakeholder believes users want", feedback: "A belief is a hypothesis to test, not evidence." },
        { id: "b", label: "What participants say they would do in future", feedback: "People are poor at predicting their own behaviour." },
        { id: "c", label: "What several participants were observed doing", correct: true, feedback: "Correct. Behaviour, seen more than once, is the firmest ground." },
        { id: "d", label: "What a competitor has launched", feedback: "A competitor's choice tells you about their users and constraints, not yours." },
      ],
    },
    {
      question: "A persona should be based on…",
      explanation:
        "A persona summarises patterns found across research participants. Without that link to evidence it is a character the team invented.",
      options: [
        { id: "a", label: "The team's ideal customer", feedback: "That describes who the team hopes for, not who was found." },
        { id: "b", label: "Demographic data alone", feedback: "Age and location say little about goals and behaviour." },
        { id: "c", label: "Patterns found in research with real users", correct: true, feedback: "Correct. Each trait should trace back to participants." },
        { id: "d", label: "A single memorable interview", feedback: "One person is a case, not a pattern." },
      ],
    },
  ],
  articles: {
    "uxr-m1-t4": {
      lede: "An interview guide is a one-page plan for a conversation. It keeps you on the research question when the conversation wanders, and it makes five interviews comparable. It is not a script to read aloud.",
      sections: [
        {
          heading: "Start from what you need to learn",
          paragraphs: [
            "Write the research question at the top of the page: the thing the team does not know and has to decide on. “How do people choose where to book a table for a group?” is a research question. “Would people use our group-booking feature?” is not: it asks for a prediction, and people are poor at predicting their own behaviour.",
            "Under it, list three or four topics you need to cover. Topics, not questions: how they do it today, what goes wrong, what they have tried, who else is involved.",
          ],
        },
        {
          heading: "Write questions that ask for stories",
          paragraphs: [
            "For each topic, write one opening question about a specific past occasion: “Tell me about the last time you organised a dinner for more than four people.” Then note two or three follow-ups to use if the story stalls: what happened next, what was hard about that, how they decided.",
            "Check each question against three rules. It is open, so it cannot be answered with yes or no. It is neutral, so it does not suggest the answer. It asks one thing at a time.",
          ],
        },
        {
          heading: "Shape the session",
          paragraphs: [
            "Order the guide the way a conversation flows: an introduction that explains the purpose and asks for consent to take notes or record, a warm-up about the person, the main topics from the general to the specific, and a close that asks what you missed.",
            "Run one pilot interview with a colleague before the first real session. You will find the question nobody understands and the topic that takes twice as long as planned. Change the guide, then keep it stable for the rest of the round.",
          ],
        },
      ],
      pullQuote: {
        text: "Ask about the last time, not about next time.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Put the research question at the top; every question in the guide should serve it.",
        "Plan topics first, then one story question and a few follow-ups for each.",
        "Keep questions open, neutral and single.",
        "Pilot the guide once before the first real interview.",
      ],
    },
  },
  quizzes: {
    "uxr-m1-t5": [
      {
        question: "Which of these is a leading question?",
        platformPrompt: "Choose the correct option",
        hints: [
          "A leading question suggests its own answer.",
          "Look for the question that names a feeling the person has not mentioned.",
        ],
        explanation:
          "A leading question carries the answer inside it. Asking what happened, and how it went, lets the person supply the feeling themselves.",
        reviewTopicId: "uxr-m1-t3",
        reviewTopicTitle: "Discovery interview techniques",
        options: [
          { id: "a", label: "Tell me about the last time you booked a table for a group.", feedback: "Open and neutral: it asks for a story." },
          {
            id: "b",
            label: "Don't you find it frustrating when booking sites hide the price?",
            correct: true,
            feedback: "Correct. It tells the person what to feel before they answer.",
          },
          { id: "c", label: "What did you do after the booking failed?", feedback: "A neutral follow-up about what happened." },
          { id: "d", label: "Who else was involved in the decision?", feedback: "Open and neutral." },
        ],
      },
      {
        question: "Why ask about a specific past occasion rather than what someone usually does?",
        platformPrompt: "Choose the correct option",
        explanation:
          "“Usually” invites a tidy summary. A specific occasion brings back the steps, the tools and what went wrong, which is the material you need.",
        reviewTopicId: "uxr-m1-t3",
        reviewTopicTitle: "Discovery interview techniques",
        options: [
          { id: "a", label: "It makes the interview shorter.", feedback: "Stories often take longer. The gain is detail, not time." },
          {
            id: "b",
            label: "A specific occasion gives steps and details; “usually” gives a summary and opinions.",
            correct: true,
            feedback: "Correct. Detail from a real occasion is evidence.",
          },
          { id: "c", label: "People prefer talking about the past.", feedback: "Preference is not the reason. The quality of the detail is." },
          { id: "d", label: "It removes the need for follow-up questions.", feedback: "Follow-ups are still how you get to the reasons." },
        ],
      },
      {
        question: "Where does the research question go in an interview guide?",
        explanation:
          "The research question is for the team: it sits at the top of the guide and every interview question is checked against it. Participants are asked about their own experience.",
        reviewTopicId: "uxr-m1-t4",
        reviewTopicTitle: "Writing an interview guide",
        options: [
          {
            id: "a",
            label: "At the top of the guide, as the test every question has to pass",
            correct: true,
            feedback: "Correct. It keeps the guide, and the conversation, on course.",
          },
          { id: "b", label: "It is the first question you ask the participant", feedback: "Participants get questions about their own experience, not the team's question." },
          { id: "c", label: "In the closing section", feedback: "The close asks what you missed. The research question frames the whole guide." },
          { id: "d", label: "It is agreed by the team but not written down", feedback: "Unwritten, it drifts from one interview to the next." },
        ],
      },
    ],
  },
  assignments: {},
  ora: {
    "uxr-m1-t10": {
      brief:
        "Using the five interview transcripts of the case study (or your own interviews, if you have run at least three), draft one persona. Show the evidence behind it: the patterns you found across participants, and the quotes or observations that support each one.",
      deliverable:
        "Submit a PDF or DOCX of 1–2 pages: the persona (goals, behaviours, pain points, context) and an evidence table that links each trait to at least two participants.",
      dueLabel: "Due 24 Sep 2026",
      requiredReviews: 1,
      acceptedTypes: [".pdf", ".docx", ".png", ".jpg"],
      overallCommentPrompt: "Which part of your peer's persona was best supported by evidence?",
      criteria: [
        {
          id: "c1",
          label: "Task 1 · Ground the persona in evidence",
          maxPoints: 6,
          options: [
            { points: 6, label: "Every trait is linked to two or more participants" },
            { points: 4, label: "Most traits are linked to evidence; some rest on one participant" },
            { points: 2, label: "Evidence is mentioned but not linked to traits" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c2",
          label: "Task 2 · Describe goals and behaviours",
          maxPoints: 5,
          options: [
            { points: 5, label: "Goals and behaviours are specific and come from the interviews" },
            { points: 3, label: "Goals are clear; behaviours are generic" },
            { points: 0, label: "Missing or invented" },
          ],
        },
        {
          id: "c3",
          label: "Task 3 · Put the pain points in context",
          maxPoints: 5,
          options: [
            { points: 5, label: "Each pain point is tied to a situation and a consequence" },
            { points: 3, label: "Pain points are listed without context" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c4",
          label: "Task 4 · Keep the persona usable",
          maxPoints: 4,
          options: [
            { points: 4, label: "One page, easy to scan, no invented detail" },
            { points: 2, label: "Complete, but padded with detail the research does not support" },
            { points: 0, label: "Not attempted" },
          ],
        },
      ],
    },
  },
};

const OWN_CONTENT: Record<string, OwnCourseContent> = {
  [aiContentCourse.slug]: AI_CONTENT,
  [uxResearchCourse.slug]: UX_RESEARCH,
};

/** The content of the topic's course, when that course has its own; undefined for the sample courses. */
function ownContent(topic: FlatTopic): OwnCourseContent | undefined {
  return OWN_CONTENT[getCourseForTopic(topic.id).slug];
}

/* Plain wording for the topics of those courses that have no body of their own. */

function plainTranscript(subject: string, mod: string): string[] {
  return [
    `Welcome back. In this lesson we work through ${subject} and where it fits within ${mod}.`,
    `Let's start with why it matters, and with what tends to go wrong when this step is skipped.`,
    `Here's the core idea in plain terms, before we look at how it works in practice.`,
    `A common mistake is to rush to the result. We'll slow down and look at the decisions behind it.`,
    `Let's walk through a short example, so you can see each step before you try it yourself.`,
    `Pause here if you want to take a note. The next part builds on this example.`,
    `That's the essence of ${subject}. The next topic builds on it, so note anything you want to revisit.`,
  ];
}

function plainArticle(topic: FlatTopic): Omit<ArticleContent, "byline"> {
  return {
    lede: `${topic.title} is part of ${topic.moduleTitle}. This reading sets out the main ideas and how to use them in the work that follows.`,
    sections: [
      {
        heading: "Why it matters",
        paragraphs: [
          "This topic is here because the later work depends on it. The practice tasks and the graded work of this module assume you can apply it, not only define it.",
          "Read it once for the overall argument, then go back to the parts you would have done differently.",
        ],
      },
      {
        heading: "How to use it",
        paragraphs: [
          "Take one example from your own work and try each idea on it as you read. An idea you have applied once is easier to recall than one you have only read.",
          "Keep a short note of what changed in your example. You can reuse it in the next assignment.",
        ],
      },
    ],
    pullQuote: {
      text: "An idea you have applied once is easier to recall than one you have only read.",
      attribution: "Course notes",
    },
    takeaways: [
      "Read for the decisions each idea helps you make.",
      "Try each idea on one example from your own work.",
      "Note what changed, and bring it to the next assignment.",
    ],
  };
}

const PLAIN_ACTIVITY_STEPS: ActivityContent["steps"] = [
  { title: "Read the task", detail: "Open the worksheet in the Downloads tab and read the task and the example." },
  { title: "Do a first pass", detail: "Work through the task once, without stopping to polish." },
  { title: "Compare with the example", detail: "Check your result against the worked example and note where it differs." },
  { title: "Note one change", detail: "Write down the one thing you would do differently next time." },
];

const PLAIN_DISCUSSION_THREADS: DiscussionThread[] = [
  {
    author: "Carlos M.",
    timestamp: "2 hours ago",
    content:
      "The example in this topic helped. I tried it on my own project and my first version was too broad; narrowing it to one audience fixed it.",
    replies: 3,
    upvotes: 12,
  },
  {
    author: "Aisha R.",
    timestamp: "Yesterday",
    content: "Useful to see the reasoning and not only the result. I am keeping the checklist from this one.",
    replies: 1,
    upvotes: 8,
  },
];

function plainAssignmentBrief(topic: FlatTopic): AssignmentBrief {
  return {
    brief: `Complete the task set out in “${topic.title}” and submit your work as a PDF or DOCX. The full brief and the submission template are in the Downloads tab.`,
    requirements: ["1–2 pages", "Use the submission template", "Counts toward your final grade"],
  };
}

function plainOra(topic: FlatTopic): OraContent {
  return {
    brief: `Complete “${topic.title}” as set out in the project brief in the Downloads tab, then submit your work for review by a peer.`,
    deliverable: "Submit a PDF or DOCX. Say what you decided and why, not only what you made.",
    dueLabel: "Due date on the Dates tab",
    requiredReviews: 1,
    acceptedTypes: [".pdf", ".docx", ".png", ".jpg"],
    overallCommentPrompt: "What did you like most about your peer's submission?",
    criteria: [
      {
        id: "c1",
        label: "Task 1 · Meet the brief",
        maxPoints: 6,
        options: [
          { points: 6, label: "Every part of the brief is covered" },
          { points: 4, label: "Most of the brief is covered" },
          { points: 2, label: "Parts of the brief are missing" },
          { points: 0, label: "Not attempted" },
        ],
      },
      {
        id: "c2",
        label: "Task 2 · Support the decisions",
        maxPoints: 5,
        options: [
          { points: 5, label: "Each decision is explained and supported" },
          { points: 3, label: "Decisions are stated but not supported" },
          { points: 0, label: "No reasoning given" },
        ],
      },
      {
        id: "c3",
        label: "Task 3 · Present the work clearly",
        maxPoints: 5,
        options: [
          { points: 5, label: "Clear structure, easy to follow" },
          { points: 3, label: "Complete but hard to follow" },
          { points: 0, label: "Not attempted" },
        ],
      },
      {
        id: "c4",
        label: "Task 4 · Say what you would change",
        maxPoints: 4,
        options: [
          { points: 4, label: "A specific change, with the reason for it" },
          { points: 2, label: "A general remark" },
          { points: 0, label: "Not attempted" },
        ],
      },
    ],
  };
}
