"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "./SignOutButton";
import { useT } from "@/lib/i18n/context";

export function Header({
  userEmail,
  isModerator,
}: {
  userEmail: string | null;
  isModerator: boolean;
}) {
  const t = useT();
  const pathname = usePathname();
  const onLoginPage = pathname === "/login";

  return (
    <nav className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 py-3 text-sm">
      <span className="font-display text-base font-medium">{t.nav.evenements}</span>

      <div className="ml-auto flex items-center gap-4">
        {userEmail ? (
          <>
            {isModerator && (
              <Link href="/moderation" className="text-xs text-foreground-muted hover:text-foreground">
                {t.nav.moderation}
              </Link>
            )}
            <span className="hidden text-foreground-muted sm:inline">{userEmail}</span>
            <SignOutButton />
          </>
        ) : (
          !onLoginPage && (
            <Link href="/login" className="text-foreground-muted hover:text-foreground">
              {t.nav.connexion}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
