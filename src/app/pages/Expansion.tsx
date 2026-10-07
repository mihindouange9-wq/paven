import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AfricaMap from "../../components/AfricaMap";
import CompanyRow from "../../components/CompanyRow";
import { Button, Country, Label, PType } from "../../components/ui";
import { CITIES, COMPANIES, COUNTRIES, countryByCode, PARTNERSHIP_TYPES, USER } from "../../data/mock";
import type { CountryCode, PartnershipTypeId } from "../../data/types";

/** Expansion : Depuis → Vers → Objectif, puis « PAVEN a trouvé n entreprises », avec la route tracée sur la carte. */
export function Component() {
  const [params] = useSearchParams();
  const [from, setFrom] = useState<CountryCode>((params.get("from") as CountryCode) || "GA");
  const [to, setTo] = useState<CountryCode>((params.get("to") as CountryCode) || "CM");
  const [type, setType] = useState<PartnershipTypeId>("distributor");
  const [launched, setLaunched] = useState(true);
  const results = useMemo(() => COMPANIES.filter((c) => c.id !== USER.company && c.country === to), [to]);
  const fromCity = CITIES.find((c) => c.country === from)!;
  const toCity = CITIES.find((c) => c.country === to)!;
  const found = Math.max(results.length, Math.round(countryByCode(to).stats.companies / 180));

  return (
    <>
      <header className="page-head"><h1>Expansion</h1><p>Développez-vous sans repartir de zéro : dites d'où vous partez, où vous allez, ce que vous cherchez.</p></header>
      <div className="two-col">
        <section className="panel">
          <div className="panel__head"><Label strong>Demande d'expansion</Label><span className="label">{fromCity.name} → {toCity.name}</span></div>
          <div className="panel__body">
            <form className="expansion-form" onSubmit={(e) => { e.preventDefault(); setLaunched(true); }}>
              <div className="expansion-form__row">
                <label className="field"><span className="label">Depuis</span><select className="input select" value={from} onChange={(e) => { setFrom(e.target.value as CountryCode); setLaunched(false); }}>{COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select></label>
                <label className="field"><span className="label">Vers</span><select className="input select" value={to} onChange={(e) => { setTo(e.target.value as CountryCode); setLaunched(false); }}>{COUNTRIES.filter((c) => c.code !== from).map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select></label>
                <label className="field"><span className="label">Objectif</span><select className="input select" value={type} onChange={(e) => { setType(e.target.value as PartnershipTypeId); setLaunched(false); }}>{PARTNERSHIP_TYPES.map((p) => <option key={p.id} value={p.id}>{p.verb}</option>)}</select></label>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <Button type="submit" primary small>Lancer l'analyse</Button>
                <span className="company-row__meta"><Country code={from} /> → <Country code={to} /> · <PType id={type} /></span>
              </div>
            </form>
            <div style={{ marginTop: "1.5rem" }}><AfricaMap highlight={[fromCity.id, toCity.id]} routes={[[fromCity.id, toCity.id]]} labels /></div>
          </div>
        </section>
        <section className="panel" aria-live="polite">
          <div className="panel__head"><Label strong>{launched ? `PAVEN a trouvé ${found} entreprises compatibles` : "Analyse en attente"}</Label><Country code={to} filled /></div>
          <div className="panel__body">
            {launched ? (results.length ? results.map((c, i) => <CompanyRow key={c.id} company={c} score={Math.max(62, 94 - i * 6)} />) : <p className="pipeline__empty">Aucune entreprise de démonstration dans ce pays. Les {found} résultats estimés viennent des chiffres de marché.</p>) : <p className="pipeline__empty">Modifiez votre demande, puis lancez l'analyse.</p>}
          </div>
        </section>
      </div>
    </>
  );
}
