import { Link } from "react-router-dom";
import { Country, Label, Monogram, PType, Score, Stamp } from "../../components/ui";
import { companyById, industryName, MATCHES } from "../../data/mock";

const STATUS: Record<string, string> = { new: "Nouvelle", viewed: "Consultée", contacted: "Contactée" };

export function Component() {
  return (
    <>
      <header className="page-head">
        <h1>Compatibilités</h1>
        <p>Chaque score est expliqué critère par critère. Ouvrez une compatibilité pour lire pourquoi elle tient, puis démarrez la conversation.</p>
      </header>
      <section className="panel">
        <div className="panel__head"><Label strong>Pour Gabon Fresh Foods</Label><span className="label tabular">{MATCHES.length} compatibilités</span></div>
        <div className="panel__body table-wrap">
          <table className="table">
            <thead><tr><th>Entreprise</th><th>Type</th><th>Résumé</th><th>Statut</th><th className="num">Score</th></tr></thead>
            <tbody>
              {MATCHES.map((m) => { const c = companyById(m.to); return (
                <tr key={m.id}>
                  <td><Link to={`/app/compatibilites/${m.id}`} style={{ display: "flex", gap: "0.75rem", alignItems: "center", textDecoration: "none" }}><Monogram company={c} /><span><strong style={{ fontFamily: "var(--font-ui)" }}>{c.name}</strong><br /><span className="company-row__meta"><Country code={c.country} /> · {industryName(c.industry)}</span></span></Link></td>
                  <td><PType id={m.partnershipType} /></td>
                  <td style={{ color: "var(--ink-muted)", maxWidth: "26rem" }}>{m.summary}</td>
                  <td>{m.status === "new" ? <Stamp>{STATUS[m.status]}</Stamp> : <span className="label">{STATUS[m.status]}</span>}</td>
                  <td className="num"><Score value={m.score} size="1.5rem" /></td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
