import type { Metadata } from "@/lib/router";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { DASHBOARD_HREF, MY_LEARNING_HREF } from "@/lib/platform/routes";
import styles from "./not-found.module.css";

export const metadata: Metadata = { title: "Page not found" };

/**
 * Any address the prototype does not have: say so in words, and give the two ways back.
 * Replaces Next's default 404, which had no main landmark and none of the product.
 */
export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className={styles.page}
    >
      <SkillUpLogo className={styles.logo} />
      <div className={styles.copy}>
        <h1 className={`sk-text-headline-small-semibold ${styles.title}`}>This page is not here</h1>
        <p className={`sk-text-body-large-regular ${styles.text}`}>
          The address may be mistyped, or the page may not be part of this prototype yet.
        </p>
      </div>
      <div className={styles.actions}>
        <ButtonLink href={DASHBOARD_HREF} hierarchy="primary" size="lg">
          Go to the dashboard
        </ButtonLink>
        <ButtonLink href={MY_LEARNING_HREF} hierarchy="secondary" size="lg">
          My Learning
        </ButtonLink>
      </div>
    </main>
  );
}
