/* Modèle de données PAVEN. Le MVP est alimenté par des données de démonstration (src/data/mock.ts),
   mais les entités sont structurées comme celles d'un vrai produit. */

export type CountryCode =
  | "GA" | "CM" | "CI" | "SN" | "MA" | "GH" | "NG" | "KE" | "RW" | "ZA" | "TZ" | "EG" | "CG" | "CD" | "ET" | "BJ" | "TG";

export interface Country {
  code: CountryCode;
  name: string;
  region: "Afrique centrale" | "Afrique de l'Ouest" | "Afrique du Nord" | "Afrique de l'Est" | "Afrique australe";
  currency: string;
  /** Statistiques de démonstration affichées sur la carte des marchés. */
  stats: { companies: number; opportunities: number; requests: number; connectedMarkets: number };
  /** Marchés les plus connectés (codes pays), dans l'ordre. */
  connected: CountryCode[];
}

export interface City {
  id: string;
  name: string;
  country: CountryCode;
  /** Position sur la carte abstraite (0–100). */
  x: number;
  y: number;
}

export type IndustryId =
  | "agro" | "distribution" | "tech" | "manufacturing" | "logistics" | "energy" | "finance" | "construction" | "health" | "retail";

export interface Industry {
  id: IndustryId;
  name: string;
}

export type PartnershipTypeId =
  | "distributor" | "supplier" | "strategic" | "technology" | "commercial" | "manufacturer" | "logistics" | "subcontractor" | "local" | "jointventure";

export interface PartnershipType {
  id: PartnershipTypeId;
  name: string;
  /** Verbe court : « Trouver un distributeur ». */
  verb: string;
  description: string;
}

export type CompanySize = "1–10" | "10–50" | "50–100" | "100–250" | "250–1 000" | "1 000+";

export type VerificationLevel = "business" | "information" | "ready";

export interface Verification {
  level: VerificationLevel;
  label: string;
  description: string;
  /** Date de vérification (démonstration). */
  date: string;
}

export interface Company {
  id: string;
  name: string;
  country: CountryCode;
  city: string;
  industry: IndustryId;
  secondaryIndustry?: IndustryId;
  size: CompanySize;
  founded: number;
  markets: string[];
  description: string;
  lookingFor: string[];
  offers: string[];
  partnershipTypes: PartnershipTypeId[];
  verification: VerificationLevel[];
  /** Initiales affichées dans le monogramme. */
  monogram: string;
}

export interface MatchReason {
  label: string;
  score: number;
  explanation: string;
}

export interface Match {
  id: string;
  /** Entreprise qui regarde. */
  from: string;
  /** Entreprise proposée. */
  to: string;
  score: number;
  reasons: MatchReason[];
  summary: string;
  partnershipType: PartnershipTypeId;
  date: string;
  status: "new" | "viewed" | "contacted";
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  partnershipType: PartnershipTypeId;
  market: CountryCode;
  fit: number;
  posted: string;
  summary: string;
}

export interface Message {
  id: string;
  from: string;
  text: string;
  at: string;
}

export interface Conversation {
  id: string;
  with: string;
  subject: string;
  messages: Message[];
  unread: number;
}

export type DealStage = "discovery" | "conversation" | "evaluation" | "negotiation" | "partnership";

export interface DealTask {
  id: string;
  label: string;
  owner: string;
  done: boolean;
  due?: string;
}

export interface DealDocument {
  id: string;
  name: string;
  kind: "NDA" | "Fiche" | "Contrat" | "Catalogue" | "Note";
  size: string;
  by: string;
  at: string;
  signed?: boolean;
}

export interface DealRoom {
  id: string;
  companies: [string, string];
  objective: string;
  stage: DealStage;
  opened: string;
  tasks: DealTask[];
  documents: DealDocument[];
  notes: string[];
  calendar: { date: string; label: string }[];
  conversation: string;
}

export type PipelineStage = "potential" | "contacted" | "discussion" | "negotiation" | "active";

export interface PipelineEntry {
  company: string;
  stage: PipelineStage;
  score: number;
  since: string;
}

export interface ExpansionRequest {
  id: string;
  from: string;
  fromCity: string;
  to: CountryCode;
  toCity: string;
  objective: string;
  partnershipType: PartnershipTypeId;
  found: number;
}

export interface User {
  company: string;
  name: string;
  role: string;
}
