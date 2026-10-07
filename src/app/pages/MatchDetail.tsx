import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reasons } from "../../components/CompanyRow";
import { Button, Country, Field, Label, Monogram, PType, Score, Stamp, Verifs } from "../../components/ui";
import { companyById, industryName, MATCHES } from "../../data/mock";

export function Component() {
  const { id } = useParams();
  const m = MATCHES.find((x) => x.id === id) ?? MATCHES[0];
  const c = companyById(m.to);
  const me = companyById(m.from);
  return (
    <>
      <header className="page-head">
        <Link to="/app/compatibilites" className="label">← Compatibilités</Link>
        <div className="page-head__row">
          <div className="profile-head">
            <Monogram company={c} large />
            <div>
              <h1>{c.name}</h1>
              <p className="profile-head__meta"><Country code={c.country} /> · {c.city} · {industryName(c.industry)}{c.secondaryIndustry ? ` / ${industryName(c.secondaryIndustry)}` : ""}</p>
              <Verifs levels={c.verification} compact />
            </div>
          </div>
          <div style={{ display: "grid", justifyItems: "end", gap: "0.5rem" }}>
            <Score value={m.score} size="4rem" accent />
            <Stamp solid>{m.score} % compatible</Stamp>
          </div>
        </div>
      </header>

      <div className="two-col">
        <section className="panel">
          <div className="panel__head"><Label strong>Pourquoi cette compatibilité ?</Label><PType id={m.partnershipType} /></div>
          <div className="panel__body">
            <p style={{ marginBottom: "0.5rem" }}>{m.summary}</p>
            <Reasons reasons={m.reasons} />
            <div className="profile-actions">
              <Button to={`/app/messages?avec=${c.id}`} primary>Démarrer la conversation<ArrowRight /></Button>
              <Button to={`/app/entreprises/${c.id}`}>Voir le profil complet</Button>
            </div>
          </div>
        </section>
        <section className="panel">
          <div className="panel__head"><Label strong>Les deux dossiers</Label></div>
          <div className="panel__body">
            <Field label="Votre entreprise" value={<>{me.name} · {me.city}</>} state="filled" />
            <Field label="Vous cherchez" value={me.lookingFor.join(" · ")} />
            <Field label="Partenaire proposé" value={<>{c.name} · {c.city}</>} state="filled" />
            <Field label="Il cherche" value={c.lookingFor.join(" · ")} />
            <Field label="Il offre" value={c.offers.join(" · ")} />
            <Field label="Compatibilité calculée le" value={new Date(m.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} />
          </div>
        </section>
      </div>
    </>
  );
}
