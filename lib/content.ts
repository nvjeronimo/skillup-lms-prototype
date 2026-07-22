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
  | "discussion"
  | "vilt";

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
    case "video":
      return `A short video lesson, with a synced transcript you can search and take notes from.`;
    case "reading":
      return `A short read on “${topic.title}”, with the key ideas you need before moving on.`;
    case "assessment":
      return `Check your understanding of ${topic.lessonLabel ?? topic.moduleTitle}. You can retake this as many times as you like.`;
    case "graded":
      return `Apply what you've learned and submit your work. This assignment counts toward your final grade.`;
    case "activity":
      return `An interactive exercise to practise the concepts from ${topic.moduleTitle}.`;
    case "ora":
      return `A peer-reviewed project. You'll submit your work, review a peer, and receive a grade.`;
    case "lessonPage":
      return `A guided page that brings together everything on this topic — video, notes, diagrams and downloads.`;
    case "lab":
      return `A hands-on lab you run on your own machine. Nothing is submitted and it isn't graded.`;
    case "podcast":
      return `A conversation you can listen to on the move — transcript and chapters included.`;
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
  // Branching / scenario activities are authored as SCORM packages.
  const isScorm = /scenario|match|connect|simulat/i.test(topic.title);
  return {
    kind: isScorm ? "scorm" : "checklist",
    packageLabel: "Articulate Storyline package",
    packageSizeLabel: "8.4 MB",
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
      "In this lab you'll run pre-written Python against a sample process dataset to calculate capability indices and spot the drivers of variation. Everything runs locally — nothing is submitted.",
    prerequisites: [
      "Python 3.10+ with Jupyter Notebook installed",
      "pandas and matplotlib available in your environment",
    ],
    steps: [
      "Download the notebook and the dataset below.",
      "Place both files in the same folder and open the notebook in Jupyter.",
      "Run each cell in order — the comments explain what to expect.",
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
      "A conversation about what actually changes on the shop floor when a Six Sigma programme lands — and the three mistakes that stall most rollouts in the first ninety days.",
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
      "Submit your plan as a PDF or DOCX — 1–2 pages, including at least one control chart sketch.",
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
      "This page pulls together everything you need on control charts — the theory, a worked example, the template you'll use, and a quick check before you move on.",
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
            feedback: "A run that long is very unlikely by chance — it is a signal, not noise.",
          },
          {
            id: "b",
            label: "A shift in the process mean",
            correct: true,
            feedback: "Correct — a sustained run on one side points to a shift with an assignable cause.",
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
