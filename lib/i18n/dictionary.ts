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
    connexion: string;
    deconnexion: string;
  };

  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    profileNotFound: string;
  };

  evenements: {
    tabTous: string;
    tabMes: string;
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
    connexion: "Connexion",
    deconnexion: "Déconnexion",
  },
  common: {
    loading: "Chargement…",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    profileNotFound: "Profil introuvable.",
  },
  evenements: {
    tabTous: "Tous",
    tabMes: "Mes événements",
    proposer: "+ Proposer",
    searchPlaceholder: "Rechercher un événement…",
    tousTypes: "Tous types",
    toutesDisciplines: "Toutes disciplines",
    loadError: (message) => `Impossible de charger les événements (${message}).`,
    noResults: "Aucun événement ne correspond à ces filtres.",
    loginToSee: "pour voir tes événements.",
    loginLink: "Connecte-toi",
    jeViens: "Je viens",
    sauvegardes: "Sauvegardés",
    noneYet: "Aucun événement pour l'instant.",
    mesSoumissions: "Mes soumissions",
    noSubmissions: "Aucun événement proposé pour l'instant.",
    statutEnAttente: "En attente de validation",
    statutPublie: "Publié",
    editLink: "Modifier",
    withdrawLink: "Retirer",
    withdrawConfirm: "Retirer cet événement ? Cette action est définitive.",
  },
  saveButtons: {
    sauvegarder: "Sauvegarder",
    sauvegarde: "Sauvegardé ✓",
    jeViens: "Je viens",
    jeViensActif: "Je viens ✓",
    loginToSave: "Connecte-toi pour sauvegarder",
  },
  eventDetail: {
    back: "← Retour aux événements",
    loadError: (message) => `Impossible de charger l'événement (${message}).`,
    annonceDisclaimer:
      "Annonce entre particuliers : la transaction se fait directement avec la personne, en dehors de l'application.",
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
    mismatch: "Les deux mots de passe ne correspondent pas.",
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
    saved: "Profil mis à jour.",
    save: "Enregistrer",
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
    submitted: "Événement soumis, en attente de validation avant publication.",
    submit: "Soumettre",
  },
  matching: {
    title: "Suggestions de matching",
    subtitle: "Même ville, discipline en commun, et un tag « je cherche » partagé.",
    needTag: "Ajoute au moins un tag « je cherche » sur ton profil pour voir des suggestions.",
    noResults: "Aucune suggestion pour l'instant — reviens plus tard.",
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
    connexion: "Sign in",
    deconnexion: "Sign out",
  },
  common: {
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    profileNotFound: "Profile not found.",
  },
  evenements: {
    tabTous: "All",
    tabMes: "My events",
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
    back: "← Back to events",
    loadError: (message) => `Couldn't load this event (${message}).`,
    annonceDisclaimer:
      "Listing between individuals: the transaction happens directly with the person, outside the app.",
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
    connexion: "Σύνδεση",
    deconnexion: "Αποσύνδεση",
  },
  common: {
    loading: "Φόρτωση…",
    save: "Αποθήκευση",
    cancel: "Ακύρωση",
    delete: "Διαγραφή",
    profileNotFound: "Το προφίλ δεν βρέθηκε.",
  },
  evenements: {
    tabTous: "Όλες",
    tabMes: "Οι εκδηλώσεις μου",
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
    back: "← Πίσω στις εκδηλώσεις",
    loadError: (message) => `Αδυναμία φόρτωσης εκδήλωσης (${message}).`,
    annonceDisclaimer:
      "Αγγελία μεταξύ ιδιωτών: η συναλλαγή γίνεται απευθείας με το άτομο, εκτός εφαρμογής.",
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
};

export const dictionaries: Record<Locale, Dictionary> = { fr, en, el };
