import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button, Field, PType } from "../components/ui";
import { NEED } from "../content/fr";
import { PARTNERSHIP_TYPES } from "../data/mock";
import type { PartnershipTypeId } from "../data/types";

/** « De quoi votre entreprise a-t-elle besoin ? » : dix types, un choix, la ligne du dossier se remplit. */
export default function Need() {
  const [need, setNeed] = useState<PartnershipTypeId | null>("distributor");
  const chosen = PARTNERSHIP_TYPES.find((p) => p.id === need);

  return (
    <section id="besoin" className="section need">
      <div className="container need__grid">
        <div className="need__copy">
          <h2 data-reveal>{NEED.title}</h2>
          <p className="lead" data-reveal>{NEED.lead}</p>
          <div className="need__line sheet" data-reveal>
            <div className="sheet__body">
              <Field label="Je cherche" value={chosen ? <PType id={chosen.id} /> : "—"} state={chosen ? "filled" : "empty"} large />
              <p className="need__desc">{chosen?.description ?? "Choisissez un type de partenariat."}</p>
              <Button to={`/app/decouvrir${need ? `?type=${need}` : ""}`} primary small>Voir les entreprises<ArrowRight /></Button>
            </div>
          </div>
        </div>
        <div className="need__types" role="radiogroup" aria-label="Type de partenariat recherché" data-reveal>
          {PARTNERSHIP_TYPES.map((p) => (
            <button key={p.id} type="button" role="radio" aria-checked={need === p.id} className={`need__type ${need === p.id ? "is-on" : ""}`} onClick={() => setNeed(p.id)}>
              <i className="ptype__mark" data-k={p.id} aria-hidden="true" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
