import { topicDownloads as seedDownloads } from "./data";
import type { DownloadFile, FlatTopic, TopicType } from "./types";

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

export interface QuizQuestion {
  question: string;
  options: { id: string; label: string; correct?: boolean }[];
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
      options: [
        { id: "a", label: "Reduce process variation and defects", correct: true },
        { id: "b", label: "Increase production speed at any cost" },
        { id: "c", label: "Eliminate all documentation" },
        { id: "d", label: "Replace staff with automation" },
      ],
    },
    {
      question: "In DMAIC, which phase establishes the baseline performance?",
      options: [
        { id: "a", label: "Define" },
        { id: "b", label: "Measure", correct: true },
        { id: "c", label: "Improve" },
        { id: "d", label: "Control" },
      ],
    },
    {
      question: "“Critical to Quality” characteristics are derived from…",
      options: [
        { id: "a", label: "The customer's requirements", correct: true },
        { id: "b", label: "The finance department" },
        { id: "c", label: "Competitor pricing" },
        { id: "d", label: "Random sampling" },
      ],
    },
  ];
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
  const seeded = seedDownloads(topic.id);
  if (seeded.length) return seeded;

  const fam = topicFamily(topic.type);
  const base = topic.id;
  const make = (type: DownloadFile["type"], name: string, size: string): DownloadFile => ({
    id: `${base}-${name}`,
    topicId: topic.id,
    type,
    name,
    size,
    addedAt: "2026-05-15T00:00:00Z",
  });

  switch (fam) {
    case "reading":
      return [
        make("PDF", "reading-notes.pdf", "120 KB"),
        make("PDF", "further-reading.pdf", "88 KB"),
      ];
    case "assessment":
    case "graded":
      return [
        make("PDF", "assignment-brief.pdf", "96 KB"),
        make("DOCX", "submission-template.docx", "54 KB"),
      ];
    case "activity":
      return [make("XLSX", "activity-worksheet.xlsx", "32 KB")];
    case "discussion":
      return [make("PDF", "discussion-guidelines.pdf", "40 KB")];
    default:
      return [make("PDF", "resources.pdf", "110 KB")];
  }
}
