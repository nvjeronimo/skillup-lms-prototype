import { Button } from "@/components/atoms/Button";
import { DeliveryModeBadge, type DeliveryMode } from "@/components/atoms/MetaBadges";
import { cn } from "@/lib/utils";

export interface ResumeRowProps {
  title: string;
  deliveryMode: DeliveryMode;
  progressPct: number;
  onResume?: () => void;
  className?: string;
}

/**
 * `LMS / Platform / Resume row` (6418:18853): a course to resume on a narrow screen, the
 * mobile stand-in for the DS `LMS / Course Row`, which cannot show its delivery badge under
 * ~390px. Same atoms and tokens as the DS row: title (body-large/Medium), the Delivery Mode
 * badge under it (gap 8), then the DS Progress bar with the percentage (gap 12) and the
 * button (gap 16). bg/page, 2px border/primary, radius 12, padding 16, gap 12, no shadow.
 * The button is drawn sm (36); it is md (44) here for the mobile touch-target minimum.
 */
export function ResumeRow({ title, deliveryMode, progressPct, onResume, className }: ResumeRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border-2 border-sko-border-primary bg-sko-bg-page p-4",
        className,
      )}
    >
      <div className="flex flex-col items-start gap-2">
        <p className="sk-text-md-medium w-full text-sko-text-default">{title}</p>
        <DeliveryModeBadge value={deliveryMode} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            role="progressbar"
            aria-label={`${title} progress`}
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-sko-bg-muted"
          >
            <div className="h-full rounded-full bg-sko-bg-info" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="sk-text-sm-medium whitespace-nowrap text-sko-text-muted">{progressPct}%</span>
        </div>
        <Button hierarchy="primary" size="md" className="shrink-0" aria-label={`Resume ${title}`} onClick={onResume}>
          Resume
        </Button>
      </div>
    </div>
  );
}
