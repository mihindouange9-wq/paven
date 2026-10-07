/* Données de démonstration PAVEN. Toutes les entreprises, personnes, chiffres et conversations sont fictifs
   et servent uniquement à illustrer le fonctionnement de la plateforme. */
import type {
  Company, Conversation, Country, City, DealRoom, ExpansionRequest, Industry, Match, Opportunity, PartnershipType, PipelineEntry, User, Verification, VerificationLevel,
} from "./types";

export const COUNTRIES: Country[] = [
  { code: "GA", name: "Gabon", region: "Afrique centrale", currency: "XAF", stats: { companies: 1284, opportunities: 186, requests: 73, connectedMarkets: 8 }, connected: ["CM", "CI", "CG", "SN", "MA"] },
  { code: "CM", name: "Cameroun", region: "Afrique centrale", currency: "XAF", stats: { companies: 3418, opportunities: 412, requests: 164, connectedMarkets: 11 }, connected: ["GA", "NG", "CI", "CG", "MA"] },
  { code: "CI", name: "Côte d'Ivoire", region: "Afrique de l'Ouest", currency: "XOF", stats: { companies: 4102, opportunities: 538, requests: 201, connectedMarkets: 12 }, connected: ["SN", "GH", "CM", "GA", "MA"] },
  { code: "SN", name: "Sénégal", region: "Afrique de l'Ouest", currency: "XOF", stats: { companies: 2764, opportunities: 329, requests: 118, connectedMarkets: 9 }, connected: ["CI", "MA", "GH", "GA", "NG"] },
  { code: "MA", name: "Maroc", region: "Afrique du Nord", currency: "MAD", stats: { companies: 6120, opportunities: 702, requests: 246, connectedMarkets: 14 }, connected: ["SN", "CI", "EG", "GA", "CM"] },
  { code: "GH", name: "Ghana", region: "Afrique de l'Ouest", currency: "GHS", stats: { companies: 3356, opportunities: 391, requests: 142, connectedMarkets: 10 }, connected: ["NG", "CI", "TG", "SN", "KE"] },
  { code: "NG", name: "Nigeria", region: "Afrique de l'Ouest", currency: "NGN", stats: { companies: 9840, opportunities: 1130, requests: 418, connectedMarkets: 15 }, connected: ["GH", "CM", "KE", "CI", "ZA"] },
  { code: "KE", name: "Kenya", region: "Afrique de l'Est", currency: "KES", stats: { companies: 5210, opportunities: 614, requests: 229, connectedMarkets: 13 }, connected: ["RW", "TZ", "NG", "ET", "ZA"] },
  { code: "RW", name: "Rwanda", region: "Afrique de l'Est", currency: "RWF", stats: { companies: 1096, opportunities: 158, requests: 61, connectedMarkets: 7 }, connected: ["KE", "TZ", "CD", "ET", "ZA"] },
  { code: "ZA", name: "Afrique du Sud", region: "Afrique australe", currency: "ZAR", stats: { companies: 8720, opportunities: 904, requests: 311, connectedMarkets: 16 }, connected: ["KE", "NG", "TZ", "RW", "MA"] },
  { code: "TZ", name: "Tanzanie", region: "Afrique de l'Est", currency: "TZS", stats: { companies: 2430, opportunities: 276, requests: 97, connectedMarkets: 8 }, connected: ["KE", "RW", "ZA", "CD", "ET"] },
  { code: "EG", name: "Égypte", region: "Afrique du Nord", currency: "EGP", stats: { companies: 7410, opportunities: 812, requests: 274, connectedMarkets: 12 }, connected: ["MA", "KE", "ET", "ZA", "NG"] },
  { code: "CG", name: "Congo", region: "Afrique centrale", currency: "XAF", stats: { companies: 842, opportunities: 102, requests: 44, connectedMarkets: 6 }, connected: ["GA", "CM", "CD", "CI", "MA"] },
  { code: "CD", name: "RD Congo", region: "Afrique centrale", currency: "CDF", stats: { companies: 2980, opportunities: 318, requests: 126, connectedMarkets: 9 }, connected: ["RW", "CG", "KE", "TZ", "ZA"] },
  { code: "ET", name: "Éthiopie", region: "Afrique de l'Est", currency: "ETB", stats: { companies: 2210, opportunities: 241, requests: 88, connectedMarkets: 7 }, connected: ["KE", "EG", "RW", "TZ", "ZA"] },
  { code: "BJ", name: "Bénin", region: "Afrique de l'Ouest", currency: "XOF", stats: { companies: 1130, opportunities: 134, requests: 52, connectedMarkets: 6 }, connected: ["NG", "TG", "CI", "GH", "SN"] },
  { code: "TG", name: "Togo", region: "Afrique de l'Ouest", currency: "XOF", stats: { companies: 960, opportunities: 118, requests: 47, connectedMarkets: 6 }, connected: ["GH", "BJ", "CI", "NG", "SN"] },
];

/* Positions abstraites sur la carte (0–100), fidèles à la géographie sans la dessiner. */
export const CITIES: City[] = [
  { id: "libreville", name: "Libreville", country: "GA", x: 46, y: 55 },
  { id: "port-gentil", name: "Port-Gentil", country: "GA", x: 45, y: 58 },
  { id: "franceville", name: "Franceville", country: "GA", x: 50, y: 58 },
  { id: "oyem", name: "Oyem", country: "GA", x: 47, y: 51 },
  { id: "moanda", name: "Moanda", country: "GA", x: 49, y: 57.5 },
  { id: "douala", name: "Douala", country: "CM", x: 46, y: 48 },
  { id: "yaounde", name: "Yaoundé", country: "CM", x: 49, y: 49 },
  { id: "abidjan", name: "Abidjan", country: "CI", x: 30, y: 45.5 },
  { id: "dakar", name: "Dakar", country: "SN", x: 18, y: 33 },
  { id: "casablanca", name: "Casablanca", country: "MA", x: 26, y: 13 },
  { id: "lagos", name: "Lagos", country: "NG", x: 38, y: 45 },
  { id: "accra", name: "Accra", country: "GH", x: 34, y: 45.5 },
  { id: "nairobi", name: "Nairobi", country: "KE", x: 73, y: 56 },
  { id: "kigali", name: "Kigali", country: "RW", x: 66, y: 58 },
  { id: "johannesburg", name: "Johannesburg", country: "ZA", x: 62, y: 84 },
  { id: "cairo", name: "Le Caire", country: "EG", x: 64, y: 14 },
  { id: "dar", name: "Dar es Salaam", country: "TZ", x: 72, y: 63 },
  { id: "brazzaville", name: "Brazzaville", country: "CG", x: 50, y: 61 },
  { id: "kinshasa", name: "Kinshasa", country: "CD", x: 51, y: 62 },
  { id: "addis", name: "Addis-Abeba", country: "ET", x: 73, y: 42 },
  { id: "cotonou", name: "Cotonou", country: "BJ", x: 36, y: 45.3 },
  { id: "lome", name: "Lomé", country: "TG", x: 35, y: 45.4 },
];

export const INDUSTRIES: Industry[] = [
  { id: "agro", name: "Agroalimentaire" },
  { id: "distribution", name: "Distribution" },
  { id: "tech", name: "Technologie" },
  { id: "manufacturing", name: "Industrie" },
  { id: "logistics", name: "Logistique" },
  { id: "energy", name: "Énergie" },
  { id: "finance", name: "Finance" },
  { id: "construction", name: "Construction" },
  { id: "health", name: "Santé" },
  { id: "retail", name: "Commerce de détail" },
];

export const PARTNERSHIP_TYPES: PartnershipType[] = [
  { id: "distributor", name: "Distributeur", verb: "Trouver un distributeur", description: "Une entreprise qui place vos produits sur son marché." },
  { id: "supplier", name: "Fournisseur", verb: "Trouver un fournisseur", description: "Une entreprise qui produit ce dont vous avez besoin." },
  { id: "strategic", name: "Partenaire stratégique", verb: "Trouver un partenaire stratégique", description: "Une alliance durable autour d'un objectif commun." },
  { id: "technology", name: "Partenaire technologique", verb: "Trouver un partenaire technologique", description: "Intégration, développement, infrastructure." },
  { id: "commercial", name: "Partenaire commercial", verb: "Trouver un partenaire commercial", description: "Vente, représentation, développement de clientèle." },
  { id: "manufacturer", name: "Fabricant", verb: "Trouver un fabricant", description: "Production sous votre marque ou vos spécifications." },
  { id: "logistics", name: "Partenaire logistique", verb: "Trouver un partenaire logistique", description: "Transport, entreposage, dédouanement." },
  { id: "subcontractor", name: "Sous-traitant", verb: "Trouver un sous-traitant", description: "Une capacité de production ou de service déléguée." },
  { id: "local", name: "Partenaire local", verb: "Trouver un partenaire local", description: "Une entreprise implantée sur le marché visé." },
  { id: "jointventure", name: "Coentreprise", verb: "Monter une coentreprise", description: "Une structure commune pour un nouveau marché." },
];

export const VERIFICATIONS: Record<VerificationLevel, Verification> = {
  business: { level: "business", label: "Entreprise vérifiée", description: "Identité légale et immatriculation confirmées.", date: "2026-09-12" },
  information: { level: "information", label: "Informations vérifiées", description: "Effectifs, implantation et activité confirmés.", date: "2026-09-18" },
  ready: { level: "ready", label: "Prête au partenariat", description: "Besoins et capacités décrits avec précision.", date: "2026-09-30" },
};

export const COMPANIES: Company[] = [
  {
    id: "gabon-fresh-foods", name: "Gabon Fresh Foods", country: "GA", city: "Libreville", industry: "agro", size: "50–100", founded: 2014,
    markets: ["Gabon"], monogram: "GF",
    description: "Marque gabonaise de produits alimentaires frais et transformés, avec une unité de production à Owendo et un réseau de 240 points de vente au Gabon.",
    lookingFor: ["Distributeur au Cameroun", "Partenaire commercial", "Réseau de distribution"],
    offers: ["Marque établie", "Capacité de production 40 t / mois", "Gamme de 32 produits"],
    partnershipTypes: ["distributor", "commercial"], verification: ["business", "information", "ready"],
  },
  {
    id: "agrodistrib-cameroon", name: "AgroDistrib Cameroon", country: "CM", city: "Douala", industry: "distribution", secondaryIndustry: "agro", size: "50–100", founded: 2011,
    markets: ["Cameroun", "Afrique centrale"], monogram: "AD",
    description: "Distributeur de produits de grande consommation couvrant Douala, Yaoundé et les villes secondaires du Cameroun, avec entrepôts frigorifiques et flotte propre.",
    lookingFor: ["Fournisseurs africains", "Marques alimentaires", "Partenariats stratégiques"],
    offers: ["Distribution", "Réseau de 1 800 détaillants", "Coordination logistique", "Accès au marché"],
    partnershipTypes: ["supplier", "strategic", "distributor"], verification: ["business", "information", "ready"],
  },
  {
    id: "kivu-foods", name: "Kivu Foods", country: "CD", city: "Goma", industry: "agro", size: "10–50", founded: 2018,
    markets: ["RD Congo", "Rwanda"], monogram: "KF",
    description: "Transformation de café et de fruits du Kivu, exportés vers Kigali et Nairobi.",
    lookingFor: ["Distributeur en Afrique de l'Est", "Partenaire logistique"],
    offers: ["Café lavé certifié", "Fruits séchés", "Traçabilité"],
    partnershipTypes: ["distributor", "logistics"], verification: ["business", "information"],
  },
  {
    id: "nexa-ci", name: "Nexa Côte d'Ivoire", country: "CI", city: "Abidjan", industry: "tech", size: "10–50", founded: 2019,
    markets: ["Côte d'Ivoire", "Afrique de l'Ouest"], monogram: "NX",
    description: "Intégrateur de solutions de paiement et de gestion pour le commerce et la distribution en Afrique de l'Ouest.",
    lookingFor: ["Partenaires technologiques", "Éditeurs à intégrer", "Accès au marché gabonais"],
    offers: ["Intégration de paiement mobile", "Déploiement terrain", "Support en français"],
    partnershipTypes: ["technology", "commercial"], verification: ["business", "information", "ready"],
  },
  {
    id: "atlas-manufacturing", name: "Atlas Manufacturing", country: "MA", city: "Casablanca", industry: "manufacturing", size: "250–1 000", founded: 2003,
    markets: ["Maroc", "Afrique de l'Ouest", "Europe"], monogram: "AM",
    description: "Fabricant d'emballages et de composants plastiques, capacité d'export vers l'Afrique de l'Ouest depuis Casablanca et Tanger.",
    lookingFor: ["Clients industriels en Afrique de l'Ouest", "Distributeurs"],
    offers: ["Fabrication sous spécifications", "Capacité 12 000 t / an", "Certification ISO 9001"],
    partnershipTypes: ["manufacturer", "supplier"], verification: ["business", "information", "ready"],
  },
  {
    id: "savanna-logistics", name: "Savanna Logistics", country: "KE", city: "Nairobi", industry: "logistics", size: "100–250", founded: 2009,
    markets: ["Kenya", "Rwanda", "Tanzanie", "Ouganda"], monogram: "SL",
    description: "Transport routier et entreposage sous douane sur le corridor Mombasa – Nairobi – Kigali.",
    lookingFor: ["Chargeurs réguliers", "Partenaires de distribution au Rwanda"],
    offers: ["Flotte de 140 camions", "Entrepôts sous douane", "Dédouanement"],
    partnershipTypes: ["logistics", "local"], verification: ["business", "information", "ready"],
  },
  {
    id: "teranga-industries", name: "Teranga Industries", country: "SN", city: "Dakar", industry: "manufacturing", secondaryIndustry: "agro", size: "100–250", founded: 2007,
    markets: ["Sénégal", "Mali", "Mauritanie"], monogram: "TI",
    description: "Conserverie et conditionnement à Dakar, à la recherche de fournisseurs d'emballages au Maghreb.",
    lookingFor: ["Fabricant d'emballages", "Fournisseur de composants"],
    offers: ["Volumes réguliers", "Contrats pluriannuels"],
    partnershipTypes: ["supplier", "manufacturer"], verification: ["business", "information"],
  },
  {
    id: "kigali-connect", name: "Kigali Connect", country: "RW", city: "Kigali", industry: "tech", size: "10–50", founded: 2020,
    markets: ["Rwanda"], monogram: "KC",
    description: "Intégrateur de logiciels pour les PME rwandaises, partenaire des opérateurs locaux.",
    lookingFor: ["Éditeurs SaaS est-africains", "Partenaires technologiques"],
    offers: ["Intégration", "Formation", "Support local"],
    partnershipTypes: ["technology", "local"], verification: ["business", "information", "ready"],
  },
  {
    id: "mombasa-tech", name: "Mombasa Tech", country: "KE", city: "Mombasa", industry: "tech", size: "50–100", founded: 2016,
    markets: ["Kenya", "Afrique de l'Est"], monogram: "MT",
    description: "Éditeur SaaS de gestion pour la distribution, en expansion vers le Rwanda.",
    lookingFor: ["Partenaire d'intégration au Rwanda", "Distributeurs"],
    offers: ["Logiciel de gestion", "Licences revendeur"],
    partnershipTypes: ["technology", "distributor"], verification: ["business", "information", "ready"],
  },
  {
    id: "lagos-brands", name: "Lagos Brands Co.", country: "NG", city: "Lagos", industry: "agro", secondaryIndustry: "retail", size: "100–250", founded: 2012,
    markets: ["Nigeria"], monogram: "LB",
    description: "Marques de boissons et snacks, 2 000 points de vente à Lagos et Abuja.",
    lookingFor: ["Distributeur au Ghana"],
    offers: ["Marques connues", "Marketing terrain", "Volumes"],
    partnershipTypes: ["distributor"], verification: ["business", "information", "ready"],
  },
  {
    id: "accra-distribution", name: "Accra Distribution Group", country: "GH", city: "Accra", industry: "distribution", size: "50–100", founded: 2010,
    markets: ["Ghana"], monogram: "AG",
    description: "Distribution de boissons et produits secs sur Accra, Kumasi et Takoradi.",
    lookingFor: ["Marques ouest-africaines", "Fournisseurs"],
    offers: ["Réseau de 1 200 détaillants", "Entrepôts", "Force de vente"],
    partnershipTypes: ["supplier", "strategic"], verification: ["business", "information", "ready"],
  },
  {
    id: "ogooue-services", name: "Ogooué Services", country: "GA", city: "Port-Gentil", industry: "logistics", size: "10–50", founded: 2015,
    markets: ["Gabon"], monogram: "OS",
    description: "Prestataire logistique et fournisseur de consommables industriels à Port-Gentil.",
    lookingFor: ["Clients industriels", "Partenaires à Libreville"],
    offers: ["Livraison Port-Gentil – Libreville", "Entreposage", "Consommables"],
    partnershipTypes: ["supplier", "logistics", "local"], verification: ["business", "information"],
  },
  {
    id: "haut-ogooue-agri", name: "Haut-Ogooué Agri", country: "GA", city: "Franceville", industry: "agro", size: "10–50", founded: 2017,
    markets: ["Gabon"], monogram: "HA",
    description: "Coopérative agricole du Haut-Ogooué : manioc, banane plantain, légumes.",
    lookingFor: ["Transformateurs", "Distributeurs à Libreville"],
    offers: ["Production régulière", "Produits frais"],
    partnershipTypes: ["supplier", "local"], verification: ["business"],
  },
  {
    id: "sahel-pack", name: "Sahel Pack", country: "MA", city: "Tanger", industry: "manufacturing", size: "50–100", founded: 2012,
    markets: ["Maroc", "Sénégal", "Côte d'Ivoire"], monogram: "SP",
    description: "Emballages souples pour l'agroalimentaire, livrés en Afrique de l'Ouest depuis Tanger.",
    lookingFor: ["Conserveries et transformateurs ouest-africains"],
    offers: ["Emballages souples", "Délais courts", "Petites séries"],
    partnershipTypes: ["supplier", "manufacturer"], verification: ["business", "information", "ready"],
  },
  {
    id: "douala-fresh", name: "Douala Fresh Market", country: "CM", city: "Douala", industry: "retail", secondaryIndustry: "distribution", size: "10–50", founded: 2016,
    markets: ["Cameroun"], monogram: "DF",
    description: "Chaîne de six supermarchés de produits frais à Douala.",
    lookingFor: ["Fournisseurs de produits frais", "Marques régionales"],
    offers: ["Linéaires", "Visibilité en magasin"],
    partnershipTypes: ["supplier", "commercial"], verification: ["business", "information"],
  },
  {
    id: "central-africa-logistics", name: "Central Africa Logistics", country: "CM", city: "Douala", industry: "logistics", size: "100–250", founded: 2008,
    markets: ["Cameroun", "Gabon", "Congo", "Tchad"], monogram: "CL",
    description: "Transport et transit entre le port de Douala, Libreville et Brazzaville.",
    lookingFor: ["Chargeurs réguliers", "Marques en expansion régionale"],
    offers: ["Transit portuaire", "Transport frigorifique", "Dédouanement"],
    partnershipTypes: ["logistics"], verification: ["business", "information", "ready"],
  },
];

export const USER: User = { company: "gabon-fresh-foods", name: "Aurélie Nzé", role: "Directrice du développement" };

export const MATCHES: Match[] = [
  {
    id: "m-agrodistrib", from: "gabon-fresh-foods", to: "agrodistrib-cameroon", score: 94, partnershipType: "distributor", date: "2026-10-06", status: "new",
    summary: "Forte compatibilité de distribution pour votre expansion au Cameroun.",
    reasons: [
      { label: "Marché cible", score: 92, explanation: "AgroDistrib opère sur le marché que vous visez, le Cameroun, depuis Douala et Yaoundé." },
      { label: "Secteur", score: 89, explanation: "Distribution de produits de grande consommation : votre gamme correspond à son catalogue." },
      { label: "Capacité de distribution", score: 96, explanation: "1 800 détaillants et entrepôts frigorifiques, à la hauteur de vos volumes." },
      { label: "Taille d'entreprise", score: 90, explanation: "Même ordre de grandeur, 50 à 100 personnes : un partenariat équilibré." },
      { label: "Couverture géographique", score: 93, explanation: "Douala, Yaoundé et les villes secondaires, soit l'essentiel du marché camerounais." },
      { label: "Objectif de partenariat", score: 91, explanation: "AgroDistrib cherche des marques alimentaires africaines : vos intentions se répondent." },
    ],
  },
  {
    id: "m-douala-fresh", from: "gabon-fresh-foods", to: "douala-fresh", score: 88, partnershipType: "commercial", date: "2026-10-05", status: "viewed",
    summary: "Six magasins de produits frais à Douala, en recherche de marques régionales.",
    reasons: [
      { label: "Marché cible", score: 92, explanation: "Implantée à Douala, votre première ville d'entrée." },
      { label: "Secteur", score: 86, explanation: "Commerce de détail alimentaire, complémentaire à votre production." },
      { label: "Capacité de distribution", score: 78, explanation: "Six magasins : un volume limité mais une vitrine immédiate." },
      { label: "Objectif de partenariat", score: 94, explanation: "Recherche explicitement des fournisseurs de produits frais." },
    ],
  },
  {
    id: "m-cal", from: "gabon-fresh-foods", to: "central-africa-logistics", score: 85, partnershipType: "logistics", date: "2026-10-04", status: "viewed",
    summary: "Transport frigorifique entre Libreville et le port de Douala.",
    reasons: [
      { label: "Couverture géographique", score: 95, explanation: "Dessert déjà Libreville, Douala et Brazzaville." },
      { label: "Capacité", score: 88, explanation: "Transport frigorifique et transit portuaire, nécessaires à vos produits frais." },
      { label: "Objectif de partenariat", score: 80, explanation: "Cherche des marques en expansion régionale ; votre projet correspond." },
      { label: "Taille d'entreprise", score: 76, explanation: "Plus grande que vous : prévoir un cadre contractuel clair." },
    ],
  },
  {
    id: "m-ogooue", from: "gabon-fresh-foods", to: "ogooue-services", score: 82, partnershipType: "supplier", date: "2026-10-02", status: "contacted",
    summary: "Consommables et logistique locale entre Port-Gentil et Libreville.",
    reasons: [
      { label: "Marché", score: 90, explanation: "Même pays, liaison régulière Port-Gentil – Libreville." },
      { label: "Capacité", score: 80, explanation: "Entreposage et livraison adaptés à des volumes moyens." },
      { label: "Objectif de partenariat", score: 78, explanation: "Cherche des partenaires à Libreville." },
    ],
  },
  {
    id: "m-haut-ogooue", from: "gabon-fresh-foods", to: "haut-ogooue-agri", score: 79, partnershipType: "supplier", date: "2026-09-30", status: "viewed",
    summary: "Approvisionnement en produits frais depuis Franceville.",
    reasons: [
      { label: "Secteur", score: 90, explanation: "Production agricole directement utilisable par votre unité de transformation." },
      { label: "Marché", score: 85, explanation: "Gabon, liaison Franceville – Libreville." },
      { label: "Vérification", score: 60, explanation: "Seule l'identité légale est vérifiée à ce jour." },
    ],
  },
];

export const OPPORTUNITIES: Opportunity[] = [
  { id: "o1", title: "Distributeur recherché — Cameroun", company: "gabon-fresh-foods", partnershipType: "distributor", market: "CM", fit: 94, posted: "2026-10-01", summary: "Entreprise agroalimentaire gabonaise cherche un distributeur couvrant Douala et Yaoundé pour une gamme de 32 produits." },
  { id: "o2", title: "Partenaire technologique recherché — Rwanda", company: "mombasa-tech", partnershipType: "technology", market: "RW", fit: 91, posted: "2026-10-03", summary: "Éditeur SaaS kényan cherche un partenaire d'intégration à Kigali pour déployer sa solution de gestion." },
  { id: "o3", title: "Fabricant d'emballages recherché — Maroc", company: "teranga-industries", partnershipType: "manufacturer", market: "MA", fit: 89, posted: "2026-09-28", summary: "Conserverie sénégalaise cherche un fabricant d'emballages marocain pour des volumes réguliers." },
  { id: "o4", title: "Distributeur recherché — Ghana", company: "lagos-brands", partnershipType: "distributor", market: "GH", fit: 87, posted: "2026-09-26", summary: "Marques nigérianes de boissons cherchent un distributeur établi à Accra et Kumasi." },
  { id: "o5", title: "Chargeurs réguliers — corridor Nairobi – Kigali", company: "savanna-logistics", partnershipType: "logistics", market: "RW", fit: 84, posted: "2026-09-25", summary: "Transporteur kényan propose des capacités régulières sous douane vers Kigali." },
  { id: "o6", title: "Fournisseur local recherché — Libreville", company: "douala-fresh", partnershipType: "supplier", market: "GA", fit: 81, posted: "2026-09-22", summary: "Chaîne de supermarchés camerounaise cherche des producteurs gabonais de produits frais." },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c-agrodistrib", with: "agrodistrib-cameroon", subject: "Distribution au Cameroun — gamme Gabon Fresh Foods", unread: 1,
    messages: [
      { id: "1", from: "gabon-fresh-foods", text: "Bonjour, PAVEN nous a mis en relation à 94 %. Nous préparons notre entrée au Cameroun avec 32 références de produits frais et transformés. Pourrions-nous échanger sur vos capacités de distribution à Douala et Yaoundé ?", at: "2026-10-06T09:14" },
      { id: "2", from: "agrodistrib-cameroon", text: "Bonjour Aurélie, avec plaisir. Nous couvrons 1 800 détaillants et disposons de 2 400 m² frigorifiques à Douala. Pouvez-vous nous transmettre votre catalogue et vos conditions logistiques ?", at: "2026-10-06T11:02" },
      { id: "3", from: "gabon-fresh-foods", text: "Catalogue joint dans le Deal Room. Nos volumes export démarrent à 8 tonnes par mois. Un appel jeudi vous conviendrait-il ?", at: "2026-10-06T14:30" },
      { id: "4", from: "agrodistrib-cameroon", text: "Jeudi 10 h, parfait. Nous préparons une proposition de couverture par ville.", at: "2026-10-07T08:45" },
    ],
  },
  {
    id: "c-ogooue", with: "ogooue-services", subject: "Consommables et livraisons Port-Gentil", unread: 0,
    messages: [
      { id: "1", from: "gabon-fresh-foods", text: "Bonjour, nous cherchons un partenaire pour la livraison hebdomadaire vers Port-Gentil.", at: "2026-10-02T10:00" },
      { id: "2", from: "ogooue-services", text: "Bonjour, nous assurons deux rotations par semaine. Je vous envoie notre grille tarifaire.", at: "2026-10-02T15:20" },
    ],
  },
  {
    id: "c-cal", with: "central-africa-logistics", subject: "Transport frigorifique Libreville – Douala", unread: 2,
    messages: [
      { id: "1", from: "central-africa-logistics", text: "Bonjour, nous avons vu votre opportunité au Cameroun. Nous opérons des liaisons frigorifiques hebdomadaires Libreville – Douala.", at: "2026-10-05T16:40" },
      { id: "2", from: "central-africa-logistics", text: "Nous pouvons vous proposer un tarif groupé avec le transit portuaire.", at: "2026-10-05T16:42" },
    ],
  },
];

export const DEAL_ROOMS: DealRoom[] = [
  {
    id: "dr-agrodistrib", companies: ["gabon-fresh-foods", "agrodistrib-cameroon"], objective: "Distribution de la gamme Gabon Fresh Foods au Cameroun", stage: "evaluation", opened: "2026-10-06", conversation: "c-agrodistrib",
    tasks: [
      { id: "t1", label: "Partager le catalogue et la grille tarifaire export", owner: "gabon-fresh-foods", done: true, due: "2026-10-06" },
      { id: "t2", label: "Proposition de couverture par ville", owner: "agrodistrib-cameroon", done: false, due: "2026-10-10" },
      { id: "t3", label: "Appel de cadrage", owner: "gabon-fresh-foods", done: false, due: "2026-10-09" },
      { id: "t4", label: "Visite des entrepôts de Douala", owner: "gabon-fresh-foods", done: false, due: "2026-10-21" },
    ],
    documents: [
      { id: "d1", name: "Accord de confidentialité PAVEN", kind: "NDA", size: "84 Ko", by: "PAVEN", at: "2026-10-06", signed: true },
      { id: "d2", name: "Catalogue Gabon Fresh Foods 2026", kind: "Catalogue", size: "6,2 Mo", by: "gabon-fresh-foods", at: "2026-10-06" },
      { id: "d3", name: "Fiche entreprise AgroDistrib Cameroon", kind: "Fiche", size: "310 Ko", by: "PAVEN", at: "2026-10-06" },
    ],
    notes: ["Volumes export de départ : 8 t / mois, montée à 20 t sur 12 mois.", "AgroDistrib souhaite une exclusivité sur Douala ; à discuter."],
    calendar: [{ date: "2026-10-09", label: "Appel de cadrage, 10 h" }, { date: "2026-10-21", label: "Visite des entrepôts, Douala" }],
  },
  {
    id: "dr-ogooue", companies: ["gabon-fresh-foods", "ogooue-services"], objective: "Livraisons hebdomadaires Libreville – Port-Gentil", stage: "conversation", opened: "2026-10-02", conversation: "c-ogooue",
    tasks: [{ id: "t1", label: "Recevoir la grille tarifaire", owner: "ogooue-services", done: true }, { id: "t2", label: "Valider le calendrier des rotations", owner: "gabon-fresh-foods", done: false, due: "2026-10-12" }],
    documents: [{ id: "d1", name: "Accord de confidentialité PAVEN", kind: "NDA", size: "84 Ko", by: "PAVEN", at: "2026-10-02", signed: true }, { id: "d2", name: "Grille tarifaire 2026", kind: "Note", size: "120 Ko", by: "ogooue-services", at: "2026-10-02" }],
    notes: [],
    calendar: [],
  },
];

export const PIPELINE: PipelineEntry[] = [
  { company: "agrodistrib-cameroon", stage: "negotiation", score: 94, since: "2026-10-06" },
  { company: "douala-fresh", stage: "discussion", score: 88, since: "2026-10-05" },
  { company: "central-africa-logistics", stage: "contacted", score: 85, since: "2026-10-05" },
  { company: "ogooue-services", stage: "active", score: 82, since: "2026-09-20" },
  { company: "haut-ogooue-agri", stage: "potential", score: 79, since: "2026-09-30" },
  { company: "nexa-ci", stage: "potential", score: 74, since: "2026-09-28" },
  { company: "sahel-pack", stage: "potential", score: 71, since: "2026-09-27" },
  { company: "accra-distribution", stage: "potential", score: 68, since: "2026-09-25" },
];

export const PIPELINE_COUNTS = { potential: 12, contacted: 6, discussion: 4, negotiation: 2, active: 3 };

export const EXPANSIONS: ExpansionRequest[] = [
  { id: "e1", from: "gabon-fresh-foods", fromCity: "Libreville", to: "CM", toCity: "Douala", objective: "Trouver des partenaires de distribution", partnershipType: "distributor", found: 18 },
  { id: "e2", from: "gabon-fresh-foods", fromCity: "Libreville", to: "CI", toCity: "Abidjan", objective: "Accéder au marché ivoirien", partnershipType: "commercial", found: 11 },
];

/* Scénarios narratifs de la landing : Depuis → Vers. */
export const SCENARIOS = [
  { from: "libreville", to: "douala", need: "distributor", result: "AgroDistrib Cameroon", score: 94 },
  { from: "libreville", to: "abidjan", need: "technology", result: "Nexa Côte d'Ivoire", score: 91 },
  { from: "dakar", to: "casablanca", need: "manufacturer", result: "Atlas Manufacturing", score: 89 },
  { from: "nairobi", to: "kigali", need: "technology", result: "Kigali Connect", score: 92 },
  { from: "lagos", to: "accra", need: "distributor", result: "Accra Distribution Group", score: 87 },
  { from: "libreville", to: "port-gentil", need: "supplier", result: "Ogooué Services", score: 82 },
] as const;

/* Accès rapides */
export const companyById = (id: string) => COMPANIES.find((c) => c.id === id)!;
export const countryByCode = (code: string) => COUNTRIES.find((c) => c.code === code)!;
export const cityById = (id: string) => CITIES.find((c) => c.id === id)!;
export const industryName = (id: string) => INDUSTRIES.find((i) => i.id === id)?.name ?? id;
export const partnershipName = (id: string) => PARTNERSHIP_TYPES.find((p) => p.id === id)?.name ?? id;
