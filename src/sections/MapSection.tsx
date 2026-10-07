import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AfricaMap from "../components/AfricaMap";
import { Button, Country, Field, Label } from "../components/ui";
import { MAP } from "../content/fr";
import { COUNTRIES, countryByCode } from "../data/mock";
import type { CountryCode } from "../data/types";

/** « Un continent. Des milliers d'opportunités. » : choisir un pays, lire ses chiffres et ses marchés connectés. */
export default function MapSection() {
  const [code, setCode] = useState<CountryCode>("GA");
  const c = countryByCode(code);
  const n = (v: number) => v.toLocaleString("fr-FR");

  return (
    <section id="marches" className="section map" data-tone="white">
      <div className="container">
        <header className="map__head">
          <h2 data-reveal>{MAP.title}</h2>
          <p className="lead" data-reveal>{MAP.lead}</p>
        </header>
        <div className="map__grid">
          <div className="map__canvas" data-reveal>
            <AfricaMap selected={code} onSelect={setCode} />
            <ul className="map__picker" aria-label="Choisir un pays">
              {COUNTRIES.map((x) => (
                <li key={x.code}>
                  <button type="button" className={`chip ${x.code === code ? "is-on" : ""}`} aria-pressed={x.code === code} onClick={() => setCode(x.code)}>{x.name}</button>
                </li>
              ))}
            </ul>
          </div>
          <aside className="map__sheet sheet" data-reveal aria-live="polite">
            <div className="sheet__head">
              <Label strong>Marché</Label>
              <Country code={code} filled />
            </div>
            <div className="sheet__body">
              <Field label={MAP.companies} value={<span className="tabular">{n(c.stats.companies)}</span>} large />
              <Field label={MAP.opportunities} value={<span className="tabular">{n(c.stats.opportunities)}</span>} large />
              <Field label={MAP.requests} value={<span className="tabular">{n(c.stats.requests)}</span>} large />
              <Field label={MAP.connected} value={<span className="tabular">{c.stats.connectedMarkets}</span>} large />
              <div className="map__connected">
                <Label>Marchés les plus connectés</Label>
                <ul>
                  {c.connected.map((k) => (
                    <li key={k}><button type="button" className="map__link" onClick={() => setCode(k)}><Country code={k} /><ArrowRight size={14} /></button></li>
                  ))}
                </ul>
              </div>
              <p className="demo-note">Chiffres de démonstration.</p>
              <Button to={`/app/decouvrir?pays=${code}`} small>Voir les entreprises · {c.name}<ArrowRight /></Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
