import { useMemo } from "react";
import { CITIES, countryByCode } from "../data/mock";
import type { CountryCode } from "../data/types";

/* Contour simplifié du continent (0–100). Il n'est jamais dessiné en trait : il ne sert qu'à poser la trame de points. */
const OUTLINE: [number, number][] = [
  [27, 9], [34, 7], [41, 7], [47, 10], [52, 12], [57, 12], [62, 12], [67, 13], [69, 16], [68, 21], [71, 27], [75, 31], [79, 37], [84, 39], [91, 40], [92, 43],
  [86, 49], [80, 54], [76, 58], [74, 63], [73, 68], [71, 73], [69, 78], [66, 82], [63, 87], [58, 92], [54, 90], [51, 85], [49, 78], [48, 70], [48, 64], [46, 60],
  [44, 56], [45, 51], [44, 48], [40, 47], [36, 47], [32, 48], [28, 47], [25, 45], [22, 42], [20, 39], [18, 35], [16, 32], [16, 27], [18, 22], [21, 17], [24, 12],
];

function inside(x: number, y: number) {
  let ok = false;
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i], [xj, yj] = OUTLINE[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ok = !ok;
  }
  return ok;
}

const STEP = 2.1;

/* Position des étiquettes : les villes côtières d'Afrique de l'Ouest et les capitales jumelles se chevauchent sinon. */
const LABEL: Record<string, { dx: number; dy: number; anchor?: "end" | "middle" } | null> = {
  abidjan: { dx: -1.9, dy: 0.5, anchor: "end" },
  accra: { dx: 0, dy: 3.4, anchor: "middle" },
  lome: null,
  cotonou: null,
  lagos: { dx: 1.6, dy: -1.6 },
  brazzaville: { dx: 1.9, dy: -0.9 },
  kinshasa: { dx: 1.9, dy: 2.6 },
  kigali: { dx: -1.9, dy: 0.5, anchor: "end" },
  nairobi: { dx: 1.9, dy: 0.5 },
  libreville: { dx: -1.9, dy: 0.5, anchor: "end" },
  douala: { dx: 1.9, dy: -0.6 },
};

type Props = {
  selected?: CountryCode | null;
  onSelect?: (code: CountryCode) => void;
  /** Routes à tracer entre villes (ids), en plus de celles du pays choisi. */
  routes?: [string, string][];
  /** Villes mises en avant (ids). */
  highlight?: string[];
  labels?: boolean;
  className?: string;
};

/** Carte abstraite : une trame de points, des villes, des routes. Jamais de frontières, jamais de couleurs par pays. */
export default function AfricaMap({ selected, onSelect, routes = [], highlight = [], labels = true, className = "" }: Props) {
  const dots = useMemo(() => {
    const out: [number, number][] = [];
    for (let y = 6; y < 96; y += STEP) for (let x = 12; x < 96; x += STEP) if (inside(x + (Math.round(y / STEP) % 2) * (STEP / 2), y)) out.push([x + (Math.round(y / STEP) % 2) * (STEP / 2), y]);
    return out;
  }, []);

  const country = selected ? countryByCode(selected) : null;
  const capital = (code: string) => CITIES.find((c) => c.country === code)!;
  const autoRoutes: [string, string][] = country ? country.connected.map((code) => [capital(country.code).id, capital(code).id]) : [];
  const allRoutes = [...autoRoutes, ...routes];
  const city = (id: string) => CITIES.find((c) => c.id === id)!;

  return (
    <svg viewBox="0 0 100 100" className={`africa ${className}`} role="img" aria-label="Carte abstraite des marchés africains">
      <g className="africa__dots" aria-hidden="true">
        {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.42" />)}
      </g>
      <g className="africa__routes" aria-hidden="true">
        {allRoutes.map(([a, b], i) => {
          const A = city(a), B = city(b);
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 - Math.abs(A.x - B.x) * 0.18;
          return <path key={i} d={`M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`} data-draw />;
        })}
      </g>
      <g className="africa__cities">
        {CITIES.map((c) => {
          const on = c.country === selected || highlight.includes(c.id);
          const main = CITIES.find((x) => x.country === c.country)!.id === c.id;
          if (!main && !on) return null;
          return (
            <g key={c.id} className={`africa__city ${on ? "is-on" : ""}`} transform={`translate(${c.x} ${c.y})`}>
              {onSelect ? (
                <circle r="2.4" className="africa__hit" onClick={() => onSelect(c.country)} tabIndex={0} role="button" aria-label={`${c.name}, ${countryByCode(c.country).name}`} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(c.country)} />
              ) : null}
              <circle r={on ? 1.3 : 0.9} className="africa__node" />
              {labels && main && LABEL[c.id] !== null ? (() => { const p = LABEL[c.id] ?? { dx: 1.9, dy: 0.5 }; return <text x={p.dx} y={p.dy} textAnchor={p.anchor ?? "start"} className="africa__label">{c.name}</text>; })() : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
