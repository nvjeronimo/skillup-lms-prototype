import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";

/** An unknown program slug: say so and point back to My Learning. */
export default function ProgramNotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-sko-bg-faint p-6">
      <div className="w-full max-w-xl bg-sko-bg-page">
        <EmptyState
          icon={SearchX}
          titleAs="h1"
          title="We could not find that program"
          description="It may have been renamed, or the link is incomplete."
          action={
            <Link
              href="/platform/my-learning?tab=programs"
              className="sk-text-sm-semibold inline-flex min-h-11 items-center text-sko-text-primary underline underline-offset-2"
            >
              See your programs
            </Link>
          }
        />
      </div>
    </div>
  );
}
