import { Link } from "react-router-dom";
import { Country, Monogram, PType, Score, Verifs } from "./ui";
import { industryName } from "../data/mock";
import type { Company } from "../data/types";

/** Ligne d'entreprise : monogramme, nom, pays, secteur, ce qu'elle offre et cherche, score. */
export default function CompanyRow({ company, score, note }: { company: Company; score?: number; note?: string }) {
  return (
    <Link to={`/app/entreprises/${company.id}`} className="company-row">
      <Monogram company={company} />
      <div className="company-row__main">
        <strong>{company.name}</strong>
        <span className="company-row__meta"><Country code={company.country} /> · {company.city} · {industryName(company.industry)} · {company.size} pers.</span>
        <Verifs levels={company.verification} compact />
        {note ? <span className="company-row__meta">{note}</span> : null}
        <div className="company-row__offers">{company.offers.slice(0, 3).map((o) => <span key={o}>{o}</span>)}</div>
      </div>
      <div className="company-row__side">
        {score !== undefined ? <Score value={score} size="1.75rem" /> : null}
        <PType id={company.partnershipTypes[0]} />
      </div>
    </Link>
  );
}

export function Reasons({ reasons }: { reasons: { label: string; score: number; explanation: string }[] }) {
  return (
    <ol className="reasons">
      {reasons.map((r) => (
        <li key={r.label} className="reason">
          <div className="reason__head"><span className="reason__score">{r.score} %</span><strong>{r.label}</strong></div>
          <span className="reason__bar" aria-hidden="true"><i style={{ width: `${r.score}%` }} /></span>
          <p>{r.explanation}</p>
        </li>
      ))}
    </ol>
  );
}
