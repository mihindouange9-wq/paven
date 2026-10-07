/* Textes de l'interface, en français. Les titres reprennent en substance ceux du brief du client ;
   la version anglaise viendra par un sélecteur FR / EN. */

export const BRAND = {
  name: "PAVEN",
  tagline: "Africa's Business Connection Infrastructure",
  vision: "Make Africa easier to do business with.",
  footer: "Built for African business.",
};

export const NAV = [
  { label: "Plateforme", href: "#plateforme" },
  { label: "Moteur de compatibilité", href: "#compatibilite" },
  { label: "Marchés", href: "#marches" },
  { label: "Expansion", href: "#expansion" },
  { label: "Confiance", href: "#confiance" },
];

export const HERO = {
  title: "Les affaires changent de rythme quand l'Afrique se connecte.",
  lead: "Des entreprises vérifiées, des partenaires stratégiques et de nouveaux marchés, partout en Afrique.",
  primary: "Trouver un partenaire",
  secondary: "Explorer l'Afrique",
};

export const PROBLEM = {
  title: "L'Afrique a les entreprises. Le défi, c'est de trouver les bonnes.",
  items: [
    { title: "Des marchés fragmentés", text: "Les entreprises sont dispersées entre des dizaines de marchés qui ne se parlent pas." },
    { title: "Une visibilité limitée", text: "Difficile de savoir quelles entreprises sont réellement compatibles avec la vôtre." },
    { title: "La confiance", text: "Avant de collaborer, il faut des informations fiables sur qui est en face." },
    { title: "L'expansion", text: "Entrer dans un nouveau pays demande des partenaires locaux que l'on ne connaît pas encore." },
  ],
};

export const NEED = {
  title: "De quoi votre entreprise a-t-elle besoin ?",
  lead: "Choisissez ce que vous cherchez : PAVEN cherche l'entreprise qui le propose.",
};

export const WHERE = {
  title: "Où voulez-vous aller ?",
  mine: "Mon pays",
  other: "Un autre marché africain",
  expandTo: "Développer vers",
  from: "Depuis",
  to: "Vers",
};

export const ENGINE = {
  title: "Toutes les connexions ne sont pas des opportunités. PAVEN trouve les bonnes.",
  lead: "Chaque mise en relation est un score expliqué, critère par critère. Jamais un pourcentage seul.",
  why: "Pourquoi cette compatibilité ?",
  view: "Voir l'entreprise",
};

export const MAP = {
  title: "Un continent. Des milliers d'opportunités.",
  lead: "Choisissez un pays : ses entreprises, ses opportunités et ses marchés connectés apparaissent.",
  companies: "Entreprises",
  opportunities: "Opportunités actives",
  requests: "Demandes de partenariat",
  connected: "Marchés connectés",
};

export const EXPANSION = {
  title: "Développez-vous sans repartir de zéro.",
  lead: "Dites d'où vous partez, où vous allez et ce que vous cherchez. PAVEN fait le reste.",
  from: "Depuis",
  to: "Vers",
  objective: "Objectif",
  found: (n: number) => `PAVEN a trouvé ${n} entreprises compatibles`,
  filters: ["Secteur", "Taille", "Ville", "Capacité de distribution", "Type de partenariat", "Vérification"],
};

export const JOURNEY = {
  title: "Six étapes, un seul parcours.",
  steps: [
    { title: "Définissez votre objectif", text: "Distributeur, fournisseur, partenaire technologique : dites ce qu'il vous faut." },
    { title: "Choisissez votre marché", text: "Votre pays, ou n'importe quel marché africain." },
    { title: "Découvrez les entreprises pertinentes", text: "Des profils vérifiés, décrits avec leurs besoins et leurs capacités." },
    { title: "Comparez la compatibilité", text: "Un score expliqué critère par critère." },
    { title: "Connectez-vous", text: "Une conversation privée, puis un Deal Room." },
    { title: "Construisez le partenariat", text: "Documents, étapes, tâches et calendrier au même endroit." },
  ],
};

export const LOCAL = {
  title: "Grandir plus près de chez soi.",
  lead: "PAVEN sert aussi aux partenariats dans votre propre pays : un fournisseur à Port-Gentil, un distributeur à Franceville, un sous-traitant à Oyem.",
  needs: ["Fournisseur", "Distributeur", "Sous-traitant", "Partenaire commercial"],
};

export const CROSS = {
  title: "Franchir les frontières. Rester local.",
  lead: "Des partenariats entre marchés voisins, construits avec des entreprises qui connaissent le terrain.",
  pairs: [["GA", "CM"], ["SN", "MA"], ["NG", "GH"], ["KE", "RW"]] as const,
};

export const TRUST = {
  title: "Des connexions d'affaires construites sur le contexte.",
  lead: "La confiance ne se décrète pas. Elle se montre, pièce par pièce.",
  items: [
    { title: "Vérification des entreprises", text: "Identité légale, informations principales, intentions de partenariat." },
    { title: "Profils clairs", text: "Ce que l'entreprise offre, ce qu'elle cherche, où elle opère." },
    { title: "Intention de partenariat", text: "Chaque entreprise dit ce qu'elle attend avant la première conversation." },
    { title: "Compatibilité expliquée", text: "Jamais un pourcentage seul : les raisons, une à une." },
    { title: "Conversations privées", text: "Les échanges restent entre les deux entreprises." },
    { title: "Deal Rooms sécurisés", text: "Documents, accord de confidentialité, étapes et décisions au même endroit." },
  ],
  levels: [
    { title: "Entreprise vérifiée", text: "Identité légale et immatriculation confirmées." },
    { title: "Informations vérifiées", text: "Effectifs, implantation et activité confirmés." },
    { title: "Prête au partenariat", text: "Besoins et capacités décrits avec précision." },
  ],
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
  title: "L'Afrique n'est pas un marché. C'est des milliers d'opportunités.",
  lead: "PAVEN aide les entreprises à trouver où elles ont leur place, et avec qui construire.",
  primary: "Trouver votre prochain partenaire",
  secondary: "Explorer les marchés africains",
};

export const FOOTER = {
  platform: ["Découvrir", "Compatibilités", "Opportunités", "Expansion", "Entreprises", "À propos"],
  legal: ["Confidentialité", "Conditions", "Sécurité"],
  languages: ["FR", "EN"],
  demo: "Les entreprises, scores et conversations présentés sont des données de démonstration fictives.",
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
