import { Country, PType } from "../components/ui";
import { CROSS } from "../content/fr";
import type { PartnershipTypeId } from "../data/types";

const PAIRS: { a: string; b: string; type: PartnershipTypeId; note: string }[] = [
  { a: "GA", b: "CM", type: "distributor", note: "Agroalimentaire · 94 %" },
  { a: "SN", b: "MA", type: "manufacturer", note: "Emballages · 89 %" },
  { a: "NG", b: "GH", type: "distributor", note: "Boissons · 87 %" },
  { a: "KE", b: "RW", type: "technology", note: "Intégration · 92 %" },
];

/** « Franchir les frontières. Rester local. » : quatre paires de marchés, une route chacune. */
export default function Cross() {
  return (
    <section id="transfrontalier" className="section cross" data-tone="buff">
      <div className="container">
        <header className="cross__head">
          <h2 data-reveal>{CROSS.title}</h2>
          <p className="lead" data-reveal>{CROSS.lead}</p>
        </header>
        <ul className="cross__pairs">
          {PAIRS.map((p) => (
            <li key={p.a + p.b} className="cross__pair" data-reveal>
              <Country code={p.a} filled />
              <svg className="cross__link" viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 12h192" fill="none" stroke="currentColor" strokeWidth="1.5" data-draw />
                <path d="M100 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0" fill="currentColor" />
              </svg>
              <Country code={p.b} filled />
              <span className="cross__note"><PType id={p.type} /><span className="tabular">{p.note}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
