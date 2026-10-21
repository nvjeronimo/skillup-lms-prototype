import { tsToSeconds } from "@/lib/utils";

/**
 * The transcript line playing at `seconds`: the last one that has started, or the first one.
 * Playback moves the active line with it, as a click on a line moves the playhead.
 */
export function lineAt(lines: readonly { id: string; ts: string }[], seconds: number): string | undefined {
  let id = lines[0]?.id;
  for (const line of lines) {
    if (tsToSeconds(line.ts) <= seconds) id = line.id;
  }
  return id;
}
