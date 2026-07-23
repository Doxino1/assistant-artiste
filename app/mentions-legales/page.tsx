import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Document juridique français (Mentions légales) — volontairement non
// traduit : un contenu de cette nature ne doit pas être approximé par une
// traduction automatique. Une note en tête de page le signale aux
// visiteurs non francophones.
export const metadata = {
  title: "Mentions légales — Assistant pour artistes",
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href="/" className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground">
        <ArrowLeft size={14} strokeWidth={1.75} />
        Retour
      </Link>

      <h1 className="font-display mt-4 text-xl font-semibold">Mentions légales</h1>
      <p className="mt-1 text-xs text-foreground/50">
        This page is only available in French. See the Politique de confidentialité / Privacy Policy for a
        multilingual summary of how your data is handled.
      </p>

      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-medium">Éditeur du site</h2>
          <p className="mt-2 text-foreground-muted">
            Le site « Assistant pour artistes » est édité à titre non professionnel, personnel et bénévole, par
            une personne physique désignée par le pseudonyme <strong className="text-foreground">Doxino</strong>.
          </p>
          <p className="mt-2 text-foreground-muted">
            Conformément à l&rsquo;article 6-III-2° de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
            l&rsquo;économie numérique (LCEN), l&rsquo;éditeur d&rsquo;un site à titre non professionnel peut
            conserver l&rsquo;anonymat vis-à-vis du public, à condition d&rsquo;avoir communiqué ses éléments
            d&rsquo;identification à son hébergeur. Ces éléments peuvent être communiqués à toute autorité
            judiciaire qui en ferait la demande.
          </p>
          <p className="mt-2 text-foreground-muted">
            Contact éditeur :{" "}
            <a href="mailto:dotian.diarra@aliecom.com" className="underline hover:text-foreground">
              dotian.diarra@aliecom.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-medium">Hébergement</h2>
          <p className="mt-2 text-foreground-muted">
            Le site est hébergé par :
            <br />
            Vercel Inc.
            <br />
            440 N Barranca Ave #4133
            <br />
            Covina, CA 91723 — États-Unis
            <br />
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="underline hover:text-foreground">
              vercel.com
            </a>
          </p>
          <p className="mt-2 text-foreground-muted">
            La base de données, l&rsquo;authentification et le stockage des fichiers sont gérés par Supabase.
            Voir la Politique de confidentialité pour le détail des sous-traitants et des données traitées.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Propriété intellectuelle</h2>
          <p className="mt-2 text-foreground-muted">
            La structure, le design et les textes propres au site sont la propriété de l&rsquo;éditeur, sauf
            mention contraire. Le contenu publié par les utilisateurs (événements, boutiques, posts, portfolio,
            messages) reste la propriété de leurs auteurs respectifs, qui en conservent l&rsquo;entière
            responsabilité — voir les Conditions générales d&rsquo;utilisation.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Responsabilité</h2>
          <p className="mt-2 text-foreground-muted">
            L&rsquo;éditeur s&rsquo;efforce d&rsquo;assurer l&rsquo;exactitude des informations diffusées sur le
            site, sans garantie. Le site repose en partie sur du contenu soumis par ses utilisateurs (événements,
            annonces, boutiques, messages) ; ce contenu fait l&rsquo;objet d&rsquo;une modération mais ne peut
            être vérifié de façon exhaustive avant publication. Voir les Conditions générales d&rsquo;utilisation
            pour le détail du fonctionnement de la modération et du signalement.
          </p>
        </section>

        <section>
          <h2 className="font-medium">Droit applicable</h2>
          <p className="mt-2 text-foreground-muted">
            Les présentes mentions légales sont soumises au droit français.
          </p>
        </section>
      </div>
    </div>
  );
}
