import { useRef } from "react";
import { ScrollTrigger, setupReveals, useGSAP } from "../lib/motion";
import Header from "../sections/Header";
import Hero from "../sections/Hero";
import Problem from "../sections/Problem";
import Need from "../sections/Need";
import Where from "../sections/Where";
import Engine from "../sections/Engine";
import MapSection from "../sections/MapSection";
import ExpansionSection from "../sections/ExpansionSection";
import Journey from "../sections/Journey";
import Local from "../sections/Local";
import Cross from "../sections/Cross";
import Trust from "../sections/Trust";
import MobileSection from "../sections/MobileSection";
import Final from "../sections/Final";
import Footer from "../sections/Footer";
import "./landing.css";

export default function Landing() {
  const main = useRef<HTMLElement>(null);

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

  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <Header />
      <main id="contenu" ref={main}>
        <Hero />
        <Problem />
        <Need />
        <Where />
        <Engine />
        <MapSection />
        <ExpansionSection />
        <Journey />
        <Local />
        <Cross />
        <Trust />
        <MobileSection />
        <Final />
      </main>
      <Footer />
    </>
  );
}
