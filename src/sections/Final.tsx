import { ArrowRight } from "lucide-react";
import { useCallback } from "react";
import LiveBath from "../components/LiveBath";
import { Button, Duo } from "../components/ui";
import { buildFinalOps, PIGMENTS } from "./Hero";
import { FINAL } from "../content/fr";

/** Clôture, sur turquoise : le titre en très grand, deux actions, et le bain peigné vu dans une goutte. */
export default function Final() {
  const build = useCallback((t: number) => buildFinalOps(PIGMENTS, t), []);
  return (
    <section id="commencer" className="scene final" data-scene data-tone="turquoise" tabIndex={-1}>
      <div className="container final__inner">
        <div className="final__copy">
          <h2 data-reveal="lines"><Duo parts={FINAL.title} /></h2>
          <p className="lead" data-reveal>{FINAL.lead}</p>
          <div className="final__actions" data-reveal>
            <Button to="/app/decouvrir" className="btn--ink">{FINAL.primary}<ArrowRight /></Button>
            <Button href="#marches">{FINAL.secondary}</Button>
          </div>
        </div>
        <div className="final__bath" aria-hidden="true" data-reveal><LiveBath build={build} bath="#0b2a2c" /></div>
      </div>
    </section>
  );
}
