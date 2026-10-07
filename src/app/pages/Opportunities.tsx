import { Link } from "react-router-dom";
import { Country, Field, Label, Monogram, PType, Score } from "../../components/ui";
import { companyById, OPPORTUNITIES } from "../../data/mock";

export function Component() {
  return (
    <>
      <header className="page-head">
        <h1>Opportunités d'affaires</h1>
        <p>Des entreprises ont décrit ce qu'elles cherchent et où. Chaque opportunité porte sa compatibilité estimée avec votre entreprise.</p>
      </header>
      <div className="two-col two-col--even">
        {OPPORTUNITIES.map((o) => { const c = companyById(o.company); return (
          <article key={o.id} className="panel">
            <div className="panel__head"><Label strong>{o.title}</Label><Score value={o.fit} size="1.5rem" /></div>
            <div className="panel__body">
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.5rem" }}><Monogram company={c} /><div><strong style={{ fontFamily: "var(--font-ui)" }}>{c.name}</strong><br /><span className="company-row__meta"><Country code={c.country} /> · {c.city}</span></div></div>
              <p style={{ color: "var(--ink-muted)", marginBottom: "0.5rem" }}>{o.summary}</p>
              <div className="facts">
                <Field label="Recherche" value={<PType id={o.partnershipType} />} />
                <Field label="Marché" value={<Country code={o.market} filled />} />
                <Field label="Publiée le" value={new Date(o.posted).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} />
                <Field label="Compatibilité estimée" value={<span className="tabular">{o.fit} %</span>} state="filled" />
              </div>
              <div className="profile-actions"><Link to={`/app/entreprises/${c.id}`} className="btn btn--small">Voir l'entreprise</Link><Link to={`/app/messages?avec=${c.id}`} className="btn btn--small btn--primary">Répondre</Link></div>
            </div>
          </article>
        ); })}
      </div>
    </>
  );
}
