"use client";

import { SavedStatus } from "@/lib/types";

interface SaveButtonsProps {
  status?: SavedStatus;
  onChange: (status: SavedStatus | null) => void;
}

export function SaveButtons({ status, onChange }: SaveButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(status === "sauvegarde" ? null : "sauvegarde")}
        className={`rounded-full border px-3 py-1 text-sm transition ${
          status === "sauvegarde"
            ? "border-foreground bg-foreground text-background"
            : "border-foreground/20 hover:border-foreground/40"
        }`}
      >
        {status === "sauvegarde" ? "Sauvegardé ✓" : "Sauvegarder"}
      </button>
      <button
        type="button"
        onClick={() => onChange(status === "je_viens" ? null : "je_viens")}
        className={`rounded-full border px-3 py-1 text-sm transition ${
          status === "je_viens"
            ? "border-foreground bg-foreground text-background"
            : "border-foreground/20 hover:border-foreground/40"
        }`}
      >
        {status === "je_viens" ? "Je viens ✓" : "Je viens"}
      </button>
    </div>
  );
}
