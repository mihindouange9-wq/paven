import { useEffect, useRef, type RefObject } from "react";
import { RotateCcw } from "lucide-react";
import { ATLAS, ATLAS_CITIES, ATLAS_H, ATLAS_W } from "../data/africa";
import { COUNTRIES, countryByCode } from "../data/mock";
import type { CountryCode } from "../data/types";
import { gsap, prefersReducedMotion, ScrollTrigger } from "../lib/motion";

/* L'atlas : la carte qui raconte PAVEN à elle seule.
   Au départ le continent est défait : cinquante-trois pays éparpillés, tournés, qui ne se touchent pas
   (les marchés fragmentés). Quand la scène s'ouvre, ils se rassemblent en un seul continent, les marchés de la
   plateforme s'allument, puis les liaisons se tracent d'une ville à l'autre. Ensuite la carte se lit : on choisit
   un pays, ses liaisons ressortent et un point les parcourt.
   Tout est dessiné sur une toile (12 500 points de contour, Natural Earth) : les pièces bougent sans à-coups.
   En mouvement réduit la carte est rendue construite ; la liste « Marché » reste le chemin au clavier. */

const C = { land: "#15494a", market: "#1f7577", linked: "#2b9397", selected: "#0d9da4", hover: "#35a9ad", border: "#0b2a2c", route: "#fce688", ivory: "#fffbea" };
const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const x = p(a), y = p(b);
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(" ")})`;
};
const hash = (s: string, k: number) => { let h = k * 7919; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 10007; return h / 10007; };

/* Où poser le nom de chaque ville : décalage en pixels et alignement, pour que les villes proches (golfe de
   Guinée, Grands Lacs, les deux Congo) ne se recouvrent pas. Par défaut : à droite du point. */
const LABEL: Record<string, [number, number, CanvasTextAlign]> = {
  SN: [13, -1, "left"], CI: [-13, -1, "right"], GH: [-3, 16, "right"], TG: [0, -15, "center"], BJ: [6, 17, "left"], NG: [10, -12, "left"],
  CG: [-13, 2, "right"], CD: [13, 6, "left"], RW: [-13, -1, "right"], MA: [13, -1, "left"],
};

type Route = { a: string; b: string; ax: number; ay: number; bx: number; by: number; cx: number; cy: number; len: number; s: { prog: number } };

/* Les liaisons : chaque paire de marchés connectés dans les données, une seule fois. La courbe bombe vers le haut. */
function buildRoutes(): Route[] {
  const seen = new Set<string>(), out: Route[] = [];
  for (const c of COUNTRIES) for (const o of c.connected) {
    const key = [c.code, o].sort().join("-");
    if (seen.has(key) || !ATLAS_CITIES[c.code] || !ATLAS_CITIES[o]) continue;
    seen.add(key);
    const [ax, ay] = ATLAS_CITIES[c.code], [bx, by] = ATLAS_CITIES[o];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
    let nx = -dy / len, ny = dx / len; if (ny > 0) { nx = -nx; ny = -ny; }
    out.push({ a: c.code, b: o, ax, ay, bx, by, cx: (ax + bx) / 2 + nx * len * 0.2, cy: (ay + by) / 2 + ny * len * 0.2, len: len * 1.08, s: { prog: 0 } });
  }
  return out;
}

type Props = { selected: CountryCode; onSelect: (code: CountryCode) => void; scene: RefObject<HTMLElement | null> };

export default function Atlas({ selected, onSelect, scene }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ select: (c: string) => void; replay: () => void } | null>(null);
  const pick = useRef(onSelect);
  pick.current = onSelect;

  useEffect(() => {
    const cv = canvas.current!, ctx = cv.getContext("2d")!;
    const reduced = prefersReducedMotion();
    const paths = ATLAS.map((c) => new Path2D(c.d));
    const routes = buildRoutes();
    const markets = ATLAS.map((c, i) => (c.market ? i : -1)).filter((i) => i >= 0);
    const cityOf = (id: string) => ATLAS_CITIES[id];

    /* État de chaque pays : décalage, rotation, échelle, opacité, éclat de marché ; état de chaque ville. */
    const CX = ATLAS_W / 2, CY = ATLAS_H / 2;
    const scattered = (i: number) => {
      const c = ATLAS[i], vx = c.c[0] - CX, vy = c.c[1] - CY, len = Math.hypot(vx, vy) || 1;
      const far = 190 + hash(c.id, 1) * 520;
      return { x: (vx / len) * far + (hash(c.id, 2) - 0.5) * 260, y: (vy / len) * far + (hash(c.id, 3) - 0.5) * 260, r: (hash(c.id, 4) - 0.5) * 1.7, s: 0.8, a: 0, lit: 0 };
    };
    const st = ATLAS.map((_, i) => (reduced ? { x: 0, y: 0, r: 0, s: 1, a: 1, lit: 1 } : scattered(i)));
    const nodes: Record<string, { v: number }> = Object.fromEntries(Object.keys(ATLAS_CITIES).map((k) => [k, { v: reduced ? 1 : 0 }]));
    const g = { dim: reduced ? 0.3 : 1, labels: reduced ? 1 : 0 };
    if (reduced) routes.forEach((r) => (r.s.prog = 1));

    let sel: string = selected, hover = "", dirty = true, inView = false, pulseUntil = 0, built = reduced;
    let k = 1, ox = 0, oy = 0, dpr = 1, tl: gsap.core.Timeline | null = null;

    const size = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.max(2, Math.round(r.width * dpr)); cv.height = Math.max(2, Math.round(r.height * dpr));
      k = Math.min(r.width / ATLAS_W, r.height / ATLAS_H) * 0.93;
      ox = (r.width - ATLAS_W * k) / 2; oy = (r.height - ATLAS_H * k) / 2;
      dirty = true;
    };

    const linked = () => new Set(countryByCode(sel)?.connected ?? []);
    const at = (r: Route, t: number, from: string) => {
      const u = from === r.a ? t : 1 - t, m = 1 - u;
      return [m * m * r.ax + 2 * m * u * r.cx + u * u * r.bx, m * m * r.ay + 2 * m * u * r.cy + u * u * r.by];
    };

    const draw = (now: number) => {
      const px = 1 / k; // un pixel d'écran, en unités de carte
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.translate(ox, oy); ctx.scale(k, k);
      const near = linked();

      // Les pays
      ctx.lineJoin = "round";
      for (let i = 0; i < ATLAS.length; i++) {
        const c = ATLAS[i], s = st[i];
        if (s.a <= 0.003) continue;
        const moved = s.x !== 0 || s.y !== 0 || s.r !== 0 || s.s !== 1;
        if (moved) { ctx.save(); ctx.translate(c.c[0] + s.x, c.c[1] + s.y); ctx.rotate(s.r); ctx.scale(s.s, s.s); ctx.translate(-c.c[0], -c.c[1]); }
        ctx.globalAlpha = s.a;
        let fill = c.market ? mix(C.land, C.market, s.lit) : C.land;
        if (built && c.market) fill = c.id === sel ? C.selected : c.id === hover ? C.hover : near.has(c.id as CountryCode) ? C.linked : fill;
        ctx.fillStyle = fill; ctx.fill(paths[i]);
        ctx.strokeStyle = C.border; ctx.lineWidth = 1.1 * px; ctx.stroke(paths[i]);
        if (moved) ctx.restore();
      }
      ctx.globalAlpha = 1;

      // Les liaisons
      ctx.lineCap = "round";
      for (const r of routes) {
        if (r.s.prog <= 0.001) continue;
        const mine = r.a === sel || r.b === sel;
        ctx.globalAlpha = mine ? 1 : g.dim;
        ctx.strokeStyle = C.route; ctx.lineWidth = (mine && built ? 2.2 : 1.2) * px;
        ctx.setLineDash([r.len * r.s.prog, r.len * 2]);
        ctx.beginPath(); ctx.moveTo(r.ax, r.ay); ctx.quadraticCurveTo(r.cx, r.cy, r.bx, r.by); ctx.stroke();
      }
      ctx.setLineDash([]); ctx.globalAlpha = 1;

      // Un point parcourt les liaisons du pays choisi, quelques secondes après chaque choix
      if (built && now < pulseUntil) {
        const fade = Math.min(1, (pulseUntil - now) / 800);
        for (const r of routes) {
          if (r.a !== sel && r.b !== sel) continue;
          const t = ((now / 1700) + hash(r.a + r.b, 5)) % 1;
          const [x, y] = at(r, t, sel);
          ctx.globalAlpha = 0.28 * fade; ctx.fillStyle = C.ivory; ctx.beginPath(); ctx.arc(x, y, 8 * px, 0, 6.2832); ctx.fill();
          ctx.globalAlpha = fade; ctx.beginPath(); ctx.arc(x, y, 3.2 * px, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Les villes : un point par marché ; celle du pays choisi porte un anneau (forme, pas seulement couleur)
      for (const id of Object.keys(ATLAS_CITIES)) {
        const v = nodes[id].v; if (v <= 0.01) continue;
        const [x, y] = cityOf(id), on = id === sel;
        ctx.fillStyle = on ? C.route : C.ivory;
        ctx.beginPath(); ctx.arc(x, y, (on ? 5.2 : 3.3) * px * v, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = C.border; ctx.lineWidth = 1.2 * px; ctx.stroke();
        if (on) { ctx.strokeStyle = C.route; ctx.lineWidth = 1.4 * px; ctx.beginPath(); ctx.arc(x, y, 10 * px * v, 0, 6.2832); ctx.stroke(); }
      }

      // Les noms : la ville choisie et celles qui lui sont reliées
      if (g.labels > 0.01) {
        ctx.font = `700 ${11.5 * px}px "Manrope Variable", Manrope, sans-serif`;
        ctx.textBaseline = "middle"; ctx.lineJoin = "round";
        for (const id of [sel, ...near, hover]) {
          const c = id && cityOf(id); if (!c) continue;
          const [lx, ly, align] = LABEL[id] ?? [13, -1, "left"];
          ctx.textAlign = align;
          const x = c[0] + lx * px, y = c[1] + ly * px;
          ctx.globalAlpha = g.labels;
          ctx.strokeStyle = C.border; ctx.lineWidth = 3.5 * px; ctx.strokeText(c[2], x, y);
          ctx.fillStyle = id === sel ? C.route : C.ivory; ctx.fillText(c[2], x, y);
        }
        ctx.globalAlpha = 1;
      }
    };

    const frame = () => {
      if (!inView) return;
      const now = performance.now();
      if (dirty || (tl && tl.isActive()) || (built && now < pulseUntil)) { dirty = false; draw(now); }
    };

    /** Le continent se construit : pièces éparses, rassemblement, marchés, liaisons. */
    const build = () => {
      tl?.kill();
      built = false; g.dim = 1; g.labels = 0;
      ATLAS.forEach((_, i) => Object.assign(st[i], scattered(i)));
      Object.values(nodes).forEach((n) => (n.v = 0));
      routes.forEach((r) => (r.s.prog = 0));
      // du centre vers les bords : le cœur du continent se pose d'abord
      const order = st.map((s, i) => ({ s, d: Math.hypot(ATLAS[i].c[0] - CX, ATLAS[i].c[1] - CY) })).sort((a, b) => a.d - b.d).map((o) => o.s);
      const lit = markets.map((i) => st[i]);
      tl = gsap.timeline({ onUpdate: () => { dirty = true; } })
        .to(order, { a: 0.8, duration: 0.5, ease: "power1.out", stagger: 0.006 }, 0)
        .to(order, { x: 0, y: 0, r: 0, s: 1, a: 1, duration: 1.5, ease: "expo.inOut", stagger: 0.017 }, 0.45)
        .to(lit, { lit: 1, duration: 0.5, ease: "power2.out", stagger: 0.03 }, ">-0.45")
        .to(Object.values(nodes), { v: 1, duration: 0.5, ease: "expo.out", stagger: 0.03 }, "<0.05")
        .to(routes.map((r) => r.s), { prog: 1, duration: 0.85, ease: "power2.inOut", stagger: 0.022 }, ">-0.25")
        .add(() => { built = true; pulseUntil = performance.now() + 9000; })
        .to(g, { dim: 0.26, labels: 1, duration: 0.7, ease: "power2.out" }, ">");
    };

    size();
    const ro = new ResizeObserver(size); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; dirty = true; }); io.observe(cv);
    gsap.ticker.add(frame);
    document.fonts.ready.then(() => { dirty = true; });
    const trigger = reduced || !scene.current ? null : ScrollTrigger.create({ trigger: scene.current, start: "top 36%", once: true, onEnter: build });

    // Survol et clic : seuls les marchés de la démonstration répondent
    const hit = (e: PointerEvent) => {
      if (!built) return "";
      const r = cv.getBoundingClientRect(), x = (e.clientX - r.left - ox) / k, y = (e.clientY - r.top - oy) / k;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      let found = "";
      for (const id of Object.keys(ATLAS_CITIES)) { const c = cityOf(id); if (Math.hypot(c[0] - x, c[1] - y) < 16 / k) { found = id; break; } }
      if (!found) for (const i of markets) if (ctx.isPointInPath(paths[i], x, y)) { found = ATLAS[i].id; break; }
      ctx.restore();
      return found;
    };
    const onMove = (e: PointerEvent) => { const h = hit(e); if (h !== hover) { hover = h; cv.style.cursor = h ? "pointer" : ""; dirty = true; } };
    const onLeave = () => { if (hover) { hover = ""; cv.style.cursor = ""; dirty = true; } };
    const onClick = (e: PointerEvent) => { const h = hit(e); if (h) pick.current(h as CountryCode); };
    cv.addEventListener("pointermove", onMove); cv.addEventListener("pointerleave", onLeave); cv.addEventListener("click", onClick as EventListener);

    api.current = {
      select: (c) => { sel = c; dirty = true; if (built && !reduced) pulseUntil = performance.now() + 7000; },
      replay: () => { if (!reduced) build(); },
    };
    return () => {
      tl?.kill(); trigger?.kill(); ro.disconnect(); io.disconnect(); gsap.ticker.remove(frame);
      cv.removeEventListener("pointermove", onMove); cv.removeEventListener("pointerleave", onLeave); cv.removeEventListener("click", onClick as EventListener);
      api.current = null;
    };
    // la sélection est transmise par l'effet ci-dessous : la toile n'est montée qu'une fois
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { api.current?.select(selected); }, [selected]);

  const markets = Object.keys(ATLAS_CITIES).length;
  const links = new Set(COUNTRIES.flatMap((c) => c.connected.filter((o) => ATLAS_CITIES[c.code] && ATLAS_CITIES[o]).map((o) => [c.code, o].sort().join("-")))).size;

  return (
    <div className="atlas">
      <canvas ref={canvas} className="atlas__canvas" role="img" aria-label={`Carte de l'Afrique : ${markets} marchés et ${links} liaisons entre eux. ${countryByCode(selected).name} est sélectionné.`} />
      <p className="atlas__legend"><span className="tabular">{markets}</span> marchés <i aria-hidden="true" /> <span className="tabular">{links}</span> liaisons</p>
      <button type="button" className="atlas__replay" onClick={() => api.current?.replay()}><RotateCcw size={15} aria-hidden="true" />Rejouer</button>
    </div>
  );
}
