import * as React from "react";
import Link from "@/lib/router";
import { usePathname, useRouter, useSearchParams } from "@/lib/router";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { personaIds, personas } from "@/lib/lab/dashboard-mock";
import { cn } from "@/lib/utils";
import styles from "./LabTopbar.module.css";

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
      <div className={styles.strip}>
        <Link href="/lab" className={`sk-text-body-medium-semibold ${styles.back}`}>
          ← All explorations
        </Link>
        <span className={`sk-text-body-medium-medium ${styles.muted}`}>World: The Training Block</span>
        <label className={`${styles.persona} ${styles.stripPersona}`}>
          <span className={`sk-text-body-medium-medium ${styles.muted}`}>Persona</span>
          <select
            value={persona}
            onChange={(e) => {
              const next = new URLSearchParams(params.toString());
              next.set("persona", e.target.value);
              router.replace(`${pathname}?${next.toString()}`);
            }}
            className={`sk-text-body-medium-medium ${styles.select}`}
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
    <header className={styles.header}>
      <Link href="/lab" className={styles.home} aria-label="SkillUp — lab home">
        <SkillUpLogo className={styles.logo} />
      </Link>
      <nav aria-label="Primary" className={styles.nav}>
        {NAV.map((item) => {
          const current = item.href !== "/" && pathname.startsWith("/lab/dashboard");
          return (
            <Link
              key={item.label}
              href={item.href === "/" ? item.href : `${item.href}?persona=${persona}`}
              aria-current={current ? "page" : undefined}
              className={cn(
                "sk-text-body-medium-semibold",
                styles.navLink,
                current ? styles.navLinkCurrent : styles.navLinkIdle,
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <label className={styles.persona}>
        <span className={`sk-text-body-medium-medium ${styles.muted}`}>Persona</span>
        <select
          value={persona}
          onChange={(e) => {
            const next = new URLSearchParams(params.toString());
            next.set("persona", e.target.value);
            router.replace(`${pathname}?${next.toString()}`);
          }}
          className={`sk-text-body-medium-medium ${styles.select}`}
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
