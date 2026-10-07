import { useRef } from "react";
import { Mark } from "../brand/Logo";
import Phone from "../components/Phone";
import { Check, Country, Label, Score } from "../components/ui";
import { MOBILE } from "../content/fr";
import { companyById, MATCHES } from "../data/mock";
import { gsap, prefersReducedMotion, stampIn, useGSAP } from "../lib/motion";

/** Le téléphone est dans la composition : la notification de compatibilité arrive sur l'écran pendant le défilement. */
export default function MobileSection() {
  const root = useRef<HTMLElement>(null);
  const m = MATCHES[0];
  const partner = companyById(m.to);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".mobile__phone", start: "top 65%", once: true } });
      tl.from(".mobile__phone .phone", { y: 60, duration: 1.2, ease: "power4.out" }, 0)
        .from(".mobile__notif", { autoAlpha: 0, y: -14, duration: 0.6 }, 0.6)
        .from(".mobile__notif .mobile__row", { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.08 }, 0.8);
      stampIn(".mobile__stamp", 1.4, tl);
      gsap.to(".mobile__phone .phone", { y: -24, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    },
    { scope: root },
  );

  return (
    <section id="mobile" className="section mobile" ref={root}>
      <div className="container mobile__grid">
        <div className="mobile__copy">
          <h2 data-reveal>Une compatibilité arrive. Vous savez déjà pourquoi.</h2>
          <p className="lead" data-reveal>Sur téléphone, PAVEN ne montre jamais un pourcentage seul : la raison principale est lue en une ligne, le profil complet en un geste.</p>
          <ul className="mobile__points" data-reveal>
            <li><Check /> Notifications de compatibilité et de demande de partenariat.</li>
            <li><Check /> Profils, Deal Rooms et conversations, au même rythme que sur ordinateur.</li>
            <li><Check /> Pensé pour les réseaux mobiles africains : léger, lisible, hors connexion pour la lecture.</li>
          </ul>
        </div>
        <div className="mobile__phone" data-reveal>
          <svg className="mobile__rings" viewBox="0 0 600 600" aria-hidden="true">{[120, 190, 260, 330].map((r) => <circle key={r} cx="300" cy="300" r={r} />)}</svg>
          <Phone label={`Écran PAVEN mobile : nouvelle compatibilité avec ${partner.name}, ${m.score} %`}>
            <div className="mobile__app">
              <div className="mobile__top"><Mark size={22} title="" /><span>PAVEN</span><span className="mobile__time tabular">9:41</span></div>
              <div className="mobile__notif">
                <Label strong>{MOBILE.title}</Label>
                <div className="mobile__row mobile__company">
                  <span className="monogram">{partner.monogram}</span>
                  <div><strong>{partner.name}</strong><Country code={partner.country} /></div>
                </div>
                <div className="mobile__row mobile__score"><Score value={m.score} size="2.75rem" /><span className="label">de compatibilité</span></div>
                <p className="mobile__row mobile__quote">« {m.summary} »</p>
                <ul className="mobile__row mobile__reasons">
                  {m.reasons.slice(0, 3).map((r) => <li key={r.label}><span className="tabular">{r.score} %</span>{r.label}</li>)}
                </ul>
                <div className="mobile__row mobile__actions">
                  <span className="btn btn--primary btn--small">{MOBILE.connect}</span>
                  <span className="btn btn--small">{MOBILE.view}</span>
                </div>
              </div>
              <span className="stamp stamp--solid mobile__stamp"><strong className="tabular">{m.score} %</strong>compatible</span>
            </div>
          </Phone>
        </div>
      </div>
    </section>
  );
}
