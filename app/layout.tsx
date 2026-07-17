import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-foreground/10">
          <nav className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 py-3 text-sm">
            <Link href="/" className="font-medium">
              Flux
            </Link>
            <Link href="/mes-evenements" className="text-foreground/60 hover:text-foreground">
              Mes événements
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
