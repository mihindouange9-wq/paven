import { useState } from "react";
import { Link } from "react-router-dom";
import { Label, Monogram } from "../../components/ui";
import { PIPELINE_STAGES } from "../../content/fr";
import { companyById, PIPELINE, PIPELINE_COUNTS } from "../../data/mock";
import type { PipelineEntry, PipelineStage } from "../../data/types";

const ORDER: PipelineStage[] = ["potential", "contacted", "discussion", "negotiation", "active"];

export function Component() {
  const [entries, setEntries] = useState<PipelineEntry[]>(PIPELINE);
  const move = (company: string, dir: 1 | -1) => setEntries((all) => all.map((e) => (e.company === company ? { ...e, stage: ORDER[Math.min(ORDER.length - 1, Math.max(0, ORDER.indexOf(e.stage) + dir))] } : e)));
  return (
    <>
      <header className="page-head"><h1>Mes partenariats</h1><p>Le pipeline, de l'entreprise potentielle au partenariat actif. Déplacez une entreprise d'une étape à l'autre.</p></header>
      <ul className="counters counters--5" aria-label="Totaux">
        {ORDER.map((s) => <li key={s} className="counter"><span className={`counter__n ${s === "active" ? "counter__n--accent" : ""}`}>{PIPELINE_COUNTS[s]}</span><Label>{PIPELINE_STAGES[s]}</Label></li>)}
      </ul>
      <div className="pipeline">
        {ORDER.map((s) => { const col = entries.filter((e) => e.stage === s); return (
          <section key={s} className="pipeline__col" aria-label={PIPELINE_STAGES[s]}>
            <div className="pipeline__col-head"><Label strong>{PIPELINE_STAGES[s]}</Label><span className="label tabular">{col.length}</span></div>
            {col.length ? col.map((e) => { const c = companyById(e.company); return (
              <article key={e.company} className="pipeline__card">
                <Monogram company={c} />
                <div>
                  <Link to={`/app/entreprises/${c.id}`} style={{ textDecoration: "none" }}><strong>{c.name}</strong></Link>
                  <span className="tabular">{e.score} % · depuis le {new Date(e.since).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                  <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.4rem" }}>
                    <button type="button" className="chip" onClick={() => move(e.company, -1)} disabled={s === "potential"} aria-label={`Reculer ${c.name}`}>←</button>
                    <button type="button" className="chip" onClick={() => move(e.company, 1)} disabled={s === "active"} aria-label={`Avancer ${c.name}`}>→</button>
                  </div>
                </div>
              </article>
            ); }) : <p className="pipeline__empty">Aucune entreprise à cette étape.</p>}
          </section>
        ); })}
      </div>
    </>
  );
}
