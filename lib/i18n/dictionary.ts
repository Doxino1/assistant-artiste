import type {
  AnnouncementSubtype,
  EventType,
  MatchingTag,
  ProfileType,
  Ville,
} from "../types.ts";

export type Locale = "fr" | "en" | "el";

export const LOCALES: Locale[] = ["fr", "en", "el"];

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  el: "EL",
};

export interface Dictionary {
  villeLabels: Record<Ville, string>;
  eventTypeLabels: Record<EventType, string>;
  announcementSubtypeLabels: Record<AnnouncementSubtype, string>;
  profileTypeLabels: Record<ProfileType, string>;
  matchingTagLabels: Record<MatchingTag, string>;
  disciplineLabels: Record<string, string>;

  nav: {
    evenements: string;
    matching: string;
    communaute: string;
    profil: string;
    moderation: string;
    connexion: string;
    deconnexion: string;
  };

  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    profileNotFound: string;
    public: string;
    prive: string;
  };

  evenements: {
    tabTous: string;
    tabMes: string;
    tabCarte: string;
    proposer: string;
    searchPlaceholder: string;
    tousTypes: string;
    toutesDisciplines: string;
    loadError: (message: string) => string;
    noResults: string;
    loginToSee: string;
    loginLink: string;
    jeViens: string;
    sauvegardes: string;
    noneYet: string;
    mesSoumissions: string;
    noSubmissions: string;
    statutEnAttente: string;
    statutPublie: string;
    editLink: string;
    withdrawLink: string;
    withdrawConfirm: string;
  };

  saveButtons: {
    sauvegarder: string;
    sauvegarde: string;
    jeViens: string;
    jeViensActif: string;
    loginToSave: string;
  };

  eventDetail: {
    back: string;
    loadError: (message: string) => string;
    annonceDisclaimer: string;
    addToGoogleCalendar: string;
    addToAppleCalendar: string;
    goingFollows: (names: string, count: number) => string;
  };

  auth: {
    seConnecter: string;
    sInscrire: string;
    email: string;
    motDePasse: string;
    nom: string;
    motDePasseOublie: string;
    resetInstructions: string;
    envoyerLeLien: string;
    resetEmailSent: string;
    accountCreated: string;
    resendConfirmation: string;
    resendConfirmationSent: string;
  };

  resetPassword: {
    title: string;
    nouveauMotDePasse: string;
    confirmerMotDePasse: string;
    submit: string;
    mismatch: string;
  };

  profil: {
    title: string;
    nom: string;
    ville: string;
    typeProfil: string;
    disciplines: string;
    bio: string;
    jeCherche: string;
    emailContact: string;
    emailContactHint: string;
    emailContactPlaceholder: string;
    saved: string;
    save: string;
    postsLabel: string;
    followersLabel: string;
    followingLabel: string;
    postsSubtitle: string;
    portfolioSubtitle: string;
    settingsTitle: string;
  };

  submission: {
    title: string;
    subtitle: string;
    titre: string;
    description: string;
    lieu: string;
    heureLocale: (ville: string, tz: string) => string;
    annonceDisclaimer: string;
    submitted: string;
    submit: string;
    repeatWeekly: string;
    repeatCountLabel: string;
    repeatHint: string;
  };

  map: {
    noCoordinates: (count: number) => string;
  };

  matching: {
    title: string;
    subtitle: string;
    needTag: string;
    noResults: string;
    contact: string;
    noContact: string;
  };

  communaute: {
    title: (ville: string) => string;
    noMessages: string;
    placeholder: string;
    send: string;
    anonyme: string;
    groupNotFound: string;
  };

  weeklyEmail: {
    subject: (count: number, ville: string) => string;
    greeting: (nom: string) => string;
    intro: (ville: string) => string;
  };

  moderation: {
    title: string;
    empty: string;
    publish: string;
    reject: string;
    rejectConfirm: string;
    submittedBy: (nom: string) => string;
    loadError: (message: string) => string;
  };

  portfolio: {
    title: string;
    addTitle: string;
    addPiece: string;
    titre: string;
    technique: string;
    annee: string;
    image: string;
    add: string;
    empty: string;
    delete: string;
    private: string;
  };

  posts: {
    title: string;
    legende: string;
    publish: string;
    empty: string;
    comments: string;
    addComment: string;
    send: string;
    delete: string;
    private: string;
  };

  library: {
    title: string;
    subtitle: string;
    titre: string;
    contenu: string;
    image: string;
    add: string;
    empty: string;
    delete: string;
  };

  artiste: {
    directory: string;
    follow: string;
    unfollow: string;
    portfolio: string;
    posts: string;
    followers: (count: number) => string;
    following: (count: number) => string;
    notFound: string;
    verified: string;
  };

  shops: {
    title: string;
    addShop: string;
    nom: string;
    adresse: string;
    description: string;
    lien: string;
    add: string;
    empty: string;
    delete: string;
  };

  calendar: {
    tab: string;
    today: string;
  };

  safety: {
    block: string;
    blockConfirm: string;
    blocked: string;
    unblock: string;
    report: string;
    reportTitle: string;
    reportReasonSpam: string;
    reportReasonBehavior: string;
    reportReasonImpersonation: string;
    reportReasonOther: string;
    reportDescriptionPlaceholder: string;
    reportSubmit: string;
    reportSent: string;
    cancel: string;
    blockedUsersTitle: string;
    noBlockedUsers: string;
  };

  account: {
    exportData: string;
    exportHint: string;
    exportButton: string;
    deleteAccount: string;
    deleteWarning: string;
    deleteConfirmLabel: (word: string) => string;
    deleteConfirmWord: string;
    deleteButton: string;
    deleteError: string;
  };

  onboarding: {
    stepLabel: (step: number, total: number) => string;
    back: string;
    next: string;
    skip: string;
    finish: string;
    saveError: string;
    step1Title: string;
    step1Hint: string;
    step2Title: string;
    step2Hint: string;
    step3Title: string;
    step4Title: string;
    step4Hint: string;
    step5Title: string;
    step5Intro: string;
    step5ExampleEvents: string[];
  };
}

export const fr: Dictionary = {
  villeLabels: { Paris: "Paris", Athènes: "Athènes" },
  eventTypeLabels: {
    vernissage: "Vernissage",
    expo: "Exposition",
    workshop: "Workshop",
    open_call: "Open call",
    annonce: "Annonce",
  },
  announcementSubtypeLabels: {
    oeuvre: "Œuvre",
    materiel: "Matériel",
    atelier: "Atelier",
  },
  profileTypeLabels: {
    artiste_pro: "Artiste professionnel·le",
    amateur: "Artiste amateur",
    galerie: "Galerie",
    institution: "Institution",
    curateur: "Curateur·rice",
  },
  matchingTagLabels: {
    atelier_partage: "Atelier partagé",
    collaborations: "Collaborations",
    mentorat: "Mentorat",
  },
  disciplineLabels: {
    Peinture: "Peinture",
    Sculpture: "Sculpture",
    Performance: "Performance",
    Multidisciplinaire: "Multidisciplinaire",
  },
  nav: {
    evenements: "Événements",
    matching: "Matching",
    communaute: "Communauté",
    profil: "Profil",
    moderation: "Modération",
    connexion: "Connexion",
    deconnexion: "Déconnexion",
  },
  common: {
    loading: "Chargement…",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    profileNotFound: "Profil introuvable.",
    public: "Public",
    prive: "Privé",
  },
  evenements: {
    tabTous: "Tous",
    tabMes: "Mes événements",
    tabCarte: "Carte",
    proposer: "+ Proposer",
    searchPlaceholder: "Rechercher un événement…",
    tousTypes: "Tous types",
    toutesDisciplines: "Toutes disciplines",
    loadError: (message) => `Petit souci pour charger les événements (${message}) — réessaie dans un instant.`,
    noResults: "Rien ne correspond à ces filtres — essaie d'en retirer un ou deux.",
    loginToSee: "pour voir tes événements.",
    loginLink: "Connecte-toi",
    jeViens: "Je viens",
    sauvegardes: "Sauvegardés",
    noneYet: "Rien par ici pour l'instant.",
    mesSoumissions: "Mes soumissions",
    noSubmissions: "Tu n'as encore rien proposé.",
    statutEnAttente: "En attente de validation",
    statutPublie: "Publié",
    editLink: "Modifier",
    withdrawLink: "Retirer",
    withdrawConfirm: "Retirer cet événement ? C'est définitif, impossible de revenir en arrière.",
  },
  saveButtons: {
    sauvegarder: "Sauvegarder",
    sauvegarde: "Sauvegardé ✓",
    jeViens: "Je viens",
    jeViensActif: "Je viens ✓",
    loginToSave: "Connecte-toi pour sauvegarder",
  },
  eventDetail: {
    back: "Retour aux événements",
    loadError: (message) => `Petit souci pour charger cet événement (${message}) — réessaie ?`,
    annonceDisclaimer:
      "Annonce entre particuliers : la transaction se fait directement avec la personne, en dehors de l'application.",
    addToGoogleCalendar: "Google Agenda",
    addToAppleCalendar: "Apple / Outlook (.ics)",
    goingFollows: (names, count) => `${names} — ${count > 1 ? "abonnements que tu suis" : "abonnement que tu suis"} y ${count > 1 ? "vont" : "va"}.`,
  },
  auth: {
    seConnecter: "Se connecter",
    sInscrire: "S'inscrire",
    email: "Email",
    motDePasse: "Mot de passe",
    nom: "Nom",
    motDePasseOublie: "Mot de passe oublié ?",
    resetInstructions: "Indique ton email, on t'envoie un lien pour choisir un nouveau mot de passe.",
    envoyerLeLien: "Envoyer le lien",
    resetEmailSent: "Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé.",
    accountCreated: "Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse avant de te connecter.",
    resendConfirmation: "Tu n'as pas reçu l'email ?",
    resendConfirmationSent: "Email de confirmation renvoyé — vérifie ta boîte mail.",
  },
  resetPassword: {
    title: "Nouveau mot de passe",
    nouveauMotDePasse: "Nouveau mot de passe",
    confirmerMotDePasse: "Confirmer le mot de passe",
    submit: "Enregistrer le mot de passe",
    mismatch: "Les deux mots de passe ne correspondent pas, réessaie.",
  },
  profil: {
    title: "Mon profil",
    nom: "Nom",
    ville: "Ville",
    typeProfil: "Type de profil",
    disciplines: "Disciplines",
    bio: "Bio",
    jeCherche: "Je cherche",
    emailContact: "Email de contact",
    emailContactHint: "(optionnel, visible des autres artistes)",
    emailContactPlaceholder: "Laisse vide pour ne pas être contactable",
    saved: "Enregistré. Ton profil est à jour.",
    save: "Enregistrer",
    postsLabel: "Posts",
    followersLabel: "Abonnés",
    followingLabel: "Abonnements",
    postsSubtitle: "Ce que tu partages au fil de l'eau",
    portfolioSubtitle: "Ta sélection de travail, vitrine pro",
    settingsTitle: "Paramètres du profil",
  },
  submission: {
    title: "Proposer un événement",
    subtitle: "Ta soumission sera relue avant publication dans le flux.",
    titre: "Titre",
    description: "Description",
    lieu: "Lieu",
    heureLocale: (ville, tz) => `Heure locale à ${ville} (${tz}).`,
    annonceDisclaimer:
      "La transaction (paiement, échange) se fait directement entre vous, en dehors de l'application — on ne s'en occupe pas.",
    submitted: "Envoyé ! On le relit vite fait avant de le publier dans le flux.",
    submit: "Soumettre",
    repeatWeekly: "Répéter chaque semaine",
    repeatCountLabel: "Nombre d'occurrences (dont celle-ci)",
    repeatHint: "Chaque occurrence est soumise à validation séparément.",
  },
  map: {
    noCoordinates: (count) =>
      count > 1
        ? `${count} événements sans localisation précise — retrouve-les dans la liste.`
        : `${count} événement sans localisation précise — retrouve-le dans la liste.`,
  },
  matching: {
    title: "Suggestions de matching",
    subtitle: "Même ville, discipline en commun, et un tag « je cherche » partagé.",
    needTag: "Ajoute au moins un tag « je cherche » sur ton profil pour voir des suggestions.",
    noResults: "Personne à te proposer pour l'instant — reviens bientôt.",
    contact: "Contacter",
    noContact: "Pas de contact renseigné",
  },
  communaute: {
    title: (ville) => `Communauté ${ville}`,
    noMessages: "Aucun message pour l'instant — lance la discussion.",
    placeholder: "Écrire un message…",
    send: "Envoyer",
    anonyme: "Anonyme",
    groupNotFound: "Groupe introuvable pour cette ville.",
  },
  weeklyEmail: {
    subject: (count, ville) => `${count} événement${count > 1 ? "s" : ""} à ${ville} cette semaine`,
    greeting: (nom) => `Bonjour ${nom},`,
    intro: (ville) => `Voici les événements à ${ville} pour les 7 prochains jours :`,
  },
  moderation: {
    title: "Modération",
    empty: "Aucun événement en attente.",
    publish: "Publier",
    reject: "Rejeter",
    rejectConfirm: "Rejeter et supprimer cet événement ? Impossible de revenir en arrière.",
    submittedBy: (nom) => `Soumis par ${nom}`,
    loadError: (message) => `Petit souci pour charger les soumissions (${message}).`,
  },
  portfolio: {
    title: "Mon portfolio",
    addTitle: "Ajouter une œuvre",
    addPiece: "Ajouter une pièce",
    titre: "Titre",
    technique: "Technique",
    annee: "Année",
    image: "Image",
    add: "Ajouter",
    empty: "Ton portfolio est vide — ajoute ta première pièce.",
    delete: "Supprimer",
    private: "Portfolio privé",
  },
  posts: {
    title: "Mes posts",
    legende: "Légende",
    publish: "Publier",
    empty: "Rien à montrer pour l'instant — poste ta première photo.",
    comments: "Commentaires",
    addComment: "Écrire un commentaire…",
    send: "Envoyer",
    delete: "Supprimer",
    private: "Posts privés",
  },
  library: {
    title: "Bibliothèque privée",
    subtitle: "Ton espace perso, jamais partagé.",
    titre: "Titre",
    contenu: "Contenu",
    image: "Image",
    add: "Ajouter",
    empty: "Ta bibliothèque est vide — garde ici ce que tu veux, rien que pour toi.",
    delete: "Supprimer",
  },
  artiste: {
    directory: "Artistes",
    follow: "Suivre",
    unfollow: "Ne plus suivre",
    portfolio: "Portfolio",
    posts: "Posts",
    followers: (count) => `${count} abonné${count > 1 ? "s" : ""}`,
    following: (count) => `${count} abonnement${count > 1 ? "s" : ""}`,
    notFound: "Profil introuvable.",
    verified: "Compte vérifié",
  },
  shops: {
    title: "Boutiques de matériel",
    addShop: "Ajouter une boutique",
    nom: "Nom",
    adresse: "Adresse",
    description: "Description",
    lien: "Lien",
    add: "Ajouter",
    empty: "Aucune boutique par ici pour l'instant.",
    delete: "Supprimer",
  },
  calendar: {
    tab: "Calendrier",
    today: "Aujourd'hui",
  },
  safety: {
    block: "Bloquer",
    blockConfirm: "Bloquer cette personne ? Tu ne verras plus son profil ni son contenu, et elle ne pourra plus te contacter.",
    blocked: "Bloqué",
    unblock: "Débloquer",
    report: "Signaler",
    reportTitle: "Signaler",
    reportReasonSpam: "Spam",
    reportReasonBehavior: "Comportement inapproprié",
    reportReasonImpersonation: "Usurpation d'identité",
    reportReasonOther: "Autre",
    reportDescriptionPlaceholder: "Détails (optionnel)",
    reportSubmit: "Envoyer le signalement",
    reportSent: "Signalement envoyé, merci.",
    cancel: "Annuler",
    blockedUsersTitle: "Utilisateurs bloqués",
    noBlockedUsers: "Personne de bloqué — tant mieux.",
  },
  account: {
    exportData: "Télécharger mes données",
    exportHint: "Profil, posts publiés, événements soumis et sauvegardés, au format JSON.",
    exportButton: "Télécharger",
    deleteAccount: "Supprimer mon compte",
    deleteWarning: "C'est définitif : une fois supprimées, tes données (profil, posts, portfolio, bibliothèque privée, messages) ne reviennent pas. Toujours partant·e ?",
    deleteConfirmLabel: (word) => `Tape ${word} pour confirmer`,
    deleteConfirmWord: "SUPPRIMER",
    deleteButton: "Supprimer définitivement",
    deleteError: "Ça n'a pas marché, réessaie ou contacte-nous.",
  },
  onboarding: {
    stepLabel: (step, total) => `Étape ${step} sur ${total}`,
    back: "Retour",
    next: "Continuer",
    skip: "Passer",
    finish: "C'est parti",
    saveError: "Un souci est survenu, réessaie.",
    step1Title: "Quelle est ta ville principale ?",
    step1Hint: "On te montrera d'abord les événements de cette ville.",
    step2Title: "Quelles disciplines pratiques-tu ?",
    step2Hint: "Choisis-en au moins une.",
    step3Title: "Quel type de profil es-tu ?",
    step4Title: "Qu'est-ce que tu recherches ?",
    step4Hint: "Optionnel — utilisé pour te proposer des rencontres pertinentes.",
    step5Title: "Te voilà !",
    step5Intro: "Chaque semaine, tu recevras un email avec les événements à venir dans ta ville. Un peu comme ça :",
    step5ExampleEvents: [
      "Vernissage · lundi 27 juillet, 20:00 — Lignes de fuite",
      "Workshop · mercredi 29 juillet, 14:00 — Taille directe sur pierre",
      "Exposition · samedi 1 août, 11:00 — Résidences croisées",
    ],
  },
};

export const en: Dictionary = {
  villeLabels: { Paris: "Paris", Athènes: "Athens" },
  eventTypeLabels: {
    vernissage: "Opening",
    expo: "Exhibition",
    workshop: "Workshop",
    open_call: "Open call",
    annonce: "Listing",
  },
  announcementSubtypeLabels: {
    oeuvre: "Artwork",
    materiel: "Supplies",
    atelier: "Studio",
  },
  profileTypeLabels: {
    artiste_pro: "Professional artist",
    amateur: "Amateur artist",
    galerie: "Gallery",
    institution: "Institution",
    curateur: "Curator",
  },
  matchingTagLabels: {
    atelier_partage: "Shared studio",
    collaborations: "Collaborations",
    mentorat: "Mentorship",
  },
  disciplineLabels: {
    Peinture: "Painting",
    Sculpture: "Sculpture",
    Performance: "Performance",
    Multidisciplinaire: "Multidisciplinary",
  },
  nav: {
    evenements: "Events",
    matching: "Matching",
    communaute: "Community",
    profil: "Profile",
    moderation: "Moderation",
    connexion: "Sign in",
    deconnexion: "Sign out",
  },
  common: {
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    profileNotFound: "Profile not found.",
    public: "Public",
    prive: "Private",
  },
  evenements: {
    tabTous: "All",
    tabMes: "My events",
    tabCarte: "Map",
    proposer: "+ Submit",
    searchPlaceholder: "Search an event…",
    tousTypes: "All types",
    toutesDisciplines: "All disciplines",
    loadError: (message) => `Couldn't load events (${message}).`,
    noResults: "No event matches these filters.",
    loginToSee: "to see your events.",
    loginLink: "Sign in",
    jeViens: "Going",
    sauvegardes: "Saved",
    noneYet: "Nothing here yet.",
    mesSoumissions: "My submissions",
    noSubmissions: "No event submitted yet.",
    statutEnAttente: "Pending review",
    statutPublie: "Published",
    editLink: "Edit",
    withdrawLink: "Withdraw",
    withdrawConfirm: "Withdraw this event? This can't be undone.",
  },
  saveButtons: {
    sauvegarder: "Save",
    sauvegarde: "Saved ✓",
    jeViens: "Going",
    jeViensActif: "Going ✓",
    loginToSave: "Sign in to save",
  },
  eventDetail: {
    back: "Back to events",
    loadError: (message) => `Couldn't load this event (${message}).`,
    annonceDisclaimer:
      "Listing between individuals: the transaction happens directly with the person, outside the app.",
    addToGoogleCalendar: "Google Calendar",
    addToAppleCalendar: "Apple / Outlook (.ics)",
    goingFollows: (names, count) => `${names} — ${count > 1 ? "people you follow are" : "person you follow is"} going.`,
  },
  auth: {
    seConnecter: "Sign in",
    sInscrire: "Sign up",
    email: "Email",
    motDePasse: "Password",
    nom: "Name",
    motDePasseOublie: "Forgot password?",
    resetInstructions: "Enter your email, we'll send you a link to choose a new password.",
    envoyerLeLien: "Send link",
    resetEmailSent: "If an account exists for this address, a reset link was just sent.",
    accountCreated: "Account created! Check your inbox to confirm your address before signing in.",
    resendConfirmation: "Didn't get the email?",
    resendConfirmationSent: "Confirmation email resent — check your inbox.",
  },
  resetPassword: {
    title: "New password",
    nouveauMotDePasse: "New password",
    confirmerMotDePasse: "Confirm password",
    submit: "Save password",
    mismatch: "Passwords don't match.",
  },
  profil: {
    title: "My profile",
    nom: "Name",
    ville: "City",
    typeProfil: "Profile type",
    disciplines: "Disciplines",
    bio: "Bio",
    jeCherche: "Looking for",
    emailContact: "Contact email",
    emailContactHint: "(optional, visible to other artists)",
    emailContactPlaceholder: "Leave blank to not be contactable",
    saved: "Profile updated.",
    save: "Save",
    postsLabel: "Posts",
    followersLabel: "Followers",
    followingLabel: "Following",
    postsSubtitle: "What you share as you go",
    portfolioSubtitle: "Your curated work, a professional showcase",
    settingsTitle: "Profile settings",
  },
  submission: {
    title: "Submit an event",
    subtitle: "Your submission will be reviewed before appearing in the feed.",
    titre: "Title",
    description: "Description",
    lieu: "Venue",
    heureLocale: (ville, tz) => `Local time in ${ville} (${tz}).`,
    annonceDisclaimer:
      "The transaction (payment, exchange) happens directly between you, outside the app — we don't handle it.",
    submitted: "Event submitted, pending review before publication.",
    submit: "Submit",
    repeatWeekly: "Repeat weekly",
    repeatCountLabel: "Number of occurrences (including this one)",
    repeatHint: "Each occurrence is reviewed separately.",
  },
  map: {
    noCoordinates: (count) =>
      count > 1
        ? `${count} events without a precise location — find them in the list.`
        : `${count} event without a precise location — find it in the list.`,
  },
  matching: {
    title: "Matching suggestions",
    subtitle: "Same city, a shared discipline, and a shared “looking for” tag.",
    needTag: "Add at least one “looking for” tag to your profile to see suggestions.",
    noResults: "No suggestions yet — check back later.",
    contact: "Contact",
    noContact: "No contact info provided",
  },
  communaute: {
    title: (ville) => `${ville} Community`,
    noMessages: "No messages yet — start the conversation.",
    placeholder: "Write a message…",
    send: "Send",
    anonyme: "Anonymous",
    groupNotFound: "No group found for this city.",
  },
  weeklyEmail: {
    subject: (count, ville) => `${count} event${count > 1 ? "s" : ""} in ${ville} this week`,
    greeting: (nom) => `Hi ${nom},`,
    intro: (ville) => `Here are the events in ${ville} for the next 7 days:`,
  },
  moderation: {
    title: "Moderation",
    empty: "No pending event.",
    publish: "Publish",
    reject: "Reject",
    rejectConfirm: "Reject and delete this event?",
    submittedBy: (nom) => `Submitted by ${nom}`,
    loadError: (message) => `Couldn't load submissions (${message}).`,
  },
  portfolio: {
    title: "My portfolio",
    addTitle: "Add a piece",
    addPiece: "Add a piece",
    titre: "Title",
    technique: "Technique",
    annee: "Year",
    image: "Image",
    add: "Add",
    empty: "Nothing here yet.",
    delete: "Delete",
    private: "Private portfolio",
  },
  posts: {
    title: "My posts",
    legende: "Caption",
    publish: "Post",
    empty: "No post yet.",
    comments: "Comments",
    addComment: "Write a comment…",
    send: "Send",
    delete: "Delete",
    private: "Private posts",
  },
  library: {
    title: "Private library",
    subtitle: "Your personal space, never shared.",
    titre: "Title",
    contenu: "Content",
    image: "Image",
    add: "Add",
    empty: "Nothing here yet.",
    delete: "Delete",
  },
  artiste: {
    directory: "Artists",
    follow: "Follow",
    unfollow: "Unfollow",
    portfolio: "Portfolio",
    posts: "Posts",
    followers: (count) => `${count} follower${count > 1 ? "s" : ""}`,
    following: (count) => `${count} following`,
    notFound: "Profile not found.",
    verified: "Verified account",
  },
  shops: {
    title: "Art supply shops",
    addShop: "Add a shop",
    nom: "Name",
    adresse: "Address",
    description: "Description",
    lien: "Link",
    add: "Add",
    empty: "No shop listed yet.",
    delete: "Delete",
  },
  calendar: {
    tab: "Calendar",
    today: "Today",
  },
  safety: {
    block: "Block",
    blockConfirm: "Block this person? You won't see their profile or content anymore, and they won't be able to contact you.",
    blocked: "Blocked",
    unblock: "Unblock",
    report: "Report",
    reportTitle: "Report",
    reportReasonSpam: "Spam",
    reportReasonBehavior: "Inappropriate behavior",
    reportReasonImpersonation: "Impersonation",
    reportReasonOther: "Other",
    reportDescriptionPlaceholder: "Details (optional)",
    reportSubmit: "Send report",
    reportSent: "Report sent, thank you.",
    cancel: "Cancel",
    blockedUsersTitle: "Blocked users",
    noBlockedUsers: "No blocked users.",
  },
  account: {
    exportData: "Download my data",
    exportHint: "Profile, published posts, submitted and saved events, as JSON.",
    exportButton: "Download",
    deleteAccount: "Delete my account",
    deleteWarning: "This is permanent and erases all your data (profile, posts, portfolio, private library, messages). Cannot be undone.",
    deleteConfirmLabel: (word) => `Type ${word} to confirm`,
    deleteConfirmWord: "DELETE",
    deleteButton: "Delete permanently",
    deleteError: "Deletion failed, try again or contact us.",
  },
  onboarding: {
    stepLabel: (step, total) => `Step ${step} of ${total}`,
    back: "Back",
    next: "Continue",
    skip: "Skip",
    finish: "Let's go",
    saveError: "Something went wrong, try again.",
    step1Title: "What's your main city?",
    step1Hint: "We'll show you this city's events first.",
    step2Title: "Which disciplines do you practice?",
    step2Hint: "Pick at least one.",
    step3Title: "What kind of profile are you?",
    step4Title: "What are you looking for?",
    step4Hint: "Optional — used to suggest relevant connections.",
    step5Title: "Welcome!",
    step5Intro: "Every week, you'll get an email with upcoming events in your city. For example:",
    step5ExampleEvents: [
      "Opening · Monday July 27, 8:00 PM — Lignes de fuite",
      "Workshop · Wednesday July 29, 2:00 PM — Taille directe sur pierre",
      "Exhibition · Saturday August 1, 11:00 AM — Résidences croisées",
    ],
  },
};

export const el: Dictionary = {
  villeLabels: { Paris: "Παρίσι", Athènes: "Αθήνα" },
  eventTypeLabels: {
    vernissage: "Εγκαίνια",
    expo: "Έκθεση",
    workshop: "Εργαστήριο",
    open_call: "Ανοιχτή πρόσκληση",
    annonce: "Αγγελία",
  },
  announcementSubtypeLabels: {
    oeuvre: "Έργο",
    materiel: "Υλικά",
    atelier: "Ατελιέ",
  },
  profileTypeLabels: {
    artiste_pro: "Επαγγελματίας καλλιτέχνης",
    amateur: "Ερασιτέχνης καλλιτέχνης",
    galerie: "Γκαλερί",
    institution: "Φορέας",
    curateur: "Επιμελητής/τρια",
  },
  matchingTagLabels: {
    atelier_partage: "Κοινό ατελιέ",
    collaborations: "Συνεργασίες",
    mentorat: "Καθοδήγηση",
  },
  disciplineLabels: {
    Peinture: "Ζωγραφική",
    Sculpture: "Γλυπτική",
    Performance: "Περφόρμανς",
    Multidisciplinaire: "Διεπιστημονικό",
  },
  nav: {
    evenements: "Εκδηλώσεις",
    matching: "Αντιστοίχιση",
    communaute: "Κοινότητα",
    profil: "Προφίλ",
    moderation: "Έλεγχος",
    connexion: "Σύνδεση",
    deconnexion: "Αποσύνδεση",
  },
  common: {
    loading: "Φόρτωση…",
    save: "Αποθήκευση",
    cancel: "Ακύρωση",
    delete: "Διαγραφή",
    profileNotFound: "Το προφίλ δεν βρέθηκε.",
    public: "Δημόσιο",
    prive: "Ιδιωτικό",
  },
  evenements: {
    tabTous: "Όλες",
    tabMes: "Οι εκδηλώσεις μου",
    tabCarte: "Χάρτης",
    proposer: "+ Πρόταση",
    searchPlaceholder: "Αναζήτηση εκδήλωσης…",
    tousTypes: "Όλοι οι τύποι",
    toutesDisciplines: "Όλες οι ειδικότητες",
    loadError: (message) => `Αδυναμία φόρτωσης εκδηλώσεων (${message}).`,
    noResults: "Καμία εκδήλωση δεν ταιριάζει με αυτά τα φίλτρα.",
    loginToSee: "για να δεις τις εκδηλώσεις σου.",
    loginLink: "Σύνδεση",
    jeViens: "Θα έρθω",
    sauvegardes: "Αποθηκευμένα",
    noneYet: "Τίποτα ακόμη.",
    mesSoumissions: "Οι προτάσεις μου",
    noSubmissions: "Καμία εκδήλωση δεν έχει προταθεί ακόμη.",
    statutEnAttente: "Σε αναμονή έγκρισης",
    statutPublie: "Δημοσιευμένο",
    editLink: "Επεξεργασία",
    withdrawLink: "Απόσυρση",
    withdrawConfirm: "Απόσυρση αυτής της εκδήλωσης; Δεν μπορεί να αναιρεθεί.",
  },
  saveButtons: {
    sauvegarder: "Αποθήκευση",
    sauvegarde: "Αποθηκεύτηκε ✓",
    jeViens: "Θα έρθω",
    jeViensActif: "Θα έρθω ✓",
    loginToSave: "Συνδέσου για αποθήκευση",
  },
  eventDetail: {
    back: "Πίσω στις εκδηλώσεις",
    loadError: (message) => `Αδυναμία φόρτωσης εκδήλωσης (${message}).`,
    annonceDisclaimer:
      "Αγγελία μεταξύ ιδιωτών: η συναλλαγή γίνεται απευθείας με το άτομο, εκτός εφαρμογής.",
    addToGoogleCalendar: "Google Calendar",
    addToAppleCalendar: "Apple / Outlook (.ics)",
    goingFollows: (names, count) =>
      `${names} — ${count > 1 ? "άτομα που ακολουθείς θα πάνε" : "άτομο που ακολουθείς θα πάει"}.`,
  },
  auth: {
    seConnecter: "Σύνδεση",
    sInscrire: "Εγγραφή",
    email: "Email",
    motDePasse: "Κωδικός",
    nom: "Όνομα",
    motDePasseOublie: "Ξέχασες τον κωδικό;",
    resetInstructions: "Γράψε το email σου, θα σου στείλουμε σύνδεσμο για νέο κωδικό.",
    envoyerLeLien: "Αποστολή συνδέσμου",
    resetEmailSent: "Αν υπάρχει λογαριασμός για αυτή τη διεύθυνση, μόλις στάλθηκε σύνδεσμος επαναφοράς.",
    accountCreated: "Ο λογαριασμός δημιουργήθηκε! Έλεγξε τα εισερχόμενά σου για να επιβεβαιώσεις πριν συνδεθείς.",
    resendConfirmation: "Δεν έλαβες το email;",
    resendConfirmationSent: "Το email επιβεβαίωσης στάλθηκε ξανά — έλεγξε τα εισερχόμενά σου.",
  },
  resetPassword: {
    title: "Νέος κωδικός",
    nouveauMotDePasse: "Νέος κωδικός",
    confirmerMotDePasse: "Επιβεβαίωση κωδικού",
    submit: "Αποθήκευση κωδικού",
    mismatch: "Οι δύο κωδικοί δεν ταιριάζουν.",
  },
  profil: {
    title: "Το προφίλ μου",
    nom: "Όνομα",
    ville: "Πόλη",
    typeProfil: "Τύπος προφίλ",
    disciplines: "Ειδικότητες",
    bio: "Βιογραφικό",
    jeCherche: "Αναζητώ",
    emailContact: "Email επικοινωνίας",
    emailContactHint: "(προαιρετικό, ορατό σε άλλους καλλιτέχνες)",
    emailContactPlaceholder: "Άφησέ το κενό αν δεν θες να σε βρίσκουν",
    saved: "Το προφίλ ενημερώθηκε.",
    save: "Αποθήκευση",
    postsLabel: "Posts",
    followersLabel: "Ακόλουθοι",
    followingLabel: "Ακολουθεί",
    postsSubtitle: "Ό,τι μοιράζεσαι στην πορεία",
    portfolioSubtitle: "Η επιλεγμένη δουλειά σου, επαγγελματική βιτρίνα",
    settingsTitle: "Ρυθμίσεις προφίλ",
  },
  submission: {
    title: "Πρόταση εκδήλωσης",
    subtitle: "Η πρότασή σου θα ελεγχθεί πριν εμφανιστεί στη ροή.",
    titre: "Τίτλος",
    description: "Περιγραφή",
    lieu: "Χώρος",
    heureLocale: (ville, tz) => `Τοπική ώρα στην ${ville} (${tz}).`,
    annonceDisclaimer:
      "Η συναλλαγή (πληρωμή, ανταλλαγή) γίνεται απευθείας μεταξύ σας, εκτός εφαρμογής — δεν εμπλεκόμαστε.",
    submitted: "Η εκδήλωση υποβλήθηκε, σε αναμονή έγκρισης πριν τη δημοσίευση.",
    submit: "Υποβολή",
    repeatWeekly: "Επανάληψη κάθε εβδομάδα",
    repeatCountLabel: "Αριθμός επαναλήψεων (μαζί με αυτή)",
    repeatHint: "Κάθε επανάληψη ελέγχεται ξεχωριστά.",
  },
  map: {
    noCoordinates: (count) =>
      count > 1
        ? `${count} εκδηλώσεις χωρίς ακριβή τοποθεσία — βρες τις στη λίστα.`
        : `${count} εκδήλωση χωρίς ακριβή τοποθεσία — βρες τη στη λίστα.`,
  },
  matching: {
    title: "Προτάσεις αντιστοίχισης",
    subtitle: "Ίδια πόλη, κοινή ειδικότητα, και κοινή ετικέτα «αναζητώ».",
    needTag: "Πρόσθεσε τουλάχιστον μία ετικέτα «αναζητώ» στο προφίλ σου για να δεις προτάσεις.",
    noResults: "Καμία πρόταση ακόμη — ξαναδές αργότερα.",
    contact: "Επικοινωνία",
    noContact: "Δεν έχει δοθεί στοιχείο επικοινωνίας",
  },
  communaute: {
    title: (ville) => `Κοινότητα ${ville}`,
    noMessages: "Κανένα μήνυμα ακόμη — ξεκίνα τη συζήτηση.",
    placeholder: "Γράψε ένα μήνυμα…",
    send: "Αποστολή",
    anonyme: "Ανώνυμος",
    groupNotFound: "Δεν βρέθηκε κοινότητα για αυτή την πόλη.",
  },
  weeklyEmail: {
    subject: (count, ville) => `${count} εκδήλωση${count > 1 ? "εις" : ""} στην ${ville} αυτή την εβδομάδα`,
    greeting: (nom) => `Γεια σου ${nom},`,
    intro: (ville) => `Ορίστε οι εκδηλώσεις στην ${ville} για τις επόμενες 7 μέρες:`,
  },
  moderation: {
    title: "Έλεγχος",
    empty: "Καμία εκδήλωση σε αναμονή.",
    publish: "Δημοσίευση",
    reject: "Απόρριψη",
    rejectConfirm: "Απόρριψη και διαγραφή αυτής της εκδήλωσης;",
    submittedBy: (nom) => `Υποβλήθηκε από ${nom}`,
    loadError: (message) => `Αδυναμία φόρτωσης προτάσεων (${message}).`,
  },
  portfolio: {
    title: "Το portfolio μου",
    addTitle: "Προσθήκη έργου",
    addPiece: "Προσθήκη έργου",
    titre: "Τίτλος",
    technique: "Τεχνική",
    annee: "Έτος",
    image: "Εικόνα",
    add: "Προσθήκη",
    empty: "Τίποτα ακόμη.",
    delete: "Διαγραφή",
    private: "Ιδιωτικό portfolio",
  },
  posts: {
    title: "Τα posts μου",
    legende: "Λεζάντα",
    publish: "Δημοσίευση",
    empty: "Κανένα post ακόμη.",
    comments: "Σχόλια",
    addComment: "Γράψε ένα σχόλιο…",
    send: "Αποστολή",
    delete: "Διαγραφή",
    private: "Ιδιωτικά posts",
  },
  library: {
    title: "Προσωπική βιβλιοθήκη",
    subtitle: "Ο προσωπικός σου χώρος, ποτέ κοινός.",
    titre: "Τίτλος",
    contenu: "Περιεχόμενο",
    image: "Εικόνα",
    add: "Προσθήκη",
    empty: "Τίποτα ακόμη.",
    delete: "Διαγραφή",
  },
  artiste: {
    directory: "Καλλιτέχνες",
    follow: "Ακολούθησε",
    unfollow: "Διακοπή",
    portfolio: "Portfolio",
    posts: "Posts",
    followers: (count) => `${count} ακόλουθοι`,
    following: (count) => `${count} ακολουθεί`,
    notFound: "Το προφίλ δεν βρέθηκε.",
    verified: "Επαληθευμένος λογαριασμός",
  },
  shops: {
    title: "Καταστήματα υλικών",
    addShop: "Προσθήκη καταστήματος",
    nom: "Όνομα",
    adresse: "Διεύθυνση",
    description: "Περιγραφή",
    lien: "Σύνδεσμος",
    add: "Προσθήκη",
    empty: "Κανένα κατάστημα ακόμη.",
    delete: "Διαγραφή",
  },
  calendar: {
    tab: "Ημερολόγιο",
    today: "Σήμερα",
  },
  safety: {
    block: "Αποκλεισμός",
    blockConfirm: "Αποκλεισμός αυτού του ατόμου; Δεν θα βλέπεις πια το προφίλ ή το περιεχόμενό του, και δεν θα μπορεί να σε προσεγγίσει.",
    blocked: "Αποκλεισμένος/η",
    unblock: "Άρση αποκλεισμού",
    report: "Αναφορά",
    reportTitle: "Αναφορά",
    reportReasonSpam: "Ανεπιθύμητο περιεχόμενο",
    reportReasonBehavior: "Ανάρμοστη συμπεριφορά",
    reportReasonImpersonation: "Πλαστοπροσωπία",
    reportReasonOther: "Άλλο",
    reportDescriptionPlaceholder: "Λεπτομέρειες (προαιρετικό)",
    reportSubmit: "Αποστολή αναφοράς",
    reportSent: "Η αναφορά στάλθηκε, ευχαριστούμε.",
    cancel: "Ακύρωση",
    blockedUsersTitle: "Αποκλεισμένοι χρήστες",
    noBlockedUsers: "Κανένας αποκλεισμένος χρήστης.",
  },
  account: {
    exportData: "Λήψη των δεδομένων μου",
    exportHint: "Προφίλ, δημοσιευμένα posts, εκδηλώσεις που πρότεινες και αποθήκευσες, σε μορφή JSON.",
    exportButton: "Λήψη",
    deleteAccount: "Διαγραφή λογαριασμού",
    deleteWarning: "Αυτή η ενέργεια είναι οριστική και διαγράφει όλα τα δεδομένα σου (προφίλ, posts, portfolio, ιδιωτική βιβλιοθήκη, μηνύματα). Δεν μπορεί να αναιρεθεί.",
    deleteConfirmLabel: (word) => `Πληκτρολόγησε ${word} για επιβεβαίωση`,
    deleteConfirmWord: "ΔΙΑΓΡΑΦΗ",
    deleteButton: "Οριστική διαγραφή",
    deleteError: "Η διαγραφή απέτυχε, δοκίμασε ξανά ή επικοινώνησε μαζί μας.",
  },
  onboarding: {
    stepLabel: (step, total) => `Βήμα ${step} από ${total}`,
    back: "Πίσω",
    next: "Συνέχεια",
    skip: "Παράλειψη",
    finish: "Ας ξεκινήσουμε",
    saveError: "Κάτι πήγε στραβά, δοκίμασε ξανά.",
    step1Title: "Ποια είναι η κύρια πόλη σου;",
    step1Hint: "Θα σου δείξουμε πρώτα τις εκδηλώσεις αυτής της πόλης.",
    step2Title: "Ποιες πειθαρχίες ασκείς;",
    step2Hint: "Διάλεξε τουλάχιστον μία.",
    step3Title: "Τι τύπος προφίλ είσαι;",
    step4Title: "Τι ψάχνεις;",
    step4Hint: "Προαιρετικό — χρησιμοποιείται για να σου προτείνουμε σχετικές γνωριμίες.",
    step5Title: "Καλώς όρισες!",
    step5Intro: "Κάθε εβδομάδα θα λαμβάνεις ένα email με τις επερχόμενες εκδηλώσεις στην πόλη σου. Για παράδειγμα:",
    step5ExampleEvents: [
      "Εγκαίνια · Δευτέρα 27 Ιουλίου, 20:00 — Lignes de fuite",
      "Εργαστήριο · Τετάρτη 29 Ιουλίου, 14:00 — Taille directe sur pierre",
      "Έκθεση · Σάββατο 1 Αυγούστου, 11:00 — Résidences croisées",
    ],
  },
};

export const dictionaries: Record<Locale, Dictionary> = { fr, en, el };
