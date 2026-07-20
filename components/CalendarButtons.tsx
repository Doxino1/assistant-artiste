"use client";

import { ArtEvent } from "@/lib/types";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import { useT } from "@/lib/i18n/context";

export function CalendarButtons({ event }: { event: ArtEvent }) {
  const t = useT();

  return (
    <div className="flex gap-2">
      <a
        href={googleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-foreground/20 px-3 py-1.5 text-xs hover:border-foreground/40"
      >
        {t.eventDetail.addToGoogleCalendar}
      </a>
      <button
        type="button"
        onClick={() => downloadIcs(event)}
        className="rounded-full border border-foreground/20 px-3 py-1.5 text-xs hover:border-foreground/40"
      >
        {t.eventDetail.addToAppleCalendar}
      </button>
    </div>
  );
}
