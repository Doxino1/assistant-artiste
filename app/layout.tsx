import type { Metadata } from "next";
import { Inter, Piazzolla } from "next/font/google";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { LocaleProvider } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

// Inter et Piazzolla couvrent tous les alphabets utilisés par l'app (latin +
// grec) — Fraunces/Instrument Serif n'ont pas de glyphes grecs, ce qui aurait
// cassé la cohérence typographique pour les titres en langue EL.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "greek"],
});

const piazzolla = Piazzolla({
  variable: "--font-display",
  subsets: ["latin", "greek"],
});

export const metadata: Metadata = {
  title: "Assistant pour artistes",
  description: "Événements, matching et communauté pour artistes à Paris et Athènes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isModerator = false;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("is_moderator")
      .eq("id", user.id)
      .single();
    isModerator = data?.is_moderator === true;
  }

  return (
    <html
      lang="fr"
      className={`${inter.variable} ${piazzolla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <header className="border-b border-foreground/10">
            <Header userEmail={user?.email ?? null} isModerator={isModerator} />
          </header>
          <div className={user ? "pb-20" : ""}>{children}</div>
          <BottomNav show={!!user} />
        </LocaleProvider>
      </body>
    </html>
  );
}
