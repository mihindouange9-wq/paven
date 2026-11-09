import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, useGSAP);
gsap.defaults({ ease: "power3.out", duration: 0.9 });

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Entrées des scènes. Une scène ne joue ses entrées qu'une fois « ouverte », c'est-à-dire quand le nuage du
 * passage commence à s'éclaircir sur elle (son haut franchit 40 % de l'écran) : rien ne se joue sous le nuage.
 * Chaque matière a son geste :
 *   [data-reveal]         le bloc monte de quelques pixels ;
 *   [data-reveal="lines"] le titre monte ligne par ligne dans son masque ;
 *   [data-reveal="lift"]  la feuille se lève du bain (600 ms, sans rebond) ;
 *   [data-stamp]          le tampon se pose ;
 *   [data-draw]           le trait se trace.
 * Tout est visible sans JavaScript et en mouvement réduit.
 */
export function setupReveals(scope: HTMLElement) {
  if (prefersReducedMotion()) return;
  const kind = (el: Element) => el.getAttribute("data-reveal") || "rise";
  const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope);
  blocks.forEach((el) => {
    const k = kind(el);
    if (k === "lift") gsap.set(el, { autoAlpha: 0, y: -34, rotate: -1.2, transformOrigin: "50% 0%" });
    else if (k === "lines") gsap.set(el, { autoAlpha: 0 });
    else gsap.set(el, { autoAlpha: 0, y: 22 });
  });

  const play = (els: Element[]) => {
    els.forEach((el, i) => {
      const k = kind(el), delay = i * 0.07;
      if (k === "lift") gsap.to(el, { autoAlpha: 1, y: 0, rotate: 0, duration: 0.6, ease: "expo.out", delay: delay + 0.1, overwrite: true });
      else if (k === "lines") {
        const split = SplitText.create(el, { type: "lines", mask: "lines" });
        gsap.set(el, { autoAlpha: 1 });
        gsap.from(split.lines, { yPercent: 108, duration: 1.05, ease: "power4.out", stagger: 0.09, delay, onComplete: () => split.revert() });
      } else gsap.to(el, { autoAlpha: 1, y: 0, delay, overwrite: true });
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const seen = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      if (!seen.length) return;
      seen.forEach((el) => io.unobserve(el));
      play(seen);
    },
    { rootMargin: "0px 0px -6% 0px" },
  );
  const ioStamps = new IntersectionObserver(
    (entries) => entries.filter((e) => e.isIntersecting).forEach((e) => { ioStamps.unobserve(e.target); stampIn(e.target, undefined, undefined, 0.5); }),
    { rootMargin: "0px 0px -12% 0px" },
  );

  const stamps = gsap.utils.toArray<HTMLElement>("[data-stamp]", scope);
  gsap.set(stamps, { autoAlpha: 0, scale: 1.12, rotate: -3 });
  const lines = gsap.utils.toArray<SVGGeometryElement>("[data-draw]", scope);
  lines.forEach((el) => {
    const len = el.getTotalLength ? el.getTotalLength() : 1000;
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  });

  const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]", scope);
  const triggers: ScrollTrigger[] = [];
  scenes.forEach((scene, i) => {
    const open = () => {
      scene.classList.add("is-open");
      blocks.filter((el) => scene.contains(el)).forEach((el) => io.observe(el));
      stamps.filter((el) => scene.contains(el)).forEach((el) => ioStamps.observe(el));
      gsap.to(lines.filter((el) => scene.contains(el)), { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.08, delay: 0.35 });
    };
    if (i === 0) open();
    else triggers.push(ScrollTrigger.create({ trigger: scene, start: "top 40%", once: true, onEnter: open }));
  });

  return () => { io.disconnect(); ioStamps.disconnect(); triggers.forEach((t) => t.kill()); };
}

/** Le tampon se pose : échelle 1,12 → 1, rotation −3° → −2°, sans rebond. */
export const stampIn = (el: gsap.TweenTarget, at?: number | string, tl?: gsap.core.Timeline, delay = 0) => {
  const vars = { autoAlpha: 1, scale: 1, rotate: -2, duration: 0.55, ease: "expo.out", delay };
  const from = { autoAlpha: 0, scale: 1.12, rotate: -3 };
  return tl ? tl.fromTo(el, from, vars, at) : gsap.fromTo(el, from, vars);
};

export { gsap, ScrollTrigger, useGSAP };
