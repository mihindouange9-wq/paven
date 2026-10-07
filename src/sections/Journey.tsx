import { useRef } from "react";
import { JOURNEY } from "../content/fr";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";

/** Six étapes sur une seule route : le jeton de l'entreprise avance au défilement, de Libreville à Douala. */
export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 960px)", () => {
        gsap.fromTo(".journey__token", { left: "0%" }, { left: "100%", ease: "none", scrollTrigger: { trigger: ".journey__track", start: "top 60%", end: "bottom 40%", scrub: 0.6 } });
        gsap.fromTo(".journey__fill", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".journey__track", start: "top 60%", end: "bottom 40%", scrub: 0.6 } });
      });
      mm.add("(max-width: 959px)", () => {
        gsap.fromTo(".journey__fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".journey__track", start: "top 60%", end: "bottom 40%", scrub: 0.6 } });
      });
    },
    { scope: root },
  );

  return (
    <section id="parcours" className="section journey" data-tone="white" ref={root}>
      <div className="container">
        <header className="journey__head">
          <h2 data-reveal>{JOURNEY.title}</h2>
          <p className="journey__route" data-reveal><span className="country__code">GA</span>Libreville <span aria-hidden="true">→</span> Douala<span className="country__code">CM</span></p>
        </header>
        <div className="journey__track">
          <span className="journey__line" aria-hidden="true"><i className="journey__fill" /></span>
          <span className="journey__token" aria-hidden="true">GF</span>
          <ol className="journey__steps">
            {JOURNEY.steps.map((s, i) => (
              <li key={s.title} className="journey__step" data-reveal>
                <span className="journey__n tabular" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
