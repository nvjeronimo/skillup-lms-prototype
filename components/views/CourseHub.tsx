"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { Icon } from "@/lib/icons";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { DemoControlsMenu } from "@/components/molecules/DemoControlsMenu";
import { CourseCard } from "@/components/organisms/CourseCard";
import { Toast } from "@/components/organisms/Toast";
import { type Provider } from "@/components/atoms/MetaBadges";
import { allCourses, flatTopics, user } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { track } from "@/lib/analytics";

function initials(title: string): string {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Course Hub — the landing page. One card per course; Resume enters the course. */
export function CourseHub() {
  const router = useRouter();
  const completedTopics = useLmsStore((s) => s.completedTopics);
  const theme = useLmsStore((s) => s.theme);
  const toggleTheme = useLmsStore((s) => s.toggleTheme);
  const toast = useLmsStore((s) => s.toast);
  const clearToast = useLmsStore((s) => s.clearToast);

  React.useEffect(() => track("course_enter", { surface: "hub" }), []);

  const cards = allCourses.map((c) => {
    const topics = flatTopics(c);
    const done = topics.filter((t) => completedTopics.has(t.id)).length;
    const pct = Math.round((done / Math.max(topics.length, 1)) * 100);
    const next = topics.find((t) => !completedTopics.has(t.id) && !t.locked) ?? topics[0];
    return { course: c, pct, next };
  });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-sk-bg-secondary">
      <header className="flex h-[60px] items-center gap-3 border-b border-sk-border-secondary bg-sk-bg-primary px-4 md:px-6">
        <SkillUpLogo className="h-7" />
        <div className="flex flex-1 items-center justify-end gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-sk-text-tertiary transition-colors hover:bg-sk-bg-secondary"
          >
            <Icon icon={theme === "dark" ? Sun : Moon} size={20} />
          </button>
          <DemoControlsMenu userName={user.name} userAvatarUrl={user.avatarUrl} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 p-4 md:p-8">
        <h1 className="sk-text-display-sm-semibold text-sk-text-primary">My Learning</h1>
        <p className="sk-text-md-regular mt-1 text-sk-text-secondary">
          Pick up where you left off — {cards.length} courses enrolled.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {cards.map(({ course, pct, next }) => (
            <CourseCard
              key={course.id}
              title={course.title}
              provider={course.provider as Provider}
              courseType={course.courseType}
              difficulty={course.difficulty}
              deliveryMode={course.deliveryMode}
              progressPct={pct}
              estimation={pct === 100 ? "Completed" : "2 weeks"}
              initials={initials(course.title)}
              upNext={next ? { type: next.type, title: next.title } : undefined}
              onResume={() => router.push(`/course/${course.slug}/topic/${next?.id ?? ""}`)}
            />
          ))}
        </div>
      </main>

      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
