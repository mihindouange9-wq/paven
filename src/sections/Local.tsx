import { ArrowRight } from "lucide-react";
import { Button, Country, Monogram, PType, Score } from "../components/ui";
import { LOCAL } from "../content/fr";
import { companyById } from "../data/mock";

const HOPS = [
  { city: "Libreville", note: "Siège · Gabon Fresh Foods" },
  { city: "Port-Gentil", note: "Ogooué Services · fournisseur · 82 %" },
  { city: "Franceville", note: "Haut-Ogooué Agri · fournisseur · 79 %" },
];

/** « Grandir plus près de chez soi. » : la même mécanique, dans son propre pays. */
export default function Local() {
  const og = companyById("ogooue-services");
  return (
    <section id="local" className="section local">
      <div className="container local__grid">
        <div className="local__copy">
          <h2 data-reveal>{LOCAL.title}</h2>
          <p className="lead" data-reveal>{LOCAL.lead}</p>
          <ul className="local__needs" data-reveal aria-label="Ce qu'une entreprise peut chercher près de chez elle">
            {(["supplier", "distributor", "subcontractor", "commercial"] as const).map((id) => <li key={id}><PType id={id} /></li>)}
          </ul>
        </div>
        <div className="local__route" data-reveal>
          <svg className="local__line" viewBox="0 0 24 400" preserveAspectRatio="none" aria-hidden="true"><path d="M12 10V390" fill="none" stroke="currentColor" strokeWidth="1.5" data-draw /></svg>
          <ol className="local__hops">
            {HOPS.map((h, i) => (
              <li key={h.city} className={`local__hop ${i === 0 ? "local__hop--origin" : ""}`}>
                <span className="local__dot" aria-hidden="true" />
                <div>
                  <strong className="local__city">{h.city}<Country code="GA" nameless /></strong>
                  <span className="local__note">{h.note}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="local__card sheet">
            <div className="sheet__body local__card-body">
              <Monogram company={og} />
              <div>
                <strong>{og.name}</strong>
                <span className="local__note">{og.city} · {og.offers[0]}</span>
              </div>
              <Score value={82} size="1.75rem" />
            </div>
          </div>
          <Button to="/app/decouvrir?pays=GA" small>Voir les entreprises au Gabon<ArrowRight /></Button>
        </div>
      </div>
    </section>
  );
}
