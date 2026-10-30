/**
 * Account deletion, prototype only (Nelson, 30 Oct 2026: try the flow agreed for the next release).
 *
 * Open edX basis (docs.openedx.org, "What is User Retirement?"): Account settings has "Delete my
 * account", confirmed with the password; the learner is signed out of every session and locked
 * out; the account waits in PENDING for RETIREMENT_COOL_OFF_DAYS (30 by default, SkillUp: 14),
 * then it is deleted. Only support can cancel it in that time. Signing in to cancel the request
 * is ours (the login interstitial), shown only with "Beyond Open edX".
 *
 * The request lives in the `sk-account` cookie ("pending:2026-10-30"), read by the platform
 * layout (a pending account is signed out) and by the account pages. Nothing is sent.
 */
export const ACCOUNT_COOKIE = "sk-account";
export const GRACE_DAYS = 14;

/** The day the request was made, or null when the account is active. */
export function parseDeletionRequest(value: string | null | undefined): Date | null {
  const m = /^pending:(\d{4}-\d{2}-\d{2})$/.exec(decodeURIComponent(value ?? ""));
  if (!m) return null;
  const d = new Date(`${m[1]}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** The day the account is deleted: the request + the grace period. */
export function deletionDate(requested: Date): Date {
  const d = new Date(requested);
  d.setDate(d.getDate() + GRACE_DAYS);
  return d;
}

/** "13 November 2026". */
export const formatDay = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Browser only: records the request (today) and returns its day. */
export function requestDeletion(today = new Date()): Date {
  document.cookie = `${ACCOUNT_COOKIE}=${encodeURIComponent(`pending:${isoDay(today)}`)}; path=/; max-age=31536000; samesite=lax`;
  return today;
}

/** Browser only: cancels the request (the account is active again). */
export function cancelDeletion() {
  document.cookie = `${ACCOUNT_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

/** Browser only: the pending request, if any. */
export function readDeletionRequest(): Date | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${ACCOUNT_COOKIE}=`));
  return parseDeletionRequest(raw?.slice(ACCOUNT_COOKIE.length + 1));
}

export const SIGN_IN_HREF = "/account/sign-in";
export const DELETION_REQUESTED_HREF = "/account/deletion-requested";
/** Where "Contact support" goes in the prototype. */
export const SUPPORT_HREF = "mailto:support@skillup.online?subject=Cancel%20my%20account%20deletion";
