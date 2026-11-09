import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AfricaMap from "../components/AfricaMap";
import { Button, Country, Label } from "../components/ui";
import { MAP } from "../content/fr";
import { COUNTRIES, countryByCode } from "../data/mock";
import type { CountryCode } from "../data/types";

/** Les marchés : on choisit un pays (sur la carte ou dans la liste), ses chiffres et ses marchés connectés suivent. */
export default function MapSection() {
  const [code, setCode] = useState<CountryCode>("GA");
  const c = countryByCode(code);
  const n = (v: number) => v.toLocaleString("fr-FR");
  const stats: [string, string][] = [
    [MAP.companies, n(c.stats.companies)],
    [MAP.opportunities, n(c.stats.opportunities)],
    [MAP.requests, n(c.stats.requests)],
    [MAP.connected, String(c.stats.connectedMarkets)],
  ];

  return (
    <section id="marches" className="scene map" data-scene data-tone="dark" tabIndex={-1}>
      <div className="container map__grid">
        <div className="map__copy">
          <h2 data-reveal="lines">{MAP.title}</h2>
          <p className="lead" data-reveal>{MAP.lead}</p>

          <aside className="map__sheet sheet" data-reveal="lift" aria-live="polite">
            <div className="sheet__head">
              <label className="map__pick">
                <span className="label label--strong">Marché</span>
                <select className="input select map__select" value={code} onChange={(e) => setCode(e.target.value as CountryCode)}>
                  {COUNTRIES.map((x) => <option key={x.code} value={x.code}>{x.name}</option>)}
                </select>
              </label>
              <span className="label">{c.region}</span>
            </div>
            <div className="sheet__body">
              <dl className="map__stats">
                {stats.map(([label, value]) => (
                  <div key={label}>
                    <dt className="label">{label}</dt>
                    <dd className="tabular">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="map__connected">
                <Label>Marchés les plus connectés</Label>
                <ul>
                  {c.connected.slice(0, 3).map((k) => (
                    <li key={k}><button type="button" className="map__link" onClick={() => setCode(k)}><Country code={k} /></button></li>
                  ))}
                </ul>
              </div>
              <div className="map__foot">
                <Button to={`/app/decouvrir?pays=${code}`} small>Voir les entreprises · {c.name}<ArrowRight /></Button>
                <span className="demo-note">Chiffres de démonstration.</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="map__canvas" data-reveal>
          <AfricaMap selected={code} onSelect={setCode} />
        </div>
      </div>
    </section>
  );
}
