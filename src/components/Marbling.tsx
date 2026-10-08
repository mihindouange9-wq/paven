import { useEffect, useRef } from "react";

/* Marbrure mathématique (ebru) : chaque goutte est un disque de pigment qui repousse les gouttes précédentes
   en anneaux nets ; un trait de stylet (peigne) déforme toutes les figures le long d'une ligne.
   Tout est déterministe : les mêmes opérations donnent toujours la même image. Aucun flou, aucun dégradé. */

export type Drop = { x: number; y: number; r: number; color: string; label?: string };
export type Tine = { x: number; y: number; dx: number; dy: number; z: number; c: number };
export type Op = { kind: "drop"; drop: Drop } | { kind: "tine"; tine: Tine };

type Pt = [number, number];
const SEG = 96;

function circle(d: Drop): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < SEG; i++) { const a = (i / SEG) * Math.PI * 2; pts.push([d.x + Math.cos(a) * d.r, d.y + Math.sin(a) * d.r]); }
  return pts;
}

/** Déplacement provoqué par une goutte : p' = c + (p − c) · √(1 + r² / |p − c|²). */
function pushByDrop(p: Pt, d: Drop): Pt {
  const dx = p[0] - d.x, dy = p[1] - d.y;
  const dist2 = dx * dx + dy * dy;
  if (dist2 < 1e-6) return [p[0] + d.r, p[1]];
  const f = Math.sqrt(1 + (d.r * d.r) / dist2);
  return [d.x + dx * f, d.y + dy * f];
}

/** Trait de stylet le long d'une ligne (origine x,y ; direction dx,dy) : décalage z qui décroît avec la distance. */
function pushByTine(p: Pt, t: Tine): Pt {
  const len = Math.hypot(t.dx, t.dy) || 1;
  const ux = t.dx / len, uy = t.dy / len;
  const nx = -uy, ny = ux;
  const d = Math.abs((p[0] - t.x) * nx + (p[1] - t.y) * ny);
  const k = t.z * Math.pow(t.c, d);
  return [p[0] + ux * k, p[1] + uy * k];
}

export function compute(ops: Op[], upTo: number): { color: string; pts: Pt[] }[] {
  const shapes: { color: string; pts: Pt[] }[] = [];
  const n = Math.min(ops.length, Math.max(0, Math.floor(upTo)));
  const frac = Math.max(0, Math.min(1, upTo - n));
  const apply = (op: Op, t = 1) => {
    if (op.kind === "drop") {
      const d = { ...op.drop, r: op.drop.r * t };
      for (const s of shapes) s.pts = s.pts.map((p) => pushByDrop(p, d));
      shapes.push({ color: d.color, pts: circle(d) });
    } else {
      const tn = { ...op.tine, z: op.tine.z * t };
      for (const s of shapes) s.pts = s.pts.map((p) => pushByTine(p, tn));
    }
  };
  for (let i = 0; i < n; i++) apply(ops[i]);
  if (frac > 0.02 && n < ops.length) apply(ops[n], frac);
  return shapes;
}

export function draw(ctx: CanvasRenderingContext2D, w: number, h: number, bath: string, shapes: { color: string; pts: Pt[] }[]) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = bath;
  ctx.fillRect(0, 0, w, h);
  for (const s of shapes) {
    ctx.beginPath();
    s.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h)));
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
  }
}

type Props = {
  ops: Op[];
  /** Nombre d'opérations appliquées (fractionnaire : la dernière est en cours). */
  progress: number;
  bath?: string;
  className?: string;
  label?: string;
};

/** Le bain : un canvas qui rend la marbrure à l'état demandé. Le parent anime `progress`. */
export default function Marbling({ ops, progress, bath = "#242124", className = "", label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const render = () => {
      const rect = c.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
      draw(c.getContext("2d")!, w, h, bath, compute(ops, progress));
    };
    render();
    const ro = new ResizeObserver(render);
    ro.observe(c);
    return () => ro.disconnect();
  }, [ops, progress, bath]);
  return <canvas ref={ref} className={`marbling ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
