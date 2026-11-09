import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import Marbling from "../components/Marbling";
import { Button, Duo } from "../components/ui";
import { buildFinalOps } from "./Hero";
import { FINAL } from "../content/fr";

/** Clôture, sur turquoise : le titre en très grand, deux actions, et le bain peigné vu dans une goutte. */
export default function Final() {
  const ops = useMemo(() => buildFinalOps({ a: "#0D9DA4", b: "#FCE688", c: "#FFFBEA" }), []);
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
        <div className="final__bath" aria-hidden="true" data-reveal><Marbling ops={ops} progress={ops.length} bath="#0b2a2c" /></div>
      </div>
    </section>
  );
}
