import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button, Country, Field, Label, Monogram, PType, Score, Verifs } from "../components/ui";
import SectionStamp from "../components/SectionStamp";
import { EXPANSION } from "../content/fr";
import { COMPANIES, industryName } from "../data/mock";

const RESULTS = ["nexa-ci", "atlas-manufacturing", "sahel-pack", "accra-distribution"] as const;
const SCORES: Record<string, number> = { "nexa-ci": 91, "atlas-manufacturing": 84, "sahel-pack": 79, "accra-distribution": 74 };

/** « Développez-vous sans repartir de zéro. » Libreville → Abidjan, un objectif, 18 entreprises, des filtres. */
export default function ExpansionSection() {
  const [filter, setFilter] = useState<string | null>(null);
  const list = COMPANIES.filter((c) => RESULTS.includes(c.id as (typeof RESULTS)[number]));

  return (
    <section id="expansion" className="section expansion">
      <div className="container expansion__grid">
        <SectionStamp>Expansion</SectionStamp>
        <div className="expansion__copy">
          <h2 data-reveal>{EXPANSION.title}</h2>
          <p className="lead" data-reveal>{EXPANSION.lead}</p>
          <div className="sheet expansion__sheet" data-reveal>
            <div className="sheet__body">
              <div className="expansion__fromto">
                <Field label={EXPANSION.from} value={<span className="dossier__place">Libreville <Country code="GA" nameless /></span>} state="filled" large />
                <svg className="expansion__route" viewBox="0 0 24 120" preserveAspectRatio="none" aria-hidden="true"><path d="M12 6V114" fill="none" stroke="currentColor" strokeWidth="1.5" data-draw /><circle cx="12" cy="6" r="5" /><circle cx="12" cy="114" r="5" /></svg>
                <Field label={EXPANSION.to} value={<span className="dossier__place">Abidjan <Country code="CI" nameless /></span>} state="filled" large />
              </div>
              <Field label={EXPANSION.objective} value="Trouver des partenaires de distribution et un accès au marché" state="filled" />
              <p className="expansion__found tabular">PAVEN a trouvé <span className="expansion__found-n">18</span> entreprises compatibles</p>
            </div>
          </div>
        </div>

        <div className="expansion__results" data-reveal>
          <div className="rule-head">
            <Label strong>Filtrer</Label>
            <span className="label tabular">18 résultats · 4 affichés</span>
          </div>
          <ul className="expansion__filters" aria-label="Filtres">
            {EXPANSION.filters.map((f) => (
              <li key={f}><button type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(filter === f ? null : f)}>{f}</button></li>
            ))}
          </ul>
          <ul className="ledger expansion__list">
            {list.map((c) => (
              <li key={c.id} className="expansion__row">
                <Monogram company={c} />
                <div className="expansion__row-main">
                  <strong>{c.name}</strong>
                  <span className="expansion__row-meta"><Country code={c.country} /> · {c.city} · {industryName(c.industry)}</span>
                  <Verifs levels={c.verification} compact />
                </div>
                <div className="expansion__row-side">
                  <Score value={SCORES[c.id]} size="1.75rem" />
                  <PType id={c.partnershipTypes[0]} />
                </div>
              </li>
            ))}
          </ul>
          <Button to="/app/expansion?from=GA&to=CI" small>Voir les 18 entreprises<ArrowRight /></Button>
        </div>
      </div>
    </section>
  );
}
