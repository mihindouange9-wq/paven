import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button, Country, Label, Monogram, Score } from "../components/ui";
import { HOW } from "../content/fr";
import { COMPANIES, COUNTRIES, countryByCode, industryName, MATCHES, PARTNERSHIP_TYPES, USER } from "../data/mock";
import type { Company, CountryCode, PartnershipTypeId } from "../data/types";

/* Classement de démonstration, déterministe : une entreprise du marché visé qui propose le type cherché passe en
   tête ; viennent ensuite les marchés connectés. Quand une compatibilité existe dans les données (AgroDistrib
   Cameroon, 94 %), c'est son score qui est repris, pour que toute la page raconte le même exemple. */
const seed = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 997; return h; };
function rank(need: PartnershipTypeId, target: CountryCode): { company: Company; score: number }[] {
  const connected = countryByCode(target).connected;
  return COMPANIES.filter((c) => c.id !== USER.company && (c.country === target || connected.includes(c.country)))
    .map((c) => {
      const known = MATCHES.find((m) => m.to === c.id && m.partnershipType === need);
      const base = (c.country === target ? 78 : 64) + (c.partnershipTypes.includes(need) ? 11 : 0) + (seed(c.id + need) % 5);
      return { company: c, score: known ? known.score : base };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
const found = (need: PartnershipTypeId, target: CountryCode) =>
  Math.max(4, Math.round(countryByCode(target).stats.companies * (0.004 + (seed(need + target) % 9) / 1000)));

/** « Comment ça marche » : un besoin, un marché, les entreprises classées. Les trois choix sont réels. */
export default function How() {
  const [need, setNeed] = useState<PartnershipTypeId>("distributor");
  const [scope, setScope] = useState<"mine" | "other">("other");
  const [from, setFrom] = useState<CountryCode>("GA");
  const [to, setTo] = useState<CountryCode>("CM");
  const target = scope === "mine" ? from : to;
  const rows = useMemo(() => rank(need, target), [need, target]);
  const n = found(need, target);
  const type = PARTNERSHIP_TYPES.find((p) => p.id === need)!;

  return (
    <section id="parcours" className="scene how" data-scene data-tone="buff" tabIndex={-1}>
      <div className="container">
        <header className="how__head">
          <h2 data-reveal="lines">{HOW.title}</h2>
          <p className="lead" data-reveal>{HOW.lead}</p>
        </header>

        <div className="how__grid">
          <div className="how__step" data-reveal>
            <h3>{HOW.need}</h3>
            <div className="how__types" role="radiogroup" aria-label="Type de partenariat recherché">
              {PARTNERSHIP_TYPES.map((p) => (
                <button key={p.id} type="button" role="radio" aria-checked={need === p.id} className={`how__type ${need === p.id ? "is-on" : ""}`} onClick={() => setNeed(p.id)}>
                  <i className="ptype__mark" data-k={p.id} aria-hidden="true" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
            <p className="how__hint">{type.description}</p>
          </div>

          <div className="how__step" data-reveal>
            <h3>{HOW.where}</h3>
            <div className="how__scope" role="radiogroup" aria-label="Portée de la recherche">
              <button type="button" role="radio" aria-checked={scope === "mine"} className={`chip ${scope === "mine" ? "is-on" : ""}`} onClick={() => setScope("mine")}>{HOW.mine}</button>
              <button type="button" role="radio" aria-checked={scope === "other"} className={`chip ${scope === "other" ? "is-on" : ""}`} onClick={() => setScope("other")}>{HOW.other}</button>
            </div>
            <div className="how__fromto">
              <label className="how__field">
                <span className="label">{HOW.from}</span>
                <select className="input select how__select" value={from} onChange={(e) => { const v = e.target.value as CountryCode; setFrom(v); if (v === to) setTo(COUNTRIES.find((c) => c.code !== v)!.code); }}>
                  {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </label>
              <svg className="how__arrow" viewBox="0 0 24 40" aria-hidden="true"><path d="M12 2v30M5 25l7 9 7-9" fill="none" stroke="currentColor" strokeWidth="1.5" data-draw /></svg>
              <label className={`how__field ${scope === "mine" ? "is-off" : ""}`}>
                <span className="label">{HOW.to}</span>
                <select className="input select how__select" value={scope === "mine" ? from : to} disabled={scope === "mine"} onChange={(e) => setTo(e.target.value as CountryCode)}>
                  {COUNTRIES.filter((c) => scope === "mine" || c.code !== from).map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="how__result sheet" data-reveal="lift" aria-live="polite">
            <div className="sheet__head">
              <Label strong>{HOW.who}</Label>
              <span className="how__route"><span className="country__code">{from}</span><ArrowRight size={14} aria-hidden="true" /><span className="country__code">{target}</span></span>
            </div>
            <div className="sheet__body">
              <p className="how__found"><span className="how__found-n tabular">{n}</span>{HOW.found}</p>
              <ul className="how__rows">
                {rows.map(({ company: c, score }) => (
                  <li key={c.id} className="how__row">
                    <Monogram company={c} />
                    <div className="how__row-main">
                      <strong>{c.name}</strong>
                      <span><Country code={c.country} nameless /> {c.city} · {industryName(c.industry)}</span>
                    </div>
                    <Score value={score} size="1.75rem" />
                  </li>
                ))}
              </ul>
              <div className="how__foot">
                <Button to={`/app/expansion?from=${from}&to=${target}`} primary small>{HOW.cta}<ArrowRight /></Button>
                <span className="demo-note">{HOW.demo}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="how__next" data-reveal><i className="goutte" aria-hidden="true" />{HOW.next}</p>
      </div>
    </section>
  );
}
