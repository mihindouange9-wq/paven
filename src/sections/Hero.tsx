import { useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Marbling, { type Op } from "../components/Marbling";
import { Button, Country, Field, Label, PType, Stamp } from "../components/ui";
import { HERO } from "../content/fr";
import { CITIES } from "../data/mock";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";

const PORTS = ["libreville", "douala", "abidjan", "lagos", "accra", "dakar", "casablanca", "nairobi", "kigali", "johannesburg", "cairo"];
/* Les trois pigments du bain, pris dans la palette : turquoise, jaune pastel, ivoire. */
export const PIGMENTS = { a: "#0D9DA4", b: "#FCE688", c: "#FFFBEA" };

/* Le bain, en fractions du canvas. Les villes sont des gouttes ; une goutte posée sur une autre la repousse en
   anneau (turquoise / jaune / ivoire alternés). Deux traits de stylet, décalés de part et d'autre de Libreville,
   tirent ses anneaux vers Douala : c'est la connexion. */
const POS: Record<string, [number, number]> = {
  casablanca: [0.18, 0.12], cairo: [0.82, 0.10], dakar: [0.07, 0.30], lagos: [0.30, 0.34], abidjan: [0.17, 0.50],
  nairobi: [0.90, 0.42], kigali: [0.76, 0.54], johannesburg: [0.72, 0.88], douala: [0.68, 0.24], libreville: [0.44, 0.21],
};
const TINE_C = 3e-8; // l'effet du trait tombe de moitié à 0,04 de largeur de canvas
export function buildHeroOps(p = PIGMENTS): Op[] {
  const drop = (id: string, r: number, color: string): Op => ({ kind: "drop", drop: { x: POS[id][0], y: POS[id][1], r, color, label: id } });
  const [lx, ly] = POS.libreville, [dx, dy] = POS.douala;
  const vx = dx - lx, vy = dy - ly, len = Math.hypot(vx, vy), nx = -vy / len, ny = vx / len;
  return [
    drop("casablanca", 0.055, p.b), drop("casablanca", 0.028, p.c),
    drop("cairo", 0.045, p.c),
    drop("dakar", 0.05, p.a), drop("dakar", 0.024, p.b),
    drop("lagos", 0.075, p.b), drop("lagos", 0.05, p.a), drop("lagos", 0.03, p.c), drop("lagos", 0.013, p.b),
    drop("abidjan", 0.045, p.c),
    drop("nairobi", 0.06, p.b), drop("nairobi", 0.034, p.c),
    drop("kigali", 0.04, p.c),
    drop("johannesburg", 0.07, p.a),
    drop("douala", 0.07, p.b), drop("douala", 0.042, p.c), drop("douala", 0.02, p.a),
    drop("libreville", 0.09, p.a), drop("libreville", 0.062, p.b), drop("libreville", 0.038, p.c), drop("libreville", 0.017, p.a),
    { kind: "tine", tine: { x: lx + nx * 0.05, y: ly + ny * 0.05, dx: vx, dy: vy, z: 0.12, c: TINE_C } },
    { kind: "tine", tine: { x: lx - nx * 0.05, y: ly - ny * 0.05, dx: vx, dy: vy, z: 0.08, c: TINE_C } },
    drop("libreville", 0.012, p.c),
  ];
}
/** Le bain de clôture : le peigne est passé. Cinq traits parallèles rayent toute la cuve. */
export function buildFinalOps(p = PIGMENTS): Op[] {
  const ops = buildHeroOps(p);
  for (let i = 0; i < 5; i++) ops.push({ kind: "tine", tine: { x: 0, y: 0.12 + i * 0.17, dx: 1, dy: 0.06, z: 0.11, c: 1e-10 } });
  ops.push({ kind: "drop", drop: { x: POS.libreville[0], y: POS.libreville[1], r: 0.012, color: p.c } });
  return ops;
}

/** Première scène, sur jaune : le titre dit ce que fait PAVEN ; le panneau sombre porte le bain et un exemple. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const ops = useMemo(() => buildHeroOps(), []);
  const [progress, setProgress] = useState(() => (typeof window !== "undefined" && prefersReducedMotion() ? ops.length : 0));

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const p = { n: 0 };
      // l'ouverture (logo, 0,9 s) passe d'abord : l'entrée de la scène commence quand le rideau se lève
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.85 });
      tl.from(".hero__title .line > span", { yPercent: 108, duration: 1.1, stagger: 0.08 }, 0)
        .from(".hero__lead, .hero__actions", { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.1 }, 0.45)
        .fromTo(".hero__stage", { clipPath: "inset(12% 10% 12% 10% round 28px)", autoAlpha: 0 }, { clipPath: "inset(0% 0% 0% 0% round 28px)", autoAlpha: 1, duration: 1.2, ease: "expo.out" }, 0.15)
        .to(p, { n: ops.length, duration: 2.6, ease: "none", onUpdate: () => setProgress(p.n) }, 0.3)
        .fromTo(".feuille--hero", { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" }, 1.5)
        .from(".feuille--hero .field", { autoAlpha: 0, x: -8, duration: 0.45, stagger: 0.09, ease: "power2.out" }, 1.75)
        .fromTo(".feuille--hero .stamp", { autoAlpha: 0, scale: 1.12, rotate: -3 }, { autoAlpha: 1, scale: 1, rotate: -2, duration: 0.55, ease: "expo.out" }, 2.3)
        .from(".hero__marquee", { autoAlpha: 0, duration: 0.8 }, 1.1);
    },
    { scope: root },
  );

  const cities = PORTS.map((id) => CITIES.find((x) => x.id === id)!);

  return (
    <section id="accueil" className="scene hero" ref={root} data-scene data-tone="yellow" tabIndex={-1}>
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title">
            {HERO.title.map((l, i) => <span className={`line ${i === HERO.title.length - 1 ? "t-soft" : ""}`} key={l}><span>{l}</span></span>)}
          </h1>
          <p className="hero__lead">{HERO.lead}</p>
          <div className="hero__actions">
            <Button to="/app/decouvrir" primary>{HERO.primary}<ArrowRight /></Button>
            <Button href="#parcours">{HERO.secondary}</Button>
          </div>
        </div>

        <div className="hero__stage">
          <div className="hero__bath" aria-hidden="true">
            <Marbling ops={ops} progress={progress} bath="#0b2a2c" />
          </div>
          <div className="feuille feuille--hero sheet" aria-label="Exemple de mise en relation : Gabon Fresh Foods cherche un distributeur, de Libreville vers Douala">
            <div className="sheet__head">
              <Label strong>{HERO.sheet}</Label>
              <span className="label tabular">Démonstration</span>
            </div>
            <div className="sheet__body">
              <Field label="Entreprise" value={<>Gabon Fresh Foods <span className="dossier__meta">· Agroalimentaire</span></>} state="filled" />
              <div className="sheet__grid">
                <Field label="Depuis" value={<span className="dossier__place">Libreville <Country code="GA" nameless /></span>} state="filled" large />
                <Field label="Vers" value={<span className="dossier__place">Douala <Country code="CM" nameless /></span>} state="filled" large />
              </div>
              <Field label="Cherche" value={<PType id="distributor" />} state="filled" />
              <p className="dossier__result">3 partenaires potentiels · AgroDistrib Cameroon en tête</p>
              <Stamp solid className="dossier__stamp"><strong className="tabular">94 %</strong>compatible</Stamp>
            </div>
          </div>
        </div>
      </div>

      {/* Les villes du réseau défilent en grand ; la liste n'est lue qu'une fois. */}
      <div className="hero__marquee">
        <ul className="marquee" aria-label="Villes du réseau PAVEN">
          {cities.map((c) => <li key={c.id}>{c.name}<i className="marquee__dot" aria-hidden="true" /></li>)}
        </ul>
        <ul className="marquee" aria-hidden="true">
          {cities.map((c) => <li key={c.id}>{c.name}<i className="marquee__dot" /></li>)}
        </ul>
      </div>
    </section>
  );
}
