import * as React from "react";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";

/**
 * The signed-out pages of the account flow (sign in, deletion requested): the logo and one
 * card in the middle, nothing of the platform around them, since the learner is signed out.
 */
export function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-sko-bg-subtle px-4 py-10 md:py-16">
      <SkillUpLogo className="h-8" />
      <main
        id="main"
        className="mt-8 flex w-full max-w-[520px] flex-col gap-6 rounded-surface border border-sko-border-subtle bg-sko-bg-page p-6 shadow-sm md:p-8"
      >
        {children}
      </main>
    </div>
  );
}
