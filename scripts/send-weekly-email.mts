// Envoi manuel de l'email hebdomadaire personnalisé (par ville + discipline).
// Usage : npm run send-weekly-email -- --dry-run
//
// Nécessite dans .env.local :
//   SUPABASE_SERVICE_ROLE_KEY  (Supabase > Project Settings > API — jamais NEXT_PUBLIC_*)
//   RESEND_API_KEY             (Resend > API Keys)
// Sans RESEND_API_KEY, ou avec --dry-run, le script se contente d'afficher
// qui recevrait quoi, sans rien envoyer.
//
// En production, ce même envoi est déclenché automatiquement chaque semaine
// par le Vercel Cron Job défini dans vercel.json (app/api/cron/weekly-email) —
// ce script reste utile pour un déclenchement manuel ou un test en local.

import { sendWeeklyEmails } from "../lib/weekly-email.ts";

const dryRun = process.argv.includes("--dry-run");

sendWeeklyEmails({ dryRun, onLog: (line) => console.log(line) }).catch((err) => {
  console.error(err);
  process.exit(1);
});
