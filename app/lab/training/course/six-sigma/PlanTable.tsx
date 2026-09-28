"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronDown, Lock, Radio } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { formatMinutes, pad, type CoursePlanModel, type PlanModule, type PlanTopic, type WeekRow } from "./plan-model";

/** Width is load: a block grows with its minutes, clamped so a 4-minute video stays readable. */
const blockWidth = (m: number | null) => (m == null ? 148 : Math.min(440, Math.round(128 + m * 4)));

function stateWords(t: PlanTopic): string {
  const moved = t.movedFrom ? `, moved here from week ${t.movedFrom} by your re-plan` : "";
  switch (t.state) {
    case "done":
      return `Done${moved}`;
    case "next":
      return `Today, your next topic${moved}`;
    case "locked":
      return `Locked, opens after you finish ${t.lockedBy}`;
    case "live":
      return "Live session";
    default:
      return `To do${moved}`;
  }
}

function blockClass(t: PlanTopic) {
  if (t.state === "next") return cn("tb-cp-next", t.movedFrom && "tb-cp-next-moved");
  if (t.state === "locked") return "tb-cp-locked";
  if (t.state === "done") return "tb-block tb-block-done";
  if (t.state === "live") return "tb-block tb-block-live";
  if (t.movedFrom) return "tb-block tb-block-moved";
  return "tb-block";
}

function markClass(t: PlanTopic) {
  if (t.state === "done") return "tb-mark-done";
  if (t.state === "next") return "tb-mark-today";
  if (t.movedFrom) return "tb-mark-plan tb-mark-moved";
  return "tb-mark-plan";
}

function Block({ t }: { t: PlanTopic }) {
  const time = t.state === "live" || t.minutes == null ? t.duration || "No time set" : null;
  const inner = (
    <>
      <span className="flex items-start justify-between gap-2">
        <span className={cn("tb-meta", t.state === "next" ? "tb-c-ink" : "tb-c-ink2")}>
          {t.state === "next" ? <span className="tb-label">Today · </span> : null}
          {t.type}
        </span>
        {t.state === "done" ? <Icon icon={Check} size={16} aria-hidden="true" /> : null}
        {t.state === "locked" ? <Icon icon={Lock} size={16} aria-hidden="true" /> : null}
        {t.state === "live" ? <Icon icon={Radio} size={16} className="tb-c-live" aria-hidden="true" /> : null}
      </span>
      <span className="tb-body-s tb-strong tb-cp-title mt-1 line-clamp-3 break-words">{t.title}</span>
      <span className="tb-meta tb-c-ink2 mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
        {time ? (
          <span>{time}</span>
        ) : (
          <span>
            <span className="tb-num tb-num-m tb-c-ink">{t.minutes}</span> min
          </span>
        )}
        {t.movedFrom ? <span>· from wk {pad(t.movedFrom)}</span> : null}
        {t.state === "locked" ? <span className="w-full">Opens after {t.lockedBy}</span> : null}
      </span>
      <span className="sr-only">
        , {t.duration || "no time set"}, {stateWords(t)}
      </span>
    </>
  );
  const cls = cn("tb-cp-block flex min-h-[92px] flex-col px-3 py-2.5", blockClass(t));
  const style: React.CSSProperties = { flex: `0 1 ${blockWidth(t.minutes)}px`, minWidth: 128, maxWidth: "100%" };
  return (
    <li className="flex" style={style}>
      {t.state === "locked" ? (
        <div className={cn(cls, "w-full")}>{inner}</div>
      ) : (
        <Link href={t.href} className={cn(cls, "w-full")} aria-current={t.state === "next" ? "step" : undefined}>
          {inner}
        </Link>
      )}
    </li>
  );
}

function Row({ row, thisWeek }: { row: WeekRow; thisWeek: number }) {
  const now = row.week === thisWeek;
  return (
    <li className="tb-rule-t grid grid-cols-1 gap-2 py-3 md:grid-cols-[104px_1fr] md:gap-6">
      <p className="flex items-baseline gap-2 md:flex-col md:gap-1">
        <span className="tb-label tb-c-ink3">Week</span>
        <span className={cn("tb-num tb-num-m tb-slot md:text-left", now ? "tb-c-ink" : "tb-c-ink2")}>{pad(row.week)}</span>
        {now ? <span className="tb-bg-ink tb-label rounded-sm px-1.5 py-0.5">This week</span> : null}
      </p>
      {row.movedTo ? (
        <p className="tb-body-s tb-c-ink2 flex items-center gap-2 md:min-h-[92px]">
          <span className="tb-mark tb-mark-plan tb-mark-moved" aria-hidden />
          Moved to week {pad(row.movedTo)} by your re-plan — nothing dropped.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2" aria-label={`Week ${row.week} topics`}>
          {row.topics.map((t) => (
            <Block key={t.id} t={t} />
          ))}
        </ul>
      )}
    </li>
  );
}

function ModuleRow({
  mod,
  open,
  onToggle,
  thisWeek,
  started,
}: {
  mod: PlanModule;
  open: boolean;
  onToggle: () => void;
  thisWeek: number;
  started: boolean;
}) {
  const panelId = `cp-panel-${mod.id}`;
  const weeks = mod.weekFrom === mod.weekTo ? pad(mod.weekFrom) : `${pad(mod.weekFrom)}–${pad(mod.weekTo)}`;
  const minutes = mod.topics.reduce((a, t) => a + (t.minutes ?? 0), 0);
  const allDone = mod.done === mod.topics.length;
  return (
    <li className="tb-rule-strong-t">
      <div className="grid grid-cols-1 md:grid-cols-[104px_1fr] md:gap-6">
        <p className="hidden pt-5 md:block">
          <span className="tb-label tb-c-ink3 block">Weeks</span>
          <span className="tb-num tb-num-m mt-1 block">{weeks}</span>
        </p>
        <div>
          <h3>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={onToggle}
              className="flex min-h-[64px] w-full items-start gap-3 py-4 text-left"
            >
              <span className="flex-1">
                <span className="tb-title block">
                  <span className="tb-num tb-c-ink3 mr-2">{mod.number}</span>
                  <span className="sr-only">Module {mod.number}: </span>
                  {mod.title}
                </span>
                <span className="tb-meta tb-c-ink2 mt-1 block md:hidden">Weeks {weeks}</span>
              </span>
              <span className={cn("tb-meta tb-c-ink2 hidden shrink-0 pt-1 text-right", open && "sm:block")}>
                {started ? (
                  <>
                    <span className="tb-num tb-num-m tb-c-ink">{mod.done}</span> / {mod.topics.length} done
                  </>
                ) : (
                  <>
                    {mod.topics.length} topics · {formatMinutes(minutes)}
                  </>
                )}
              </span>
              <span className="tb-c-ink2 inline-flex h-11 w-11 shrink-0 items-center justify-center" aria-hidden>
                <Icon icon={ChevronDown} size={22} className={cn("transition-transform motion-reduce:transition-none", open && "rotate-180")} />
              </span>
            </button>
          </h3>
          {/* Collapsed: the module as a strip of marks — one per topic, same colour rules. */}
          <div className={cn("-mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 pb-4", open && "hidden")}>
            <span className="flex flex-wrap gap-1" aria-hidden>
              {mod.topics.map((t) => (
                <span key={t.id} className={cn("tb-mark", markClass(t))} />
              ))}
            </span>
            <span className="tb-meta tb-c-ink2">
              {allDone ? "All done" : started ? `${mod.done} of ${mod.topics.length} done` : `${mod.topics.length} topics · ${formatMinutes(minutes)}`}
              {mod.topics.some((t) => t.state === "locked") ? " · part locked" : ""}
            </span>
          </div>
        </div>
      </div>

      <div id={panelId} hidden={!open} className="pb-4">
        {mod.segments.map((seg) => {
          const locked = seg.rows.flatMap((r) => r.topics).filter((t) => t.state === "locked");
          return (
            <section key={seg.id} aria-labelledby={seg.label ? `${seg.id}-h` : undefined}>
              {seg.label ? (
                <div className="md:pl-[128px]">
                  <h4 id={`${seg.id}-h`} className="tb-label tb-c-ink2 pb-2 pt-3">
                    Lesson · {seg.label}
                  </h4>
                  {locked.length ? (
                    <p className="tb-body-s tb-c-ink2 flex items-center gap-2 pb-3">
                      <Icon icon={Lock} size={16} aria-hidden="true" />
                      {locked.length} topics open after you finish {locked[0].lockedBy}.
                    </p>
                  ) : null}
                </div>
              ) : null}
              <ol aria-label={seg.label ? `${seg.label}, week by week` : `Module ${mod.number}, week by week`}>
                {seg.rows.map((row) => (
                  <Row key={row.week} row={row} thisWeek={thisWeek} />
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </li>
  );
}

export function PlanTable({ model, thisWeek, started }: { model: CoursePlanModel; thisWeek: number; started: boolean }) {
  const [open, setOpen] = React.useState<Set<string>>(() => new Set(model.nextModuleId ? [model.nextModuleId] : []));
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <>
      <div className="mt-4 hidden grid-cols-[104px_1fr] gap-6 pb-2 md:grid" aria-hidden>
        <span className="tb-label tb-c-ink3">Plan week</span>
        <span className="tb-label tb-c-ink3">Topics · wider block = more minutes</span>
      </div>
      <ol className="tb-cp-table mt-2 md:mt-0" aria-label="Modules">
        {model.modules.map((m) => (
          <ModuleRow
            key={m.id}
            mod={m}
            open={open.has(m.id)}
            onToggle={() => toggle(m.id)}
            thisWeek={thisWeek}
            started={started}
          />
        ))}
      </ol>
      <ul className="tb-meta tb-c-ink2 tb-rule-strong-t flex flex-wrap gap-x-4 gap-y-2 pt-3" aria-label="Legend">
        <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-done" aria-hidden />Done</li>
        <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-today" aria-hidden />Today</li>
        <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-plan" aria-hidden />Planned</li>
        <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-plan tb-mark-moved" aria-hidden />Moved by a re-plan</li>
        <li className="flex items-center gap-1.5"><span className="tb-mark tb-cp-mark-live" aria-hidden />Live session</li>
        <li className="flex items-center gap-1.5"><Icon icon={Lock} size={12} aria-hidden="true" />Locked</li>
      </ul>
    </>
  );
}
