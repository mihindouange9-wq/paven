import { Stamp } from "./ui";

/** Le tampon qui marque l'entrée dans une section : posé à l'arrivée (voir setupReveals, [data-stamp]). */
export default function SectionStamp({ children, solid }: { children: string; solid?: boolean }) {
  return <Stamp solid={solid} className="section-stamp" data-stamp>{children}</Stamp>;
}
