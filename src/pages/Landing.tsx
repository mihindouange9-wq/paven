import { useEffect, useRef, useState } from "react";
import { SCENES } from "../content/fr";
import { ScrollTrigger, prefersReducedMotion, setupReveals, useGSAP } from "../lib/motion";
import { goTo, mountNuage, type SceneInfo } from "../lib/nuage";
import Header from "../sections/Header";
import Hero from "../sections/Hero";
import Problem from "../sections/Problem";
import How from "../sections/How";
import Engine from "../sections/Engine";
import MapSection from "../sections/MapSection";
import Trust from "../sections/Trust";
import Final from "../sections/Final";
import Footer from "../sections/Footer";
import "./landing.css";

/* La page d'accueil : sept scènes d'un écran. Entre deux scènes, le nuage de pigment (src/lib/nuage.ts). */
export default function Landing() {
  const main = useRef<HTMLElement>(null);
  const cloud = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<SceneInfo>({ index: 0, tone: "dark" });

  useGSAP(
    () => {
      const stop = setupReveals(main.current!);
      const refresh = () => ScrollTrigger.refresh();
      document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh);
      return () => { stop?.(); window.removeEventListener("load", refresh); };
    },
    { scope: main },
  );

  useEffect(() => {
    const stop = mountNuage(main.current!, cloud.current!, setScene, prefersReducedMotion());
    // Arrivée sur une ancre (/#marches) : la scène visée, sans passage
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    return stop;
  }, []);

  // Tout lien interne (navigation, rail, appels à l'action) passe par le nuage
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      goTo(el);
      window.history.replaceState(null, "", `#${id}`);
      el.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <Header />
      <main id="contenu" ref={main} tabIndex={-1}>
        <Hero />
        <Problem />
        <How />
        <Engine />
        <MapSection />
        <Trust />
        <Final />
      </main>
      <Footer />

      <nav className="rail" aria-label="Scènes de la page" data-tone={scene.tone}>
        <ol>
          {SCENES.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="rail__dot" aria-current={i === scene.index ? "true" : undefined}>
                <span className="rail__label">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <canvas ref={cloud} className="nuage" aria-hidden="true" />
    </>
  );
}
