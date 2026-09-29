"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { personaIds, personas } from "@/lib/lab/dashboard-mock";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/lab/dashboard/continue" },
  { label: "My Learning", href: "/" },
];

/** Platform topbar for lab pages: logo, primary nav, and a persona switcher for testing. */
export function LabTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const persona = params.get("persona") ?? "maya";

  // Inside a lab *world* the world owns its navigation; the lab keeps only a slim strip for testing.
  if (pathname.startsWith("/lab/training")) {
    return (
      <div className="flex min-h-[44px] flex-wrap items-center gap-x-4 gap-y-1 border-b border-sko-border-subtle bg-sko-bg-page px-4 py-1 md:px-6">
        <Link href="/lab" className="sk-text-sm-semibold inline-flex min-h-[44px] items-center text-sko-text-primary">
          ← All explorations
        </Link>
        <span className="sk-text-sm-medium text-sko-text-muted">World: The Training Block</span>
        <label className="ml-auto flex items-center gap-2">
          <span className="sk-text-sm-medium text-sko-text-muted">Persona</span>
          <select
            value={persona}
            onChange={(e) => {
              const next = new URLSearchParams(params.toString());
              next.set("persona", e.target.value);
              router.replace(`${pathname}?${next.toString()}`);
            }}
            className="sk-text-sm-medium min-h-[44px] rounded-md border border-sko-border-default bg-sko-bg-page px-2 text-sko-text-default"
          >
            {personaIds.map((id) => (
              <option key={id} value={id}>
                {personas[id].name}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  return (
    <header className="flex min-h-[60px] flex-wrap items-center gap-x-4 gap-y-2 border-b border-sko-border-subtle bg-sko-bg-page px-4 py-2 md:px-6">
      <Link href="/lab" className="inline-flex min-h-[44px] items-center rounded-md" aria-label="SkillUp — lab home">
        <SkillUpLogo className="h-7" />
      </Link>
      <nav aria-label="Primary" className="flex flex-1 items-center gap-1">
        {NAV.map((item) => {
          const current = item.href !== "/" && pathname.startsWith("/lab/dashboard");
          return (
            <Link
              key={item.label}
              href={item.href === "/" ? item.href : `${item.href}?persona=${persona}`}
              aria-current={current ? "page" : undefined}
              className={cn(
                "sk-text-sm-semibold inline-flex min-h-[44px] items-center rounded-md px-3",
                current ? "bg-sko-bg-primary-soft text-sko-text-primary" : "text-sko-text-muted hover:bg-sko-bg-faint",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <label className="flex items-center gap-2">
        <span className="sk-text-sm-medium text-sko-text-muted">Persona</span>
        <select
          value={persona}
          onChange={(e) => {
            const next = new URLSearchParams(params.toString());
            next.set("persona", e.target.value);
            router.replace(`${pathname}?${next.toString()}`);
          }}
          className="sk-text-sm-medium min-h-[44px] rounded-md border border-sko-border-default bg-sko-bg-page px-2 text-sko-text-default"
        >
          {personaIds.map((id) => (
            <option key={id} value={id}>
              {personas[id].name}
            </option>
          ))}
        </select>
      </label>
    </header>
  );
}
