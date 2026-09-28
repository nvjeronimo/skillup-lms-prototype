"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CalendarDays, Flag, House, Layers } from "lucide-react";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { Icon } from "@/lib/icons";
import { getPersona } from "@/lib/lab/dashboard-mock";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Today", href: "/lab/training", icon: House, match: (p: string) => p === "/lab/training" },
  { label: "Plans", href: "/lab/training/plans", icon: Layers, match: (p: string) => p.startsWith("/lab/training/plans") || p.startsWith("/lab/training/course") },
  { label: "Calendar", href: "#", icon: CalendarDays, match: () => false },
  { label: "Certificates", href: "#", icon: Flag, match: () => false },
];

/** The world's own navigation: a slim bar on desktop, a thumb-reach tab bar on phones. */
export function TrainingNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  const persona = params.get("persona") ?? "maya";
  const p = getPersona(persona);
  const initials = p.name.split(" ").map((w) => w[0]).join("");
  const q = `?persona=${persona}`;

  return (
    <>
      <header className="tb-bg-sheet tb-rule-b">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-6 px-4 md:px-8">
          <Link href={`/lab/training${q}`} aria-label="SkillUp, Today" className="inline-flex min-h-[44px] items-center">
            <SkillUpLogo className="h-7" />
          </Link>
          <nav aria-label="Primary" className="hidden flex-1 md:block">
            <ul className="flex items-stretch gap-1">
              {ITEMS.map((it) => {
                const current = it.match(pathname);
                return (
                  <li key={it.label}>
                    <Link
                      href={it.href === "#" ? "#" : `${it.href}${q}`}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "tb-label relative inline-flex min-h-[64px] items-center px-3",
                        current ? "tb-c-ink" : "tb-c-ink2",
                      )}
                    >
                      {it.label}
                      {current ? <span aria-hidden className="tb-bg-ink absolute inset-x-3 bottom-0 h-1" /> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <span className="tb-body-s tb-c-ink2 hidden lg:inline">{p.name}</span>
            <span aria-hidden className="tb-bg-ink tb-label inline-flex h-10 w-10 items-center justify-center rounded-full">
              {initials}
            </span>
          </div>
        </div>
      </header>

      {/* Phone: the four destinations at thumb reach. */}
      <nav aria-label="Primary" className="tb-bg-sheet tb-rule-t fixed inset-x-0 bottom-0 z-40 md:hidden">
        <ul className="grid grid-cols-4">
          {ITEMS.map((it) => {
            const current = it.match(pathname);
            return (
              <li key={it.label}>
                <Link
                  href={it.href === "#" ? "#" : `${it.href}${q}`}
                  aria-current={current ? "page" : undefined}
                  className={cn("flex min-h-[64px] flex-col items-center justify-center gap-1", current ? "tb-c-ink" : "tb-c-ink3")}
                >
                  <span className={cn("inline-flex h-7 w-12 items-center justify-center rounded-full", current && "tb-bg-teal-wash")}>
                    <Icon icon={it.icon} size={20} aria-hidden="true" />
                  </span>
                  <span className="tb-label">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
