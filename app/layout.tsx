import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { LocaleProvider } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <header className="border-b border-foreground/10">
            <Header userEmail={user?.email ?? null} isModerator={isModerator} />
          </header>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
