import { PROBLEM } from "../content/fr";

const BUFF = "#D8C39A", SUNSET = "#E96A4F", OFF = "#F5F2EC", BATH = "#242124";

/* Quatre états du bain, un par constat : dispersé, voilé, en anneaux (vérifié), tiré vers l'autre (expansion). */
function Figure({ n }: { n: number }) {
  const common = { width: 96, height: 56, viewBox: "0 0 96 56", "aria-hidden": true as const, className: "problem__figure" };
  if (n === 0) return <svg {...common}><circle cx="14" cy="16" r="7" fill={BUFF} /><circle cx="52" cy="40" r="6" fill={SUNSET} /><circle cx="84" cy="12" r="5" fill={OFF} /><circle cx="36" cy="44" r="4" fill={OFF} /><circle cx="76" cy="38" r="4" fill={BUFF} /></svg>;
  if (n === 1) return <svg {...common}><circle cx="48" cy="28" r="22" fill={BUFF} /><circle cx="64" cy="30" r="20" fill={BATH} /><circle cx="48" cy="28" r="7" fill={SUNSET} /></svg>;
  if (n === 2) return <svg {...common}><circle cx="48" cy="28" r="24" fill={BUFF} /><circle cx="48" cy="28" r="16" fill={SUNSET} /><circle cx="48" cy="28" r="9" fill={OFF} /><circle cx="48" cy="28" r="3.5" fill={BUFF} /></svg>;
  return <svg {...common}><path d="M22 28a16 16 0 1 1 16 16c-10 0-26-8-36-16 10-8 26-16 36-16" fill={BUFF} /><path d="M26 28a12 12 0 1 1 12 12c-8 0-22-6-32-12 10-6 24-12 32-12" fill={SUNSET} /><circle cx="38" cy="28" r="5" fill={OFF} /><circle cx="82" cy="28" r="8" fill={BUFF} /><circle cx="82" cy="28" r="3.5" fill={OFF} /></svg>;
}

export default function Problem() {
  return (
    <section id="plateforme" className="section problem" data-tone="dark">
      <div className="container problem__grid">
        <h2 className="problem__title" data-reveal>{PROBLEM.title}</h2>
        <ul className="ledger problem__list">
          {PROBLEM.items.map((p, i) => (
            <li key={p.title} className="problem__item" data-reveal>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
              <Figure n={i} />
            </li>
          ))}
        </ul>
        <p className="problem__answer" data-reveal>PAVEN résout cette fragmentation.</p>
      </div>
    </section>
  );
}
