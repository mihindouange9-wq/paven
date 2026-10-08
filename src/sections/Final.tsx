import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import Marbling from "../components/Marbling";
import { Button } from "../components/ui";
import { buildFinalOps } from "./Hero";
import { FINAL } from "../content/fr";

export default function Final() {
  const ops = useMemo(buildFinalOps, []);
  return (
    <section id="commencer" className="section final" data-tone="deep">
      <div className="final__bath" aria-hidden="true"><Marbling ops={ops} progress={ops.length} bath="#1a1719" /></div>
      <div className="container final__inner">
        <h2 data-reveal>{FINAL.title}</h2>
        <p className="lead" data-reveal>{FINAL.lead}</p>
        <div className="final__actions" data-reveal>
          <Button to="/app/decouvrir" primary>{FINAL.primary}<ArrowRight /></Button>
          <Button href="#marches" light>{FINAL.secondary}</Button>
        </div>
      </div>
    </section>
  );
}
