import { Label } from "../../components/ui";
import { COUNTRIES, MATCHES, PARTNERSHIP_TYPES } from "../../data/mock";

export function Component() {
  const byType = PARTNERSHIP_TYPES.map((p) => ({ name: p.name, n: MATCHES.filter((m) => m.partnershipType === p.id).length + (p.id === "distributor" ? 7 : p.id === "supplier" ? 4 : p.id === "logistics" ? 2 : 1) }));
  const max = Math.max(...byType.map((b) => b.n));
  const top = [...COUNTRIES].sort((a, b) => b.stats.opportunities - a.stats.opportunities).slice(0, 6);
  return (
    <>
      <header className="page-head"><h1>Analytique</h1><p>Où va votre réseau : compatibilités par type de partenariat, marchés les plus actifs, rythme des conversations.</p></header>
      <div className="two-col two-col--even">
        <section className="panel"><div className="panel__head"><Label strong>Compatibilités par type</Label></div><div className="panel__body"><ul className="bars">{byType.map((b) => <li key={b.name}><span>{b.name}</span><i style={{ width: `${(b.n / max) * 100}%` }} /><span className="num tabular">{b.n}</span></li>)}</ul></div></section>
        <section className="panel"><div className="panel__head"><Label strong>Marchés les plus actifs</Label></div><div className="panel__body table-wrap"><table className="table"><thead><tr><th>Pays</th><th className="num">Entreprises</th><th className="num">Opportunités</th></tr></thead><tbody>{top.map((c) => <tr key={c.code}><td>{c.name}</td><td className="num">{c.stats.companies.toLocaleString("fr-FR")}</td><td className="num">{c.stats.opportunities.toLocaleString("fr-FR")}</td></tr>)}</tbody></table></div></section>
      </div>
    </>
  );
}
