import { useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Marbling, { type Op } from "../components/Marbling";
import { Button, Country, Field, Label, PType, Stamp } from "../components/ui";
import { HERO } from "../content/fr";
import { CITIES } from "../data/mock";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";

const PORTS = ["libreville", "douala", "abidjan", "lagos", "accra", "dakar", "casablanca", "nairobi", "kigali", "johannesburg", "cairo"];
const BUFF = "#D8C39A", SUNSET = "#E96A4F", OFF = "#F5F2EC";

/* Le bain du hero, en fractions du canvas. Les villes sont des gouttes ; une goutte posée sur une autre
   la repousse en anneau (buff / sunset / ivoire alternés). Deux traits de stylet, décalés de part et d'autre
   de Libreville, tirent ses anneaux vers Douala : c'est la connexion, posée en haut à droite, hors de la feuille. */
const POS: Record<string, [number, number]> = {
  casablanca: [0.18, 0.12], cairo: [0.82, 0.10], dakar: [0.07, 0.30], lagos: [0.30, 0.34], abidjan: [0.17, 0.50],
  nairobi: [0.90, 0.42], kigali: [0.76, 0.54], johannesburg: [0.72, 0.88], douala: [0.68, 0.24], libreville: [0.44, 0.21],
};
const drop = (id: string, r: number, color: string): Op => ({ kind: "drop", drop: { x: POS[id][0], y: POS[id][1], r, color, label: id } });
const TINE_C = 3e-8; // l'effet du trait tombe de moitié à 0,04 de largeur de canvas
export function buildHeroOps(): Op[] {
  const [lx, ly] = POS.libreville, [dx, dy] = POS.douala;
  const vx = dx - lx, vy = dy - ly, len = Math.hypot(vx, vy), nx = -vy / len, ny = vx / len;
  return [
    drop("casablanca", 0.055, BUFF), drop("casablanca", 0.028, OFF),
    drop("cairo", 0.045, OFF),
    drop("dakar", 0.05, SUNSET), drop("dakar", 0.024, BUFF),
    drop("lagos", 0.075, BUFF), drop("lagos", 0.05, SUNSET), drop("lagos", 0.03, OFF), drop("lagos", 0.013, BUFF),
    drop("abidjan", 0.045, OFF),
    drop("nairobi", 0.06, BUFF), drop("nairobi", 0.034, OFF),
    drop("kigali", 0.04, OFF),
    drop("johannesburg", 0.07, SUNSET),
    drop("douala", 0.07, BUFF), drop("douala", 0.042, OFF), drop("douala", 0.02, SUNSET),
    drop("libreville", 0.09, SUNSET), drop("libreville", 0.062, BUFF), drop("libreville", 0.038, OFF), drop("libreville", 0.017, SUNSET),
    { kind: "tine", tine: { x: lx + nx * 0.05, y: ly + ny * 0.05, dx: vx, dy: vy, z: 0.12, c: TINE_C } },
    { kind: "tine", tine: { x: lx - nx * 0.05, y: ly - ny * 0.05, dx: vx, dy: vy, z: 0.08, c: TINE_C } },
    drop("libreville", 0.012, OFF),
  ];
}
/** Le bain de clôture : la feuille est levée, le peigne est passé. Cinq traits parallèles rayent toute la cuve. */
export function buildFinalOps(): Op[] {
  const ops = buildHeroOps();
  for (let i = 0; i < 5; i++) ops.push({ kind: "tine", tine: { x: 0, y: 0.12 + i * 0.17, dx: 1, dy: 0.06, z: 0.11, c: 1e-10 } });
  ops.push(drop("libreville", 0.012, OFF));
  return ops;
}

/** Le hero v2 : le bain à droite, la feuille levée qui porte le dossier, le titre sur le sombre. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const ops = useMemo(buildHeroOps, []);
  const [progress, setProgress] = useState(() => (typeof window !== "undefined" && prefersReducedMotion() ? ops.length : 0));

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const p = { n: 0 };
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero__title .line > span", { yPercent: 108, duration: 1.2, stagger: 0.09 }, 0.1)
        .from(".hero__lead, .hero__actions", { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.1 }, 0.6)
        .to(p, { n: ops.length, duration: 3.0, ease: "none", onUpdate: () => setProgress(p.n) }, 0.2)
        .from(".hero__ports li", { autoAlpha: 0, y: 8, duration: 0.6, stagger: 0.04 }, 1.2)
        .fromTo(".feuille--hero", { autoAlpha: 0, y: -40, rotate: -1 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 0.8, ease: "expo.out" }, 2.3)
        .from(".feuille--hero .field", { autoAlpha: 0, x: -8, duration: 0.45, stagger: 0.1, ease: "power2.out" }, 2.6)
        .fromTo(".feuille--hero .stamp", { autoAlpha: 0, scale: 1.12, rotate: -3 }, { autoAlpha: 1, scale: 1, rotate: -2, duration: 0.55, ease: "expo.out" }, 3.2);
      gsap.to(".hero__bath", { y: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 } });
    },
    { scope: root },
  );

  const split = (t: string) => t.split("\n").map((l, i) => (
    <span className="line" key={i}><span>{l}</span></span>
  ));

  return (
    <section id="accueil" className="hero section" ref={root} data-tone="dark">
      <div className="hero__bath" aria-hidden="true">
        <Marbling ops={ops} progress={progress} bath="#242124" />
      </div>
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title">{split("Les affaires\nchangent de rythme\nquand l'Afrique\nse connecte.")}</h1>
          <p className="hero__lead">{HERO.lead}</p>
          <div className="hero__actions">
            <Button to="/app/decouvrir" primary>{HERO.primary}<ArrowRight /></Button>
            <Button href="#marches">{HERO.secondary}</Button>
          </div>
        </div>

        <div className="feuille feuille--hero sheet" aria-label="Exemple de dossier levé du bain : Gabon Fresh Foods, de Libreville vers Douala">
          <div className="sheet__head">
            <Label strong>Feuille levée · dossier d'expansion</Label>
            <span className="label tabular">N° PV-2026-0417 · démonstration</span>
          </div>
          <div className="sheet__body">
            <Field label="Entreprise" value={<>Gabon Fresh Foods <span className="dossier__meta">· Agroalimentaire · 50–100 pers.</span></>} state="filled" />
            <div className="sheet__grid">
              <Field label="Depuis" value={<span className="dossier__place">Libreville <Country code="GA" nameless /></span>} state="filled" large />
              <Field label="Vers" value={<span className="dossier__place">Douala <Country code="CM" nameless /></span>} state="filled" large />
            </div>
            <Field label="Objectif" value={<PType id="distributor" />} state="filled" />
            <Field label="Résultat" value={<span className="dossier__result">3 partenaires potentiels · AgroDistrib Cameroon en tête</span>} state="filled" />
            <Stamp solid className="dossier__stamp"><strong className="tabular">94 %</strong>compatible</Stamp>
          </div>
        </div>
      </div>

      <div className="container">
        <ul className="hero__ports" aria-label="Villes du réseau PAVEN">
          {PORTS.map((id, i) => {
            const c = CITIES.find((x) => x.id === id)!;
            return <li key={id}><i className={`goutte ${i % 3 === 1 ? "goutte--buff" : ""}`} aria-hidden="true" /><span className="hero__port-code" aria-hidden="true">{c.country}</span>{c.name}</li>;
          })}
        </ul>
      </div>
    </section>
  );
}
