import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button, Country, Field, Label, PType, Stamp } from "../components/ui";
import { HERO } from "../content/fr";
import { CITIES } from "../data/mock";
import { gsap, prefersReducedMotion, stampIn, useGSAP } from "../lib/motion";

const PORTS = ["libreville", "douala", "abidjan", "lagos", "accra", "dakar", "casablanca", "nairobi", "kigali", "johannesburg", "cairo"];

/** Le dossier d'expansion : il se remplit sous les yeux du visiteur, puis le tampon se pose. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const fields = gsap.utils.toArray<HTMLElement>(".dossier .field");
      const route = root.current!.querySelector<SVGPathElement>(".dossier__route path");
      const len = route?.getTotalLength() ?? 400;

      fields.forEach((f) => f.classList.replace("field--filled", "field--empty"));
      gsap.set(".dossier__stamp", { autoAlpha: 0 });
      if (route) gsap.set(route, { strokeDasharray: len, strokeDashoffset: len });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero__title .line > span", { yPercent: 108, duration: 1.2, stagger: 0.09 }, 0.1)
        .from(".hero__lead, .hero__actions", { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.1 }, 0.6)
        .from(".dossier", { autoAlpha: 0, y: 24, duration: 1 }, 0.35)
        .from(".hero__ports li", { autoAlpha: 0, y: 8, duration: 0.6, stagger: 0.04 }, 0.9);

      fields.forEach((f, i) => {
        const at = 1.0 + i * 0.42;
        tl.call(() => f.classList.replace("field--empty", "field--filled"), [], at)
          .from(f.querySelector(".field__value"), { autoAlpha: 0, x: -6, duration: 0.45, ease: "power2.out" }, at + 0.02);
      });
      if (route) tl.to(route, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 1.5);
      tl.from(".dossier__dot--to", { scale: 0, transformOrigin: "50% 50%", duration: 0.4 }, 2.45);
      stampIn(".dossier__stamp", 3.1, tl);
      tl.from(".dossier__result", { autoAlpha: 0, duration: 0.5 }, 3.0);
    },
    { scope: root },
  );

  const split = (t: string) => t.split("\n").map((l, i) => (
    <span className="line" key={i}><span>{l}</span></span>
  ));

  return (
    <section id="accueil" className="hero section" ref={root} data-tone="paper">
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title">{split("Les affaires\nchangent de rythme\nquand l'Afrique\nse connecte.")}</h1>
          <p className="hero__lead">{HERO.lead}</p>
          <div className="hero__actions">
            <Button to="/app/decouvrir" primary>{HERO.primary}<ArrowRight /></Button>
            <Button href="#marches">{HERO.secondary}</Button>
          </div>
        </div>

        <div className="dossier sheet" aria-label="Exemple de dossier d'expansion : Gabon Fresh Foods, de Libreville vers Douala">
          <div className="sheet__head">
            <Label strong>Dossier d'expansion</Label>
            <span className="label tabular">N° PV-2026-0417 · démonstration</span>
          </div>
          <div className="sheet__body dossier__body">
            <svg className="dossier__route" viewBox="0 0 24 300" preserveAspectRatio="none" aria-hidden="true">
              <path d="M12 18 V282" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle className="dossier__dot dossier__dot--from" cx="12" cy="18" r="5" />
              <circle className="dossier__dot dossier__dot--to" cx="12" cy="282" r="5" />
            </svg>
            <div className="dossier__fields">
              <Field label="Entreprise" value={<>Gabon Fresh Foods <span className="dossier__meta">· Agroalimentaire · 50–100 pers.</span></>} state="filled" />
              <Field label="Depuis" value={<span className="dossier__place">Libreville <Country code="GA" nameless /></span>} state="filled" large />
              <Field label="Vers" value={<span className="dossier__place">Douala <Country code="CM" nameless /></span>} state="filled" large />
              <Field label="Objectif" value={<PType id="distributor" />} state="filled" />
              <Field label="Résultat" value={<span className="dossier__result">3 partenaires potentiels · AgroDistrib Cameroon en tête</span>} state="filled" />
            </div>
            <Stamp solid className="dossier__stamp"><strong className="tabular">94 %</strong>compatible</Stamp>
          </div>
        </div>
      </div>

      <div className="container">
        <ul className="hero__ports" aria-label="Villes du réseau PAVEN">
          {PORTS.map((id) => {
            const c = CITIES.find((x) => x.id === id)!;
            return <li key={id}><span className="hero__port-code" aria-hidden="true">{c.country}</span>{c.name}</li>;
          })}
        </ul>
      </div>
    </section>
  );
}
