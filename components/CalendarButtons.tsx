"use client";

import { CalendarPlus, Download } from "lucide-react";
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
        className="flex items-center gap-1.5 rounded-lg border border-foreground/20 px-3 py-1.5 text-xs hover:border-foreground/40"
      >
        <CalendarPlus size={14} strokeWidth={1.75} />
        {t.eventDetail.addToGoogleCalendar}
      </a>
      <button
        type="button"
        onClick={() => downloadIcs(event)}
        className="flex items-center gap-1.5 rounded-lg border border-foreground/20 px-3 py-1.5 text-xs hover:border-foreground/40"
      >
        <Download size={14} strokeWidth={1.75} />
        {t.eventDetail.addToAppleCalendar}
      </button>
    </div>
  );
}
