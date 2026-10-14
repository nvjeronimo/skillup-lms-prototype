import type { Metadata } from "next";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { DASHBOARD_HREF, MY_LEARNING_HREF } from "@/lib/platform/routes";

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
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-sko-bg-faint px-4 py-12 text-center outline-none"
    >
      <SkillUpLogo className="h-8" />
      <div className="flex max-w-[480px] flex-col gap-2">
        <h1 className="sk-text-headline-small-semibold text-sko-text-default">This page is not here</h1>
        <p className="sk-text-body-large-regular text-sko-text-muted">
          The address may be mistyped, or the page may not be part of this prototype yet.
        </p>
      </div>
      <div className="flex w-full max-w-[480px] flex-col gap-3 sm:w-auto sm:flex-row">
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
