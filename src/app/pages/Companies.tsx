import { useState } from "react";
import CompanyRow from "../../components/CompanyRow";
import { Label } from "../../components/ui";
import { COMPANIES, COUNTRIES, MATCHES, USER } from "../../data/mock";

export function Component() {
  const [region, setRegion] = useState("");
  const regions = [...new Set(COUNTRIES.map((c) => c.region))];
  const list = COMPANIES.filter((c) => c.id !== USER.company).filter((c) => !region || COUNTRIES.find((k) => k.code === c.country)?.region === region);
  return (
    <>
      <header className="page-head">
        <h1>Entreprises</h1>
        <p>Toutes les entreprises vérifiées du réseau, par région. Les profils décrivent ce que chaque entreprise offre et cherche.</p>
      </header>
      <div className="filters__row">
        <Label>Région</Label>
        <div className="filters__group" role="group" aria-label="Région">
          <button type="button" className="chip" aria-pressed={region === ""} onClick={() => setRegion("")}>Toute l'Afrique</button>
          {regions.map((r) => <button key={r} type="button" className="chip" aria-pressed={region === r} onClick={() => setRegion(r)}>{r}</button>)}
        </div>
      </div>
      <section className="panel" aria-live="polite">
        <div className="panel__head"><Label strong>Réseau</Label><span className="label tabular">{list.length} entreprises</span></div>
        <div className="panel__body">{list.map((c) => <CompanyRow key={c.id} company={c} score={MATCHES.find((m) => m.to === c.id)?.score} />)}</div>
      </section>
    </>
  );
}
