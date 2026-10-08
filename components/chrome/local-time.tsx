"use client";

import { profile } from "@/data/profile";
import { formatTime, useNow } from "@/lib/hooks";

/** Local time in Turin. Renders a fixed-width placeholder on the server. */
export function LocalTime({ seconds = false, zone = true }: { seconds?: boolean; zone?: boolean }) {
  const now = useNow();
  const placeholder = seconds ? "--:--:--" : "--:--";
  const { time, zone: tz } = now ? formatTime(now, profile.location.timeZone, seconds) : { time: placeholder, zone: "" };
  return (
    <span className="tabular" suppressHydrationWarning>
      <time aria-label={now ? `Local time in ${profile.location.city}: ${time}` : undefined}>{time}</time>
      {zone && tz ? <span className="ml-[0.6em]">{tz}</span> : null}
    </span>
  );
}
