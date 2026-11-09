/* Textes de l'interface, en français. La page d'accueil tient en sept scènes : chacune dit une seule chose.
   Les titres reprennent en substance ceux du brief du client ; la version anglaise viendra par un sélecteur FR / EN. */

export const BRAND = {
  name: "PAVEN",
  tagline: "Africa's Business Connection Infrastructure",
  vision: "Make Africa easier to do business with.",
  footer: "Built for African business.",
};

/* Les scènes de la page d'accueil, dans l'ordre : ancre, nom lu par le rail de scènes. */
export const SCENES = [
  { id: "accueil", label: "Accueil" },
  { id: "plateforme", label: "Le constat" },
  { id: "parcours", label: "Comment ça marche" },
  { id: "compatibilite", label: "Compatibilité" },
  { id: "marches", label: "Marchés" },
  { id: "confiance", label: "Confiance" },
  { id: "commencer", label: "Commencer" },
];

export const NAV = [
  { label: "Comment ça marche", href: "#parcours" },
  { label: "Compatibilité", href: "#compatibilite" },
  { label: "Marchés", href: "#marches" },
  { label: "Confiance", href: "#confiance" },
];

export const HERO = {
  /* Le titre dit ce que fait PAVEN ; une ligne par élément du tableau. */
  title: ["Trouvez le bon", "partenaire", "d'affaires,", "partout en Afrique."],
  lead: "PAVEN met en relation les entreprises africaines. Dites ce que vous cherchez et sur quel marché : la plateforme vous montre les entreprises compatibles, vérifiées, et vous explique pourquoi.",
  primary: "Trouver un partenaire",
  secondary: "Voir comment ça marche",
  sheet: "Exemple de mise en relation",
};

export const PROBLEM = {
  /* Titres à deux tons : [mise en place, idée]. La première partie est atténuée, la seconde porte l'idée. */
  title: ["L'Afrique a les entreprises.", "Le défi, c'est de trouver les bonnes."],
  items: [
    { title: "Des marchés fragmentés", text: "Des dizaines de marchés qui ne se parlent pas." },
    { title: "Une visibilité limitée", text: "Impossible de savoir qui est réellement compatible avec vous." },
    { title: "La confiance", text: "Avant de collaborer, il faut des informations fiables." },
    { title: "L'expansion", text: "Un nouveau pays demande des partenaires que l'on ne connaît pas encore." },
  ],
  answer: "PAVEN résout cette fragmentation.",
};

export const HOW = {
  title: ["Un besoin, un marché,", "les bonnes entreprises."],
  lead: "Trois choix suffisent. PAVEN cherche dans votre pays ou sur un autre marché africain, et classe les entreprises par compatibilité.",
  need: "Votre besoin",
  where: "Votre marché",
  who: "Vos partenaires",
  mine: "Mon pays",
  other: "Un autre marché africain",
  from: "Depuis",
  to: "Vers",
  found: "entreprises compatibles",
  cta: "Voir ces entreprises",
  next: "Ensuite : une conversation privée, puis un Deal Room pour les documents, les étapes et les décisions.",
  demo: "Entreprises et chiffres de démonstration.",
};

export const ENGINE = {
  title: ["Toutes les connexions ne sont pas des opportunités.", "PAVEN trouve les bonnes."],
  lead: "Chaque mise en relation est un score expliqué, critère par critère. Jamais un pourcentage seul.",
  why: "Pourquoi cette compatibilité ?",
  view: "Voir l'entreprise",
};

export const MAP = {
  title: ["Un continent.", "Des milliers d'opportunités."],
  lead: "Des marchés séparés, un seul continent, des entreprises qui se relient. Choisissez un pays : ses chiffres et ses liaisons apparaissent.",
  companies: "Entreprises",
  opportunities: "Opportunités actives",
  requests: "Demandes de partenariat",
  connected: "Marchés connectés",
};

export const TRUST = {
  title: ["Des connexions d'affaires", "construites sur le contexte."],
  lead: "La confiance ne se décrète pas. Elle se montre, pièce par pièce.",
  items: [
    { title: "Profils clairs", text: "Ce que l'entreprise offre, ce qu'elle cherche, où elle opère." },
    { title: "Intention déclarée", text: "Chacune dit ce qu'elle attend avant la première conversation." },
    { title: "Conversations privées", text: "Les échanges restent entre les deux entreprises." },
    { title: "Deal Rooms sécurisés", text: "Documents, accord de confidentialité, étapes et décisions au même endroit." },
  ],
  levels: [
    { title: "Entreprise vérifiée", text: "Identité légale et immatriculation confirmées." },
    { title: "Informations vérifiées", text: "Effectifs, implantation et activité confirmés." },
    { title: "Prête au partenariat", text: "Besoins et capacités décrits avec précision." },
  ],
  note: "Aucune certification n'est inventée : chaque niveau décrit ce qui a réellement été confirmé.",
  phone: "Sur téléphone aussi : la raison principale en une ligne, le profil complet en un geste.",
};

export const MOBILE = {
  title: "Nouvelle compatibilité",
  company: "AgroDistrib Cameroon",
  score: "94 % de compatibilité",
  quote: "Forte compatibilité de distribution pour votre expansion au Cameroun.",
  connect: "Se connecter",
  view: "Voir le profil",
};

export const FINAL = {
  title: ["L'Afrique n'est pas un marché.", "C'est des milliers d'opportunités."],
  lead: "PAVEN aide les entreprises à trouver où elles ont leur place, et avec qui construire.",
  primary: "Trouver votre prochain partenaire",
  secondary: "Explorer les marchés africains",
};

export const FOOTER = {
  platform: ["Découvrir", "Compatibilités", "Opportunités", "Expansion", "Entreprises", "À propos"],
  legal: ["Confidentialité", "Conditions", "Sécurité"],
  languages: ["FR", "EN"],
  demo: "Les entreprises, scores et conversations présentés sont des données de démonstration fictives.",
  partner: { label: "En partenariat avec", name: "MÉTHODE AURA", note: "Conception et réalisation du site" },
};

export const APP_NAV = [
  { id: "overview", label: "Vue d'ensemble", path: "/app" },
  { id: "discover", label: "Découvrir", path: "/app/decouvrir" },
  { id: "matches", label: "Compatibilités", path: "/app/compatibilites" },
  { id: "companies", label: "Entreprises", path: "/app/entreprises" },
  { id: "opportunities", label: "Opportunités", path: "/app/opportunites" },
  { id: "messages", label: "Messages", path: "/app/messages" },
  { id: "dealrooms", label: "Deal Rooms", path: "/app/deal-rooms" },
  { id: "expansion", label: "Expansion", path: "/app/expansion" },
  { id: "pipeline", label: "Partenariats", path: "/app/partenariats" },
];

export const STAGES: Record<string, string> = {
  discovery: "Découverte",
  conversation: "Conversation",
  evaluation: "Évaluation",
  negotiation: "Négociation",
  partnership: "Partenariat",
};

export const PIPELINE_STAGES: Record<string, string> = {
  potential: "Potentielles",
  contacted: "Contactées",
  discussion: "En discussion",
  negotiation: "Négociation",
  active: "Actives",
};
