import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Conditions générales d'utilisation — Assistant pour artistes",
};

export default function CguPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground">
        <ArrowLeft size={14} strokeWidth={1.75} />
        Retour
      </Link>

      <h1 className="font-display mt-4 text-xl font-semibold">Conditions générales d&rsquo;utilisation</h1>
      <p className="mt-1 text-xs text-foreground/50">
        This page is only available in French. Summary: be respectful, don&rsquo;t spam, you&rsquo;re responsible
        for what you post, moderation applies, and the platform never handles payment for anything (including
        Annonce listings) — any transaction happens directly between users, at their own risk.
      </p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-medium">Objet</h2>
          <p className="mt-2 text-foreground-muted">
            « Assistant pour artistes » est un service gratuit qui centralise la découverte d&rsquo;événements
            artistiques, la mise en relation entre artistes et une communauté locale, à Paris et à Athènes.
            L&rsquo;utilisation du site implique l&rsquo;acceptation pleine et entière des présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Compte</h2>
          <p className="mt-2 text-foreground-muted">
            La création d&rsquo;un compte est gratuite et nécessite une adresse email valide. Tu es responsable de
            la confidentialité de tes identifiants et de l&rsquo;activité effectuée depuis ton compte.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Contenu publié par les utilisateurs</h2>
          <p className="mt-2 text-foreground-muted">
            Tu restes seul·e responsable du contenu que tu publies (événements, boutiques, posts, portfolio,
            messages, commentaires). Ce contenu doit rester pertinent pour la communauté (art, événements,
            matériel, échanges entre artistes) et respecter la loi ainsi que les droits d&rsquo;autrui.
          </p>
          <p className="mt-2 text-foreground-muted">Sont notamment interdits :</p>
          <ul className="mt-2 list-disc pl-5 text-foreground-muted">
            <li>le spam, la publicité non sollicitée et le contenu hors sujet ;</li>
            <li>le harcèlement, les propos discriminatoires ou l&rsquo;usurpation d&rsquo;identité ;</li>
            <li>le contenu illégal ou portant atteinte aux droits d&rsquo;un tiers.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-medium">Modération</h2>
          <p className="mt-2 text-foreground-muted">
            Les événements et boutiques soumis passent par une validation avant publication (automatique pour les
            contributeurs de confiance, manuelle sinon). Tout contenu — y compris les posts et messages — peut
            être signalé par la communauté et retiré par un modérateur en cas de non-respect de ces conditions.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Annonces et transactions entre utilisateurs</h2>
          <p className="mt-2 text-foreground-muted">
            Le type d&rsquo;événement « Annonce » (œuvre, matériel ou atelier à partager) permet de mettre en
            relation des utilisateurs, mais le site n&rsquo;intervient à aucun moment dans la transaction :
            aucun paiement n&rsquo;est géré, facilité ou garanti par la plateforme. Tout échange (vente, don,
            partage d&rsquo;atelier) se fait directement entre les personnes concernées, sous leur seule
            responsabilité.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Suspension et suppression de compte</h2>
          <p className="mt-2 text-foreground-muted">
            En cas de non-respect manifeste de ces conditions, un compte peut être suspendu ou supprimé.
            Tu peux à tout moment supprimer ton propre compte depuis Réglages.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Évolution du service</h2>
          <p className="mt-2 text-foreground-muted">
            Le site est un projet personnel et évolutif ; ses fonctionnalités peuvent changer. Ces conditions
            peuvent être mises à jour, la version en vigueur est toujours celle publiée sur cette page.
          </p>
        </section>
      </div>
    </div>
  );
}
