import { PROBLEM } from "../content/fr";

export default function Problem() {
  return (
    <section id="plateforme" className="section problem" data-tone="white">
      <div className="container problem__grid">
        <h2 className="problem__title" data-reveal>{PROBLEM.title}</h2>
        <ul className="ledger problem__list">
          {PROBLEM.items.map((p) => (
            <li key={p.title} className="problem__item" data-reveal>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
              <span className="field field--empty problem__empty" aria-hidden="true"><span className="field__value">—</span></span>
            </li>
          ))}
        </ul>
        <p className="problem__answer" data-reveal>PAVEN résout cette fragmentation.</p>
      </div>
    </section>
  );
}
