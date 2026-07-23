"use client";

import { useT } from "@/lib/i18n/context";
import { EventType } from "@/lib/types";

const STYLES: Record<EventType, string> = {
  vernissage: "bg-badge-vernissage-bg text-badge-vernissage-fg",
  workshop: "bg-badge-workshop-bg text-badge-workshop-fg",
  open_call: "bg-badge-open-call-bg text-badge-open-call-fg",
  expo: "bg-badge-expo-bg text-badge-expo-fg",
  residency: "bg-badge-residency-bg text-badge-residency-fg",
  annonce: "bg-badge-annonce-bg text-badge-annonce-fg",
};

export function EventTypeBadge({ type }: { type: EventType }) {
  const t = useT();
  const label = t.eventTypeLabels[type] ?? type;

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[type] ?? "bg-surface text-foreground-muted"}`}
    >
      {label}
    </span>
  );
}
