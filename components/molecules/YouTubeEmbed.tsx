import { cn } from "@/lib/utils";

/**
 * A YouTube video as a course team pastes it into a Text component in Studio (ICP Video Lessons
 * row 9, meeting of 4 Nov 2026): YouTube's own player in an iframe. We cannot restyle it, and we
 * never learn what was watched, so the topic completes by hand. The YouTube logo in the player
 * opens the video on youtube.com, and that cannot be blocked: YouTube's policies keep the logo
 * and its link visible and clickable (tech team's discovery, Kirti, 12 Nov 2026). The only YouTube
 * option since then; row 10 (YouTube inside our player) was withdrawn.
 *
 * The frame takes the place and the sticky docking of our VideoPlayer: same ground, same radius.
 * youtube-nocookie.com, so YouTube sets no cookie until the learner plays the video.
 */
export function YouTubeEmbed({
  videoId,
  title,
  heightPx,
  docked = false,
  className,
}: {
  videoId: string;
  /** The topic title: the iframe's accessible name. */
  title: string;
  heightPx?: number | string;
  docked?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-sko-bg-subtle transition-[height,border-radius] duration-short4 ease-standard-decelerate",
        heightPx ? "" : "aspect-video max-h-[34vh]",
        docked ? "rounded-b-card rounded-t-none" : "rounded-card",
        className,
      )}
      style={{ height: heightPx }}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`}
        title={title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-y-0 left-1/2 aspect-video h-full max-w-full -translate-x-1/2 border-0"
      />
    </div>
  );
}
