import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CompanyRow from "../../components/CompanyRow";
import { Button, Country, Field, Label, PType, Stamp } from "../../components/ui";
import { STAGES } from "../../content/fr";
import { companyById, CONVERSATIONS, DEAL_ROOMS, EXPANSIONS, MATCHES, OPPORTUNITIES, USER } from "../../data/mock";

export function Component() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const newMatches = MATCHES.filter((m) => m.status !== "contacted");
  const active = CONVERSATIONS.length;
  const unread = CONVERSATIONS.reduce((n, c) => n + c.unread, 0);
  const dr = DEAL_ROOMS[0];

  return (
    <>
      <header className="page-head">
        <h1>{greeting}, {USER.name.split(" ")[0]}. Votre réseau d'affaires grandit.</h1>
        <p>{companyById(USER.company).name} · {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
      </header>

      <ul className="counters" aria-label="Chiffres du jour">
        <li><Link to="/app/compatibilites" className="counter"><span className="counter__n counter__n--accent">{newMatches.length + 9}</span><Label>nouvelles compatibilités</Label></Link></li>
        <li><Link to="/app/opportunites" className="counter"><span className="counter__n">{OPPORTUNITIES.length - 2}</span><Label>nouvelles opportunités</Label></Link></li>
        <li><Link to="/app/messages" className="counter"><span className="counter__n">{active}</span><Label>conversations actives{unread ? ` · ${unread} non lus` : ""}</Label></Link></li>
        <li><Link to="/app/expansion" className="counter"><span className="counter__n">{EXPANSIONS.length}</span><Label>marchés d'expansion</Label></Link></li>
      </ul>

      <div className="two-col">
        <section className="panel" aria-labelledby="reco">
          <div className="panel__head"><Label strong><span id="reco">Partenaires recommandés</span></Label><Link to="/app/compatibilites" className="label">Tout voir</Link></div>
          <div className="panel__body">
            {MATCHES.slice(0, 3).map((m) => <CompanyRow key={m.id} company={companyById(m.to)} score={m.score} note={m.summary} />)}
          </div>
        </section>

        <div style={{ display: "grid", gap: "1.75rem" }}>
          <section className="panel panel--dark" aria-labelledby="dossier">
            <div className="panel__head"><Label strong><span id="dossier">Dossier en cours</span></Label><Stamp>{STAGES[dr.stage]}</Stamp></div>
            <div className="panel__body">
              <Field label="Partenaire" value={companyById(dr.companies[1]).name} state="filled" />
              <Field label="Objectif" value={dr.objective} />
              <Field label="Prochaine étape" value={`${dr.calendar[0].label} · ${new Date(dr.calendar[0].date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`} />
              <div style={{ marginTop: "1rem" }}><Button to={`/app/deal-rooms/${dr.id}`} light small>Ouvrir le Deal Room<ArrowRight /></Button></div>
            </div>
          </section>

          <section className="panel" aria-labelledby="exp">
            <div className="panel__head"><Label strong><span id="exp">Expansion</span></Label><Link to="/app/expansion" className="label">Gérer</Link></div>
            <div className="panel__body">
              {EXPANSIONS.map((e) => (
                <div key={e.id} className="field">
                  <Label>{e.fromCity} → {e.toCity}</Label>
                  <div className="field__value" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
                    <span><Country code={e.to} /></span>
                    <span className="tabular" style={{ color: "var(--sunset-ink)" }}>{e.found} entreprises</span>
                  </div>
                  <PType id={e.partnershipType} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
