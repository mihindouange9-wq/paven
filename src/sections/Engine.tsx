import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button, Check, Country, Label, Monogram, PType, Score, Stamp, Verifs } from "../components/ui";
import { ENGINE } from "../content/fr";
import { companyById, industryName, MATCHES } from "../data/mock";
import { gsap, prefersReducedMotion, ScrollTrigger, stampIn, useGSAP } from "../lib/motion";

/** Le moteur : un match expliqué critère par critère. Les barres se remplissent, le score monte, le tampon se pose. */
export default function Engine() {
  const root = useRef<HTMLElement>(null);
  const match = MATCHES[0];
  const partner = companyById(match.to);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const counter = { n: 0 };
      const cells = root.current!.querySelectorAll<HTMLElement>(".engine__score .score__cell");
      const show = () => { const s = String(Math.round(counter.n)).padStart(2, "0"); cells.forEach((c, i) => (c.textContent = s[i] ?? "")); };
      gsap.set(".engine__bar i", { scaleX: 0 });
      gsap.set(".engine__stamp", { autoAlpha: 0 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".engine__card", start: "top 70%", once: true }, defaults: { ease: "power3.out" } });
      show();
      match.reasons.forEach((_, i) => {
        tl.to(`.engine__reason:nth-child(${i + 1}) .engine__bar i`, { scaleX: 1, duration: 0.6 }, 0.2 + i * 0.22)
          .from(`.engine__reason:nth-child(${i + 1})`, { autoAlpha: 0.3, duration: 0.3 }, 0.2 + i * 0.22);
      });
      tl.to(counter, { n: match.score, duration: 1.6, ease: "power2.out", onUpdate: show }, 0.2);
      stampIn(".engine__stamp", 1.9, tl);
      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section id="compatibilite" className="section engine" data-tone="dark" ref={root}>
      <div className="container engine__grid">
        <div className="engine__copy">
          <h2 data-reveal>{ENGINE.title}</h2>
          <p className="lead" data-reveal>{ENGINE.lead}</p>
          <ul className="engine__principles" data-reveal>
            <li><Check /> Un score est toujours décomposé en critères mesurés.</li>
            <li><Check /> Chaque critère dit ce qu'il compare et pourquoi il compte.</li>
            <li><Check /> Les intentions des deux entreprises sont confrontées, pas seulement leurs secteurs.</li>
          </ul>
        </div>

        <article className="engine__card sheet" data-reveal aria-label={`Compatibilité avec ${partner.name}`}>
          <div className="sheet__head">
            <Label strong>Compatibilité d'entreprise</Label>
            <span className="label tabular">Réf. {match.id.toUpperCase()} · {new Date(match.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          <div className="sheet__body">
            <div className="engine__partner">
              <Monogram company={partner} large />
              <div>
                <h3>{partner.name}</h3>
                <p className="engine__meta"><Country code={partner.country} /> · {industryName(partner.industry)} / {industryName(partner.secondaryIndustry ?? partner.industry)}</p>
                <Verifs levels={partner.verification} compact />
              </div>
              <div className="engine__scorebox">
                <Score value={match.score} size="4.5rem" className="engine__score" />
                <PType id={match.partnershipType} />
              </div>
            </div>

            <h4 className="label label--strong engine__why">{ENGINE.why}</h4>
            <ol className="engine__reasons">
              {match.reasons.map((r) => (
                <li key={r.label} className="engine__reason">
                  <div className="engine__reason-head">
                    <span className="engine__reason-score tabular">{r.score} %</span>
                    <strong>{r.label}</strong>
                  </div>
                  <span className="engine__bar" aria-hidden="true"><i style={{ width: `${r.score}%` }} /></span>
                  <p>{r.explanation}</p>
                </li>
              ))}
            </ol>

            <div className="engine__foot">
              <Button to={`/app/entreprises/${partner.id}`} light small>{ENGINE.view}<ArrowRight /></Button>
              <Stamp solid className="engine__stamp"><strong className="tabular">{match.score} %</strong>compatible</Stamp>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
