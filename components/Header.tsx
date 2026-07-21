"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "./SignOutButton";
import { useLocale } from "@/lib/i18n/context";
import { LOCALE_LABELS, LOCALES } from "@/lib/i18n/dictionary";

export function Header({
  userEmail,
  isModerator,
}: {
  userEmail: string | null;
  isModerator: boolean;
}) {
  const { locale, setLocale, t } = useLocale();
  const pathname = usePathname();
  const onLoginPage = pathname === "/login";

  return (
    <nav className="mx-auto flex w-full max-w-2xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm">
      <Link href="/" className="font-display text-base font-medium">
        {t.nav.evenements}
      </Link>
      {userEmail && (
        <>
          <Link href="/matching" className="text-foreground-muted hover:text-foreground">
            {t.nav.matching}
          </Link>
          <Link href="/artistes" className="text-foreground-muted hover:text-foreground">
            {t.artiste.directory}
          </Link>
          <Link href="/communaute" className="text-foreground-muted hover:text-foreground">
            {t.nav.communaute}
          </Link>
          <Link href="/boutiques" className="text-foreground-muted hover:text-foreground">
            {t.shops.title}
          </Link>
          <Link href="/profil" className="text-foreground-muted hover:text-foreground">
            {t.nav.profil}
          </Link>
          {isModerator && (
            <Link href="/moderation" className="text-foreground-muted hover:text-foreground">
              {t.nav.moderation}
            </Link>
          )}
        </>
      )}

      <div className="flex gap-1">
        {LOCALES.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`rounded px-1.5 py-0.5 text-xs transition ${
              locale === l
                ? "bg-foreground text-background"
                : "text-foreground/40 hover:text-foreground/70"
            }`}
          >
            {LOCALE_LABELS[l]}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-4">
        {userEmail ? (
          <>
            <span className="text-foreground-muted">{userEmail}</span>
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
