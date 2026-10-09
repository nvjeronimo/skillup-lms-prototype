/**
 * Content search of a course (feature 33; Figma section 6837:27914; metadata map §39).
 *
 * In the product the request is `POST {LMS}/search/{course_id}` with `search_string`,
 * `page_size` 20 and `page_index`; each result brings `content_type`, `display_name`, an
 * `excerpt` with the matches marked, `location[]` and `url`; the page brings `total` and
 * `access_denied_count`. The prototype has no index: it filters the sample content below,
 * so the first five results and the totals for "control chart" are the ones of the screens
 * and any other word still gives an honest answer (results, or none).
 */

/** `content_type` as the screens name it: Text, Video, CAPA (Quiz), Sequence (Lesson). */
export type SearchContentType = "Text" | "Video" | "Quiz" | "Lesson";

export interface SearchDoc {
  id: string;
  type: SearchContentType;
  title: string;
  /** The text the search looks in besides the title. A Lesson (a sequence) has none. */
  text?: string;
  /** `location[]`: module › lesson › topic. */
  location: string[];
}

export interface SearchResult extends SearchDoc {
  /** How many times the words were found in the title and the text. */
  matches: number;
}

export interface SearchPage {
  results: SearchResult[];
  total: number;
  /** Results in content the learner cannot open: removed and counted (`access_denied_count`). */
  accessDenied: number;
}

export const SEARCH_PAGE_SIZE = 20;
/** Typing this word makes the request fail, so the error state can be shown in a session. */
export const SEARCH_FAIL_WORD = "fail";

const M3 = "Module 3 · Improve the process";
const M4 = "Module 4 · Control and sustain";
const M2 = "Module 2 · DMAIC in practice";
const M1 = "Module 1 · Foundations of Six Sigma";

const doc = (
  id: string,
  type: SearchContentType,
  title: string,
  location: string[],
  text?: string,
): SearchDoc => ({ id, type, title, text, location });

/* Order is relevance order. The first twenty are 9 Text, 2 Video, 7 Quiz and 2 Lesson, as on
   the screens; the five the screens draw come first. */
const DOCS: SearchDoc[] = [
  doc("t-plotting", "Text", "Plotting a control chart", [M3, "Define and measure", "Plotting a control chart"],
    "A control chart shows whether a process is stable over time, and which points need a closer look. The control chart has a centre line and two limits; draw the control chart from at least 20 samples. A control chart is read from left to right, and a control chart is only as good as its data."),
  doc("v-practice", "Video", "Control charts in practice", [M3, "Define and measure", "Control charts in practice"],
    "In this video we plot each sample on the control chart and look for runs above the centre line. The control chart on screen uses the case study data."),
  doc("q-fits", "Quiz", "Check: which chart fits the data", [M3, "Define and measure", "Knowledge check"],
    "Choose the control chart that fits attribute data collected in subgroups. Which control chart would you use for individual measurements?"),
  doc("l-capability", "Lesson", "Control charts and capability", [M4]),
  doc("t-worksheet", "Text", "The control chart worksheet", [M4, "Holding the gains", "Worksheet"],
    "Fill in the control chart worksheet with the 25 samples from the case study, then mark the points outside the limits."),
  doc("v-signals", "Video", "Reading the signals", [M3, "Define and measure", "Reading the signals"],
    "A point outside the limits of the control chart is the first signal to check, before any other rule."),
  doc("t-limits", "Text", "Where the limits come from", [M3, "Define and measure", "Where the limits come from"],
    "The limits of a control chart are calculated from the process itself, three standard deviations either side of the centre line. They are not the specification."),
  doc("t-variation", "Text", "Common and special causes", [M3, "Define and measure", "Common and special causes"],
    "A control chart separates common-cause variation from special causes. React to a special cause; leave common causes to the improvement project."),
  doc("q-limits", "Quiz", "Check: control limits", [M3, "Define and measure", "Knowledge check"],
    "On a control chart, what do the upper and lower limits describe?"),
  doc("q-rules", "Quiz", "Check: the run rules", [M3, "Analyze, improve, and control", "Knowledge check"],
    "Eight points in a row above the centre line of a control chart: what does it tell you?"),
  doc("t-xbar", "Text", "X-bar and R charts", [M3, "Analyze, improve, and control", "X-bar and R charts"],
    "The X-bar chart is the control chart for subgroup averages; the R chart follows the range inside each subgroup."),
  doc("t-attribute", "Text", "Charts for attribute data", [M3, "Analyze, improve, and control", "Charts for attribute data"],
    "For counts and proportions the control chart is a p chart or a c chart, depending on what is counted."),
  doc("q-attribute", "Quiz", "Check: attribute or variable", [M3, "Analyze, improve, and control", "Knowledge check"],
    "Defects per invoice are counted each day. Which control chart applies?"),
  doc("l-control-phase", "Lesson", "Keeping the control chart alive", [M4]),
  doc("t-plan", "Text", "The control plan", [M4, "Holding the gains", "The control plan"],
    "The control plan names who reads each control chart, how often, and what to do when a signal appears."),
  doc("q-plan", "Quiz", "Check: the control plan", [M4, "Holding the gains", "Knowledge check"],
    "Who should own a control chart once the project closes?"),
  doc("t-reaction", "Text", "Reaction plans", [M4, "Holding the gains", "Reaction plans"],
    "A reaction plan sits next to the control chart: stop, contain, find the cause, restart."),
  doc("q-reaction", "Quiz", "Check: reacting to a signal", [M4, "Holding the gains", "Knowledge check"],
    "The control chart shows one point above the upper limit. What is the first step?"),
  doc("t-handover", "Text", "Handing the process over", [M4, "Closing the project", "Handing the process over"],
    "Hand over the control chart together with the measurement method, or the chart will not be kept."),
  doc("q-final", "Quiz", "Final checkpoint", [M4, "Closing the project", "Final checkpoint"],
    "A team stops updating its control chart after three months. Which risk grows first?"),
  doc("t-case", "Text", "Case study: the packing line", [M3, "Analyze, improve, and control", "Case study"],
    "The packing line kept a control chart of fill weight for six weeks before changing anything."),
  doc("t-software", "Text", "Building the chart in a spreadsheet", [M3, "Define and measure", "Building the chart in a spreadsheet"],
    "You can build a control chart in a spreadsheet with three formulas and a line chart."),
  doc("q-case", "Quiz", "Check: the packing line", [M3, "Analyze, improve, and control", "Knowledge check"],
    "In the case study, what did the control chart show in week four?"),
  doc("t-mistakes", "Text", "Common mistakes", [M3, "Define and measure", "Common mistakes"],
    "The most common mistake is to put specification limits on a control chart in place of control limits."),
  doc("t-baseline", "Text", "Setting the baseline", [M2, "Measure", "Setting the baseline"],
    "A baseline is clearer on a control chart than in a single average."),
  doc("q-baseline", "Quiz", "Check: the baseline", [M2, "Measure", "Knowledge check"],
    "Why is a control chart a better baseline than last month's average?"),
  doc("l-measure", "Lesson", "Measure: control charts first", [M2]),
  doc("t-glossary", "Text", "Glossary", [M1, "Getting started", "Glossary"],
    "Control chart: a time plot of a process measure with a centre line and control limits."),
  doc("t-capability", "Text", "Process capability", [M4, "Holding the gains", "Process capability"],
    "Capability only means something when the control chart shows a stable process. Cp and Cpk compare the spread with the specification."),

  doc("t-dmaic", "Text", "The DMAIC cycle", [M1, "Getting started", "The DMAIC cycle"],
    "DMAIC stands for Define, Measure, Analyze, Improve and Control. Each phase ends with a review."),
  doc("v-dmaic", "Video", "Introduction to the DMAIC methodology", [M3, "Define and measure", "Introduction to the DMAIC methodology"],
    "Welcome back. In this unit we look at the DMAIC methodology and where each tool fits."),
  doc("t-define", "Text", "The define phase", [M3, "Define and measure", "The define phase"],
    "The define phase frames the problem, the customer and the scope of the project charter."),
  doc("t-measure", "Text", "The measure phase", [M3, "Define and measure", "The measure phase"],
    "The measure phase captures the baseline and checks the measurement system before any analysis."),
  doc("t-pareto", "Text", "Pareto analysis", [M2, "Analyze", "Pareto analysis"],
    "A Pareto chart orders the causes by size, so the vital few stand out from the trivial many."),
  doc("q-pareto", "Quiz", "Check: Pareto analysis", [M2, "Analyze", "Knowledge check"],
    "What does the cumulative line on a Pareto chart show?"),
  doc("v-fishbone", "Video", "Finding root causes", [M2, "Analyze", "Finding root causes"],
    "A fishbone diagram groups possible causes; the five whys take one of them down to the root cause."),
  doc("t-ctq", "Text", "Critical to quality", [M1, "Getting started", "Critical to quality"],
    "A critical-to-quality requirement starts from the voice of the customer and ends in a measure."),
];

/**
 * Prototype only: searches that are known to give each state, offered when the field is
 * empty so a reviewer does not have to guess what the sample content holds.
 */
export const SEARCH_SAMPLES: { query: string; gives: string }[] = [
  { query: "control chart", gives: "29 results, four types" },
  { query: "DMAIC", gives: "a few results" },
  { query: "Pareto", gives: "text and a quiz" },
  { query: "baseline", gives: "a few results" },
  { query: "kanbam", gives: "no results" },
  { query: SEARCH_FAIL_WORD, gives: "the search fails" },
];

/** Results the learner cannot open, counted by the platform for this search string. */
const ACCESS_DENIED: Record<string, number> = { "control chart": 2 };

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The words of the search string, as a pattern that also finds the plural. */
export function searchPattern(query: string): RegExp | null {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  return new RegExp(words.map(escape).join("\\s+") + "s?", "gi");
}

function countMatches(text: string | undefined, pattern: RegExp): number {
  if (!text) return 0;
  return (text.match(pattern) ?? []).length;
}

/** Every result for the search string, in relevance order. */
function findAll(query: string): SearchResult[] {
  const pattern = searchPattern(query);
  if (!pattern) return [];
  return DOCS.map((d) => ({ ...d, matches: countMatches(d.title, pattern) + countMatches(d.text, pattern) })).filter(
    (r) => r.matches > 0,
  );
}

/** One page of results, as `page_index` 0, 1, … of the platform's search. */
export function searchCourse(query: string, pageIndex: number): SearchPage {
  const all = findAll(query);
  const start = pageIndex * SEARCH_PAGE_SIZE;
  return {
    results: all.slice(start, start + SEARCH_PAGE_SIZE),
    total: all.length,
    accessDenied: ACCESS_DENIED[query.trim().toLowerCase()] ?? 0,
  };
}

/** The part of the text around the first match, as the platform's `excerpt` does. */
export function excerptOf(text: string, query: string): string {
  const pattern = searchPattern(query);
  const at = pattern ? text.search(pattern) : -1;
  if (at < 0) return text;
  const from = Math.max(0, text.lastIndexOf(" ", Math.max(0, at - 40)));
  const to = Math.min(text.length, at + 110);
  const end = to < text.length ? text.lastIndexOf(" ", to) : to;
  let part = text.slice(from, end > at ? end : to).trim();
  // Stop at the end of the sentence the match is in, when it ends inside the window.
  const local = part.search(pattern!);
  const stop = part.indexOf(". ", local < 0 ? 0 : local);
  if (stop > 0) part = part.slice(0, stop);
  part = part.charAt(0).toLowerCase() + part.slice(1);
  return `…${part.replace(/[.,;:]$/, "")}…`;
}
