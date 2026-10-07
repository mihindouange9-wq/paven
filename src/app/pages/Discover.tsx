import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CompanyRow from "../../components/CompanyRow";
import { Label } from "../../components/ui";
import { COMPANIES, COUNTRIES, INDUSTRIES, MATCHES, PARTNERSHIP_TYPES, USER } from "../../data/mock";
import type { CompanySize, VerificationLevel } from "../../data/types";

const SIZES: CompanySize[] = ["1–10", "10–50", "50–100", "100–250", "250–1 000", "1 000+"];

/** « Découvrir des entreprises qui valent la conversation. » Filtres réels sur les données de démonstration. */
export function Component() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const country = params.get("pays") ?? "";
  const type = params.get("type") ?? "";
  const industry = params.get("secteur") ?? "";
  const size = params.get("taille") ?? "";
  const verif = params.get("verification") ?? "";
  const set = (k: string, v: string) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p, { replace: true }); };

  const list = useMemo(() => COMPANIES.filter((c) => c.id !== USER.company)
    .filter((c) => !country || c.country === country)
    .filter((c) => !type || c.partnershipTypes.includes(type as never))
    .filter((c) => !industry || c.industry === industry || c.secondaryIndustry === industry)
    .filter((c) => !size || c.size === size)
    .filter((c) => !verif || c.verification.includes(verif as VerificationLevel))
    .filter((c) => !q || `${c.name} ${c.city} ${c.description}`.toLowerCase().includes(q.toLowerCase())), [country, type, industry, size, verif, q]);
  const score = (id: string) => MATCHES.find((m) => m.to === id)?.score;

  return (
    <>
      <header className="page-head">
        <h1>Découvrez des entreprises qui valent la conversation.</h1>
        <p>Filtrez par pays, secteur, taille, type de partenariat ou niveau de vérification. Les scores affichés sont ceux calculés pour votre entreprise.</p>
      </header>

      <div className="filters" role="search">
        <div className="filters__row">
          <input className="input" type="search" placeholder="Nom, ville, activité" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher une entreprise" />
          <select className="input select" value={country} onChange={(e) => set("pays", e.target.value)} aria-label="Pays" style={{ maxWidth: "14rem" }}>
            <option value="">Tous les pays</option>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          <select className="input select" value={industry} onChange={(e) => set("secteur", e.target.value)} aria-label="Secteur" style={{ maxWidth: "14rem" }}>
            <option value="">Tous les secteurs</option>
            {INDUSTRIES.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <select className="input select" value={size} onChange={(e) => set("taille", e.target.value)} aria-label="Taille" style={{ maxWidth: "12rem" }}>
            <option value="">Toutes les tailles</option>
            {SIZES.map((s) => <option key={s} value={s}>{s} pers.</option>)}
          </select>
        </div>
        <div className="filters__row">
          <Label>Type de partenariat</Label>
          <div className="filters__group" role="group" aria-label="Type de partenariat">
            {PARTNERSHIP_TYPES.map((p) => <button key={p.id} type="button" className="chip" aria-pressed={type === p.id} onClick={() => set("type", type === p.id ? "" : p.id)}><i className="ptype__mark" data-k={p.id} aria-hidden="true" />{p.name}</button>)}
          </div>
        </div>
        <div className="filters__row">
          <Label>Vérification</Label>
          <div className="filters__group" role="group" aria-label="Niveau de vérification">
            {[["business", "Entreprise vérifiée"], ["information", "Informations vérifiées"], ["ready", "Prête au partenariat"]].map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={verif === k} onClick={() => set("verification", verif === k ? "" : k)}>{l}</button>)}
          </div>
        </div>
      </div>

      <section className="panel" aria-live="polite">
        <div className="panel__head"><Label strong>Résultats</Label><span className="label tabular">{list.length} entreprise{list.length > 1 ? "s" : ""}</span></div>
        <div className="panel__body">
          {list.length ? list.map((c) => <CompanyRow key={c.id} company={c} score={score(c.id)} />) : <p className="pipeline__empty">Aucune entreprise ne correspond à ces critères. Élargissez le pays ou retirez un filtre.</p>}
        </div>
      </section>
    </>
  );
}
