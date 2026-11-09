import { useEffect, useRef, type RefObject } from "react";
import { compute, draw, type Op } from "./Marbling";

/* Le bain vivant : la marbrure est recalculée à chaque image, si bien que les taches de pigment bougent seules.
   Le parent fournit les opérations pour un instant donné (`build(t)`, t en secondes) : c'est lui qui écrit le
   rythme. `progress` dit combien d'opérations sont posées (l'entrée de la scène les pose une à une).
   Avec une souris, le pointeur devient un stylet : en traversant le bain il tire le pigment, qui revient ensuite.
   La boucle s'arrête quand le bain sort de l'écran ou que l'onglet est caché ; en mouvement réduit, une seule
   image, à l'état final. Le calcul reste léger : une vingtaine de figures de 96 points. */

type Stroke = { x: number; y: number; dx: number; dy: number; born: number };
type Props = {
  build: (t: number) => Op[];
  /** Nombre d'opérations posées ; absent : toutes. */
  progress?: RefObject<{ n: number }>;
  bath: string;
  /** Le pointeur tire le pigment (souris et stylet seulement). */
  stylus?: boolean;
  className?: string;
};

export default function LiveBath({ build, progress, bath, stylus, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const fn = useRef(build);
  fn.current = build;

  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 1, h = 1, raf = 0, visible = false, t0 = performance.now(), paused = 0, pausedAt = 0;
    const strokes: Stroke[] = [];
    let last: { x: number; y: number } | null = null;

    const size = () => {
      const r = c.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width * dpr)); h = Math.max(1, Math.round(r.height * dpr));
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    };
    const frame = (now: number) => {
      raf = 0;
      const t = reduced ? 0 : (now - t0 - paused) / 1000;
      const ops = fn.current(t);
      const n = reduced ? ops.length : progress?.current ? progress.current.n : ops.length;
      // les traits du stylet : forts à la naissance, ils s'effacent en 1,8 s et le pigment revient
      while (strokes.length && now - strokes[0].born > 1800) strokes.shift();
      const full = n >= ops.length;
      const all = full && strokes.length ? ops.concat(strokes.map((s) => {
        const k = 1 - (now - s.born) / 1800;
        return { kind: "tine" as const, tine: { x: s.x, y: s.y, dx: s.dx, dy: s.dy, z: 0.085 * k * k, c: 2e-7 } };
      })) : ops;
      draw(ctx, w, h, bath, compute(all, full ? all.length : n));
      if (visible && !reduced) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    size();
    const ro = new ResizeObserver(() => { size(); kick(); });
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => {
      const on = e.isIntersecting && !document.hidden;
      if (on && !visible && pausedAt) { paused += performance.now() - pausedAt; pausedAt = 0; }
      if (!on && visible) pausedAt = performance.now();
      visible = on; if (on) kick();
    });
    io.observe(c);
    const onVis = () => { if (document.hidden) { if (visible) { visible = false; pausedAt = performance.now(); } } else { const r = c.getBoundingClientRect(); if (r.bottom > 0 && r.top < window.innerHeight) { if (pausedAt) { paused += performance.now() - pausedAt; pausedAt = 0; } visible = true; kick(); } } };
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || reduced) return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) { last = null; return; }
      if (last) {
        const dx = x - last.x, dy = y - last.y, d = Math.hypot(dx, dy);
        if (d < 0.035) return;
        strokes.push({ x: last.x, y: last.y, dx, dy, born: performance.now() });
        if (strokes.length > 6) strokes.shift();
      }
      last = { x, y };
    };
    const host = stylus ? c.parentElement?.parentElement : null;
    host?.addEventListener("pointermove", onMove);
    const onLeave = () => { last = null; };
    host?.addEventListener("pointerleave", onLeave);

    kick();
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host?.removeEventListener("pointermove", onMove); host?.removeEventListener("pointerleave", onLeave);
    };
  }, [bath, progress, stylus]);

  return <canvas ref={ref} className={`marbling ${className}`} aria-hidden="true" />;
}
