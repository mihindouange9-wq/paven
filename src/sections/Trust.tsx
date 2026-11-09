import { useRef } from "react";
import { Mark } from "../brand/Logo";
import Phone from "../components/Phone";
import { Check, Country, Label, Score, Stamp } from "../components/ui";
import { MOBILE, TRUST } from "../content/fr";
import { companyById, MATCHES } from "../data/mock";
import { gsap, prefersReducedMotion, stampIn, useGSAP } from "../lib/motion";

/** La confiance : trois niveaux de vérification, quatre garanties, et la preuve dans la main (le téléphone). */
export default function Trust() {
  const root = useRef<HTMLElement>(null);
  const m = MATCHES[0];
  const partner = companyById(m.to);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 34%", once: true } });
      tl.fromTo(".trust__phone .phone", { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: "power4.out" }, 0.15)
        .fromTo(".mobile__notif", { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.75)
        .fromTo(".mobile__notif .mobile__row", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 }, 0.95);
      stampIn(".mobile__stamp", 1.5, tl);
    },
    { scope: root },
  );

  return (
    <section id="confiance" className="scene trust" data-scene data-tone="dark" tabIndex={-1} ref={root}>
      <div className="container trust__grid">
        <div className="trust__copy">
          <h2 data-reveal="lines">{TRUST.title}</h2>
          <p className="lead" data-reveal>{TRUST.lead}</p>
          <ol className="trust__levels" aria-label="Niveaux de vérification">
            {TRUST.levels.map((l, i) => (
              <li key={l.title} className="trust__level">
                <Stamp solid={i === 2} data-stamp>{l.title}</Stamp>
                <p data-reveal>{l.text}</p>
              </li>
            ))}
          </ol>
          <p className="demo-note" data-reveal>{TRUST.note}</p>
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

        <figure className="trust__phone">
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
          <figcaption>{TRUST.phone}</figcaption>
        </figure>
      </div>
    </section>
  );
}
