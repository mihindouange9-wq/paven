import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reasons } from "../../components/CompanyRow";
import { Button, Country, Field, Label, Monogram, PType, Score, Stamp, Verifs } from "../../components/ui";
import { companyById, COMPANIES, countryByCode, industryName, MATCHES, VERIFICATIONS } from "../../data/mock";

export function Component() {
  const { id } = useParams();
  const c = COMPANIES.find((x) => x.id === id) ?? companyById("agrodistrib-cameroon");
  const m = MATCHES.find((x) => x.to === c.id);
  const k = countryByCode(c.country);
  return (
    <>
      <header className="page-head">
        <Link to="/app/entreprises" className="label">← Entreprises</Link>
        <div className="page-head__row">
          <div className="profile-head">
            <Monogram company={c} large />
            <div>
              <h1>{c.name}</h1>
              <p className="profile-head__meta"><Country code={c.country} /> · {c.city} · {industryName(c.industry)}{c.secondaryIndustry ? ` / ${industryName(c.secondaryIndustry)}` : ""} · fondée en {c.founded}</p>
              <Verifs levels={c.verification} />
              <div className="profile-actions">
                <Button to={`/app/messages?avec=${c.id}`} primary>Démarrer la conversation<ArrowRight /></Button>
                {m ? <Button to={`/app/compatibilites/${m.id}`}>Voir pourquoi {m.score} %</Button> : null}
              </div>
            </div>
          </div>
          {m ? <div style={{ display: "grid", justifyItems: "end", gap: "0.5rem" }}><Score value={m.score} size="4rem" accent /><Stamp solid>compatible</Stamp></div> : null}
        </div>
      </header>

      <div className="two-col">
        <div style={{ display: "grid", gap: "1.75rem" }}>
          <section className="panel panel--sheet">
            <div className="panel__head"><Label strong>Fiche entreprise</Label><span className="label tabular">Réf. {c.id.toUpperCase().slice(0, 12)}</span></div>
            <div className="panel__body">
              <p style={{ marginBottom: "0.75rem" }}>{c.description}</p>
              <div className="facts">
                <Field label="Effectifs" value={`${c.size} personnes`} />
                <Field label="Implantation" value={`${c.city}, ${k.name}`} />
                <Field label="Marchés" value={c.markets.join(" · ")} />
                <Field label="Devise" value={k.currency} />
                <Field label="Secteur" value={industryName(c.industry)} />
                <Field label="Types de partenariat" value={<span style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>{c.partnershipTypes.map((p) => <PType key={p} id={p} />)}</span>} />
              </div>
            </div>
          </section>
          {m ? (
            <section className="panel">
              <div className="panel__head"><Label strong>Compatibilité avec votre entreprise</Label><Score value={m.score} size="1.5rem" /></div>
              <div className="panel__body"><Reasons reasons={m.reasons} /></div>
            </section>
          ) : null}
        </div>
        <div style={{ display: "grid", gap: "1.75rem" }}>
          <section className="panel">
            <div className="panel__head"><Label strong>Elle cherche</Label></div>
            <div className="panel__body"><ul className="list-plain">{c.lookingFor.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </section>
          <section className="panel">
            <div className="panel__head"><Label strong>Elle offre</Label></div>
            <div className="panel__body"><ul className="list-plain">{c.offers.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </section>
          <section className="panel panel--dark">
            <div className="panel__head"><Label strong>Vérification</Label></div>
            <div className="panel__body">
              {(["business", "information", "ready"] as const).map((l) => (
                <Field key={l} label={VERIFICATIONS[l].label} value={c.verification.includes(l) ? `${VERIFICATIONS[l].description} · ${new Date(VERIFICATIONS[l].date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}` : "Non vérifié à ce jour"} state={c.verification.includes(l) ? "filled" : "plain"} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
