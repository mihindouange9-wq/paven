import { Link } from "react-router-dom";
import { Country, Field, Monogram, Stamp } from "../../components/ui";
import { STAGES } from "../../content/fr";
import { companyById, DEAL_ROOMS } from "../../data/mock";
import type { DealStage } from "../../data/types";

const ORDER: DealStage[] = ["discovery", "conversation", "evaluation", "negotiation", "partnership"];

export function Stages({ stage }: { stage: DealStage }) {
  const i = ORDER.indexOf(stage);
  return <ol className="stages" aria-label={`Étape : ${STAGES[stage]}`}>{ORDER.map((s, j) => <li key={s} className={j < i ? "is-done" : j === i ? "is-current" : ""}>{STAGES[s]}</li>)}</ol>;
}

export function Component() {
  return (
    <>
      <header className="page-head"><h1>Deal Rooms</h1><p>Un espace par partenariat en construction : conversation, documents, accord de confidentialité, étapes, tâches et calendrier.</p></header>
      <div className="two-col two-col--even">
        {DEAL_ROOMS.map((d) => { const p = companyById(d.companies[1]); const done = d.tasks.filter((t) => t.done).length; return (
          <article key={d.id} className="panel">
            <div className="panel__head"><div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}><Monogram company={p} /><div><strong style={{ fontFamily: "var(--font-ui)" }}>{p.name}</strong><br /><span className="company-row__meta"><Country code={p.country} /></span></div></div><Stamp>{STAGES[d.stage]}</Stamp></div>
            <div className="panel__body">
              <Stages stage={d.stage} />
              <Field label="Objectif" value={d.objective} />
              <div className="facts">
                <Field label="Ouvert le" value={new Date(d.opened).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} />
                <Field label="Tâches" value={<span className="tabular">{done} / {d.tasks.length} faites</span>} />
                <Field label="Documents" value={<span className="tabular">{d.documents.length}</span>} />
                <Field label="Prochain rendez-vous" value={d.calendar[0] ? `${d.calendar[0].label}` : "À planifier"} />
              </div>
              <div className="profile-actions"><Link to={`/app/deal-rooms/${d.id}`} className="btn btn--small btn--primary">Ouvrir le Deal Room</Link></div>
            </div>
          </article>
        ); })}
      </div>
    </>
  );
}
