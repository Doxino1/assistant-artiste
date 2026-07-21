"use client";

import { useT } from "@/lib/i18n/context";

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const t = useT();

  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-xs ${checked ? "text-foreground" : "text-foreground/40"}`}>
        {checked ? t.common.public : t.common.prive}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-[18px] w-8 rounded-full transition ${
          checked ? "bg-accent" : "bg-foreground/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-[14px] w-[14px] rounded-full bg-background transition ${
            checked ? "left-[16px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
