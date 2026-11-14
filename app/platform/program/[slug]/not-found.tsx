import Link from "@/lib/router";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";
import styles from "./not-found.module.css";

/** An unknown program slug: say so and point back to My Learning. */
export default function ProgramNotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <EmptyState
          icon={SearchX}
          titleAs="h1"
          title="We could not find that program"
          description="It may have been renamed, or the link is incomplete."
          action={
            <Link
              href="/platform/my-learning?tab=programs"
              className={`sk-text-body-medium-semibold ${styles.link}`}
            >
              See your programs
            </Link>
          }
        />
      </div>
    </div>
  );
}
