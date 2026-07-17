"use client";

import { EventCard } from "@/components/EventCard";
import { mockEvents } from "@/lib/mock-events";
import { useSavedEvents } from "@/lib/use-saved-events";

export default function MesEvenementsPage() {
  const { saved } = useSavedEvents();

  const savedEvents = mockEvents
    .filter((e) => saved[e.id] === "sauvegarde")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const goingEvents = mockEvents
    .filter((e) => saved[e.id] === "je_viens")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold">Mes événements</h1>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-foreground/60">Je viens</h2>
        <div className="mt-3 flex flex-col gap-3">
          {goingEvents.length === 0 && (
            <p className="text-sm text-foreground/60">Aucun événement pour l&apos;instant.</p>
          )}
          {goingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-foreground/60">Sauvegardés</h2>
        <div className="mt-3 flex flex-col gap-3">
          {savedEvents.length === 0 && (
            <p className="text-sm text-foreground/60">Aucun événement pour l&apos;instant.</p>
          )}
          {savedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
