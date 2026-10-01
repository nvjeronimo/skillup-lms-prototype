import { Loader2 } from "lucide-react";

/**
 * Shown while a platform route segment loads. The spinner pulses instead of turning
 * when reduced motion is on (app/globals.css).
 */
export default function PlatformLoading() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-sko-bg-faint">
      <div role="status" className="flex flex-col items-center gap-3">
        <Loader2 size={32} strokeWidth={2} aria-hidden className="animate-spin text-sko-icon-primary" />
        <p className="sk-text-sm-medium text-sko-text-muted">Loading your learning…</p>
      </div>
    </div>
  );
}
