import { NextResponse } from "next/server";
import { sendWeeklyEmails } from "@/lib/weekly-email";

// Appelée automatiquement par le Vercel Cron Job défini dans vercel.json.
// Vercel ajoute l'en-tête Authorization avec CRON_SECRET quand cette variable
// est configurée — on la vérifie pour empêcher un tiers de déclencher l'envoi
// en appelant l'URL directement.
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs: string[] = [];
  try {
    const result = await sendWeeklyEmails({ dryRun: false, onLog: (line) => logs.push(line) });
    return NextResponse.json({ ...result, logs });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error", logs },
      { status: 500 }
    );
  }
}
