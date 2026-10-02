"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { isWired } from "./copy";

/**
 * The page's one primary action: a white pill whose colour lives in its disc. On hover or focus the disc
 * crosses the capsule (the world's single motion moment). An unbuilt destination renders a real button.
 */
export function Pill({
  label,
  href,
  onUnwired,
  describedBy,
}: {
  label: string;
  href?: string;
  onUnwired: () => void;
  describedBy?: string;
}) {
  const inner = (
    <>
      <span className="fd-pill__label">{label}</span>
      <span className="fd-pill__disc" aria-hidden>
        <Icon icon={ChevronRight} size={24} />
      </span>
    </>
  );
  const cls = "fd-pill w-full justify-center sm:w-auto sm:justify-start";
  return isWired(href) ? (
    <Link href={href} className={cls} aria-describedby={describedBy}>
      {inner}
    </Link>
  ) : (
    <button type="button" className={cls} onClick={onUnwired} aria-describedby={describedBy}>
      {inner}
    </button>
  );
}

/** Where "Lab demo — not wired" is announced. Always in the DOM so screen readers hear the change. */
export function Notice({ text, onField = true }: { text: string; onField?: boolean }) {
  return (
    <p role="status" className={`fd-body mt-4 min-h-[1.5em] ${onField ? "fd-c-white" : "fd-c-ink2"}`}>
      {text}
    </p>
  );
}
