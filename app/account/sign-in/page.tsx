import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInView } from "@/components/account/SignInView";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("Sign in") };

/** A stand-in sign-in page for the account deletion flow (30 Oct 2026). */
export default function SignInPage() {
  return (
    <Suspense>
      <SignInView />
    </Suspense>
  );
}
