import * as React from "react";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import styles from "./AccountShell.module.css";

/**
 * The signed-out pages of the account flow (sign in, deletion requested): the logo and one
 * card in the middle, nothing of the platform around them, since the learner is signed out.
 */
export function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <SkillUpLogo className={styles.logo} />
      <main id="main" className={styles.card}>
        {children}
      </main>
    </div>
  );
}
