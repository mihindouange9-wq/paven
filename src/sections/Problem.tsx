import { useRef, type CSSProperties } from "react";
import { Duo } from "../components/ui";
import { PROBLEM } from "../content/fr";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";

/* Quatre états du bain, un par constat : dispersé, voilé, en anneaux (vérifié), tiré vers l'autre (expansion).
   Les teintes (--a, --b, --c) sont celles de la carte qui porte la figure. */
function Figure({ n }: { n: number }) {
  const common = { width: 96, height: 56, viewBox: "0 0 96 56", "aria-hidden": true as const, className: "problem__figure" };
  const A = "var(--a)", B = "var(--b)", C = "var(--c)", BG = "var(--card)";
  if (n === 0) return <svg {...common}><circle cx="14" cy="16" r="7" fill={A} /><circle cx="52" cy="40" r="6" fill={B} /><circle cx="84" cy="12" r="5" fill={C} /><circle cx="36" cy="44" r="4" fill={C} /><circle cx="76" cy="38" r="4" fill={A} /></svg>;
  if (n === 1) return <svg {...common}><circle cx="48" cy="28" r="22" fill={A} /><circle cx="64" cy="30" r="20" fill={BG} /><circle cx="48" cy="28" r="7" fill={B} /></svg>;
  if (n === 2) return <svg {...common}><circle cx="48" cy="28" r="24" fill={A} /><circle cx="48" cy="28" r="16" fill={B} /><circle cx="48" cy="28" r="9" fill={C} /><circle cx="48" cy="28" r="3.5" fill={A} /></svg>;
  return <svg {...common}><path d="M22 28a16 16 0 1 1 16 16c-10 0-26-8-36-16 10-8 26-16 36-16" fill={A} /><path d="M26 28a12 12 0 1 1 12 12c-8 0-22-6-32-12 10-6 24-12 32-12" fill={B} /><circle cx="38" cy="28" r="5" fill={C} /><circle cx="82" cy="28" r="8" fill={A} /><circle cx="82" cy="28" r="3.5" fill={C} /></svg>;
}

/* Les quatre cartes sont posées en éventail : inclinaison et décalage de chacune. */
const FAN = [{ r: -6, y: 14 }, { r: 3, y: -8 }, { r: -3, y: 10 }, { r: 5, y: -4 }];

/** Le constat : quatre obstacles distribués comme quatre cartes, puis la réponse. */
export default function Problem() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>(".problem__card", root.current);
      // les cartes sont distribuées quand la scène s'ouvre (le nuage s'éclaircit), une à une ;
      // sur téléphone elles sont presque droites et montent simplement
      const fan = window.matchMedia("(min-width: 960px)").matches ? 1 : 0.3;
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 36%", once: true } })
        .fromTo(cards, { autoAlpha: 0, y: 120, rotate: 0 }, { autoAlpha: 1, y: (i) => FAN[i].y * fan, rotate: (i) => FAN[i].r * fan, duration: 0.9, ease: "power4.out", stagger: 0.12 }, 0.25);
    },
    { scope: root },
  );

  return (
    <section id="plateforme" className="scene problem" data-scene data-tone="dark" tabIndex={-1} ref={root}>
      <div className="container problem__grid">
        <div className="problem__copy">
          <h2 className="problem__title" data-reveal="lines"><Duo parts={PROBLEM.title} /></h2>
          <p className="problem__answer" data-reveal>{PROBLEM.answer}</p>
        </div>
        <ul className="problem__deck">
          {PROBLEM.items.map((p, i) => (
            <li key={p.title} className={`problem__card problem__card--${i + 1}`} style={{ "--r": `${FAN[i].r}deg`, "--y": `${FAN[i].y}px` } as CSSProperties}>
              <div className="problem__face">
                <Figure n={i} />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
