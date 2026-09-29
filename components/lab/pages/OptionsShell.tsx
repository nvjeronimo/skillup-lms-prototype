"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { getPersona } from "@/lib/lab/dashboard-mock";
import { PAGES, PAGE_KEYS, type OptionKey, type PageKey } from "@/lib/lab/page-options";
import { cn } from "@/lib/utils";

/** Reads /lab/pages/<page>/<option> from the path. */
function useWhere(): { page?: PageKey; option?: OptionKey } {
  const m = /^\/lab\/pages\/(today|plans|course)(?:\/([abcd]))?/.exec(usePathname());
  return { page: m?.[1] as PageKey | undefined, option: m?.[2] as OptionKey | undefined };
}

/**
 * The product's own top bar for the options: logo, the three pages, the learner.
 * Every option on a page shares it, so the comparison is about the page, not the chrome.
 */
export function OptionsNav() {
  const { page, option } = useWhere();
  const params = useSearchParams();
  const persona = params.get("persona") ?? "maya";
  const p = getPersona(persona);
  const initials = p.name.split(" ").map((w) => w[0]).join("");
  const q = `?persona=${persona}`;
  return (
    <header className="border-b border-sko-border-subtle bg-sko-bg-page">
      <div className="mx-auto flex min-h-[64px] w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4 md:px-8">
        <Link href={`/lab/pages/today/${option ?? "a"}${q}`} aria-label="SkillUp, Today" className="inline-flex min-h-[44px] items-center">
          <SkillUpLogo className="h-7" />
        </Link>
        <nav aria-label="Primary" className="order-3 w-full md:order-none md:w-auto md:flex-1">
          <ul className="flex gap-1">
            {PAGE_KEYS.map((k) => (
              <li key={k}>
                <Link
                  href={`/lab/pages/${k}/${option ?? "a"}${q}`}
                  aria-current={page === k ? "page" : undefined}
                  className={cn(
                    "sk-text-sm-semibold inline-flex min-h-[44px] items-center rounded-md px-3",
                    page === k ? "bg-sko-bg-primary-soft text-sko-text-primary" : "text-sko-text-muted hover:bg-sko-bg-faint",
                  )}
                >
                  {PAGES[k].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <span className="ml-auto flex items-center gap-3 md:ml-0">
          <span className="sk-text-sm-medium hidden text-sko-text-muted lg:inline">{p.name}</span>
          <span aria-hidden className="sk-text-sm-semibold inline-flex h-10 w-10 items-center justify-center rounded-full bg-sko-bg-primary text-sko-text-on-primary">
            {initials}
          </span>
        </span>
      </div>
    </header>
  );
}

/** Lab-only strip: which option this is, and the other options of the same page one click away. */
export function OptionSwitcher() {
  const { page, option } = useWhere();
  const params = useSearchParams();
  if (!page || !option) return null;
  const q = `?${params.toString()}`;
  const current = PAGES[page].options.find((o) => o.key === option);
  return (
    <nav aria-label={`${PAGES[page].label} options`} className="border-b border-dashed border-sko-border-default bg-sko-bg-faint">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 md:px-8">
        <span className="sk-text-sm-semibold text-sko-text-default">{PAGES[page].label} options</span>
        <ul className="flex flex-wrap gap-1">
          {PAGES[page].options.map((o) => (
            <li key={o.key}>
              <Link
                href={`/lab/pages/${page}/${o.key}${q}`}
                aria-current={o.key === option ? "page" : undefined}
                className={cn(
                  "sk-text-sm-medium inline-flex min-h-[44px] items-center rounded-md border px-3",
                  o.key === option
                    ? "border-sko-border-primary bg-sko-bg-page text-sko-text-primary"
                    : "border-transparent text-sko-text-muted hover:bg-sko-bg-page",
                )}
              >
                {o.key.toUpperCase()} · {o.name}
              </Link>
            </li>
          ))}
        </ul>
        {current ? <p className="sk-text-sm-regular w-full text-sko-text-muted">{current.idea}</p> : null}
      </div>
    </nav>
  );
}
