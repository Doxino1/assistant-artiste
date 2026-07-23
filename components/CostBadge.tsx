"use client";

import { useT } from "@/lib/i18n/context";
import { CoutType } from "@/lib/types";

const STYLES: Record<CoutType, string> = {
  gratuit: "bg-badge-free-bg text-badge-free-fg",
  payant: "bg-badge-paid-bg text-badge-paid-fg",
};

export function CostBadge({ type }: { type: CoutType }) {
  const t = useT();

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[type]}`}>
      {t.coutLabels[type]}
    </span>
  );
}
