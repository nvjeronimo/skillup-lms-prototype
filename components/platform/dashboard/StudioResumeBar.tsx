"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import type { DashboardResumeRow } from "@/lib/platform/dashboard-resume";
import { useLmsStore } from "@/lib/store";

/**
 * "Studio" direction (experimental, 22 Oct 2026): a floating ink bar that keeps the one next
 * step in reach while the Dashboard scrolls — where you stopped, how far the course is, Resume.
 * The reference's sticky pass bar, given SkillUp's job. Bottom centre on desktop and tablet; on a
 * phone it leaves the right corner to the assistant launcher. Shown only when the direction is on.
 */
export function StudioResumeBar({ course }: { course: DashboardResumeRow | undefined }) {
  const studio = useLmsStore((s) => s.studio);
  if (!studio || !course) return null;
  return (
    <aside
      aria-label="Continue learning"
      className="sk-studio-bar sk-animate-rise fixed bottom-4 left-4 right-[80px] z-30 flex items-center gap-3 rounded-pill py-2 pl-5 pr-2 md:inset-x-0 md:bottom-6 md:mx-auto md:w-[min(600px,calc(100vw-48px))]"
    >
      <div data-theme="dark" className="flex min-w-0 flex-1 flex-col">
        <span className="sk-text-body-small-medium text-sko-text-subtle">Continue · {course.progressPct}%</span>
        <span className="sk-text-body-medium-medium truncate text-sko-text-default">{course.headline}</span>
      </div>
      <Link
        href={course.href}
        aria-label={`Resume ${course.headline}`}
        className="sk-text-body-medium-semibold inline-flex h-11 shrink-0 items-center gap-1.5 rounded-pill bg-sko-bg-primary-soft px-5 text-sko-text-on-primary-soft transition-[background-color,transform] duration-short2 ease-standard-decelerate hover:bg-sko-bg-subtle active:scale-[.98]"
      >
        Resume
        <Icon icon={ArrowRight} size={16} aria-hidden="true" />
      </Link>
    </aside>
  );
}
