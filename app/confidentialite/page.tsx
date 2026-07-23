import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Comme les Mentions légales et les CGU, ce document reste en français —
// voir la note en tête de page pour les visiteurs non francophones.
export const metadata = {
  title: "Politique de confidentialité — Assistant pour artistes",
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground">
        <ArrowLeft size={14} strokeWidth={1.75} />
        Retour
      </Link>

      <h1 className="font-display mt-4 text-xl font-semibold">Politique de confidentialité</h1>
      <p className="mt-1 text-xs text-foreground/50">
        This page is only available in French. Summary: we collect your profile info, saved events, posts and
        content you submit, and the addresses of events/shops (never your personal location) to run the service.
        You can export or delete all your data at any time from Réglages / Settings. Write to{" "}
        <a href="mailto:dotian.diarra@aliecom.com" className="underline">
          dotian.diarra@aliecom.com
        </a>{" "}
        with any question.
      </p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-medium">Responsable du traitement</h2>
          <p className="mt-2 text-foreground-muted">
            L&rsquo;éditeur du site (voir les Mentions légales) est responsable du traitement des données
            décrites ici.
            <br />
            Contact :{" "}
            <a href="mailto:dotian.diarra@aliecom.com" className="underline hover:text-foreground">
              dotian.diarra@aliecom.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-medium">Données collectées et pourquoi</h2>
          <ul className="mt-2 flex flex-col gap-2 text-foreground-muted">
            <li>
              <strong className="text-foreground">Compte et profil</strong> — email, nom, ville, discipline(s),
              type de profil, bio, langue préférée : nécessaires pour créer ton compte et te montrer un contenu
              pertinent par ville et discipline.
            </li>
            <li>
              <strong className="text-foreground">Événements sauvegardés / « je viens »</strong> — pour afficher
              tes événements dans « Mes événements » et dans le résumé hebdomadaire.
            </li>
            <li>
              <strong className="text-foreground">Contenu que tu publies</strong> — événements ou boutiques
              soumis, posts, portfolio, messages dans le groupe communautaire et leurs réponses : affichés selon
              les réglages de visibilité que tu choisis (public/privé pour le portfolio et les posts).
            </li>
            <li>
              <strong className="text-foreground">Localisation des événements et boutiques</strong> — quand une
              adresse est renseignée à la soumission, elle est transformée en coordonnées via le service gratuit
              Nominatim/OpenStreetMap, uniquement pour l&rsquo;affichage sur la carte. Il s&rsquo;agit de
              l&rsquo;adresse du lieu, jamais de ta position personnelle : le site ne fait aucune géolocalisation
              de ses utilisateurs.
            </li>
            <li>
              <strong className="text-foreground">Réseaux sociaux (optionnel)</strong> — si tu renseignes tes
              identifiants Instagram/TikTok/Twitter, ils sont affichés sur ton profil public.
            </li>
            <li>
              <strong className="text-foreground">Signalements et blocages</strong> — si tu signales ou bloques
              un autre utilisateur, ces informations sont conservées pour la modération.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-medium">Base légale</h2>
          <p className="mt-2 text-foreground-muted">
            Le traitement repose sur l&rsquo;exécution du service que tu utilises en créant un compte
            (fonctionnement du site, mise en relation, communauté). L&rsquo;email hebdomadaire est envoyé par
            défaut aux comptes actifs ; tu peux le désactiver à tout moment dans Réglages.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Qui a accès à ces données</h2>
          <ul className="mt-2 flex flex-col gap-2 text-foreground-muted">
            <li>
              <strong className="text-foreground">Supabase</strong> — hébergement de la base de données, de
              l&rsquo;authentification et des fichiers (images).
            </li>
            <li>
              <strong className="text-foreground">Resend</strong> — envoi de l&rsquo;email hebdomadaire (reçoit
              ton adresse email et son contenu).
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong> — hébergement du site (voir Mentions légales).
            </li>
            <li>
              <strong className="text-foreground">Nominatim / OpenStreetMap</strong> — géocodage des adresses
              d&rsquo;événements et de boutiques (reçoit uniquement l&rsquo;adresse saisie, pas de donnée
              personnelle).
            </li>
          </ul>
          <p className="mt-2 text-foreground-muted">
            Ces données ne sont ni vendues, ni utilisées à des fins publicitaires.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Durée de conservation</h2>
          <p className="mt-2 text-foreground-muted">
            Tes données sont conservées tant que ton compte existe. À la suppression de ton compte, ton profil et
            tout ton contenu privé (posts, portfolio, bibliothèque, messages, tags, abonnements) sont supprimés
            définitivement. Les événements que tu as publiés restent visibles (ils ont déjà été partagés avec la
            communauté) mais ne sont plus rattachés à ton compte.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Tes droits</h2>
          <p className="mt-2 text-foreground-muted">
            Conformément au RGPD, tu disposes d&rsquo;un droit d&rsquo;accès, de rectification, d&rsquo;effacement
            et de portabilité de tes données.
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-foreground-muted">
            <li>
              <strong className="text-foreground">Rectification</strong> — modifie ton profil directement dans
              Réglages.
            </li>
            <li>
              <strong className="text-foreground">Portabilité</strong> — télécharge une copie de tes données au
              format JSON depuis Réglages → Télécharger mes données.
            </li>
            <li>
              <strong className="text-foreground">Effacement</strong> — supprime définitivement ton compte depuis
              Réglages → Supprimer mon compte.
            </li>
            <li>
              <strong className="text-foreground">Autre demande</strong> — écris à{" "}
              <a href="mailto:dotian.diarra@aliecom.com" className="underline hover:text-foreground">
                dotian.diarra@aliecom.com
              </a>
              .
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
