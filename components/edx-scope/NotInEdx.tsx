import * as React from "react";
import { Ban } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";

/**
 * What a whole page shows in the Open edX scope when Open edX has nothing behind it
 * (Calendar, Services). Says why, so the gap is a finding, not a broken page.
 */
export function NotInEdx({ title, reason }: { title: string; reason: string }) {
  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-12">
      <EmptyState icon={Ban} titleAs="h1" title={`${title} is not in Open edX`} description={reason} />
    </div>
  );
}
