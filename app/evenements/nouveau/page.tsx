"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EventForm, EventFormValues } from "@/components/EventForm";
import { createClient } from "@/lib/supabase/client";
import { VILLE_TIMEZONES, zonedTimeToUtcIso } from "@/lib/timezone";
import { useT } from "@/lib/i18n/context";
import { DISCIPLINES } from "@/lib/types";

const INITIAL: EventFormValues = {
  titre: "",
  description: "",
  type: "vernissage",
  sousType: "oeuvre",
  discipline: DISCIPLINES[0],
  ville: "Paris",
  date: "",
  heure: "19:00",
  lieu: "",
};

export default function NouvelEvenementPage() {
  const t = useT();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (!active) return;
        if (!user) {
          router.push("/login");
          return;
        }
        setCheckingAuth(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(values: EventFormValues): Promise<string | null> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return null;
    }

    // L'heure saisie est l'heure locale de la ville de l'événement (pas celle
    // du navigateur qui soumet), convertie en instant UTC pour le stockage.
    const dateIso = zonedTimeToUtcIso(values.date, values.heure, VILLE_TIMEZONES[values.ville]);

    const { error: insertError } = await supabase.from("events").insert({
      titre: values.titre,
      description: values.description,
      type: values.type,
      sous_type: values.type === "annonce" ? values.sousType : null,
      discipline: values.discipline,
      ville: values.ville,
      date: dateIso,
      lieu: values.lieu,
      soumis_par: user.id,
    });

    return insertError ? insertError.message : null;
  }

  if (checkingAuth) {
    return (
      <div className="mx-auto w-full max-w-sm px-4 py-8">
        <p className="text-sm text-foreground/60">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-8">
      <h1 className="text-xl font-semibold">{t.submission.title}</h1>
      <p className="mt-1 text-sm text-foreground/60">{t.submission.subtitle}</p>

      <EventForm
        initial={INITIAL}
        submitLabel={t.submission.submit}
        successMessage={t.submission.submitted}
        resetOnSuccess
        onSubmit={handleSubmit}
      />
    </div>
  );
}
