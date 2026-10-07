import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ ease: "power3.out", duration: 0.9 });

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Révélations communes : [data-reveal] monte de quelques pixels à l'entrée dans l'écran,
 * [data-draw] (svg path/line) se trace par stroke-dashoffset. Tout est visible sans JavaScript.
 */
export function setupReveals(scope: HTMLElement) {
  if (prefersReducedMotion()) return;
  const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope);
  gsap.set(blocks, { autoAlpha: 0, y: 22 });
  const io = new IntersectionObserver(
    (entries) => {
      const seen = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      if (!seen.length) return;
      seen.forEach((el) => io.unobserve(el));
      gsap.to(seen, { autoAlpha: 1, y: 0, stagger: 0.07, overwrite: true });
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  blocks.forEach((el) => io.observe(el));

  // Tampons de section : posés à l'entrée de la section, une seule fois
  const stamps = gsap.utils.toArray<HTMLElement>("[data-stamp]", scope);
  gsap.set(stamps, { autoAlpha: 0, scale: 1.12, rotate: -3 });
  const ioStamps = new IntersectionObserver(
    (entries) => entries.filter((e) => e.isIntersecting).forEach((e) => { ioStamps.unobserve(e.target); stampIn(e.target); }),
    { rootMargin: "0px 0px -20% 0px" },
  );
  stamps.forEach((el) => ioStamps.observe(el));

  const lines = gsap.utils.toArray<SVGGeometryElement>("[data-draw]", scope);
  lines.forEach((el) => {
    const len = el.getTotalLength ? el.getTotalLength() : 1000;
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(el, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });

  return () => { io.disconnect(); ioStamps.disconnect(); };
}

/** Le tampon se pose : échelle 1,12 → 1, rotation −3° → −2°, sans rebond. */
export const stampIn = (el: gsap.TweenTarget, at?: number | string, tl?: gsap.core.Timeline) => {
  const vars = { autoAlpha: 1, scale: 1, rotate: -2, duration: 0.55, ease: "expo.out" };
  const from = { autoAlpha: 0, scale: 1.12, rotate: -3 };
  return tl ? tl.fromTo(el, from, vars, at) : gsap.fromTo(el, from, vars);
};

export { gsap, ScrollTrigger, useGSAP };
