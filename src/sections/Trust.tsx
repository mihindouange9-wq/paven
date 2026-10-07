import { Check, Stamp } from "../components/ui";
import SectionStamp from "../components/SectionStamp";
import { TRUST } from "../content/fr";

/** « Des connexions d'affaires construites sur le contexte. » : six garanties, trois niveaux de vérification. */
export default function Trust() {
  return (
    <section id="confiance" className="section trust" data-tone="white">
      <div className="container trust__grid">
        <SectionStamp solid>Vérifié</SectionStamp>
        <div className="trust__copy">
          <h2 data-reveal>{TRUST.title}</h2>
          <p className="lead" data-reveal>{TRUST.lead}</p>
          <ol className="trust__levels" data-reveal aria-label="Niveaux de vérification">
            {TRUST.levels.map((l, i) => (
              <li key={l.title} className="trust__level">
                <Stamp solid={i === 2}>{l.title}</Stamp>
                <p>{l.text}</p>
              </li>
            ))}
          </ol>
          <p className="demo-note" data-reveal>Aucune certification n'est inventée : chaque niveau décrit ce qui a réellement été confirmé.</p>
        </div>
        <ul className="ledger trust__list">
          {TRUST.items.map((t) => (
            <li key={t.title} className="trust__item" data-reveal>
              <span className="trust__check"><Check size={16} /></span>
              <div>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
