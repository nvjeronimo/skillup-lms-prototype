import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { LiveNowBanner } from "@/components/organisms/LiveNowBanner";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Side stripes: DS vs proposal" };

/**
 * /lab/stripes — the three DS components the design detector flags for a coloured side or top
 * stripe, each beside a proposal without it. Left column: the shipped DS component, unchanged.
 * Right column: a lab-only rendering in DS tokens. Nothing here changes the DS.
 */
export default function StripesLab() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 p-4 outline-none md:p-8">
      <h1 className="sk-text-headline-medium-semibold text-sko-text-default">Side stripes: DS today vs a proposal</h1>
      <p className="sk-text-body-large-regular mt-1 max-w-3xl text-sko-text-muted">
        Three DS components carry a coloured stripe. Left is the DS component as shipped; right is a proposal in DS
        tokens. Switch theme and skin in the account menu to compare them in every mode.
      </p>

      <Row
        stacked
        title="1 · Live Now Banner"
        note="The state is already written in the badge, so the 4px stripe repeats it. The proposal tints the whole card instead, so the banner reads as one object: soft green when live, a toasted yellow (background and border) when upcoming."
      >
        <div className="flex flex-col gap-3">
          <LiveNowBanner state="Live" title="Agile Coach Q&A with David Chen" subtitle="AI-Driven Digital Marketing Certificate" />
          <LiveNowBanner state="Upcoming" title="Agile Coach Q&A with David Chen" subtitle="AI-Driven Digital Marketing Certificate" />
        </div>
        <div className="flex flex-col gap-3">
          <SoftLiveBanner live title="Agile Coach Q&A with David Chen" subtitle="AI-Driven Digital Marketing Certificate" />
          <SoftLiveBanner live={false} title="Agile Coach Q&A with David Chen" subtitle="AI-Driven Digital Marketing Certificate" />
        </div>
      </Row>

      <Row
        title="2 · Reading pull quote (Lesson Block HTML · Blockquote)"
        note="In a reading, a quotation is usually set apart by type rather than by a box. The proposal drops the box and the stripe: a drawn quote mark, a larger size and the primary colour. Authors change nothing: it is the same blockquote in Studio."
      >
        <ReadingContext>
          <blockquote className="flex flex-col gap-1.5 rounded-lg border-l-4 border-sko-border-primary bg-sko-bg-primary-soft px-5 py-[18px]">
            <p className="sk-text-body-large-medium text-sko-text-primary">“{QUOTE.text}”</p>
            <footer className="sk-text-body-medium-regular text-sko-text-primary">{QUOTE.attribution}</footer>
          </blockquote>
        </ReadingContext>
        <ReadingContext>
          <blockquote className="flex gap-3 py-2">
            <Icon icon={Quote} size={28} aria-hidden className="mt-0.5 shrink-0 text-sko-text-primary" />
            <div className="flex flex-col gap-2">
              <p className="sk-text-title-medium-medium text-sko-text-primary">{QUOTE.text}</p>
              <footer className="sk-text-body-medium-regular text-sko-text-muted">{QUOTE.attribution}</footer>
            </div>
          </blockquote>
        </ReadingContext>
      </Row>

      <Row
        title="3 · Inline Alert · Answer"
        note="The 2px top rule is the family's rule: every tone has one in its own colour, and only Hint has none. Today Answer bends it round 8px corners in grey. Proposal (Nelson, 14 Oct): Answer's rule the way Correct and Not quite draw theirs — straight, square corners, on the faint surface — in primary instead of grey."
      >
        <div className="flex flex-col gap-3">
          <InlineAlert tone="success" title="Correct" description="Fewer defects follow from a more predictable process." />
          <InlineAlert tone="error" title="Not quite" description="Speed is an outcome of a stable process, not its goal." />
          <InlineAlert tone="hint" title="Hint (1 of 2):" description="Think about what varies from one unit to the next." />
          <InlineAlert tone="answer" title="Answer" description={ANSWER} />
        </div>
        <div className="flex flex-col gap-3">
          <InlineAlert tone="success" title="Correct" description="Fewer defects follow from a more predictable process." />
          <InlineAlert tone="error" title="Not quite" description="Speed is an outcome of a stable process, not its goal." />
          <InlineAlert tone="hint" title="Hint (1 of 2):" description="Think about what varies from one unit to the next." />
          <InlineAlert
            tone="answer"
            title="Answer"
            description={ANSWER}
            className="!rounded-none !border-sko-border-primary !bg-sko-bg-faint"
          />
        </div>
      </Row>
    </main>
  );
}

const QUOTE = {
  text: "You cannot spot the odd connection until you have written down the normal ones.",
  attribution: "Course notes, Module 1",
};

const ANSWER =
  "Six Sigma is a data-driven methodology for reducing variation. Fewer defects follow from a more predictable process; speed and headcount are outcomes, never the goal.";

function Row({
  title,
  note,
  stacked = false,
  children,
}: {
  title: string;
  note: string;
  /** One above the other at full width, for a component that is full width on the page. */
  stacked?: boolean;
  children: [React.ReactNode, React.ReactNode];
}) {
  return (
    <section aria-labelledby={slug(title)} className="mt-10 border-t border-sko-border-subtle pt-6">
      <h2 id={slug(title)} className="sk-text-title-large-semibold text-sko-text-default">
        {title}
      </h2>
      <p className="sk-text-body-medium-regular mt-1 max-w-3xl text-sko-text-muted">{note}</p>
      <div className={cn("mt-4 grid gap-4", !stacked && "lg:grid-cols-2")}>
        <Column label="DS today">{children[0]}</Column>
        <Column label="Proposal">{children[1]}</Column>
      </div>
    </section>
  );
}

function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-sko-border-subtle bg-sko-bg-subtle p-4">
      <h3 className="sk-text-body-medium-semibold text-sko-text-muted">{label}</h3>
      {children}
    </div>
  );
}

/** A slice of a reading page, so the quote is judged in its real surroundings. */
function ReadingContext({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-sko-bg-page p-5">
      <p className="sk-text-body-large-regular text-sko-text-default">
        The same list drives the firewall rules. If a type of device needs three destinations, allow those three and
        deny the rest. You will write rules this way in Module 3.
      </p>
      {children}
      <p className="sk-text-body-large-regular text-sko-text-default">
        Keep the list next to the rules, and update both together when a device changes role.
      </p>
    </div>
  );
}

/* Upcoming (Nelson, 14 Oct): a toasted yellow for the background and the border, deeper than
   bg/warning-soft. No DS token holds it yet, so the lab derives it from bg/warning mixed into the
   page — it follows light and dark. In the DS this needs a new token (e.g. bg/warning-muted). */
const TOASTED_YELLOW: React.CSSProperties = {
  background: "color-mix(in srgb, var(--color-bg-warning) 32%, var(--color-bg-page))",
  borderColor: "var(--color-bg-warning)",
};

/** Proposal for the Live Now Banner: the whole card takes the soft tone, no side stripe. */
function SoftLiveBanner({ live, title, subtitle }: { live: boolean; title: string; subtitle: string }) {
  return (
    <div
      role="region"
      aria-label={`${live ? "Live now" : "Upcoming"}: ${title}`}
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border px-4 py-4",
        live && "border-sko-border-success-soft bg-sko-bg-success-soft",
      )}
      style={live ? undefined : TOASTED_YELLOW}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "sk-text-body-small-medium inline-flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-2 pr-3 uppercase",
            live ? "bg-sko-bg-success text-sko-text-on-success" : "bg-sko-bg-warning text-sko-text-on-warning",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
          {live ? "Live now" : "Upcoming"}
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="sk-text-body-medium-regular truncate text-sko-text-default">{title}</p>
          {/* On the toasted yellow, text/muted drops to 4.26:1 in dark; the default ink holds AA in both. */}
          <p className={cn("sk-text-body-small-regular truncate", live ? "text-sko-text-muted" : "text-sko-text-default")}>
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className={cn("sk-text-body-small-medium hidden md:block", live ? "text-sko-text-muted" : "text-sko-text-default")}>
          {live ? "LIVE NOW · ENDS AT 4:30 PM" : "STARTS IN 12 MIN · 4:00 PM"}
        </span>
        <Button variant="primary" size="md">
          {live ? "Join Live Now" : "Set reminder"}
        </Button>
      </div>
    </div>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
