import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button, Country, Field } from "../components/ui";
import { WHERE } from "../content/fr";
import { COUNTRIES, countryByCode } from "../data/mock";
import type { CountryCode } from "../data/types";

/** « Où voulez-vous aller ? » : mon pays, ou un autre marché africain. Depuis → Vers. */
export default function Where() {
  const [scope, setScope] = useState<"mine" | "other">("other");
  const [from, setFrom] = useState<CountryCode>("GA");
  const [to, setTo] = useState<CountryCode>("CM");
  const target = scope === "mine" ? from : to;
  const t = countryByCode(target);

  return (
    <section id="marches-cibles" className="section where" data-tone="buff">
      <div className="container">
        <header className="where__head">
          <h2 data-reveal>{WHERE.title}</h2>
          <div className="where__scope" role="radiogroup" aria-label="Portée de la recherche" data-reveal>
            <button type="button" role="radio" aria-checked={scope === "mine"} className={`chip ${scope === "mine" ? "is-on" : ""}`} onClick={() => setScope("mine")}>{WHERE.mine}</button>
            <button type="button" role="radio" aria-checked={scope === "other"} className={`chip ${scope === "other" ? "is-on" : ""}`} onClick={() => setScope("other")}>{WHERE.other}</button>
          </div>
        </header>

        <div className="where__grid">
          <div className="where__sheet sheet" data-reveal>
            <div className="sheet__body">
              <div className="where__fromto">
                <label className="field">
                  <span className="label">{WHERE.from}</span>
                  <select className="input select where__select" value={from} onChange={(e) => setFrom(e.target.value as CountryCode)}>
                    {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </label>
                <svg className="where__arrow" viewBox="0 0 24 64" aria-hidden="true"><path d="M12 2v52M4 46l8 10 8-10" fill="none" stroke="currentColor" strokeWidth="1.5" data-draw /></svg>
                <label className={`field ${scope === "mine" ? "field--empty" : ""}`}>
                  <span className="label">{WHERE.to}</span>
                  <select className="input select where__select" value={to} disabled={scope === "mine"} onChange={(e) => setTo(e.target.value as CountryCode)}>
                    {COUNTRIES.filter((c) => c.code !== from).map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </label>
              </div>
              <Field label="Marché visé" value={<Country code={target} filled />} state="filled" large />
              <ul className="where__stats">
                <li><span className="tabular">{t.stats.companies.toLocaleString("fr-FR")}</span><span className="label">entreprises</span></li>
                <li><span className="tabular">{t.stats.opportunities.toLocaleString("fr-FR")}</span><span className="label">opportunités</span></li>
                <li><span className="tabular">{t.stats.connectedMarkets}</span><span className="label">marchés connectés</span></li>
              </ul>
              <Button to={`/app/expansion?from=${from}&to=${target}`} primary small>Voir les partenaires<ArrowRight /></Button>
            </div>
          </div>

          <div className="where__list" data-reveal>
            <p className="label label--strong">{WHERE.expandTo}</p>
            <ul className="where__countries">
              {COUNTRIES.map((c) => (
                <li key={c.code}>
                  <button type="button" className={`where__country ${target === c.code ? "is-on" : ""}`} onClick={() => (scope === "mine" ? setFrom(c.code) : setTo(c.code))} aria-pressed={target === c.code}>
                    <Country code={c.code} filled={target === c.code} />
                    <span className="where__region">{c.region}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
