"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, User } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export function BottomNav({ show }: { show: boolean }) {
  const t = useT();
  const pathname = usePathname();

  if (!show) return null;

  const items = [
    { href: "/", label: t.nav.evenements, Icon: Calendar },
    { href: "/communaute", label: t.nav.communaute, Icon: Users },
    { href: "/profil", label: t.nav.profil, Icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-background">
      <div className="mx-auto flex w-full max-w-2xl">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition ${
                active ? "text-accent" : "text-foreground/40 hover:text-foreground/60"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
              <span className={active ? "font-medium" : ""}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
