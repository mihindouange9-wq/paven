import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui";
import SectionStamp from "../components/SectionStamp";
import { FINAL } from "../content/fr";

export default function Final() {
  return (
    <section id="commencer" className="section final" data-tone="dark">
      <div className="container final__inner">
        <SectionStamp solid>Commencer</SectionStamp>
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
