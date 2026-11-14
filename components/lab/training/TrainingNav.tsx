import Link from "@/lib/router";
import { usePathname, useSearchParams } from "@/lib/router";
import { CalendarDays, Flag, House, Layers } from "lucide-react";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { Icon } from "@/lib/icons";
import { getPersona } from "@/lib/lab/dashboard-mock";
import { cn } from "@/lib/utils";
import styles from "./TrainingNav.module.css";

/** Destinations this exploration does not build: shown so the shell reads whole, but not links to nowhere. */
const NOT_BUILT = " (not built in this lab)";

const ITEMS = [
  {
    label: "Today",
    href: "/lab/training",
    icon: House,
    match: (p: string) => p === "/lab/training",
  },
  {
    label: "Plans",
    href: "/lab/training/plans",
    icon: Layers,
    match: (p: string) =>
      p.startsWith("/lab/training/plans") || p.startsWith("/lab/training/course"),
  },
  { label: "Calendar", href: "#", icon: CalendarDays, match: () => false },
  { label: "Certificates", href: "#", icon: Flag, match: () => false },
];

/** The world's own navigation: a slim bar on desktop, a thumb-reach tab bar on phones. */
export function TrainingNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  const persona = params.get("persona") ?? "maya";
  const p = getPersona(persona);
  const initials = p.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  const q = `?persona=${persona}`;

  return (
    <>
      <header className="tb-bg-sheet tb-rule-b">
        <div className={styles.bar}>
          <Link
            href={`/lab/training${q}`}
            aria-label="SkillUp, Today"
            className={styles.home}
          >
            <SkillUpLogo className={styles.logo} />
          </Link>
          <nav aria-label="Primary" className={styles.nav}>
            <ul className={styles.navList}>
              {ITEMS.map((it) => {
                const current = it.match(pathname);
                return (
                  <li key={it.label}>
                    {it.href === "#" ? (
                      <span
                        aria-disabled="true"
                        className={`tb-label tb-c-ink3 ${styles.navItem}`}
                      >
                        {it.label}
                        <span className="sk-sr-only">{NOT_BUILT}</span>
                      </span>
                    ) : (
                      <Link
                        href={`${it.href}${q}`}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "tb-label",
                          styles.navItem,
                          current ? "tb-c-ink" : "tb-c-ink2",
                        )}
                      >
                        {it.label}
                        {current ? (
                          <span aria-hidden className={`tb-bg-ink ${styles.currentRule}`} />
                        ) : null}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className={styles.who}>
            <span className={`tb-body-s tb-c-ink2 ${styles.name}`}>{p.name}</span>
            <span
              aria-hidden
              className={`tb-bg-ink tb-label ${styles.avatar}`}
            >
              {initials}
            </span>
          </div>
        </div>
      </header>

      {/* Phone: the four destinations at thumb reach. */}
      <nav
        aria-label="Primary"
        className={`tb-bg-sheet tb-rule-t ${styles.tabBar}`}
      >
        <ul className={styles.tabs}>
          {ITEMS.map((it) => {
            const current = it.match(pathname);
            return (
              <li key={it.label}>
                {it.href === "#" ? (
                  <span
                    aria-disabled="true"
                    className={`tb-c-ink3 ${styles.tab}`}
                  >
                    <span className={styles.tabIcon}>
                      <Icon icon={it.icon} size={20} aria-hidden="true" />
                    </span>
                    <span className="tb-label">{it.label}</span>
                    <span className="sk-sr-only">{NOT_BUILT}</span>
                  </span>
                ) : (
                  <Link
                    href={`${it.href}${q}`}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      styles.tab,
                      current ? "tb-c-ink" : "tb-c-ink3",
                    )}
                  >
                    <span
                      className={cn(
                        styles.tabIcon,
                        styles.tabIconPill,
                        current && "tb-bg-teal-wash",
                      )}
                    >
                      <Icon icon={it.icon} size={20} aria-hidden="true" />
                    </span>
                    <span className="tb-label">{it.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
