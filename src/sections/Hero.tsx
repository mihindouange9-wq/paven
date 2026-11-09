import { useCallback, useRef } from "react";
import { ArrowRight } from "lucide-react";
import LiveBath from "../components/LiveBath";
import type { Op } from "../components/Marbling";
import { Button, Country, Field, Label, PType, Stamp } from "../components/ui";
import { HERO } from "../content/fr";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";

/* Les trois pigments du bain, pris dans la palette : turquoise, jaune pastel, ivoire. */
export const PIGMENTS = { a: "#0D9DA4", b: "#FCE688", c: "#FFFBEA" };

/* Le bain, en fractions du panneau. Les villes sont des gouttes ; une goutte posée sur une autre la repousse en
   anneau (turquoise / jaune / ivoire alternés). Deux traits de stylet, décalés de part et d'autre de Libreville,
   tirent ses anneaux vers Douala : c'est la connexion. La carte d'exemple couvre le bas à gauche du panneau. */
const POS: Record<string, [number, number]> = {
  casablanca: [0.16, 0.1], cairo: [0.84, 0.09], dakar: [0.08, 0.3], lagos: [0.3, 0.36], abidjan: [0.15, 0.47],
  nairobi: [0.9, 0.44], kigali: [0.76, 0.6], johannesburg: [0.84, 0.86], douala: [0.7, 0.26], libreville: [0.46, 0.2],
};

/* Le rythme : un battement toutes les 1,3 s.
   - À chaque battement une ville, à son tour, reçoit une goutte : ses anneaux se gonflent vite puis retombent
     lentement en repoussant leurs voisins, une goutte d'ivoire naît en son centre ; la suivante prend le relais.
   - Chaque ville décrit un petit cercle en huit battements.
   - Tout le bain se balance de gauche à droite sur quatre battements, comme une cuve qu'on incline.
   La même fonction donne l'image fixe (t = 0). */
export const BEAT = 1.3;
const ORDER = ["libreville", "douala", "lagos", "abidjan", "dakar", "casablanca", "cairo", "nairobi", "kigali", "johannesburg"];
const beat = (t: number, id: string) => {
  const n = ORDER.length, x = (((t / BEAT - ORDER.indexOf(id)) % n) + n) % n; // battements écoulés depuis son tour
  return x < 0.22 ? 1 - Math.pow(1 - x / 0.22, 3) : Math.exp(-(x - 0.22) * 1.05);
};
const TAU = Math.PI * 2;
const TINE_C = 3e-8; // l'effet du trait tombe de moitié à 0,04 de largeur de panneau

export function buildHeroOps(p = PIGMENTS, t = 0): Op[] {
  const at = (id: string): [number, number] => {
    const i = ORDER.indexOf(id);
    const a = (TAU * t) / (BEAT * 8) + i * 2.4, r = 0.026;
    return [POS[id][0] + r * Math.cos(a), POS[id][1] + r * Math.sin(a)];
  };
  const drop = (id: string, r: number, color: string): Op => {
    const [x, y] = at(id);
    return { kind: "drop", drop: { x, y, r: r * (1 + 0.36 * beat(t, id)), color, label: id } };
  };
  const [lx, ly] = at("libreville"), [dx, dy] = at("douala");
  const vx = dx - lx, vy = dy - ly, len = Math.hypot(vx, vy), nx = -vy / len, ny = vx / len;
  const pull = 1 + 0.9 * beat(t, "douala"); // la connexion se tend quand Douala reçoit sa goutte
  // la goutte du battement : elle naît au centre de la ville dont c'est le tour, puis se résorbe
  const turn = ORDER[((Math.floor(t / BEAT) % ORDER.length) + ORDER.length) % ORDER.length];
  const [tx, ty] = at(turn);
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
    { kind: "tine", tine: { x: lx + nx * 0.05, y: ly + ny * 0.05, dx: vx, dy: vy, z: 0.12 * pull, c: TINE_C } },
    { kind: "tine", tine: { x: lx - nx * 0.05, y: ly - ny * 0.05, dx: vx, dy: vy, z: 0.08 * pull, c: TINE_C } },
    { kind: "drop", drop: { x: lx, y: ly, r: 0.012, color: p.c } },
    { kind: "drop", drop: { x: tx, y: ty, r: 0.004 + 0.02 * beat(t, turn), color: turn === "libreville" || turn === "douala" ? p.b : p.c } },
    // le balancement : un large trait horizontal dont l'amplitude oscille sur quatre battements
    { kind: "tine", tine: { x: 0, y: 0.36, dx: 1, dy: 0, z: 0.05 * Math.sin((TAU * t) / (BEAT * 4)), c: 2e-2 } },
  ];
}
/** Le bain de clôture : le peigne est passé. Cinq traits parallèles rayent toute la cuve et respirent lentement. */
export function buildFinalOps(p = PIGMENTS, t = 0): Op[] {
  const ops = buildHeroOps(p, t);
  for (let i = 0; i < 5; i++) ops.push({ kind: "tine", tine: { x: 0, y: 0.12 + i * 0.17, dx: 1, dy: 0.06, z: 0.11 * (1 + 0.3 * Math.sin(t * 0.55 + i * 1.1)), c: 1e-10 } });
  return ops;
}
const COUNT = buildHeroOps().length;

/** Première scène, sur jaune : le titre dit ce que fait PAVEN ; le panneau sombre porte le bain vivant et un exemple. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef({ n: typeof window !== "undefined" && prefersReducedMotion() ? COUNT : 0 });
  const build = useCallback((t: number) => buildHeroOps(PIGMENTS, t), []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // l'ouverture (logo, 0,9 s) passe d'abord : l'entrée de la scène commence quand le rideau se lève
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.85 });
      tl.from(".hero__title .line > span", { yPercent: 108, duration: 1.1, stagger: 0.08 }, 0)
        .from(".hero__lead, .hero__actions", { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.1 }, 0.45)
        .fromTo(".hero__stage", { autoAlpha: 0, y: 46, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out" }, 0.15)
        // les gouttes tombent une à une, puis le bain garde son rythme tout seul
        .to(progress.current, { n: COUNT, duration: 2.6, ease: "none" }, 0.3)
        .fromTo(".feuille--hero", { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" }, 1.5)
        .from(".feuille--hero .field", { autoAlpha: 0, x: -8, duration: 0.45, stagger: 0.09, ease: "power2.out" }, 1.75)
        .fromTo(".feuille--hero .stamp", { autoAlpha: 0, scale: 1.12, rotate: -3 }, { autoAlpha: 1, scale: 1, rotate: -2, duration: 0.55, ease: "expo.out" }, 2.3);
    },
    { scope: root },
  );

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
            <LiveBath build={build} progress={progress} bath="#0b2a2c" stylus />
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
    </section>
  );
}
