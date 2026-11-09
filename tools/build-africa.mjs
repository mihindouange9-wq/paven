// Génère src/data/africa.ts : les contours réels des pays d'Afrique, projetés dans un repère de 2 000 unités.
// Source : Natural Earth (domaine public), résolution 1:50 m, via le paquet world-atlas (TopoJSON).
// node tools/build-africa.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { feature } = require("topojson-client");
const topo = require("world-atlas/countries-50m.json");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* Pays d'Afrique : code ISO numérique (celui du jeu de données) → code à deux lettres. Les très petits États
   insulaires loin des côtes (Cap-Vert, Maurice, Seychelles) sortent du cadre : ils ne feraient qu'un point. */
const AFRICA = {
  "012": "DZ", "024": "AO", "204": "BJ", "072": "BW", "854": "BF", "108": "BI", "120": "CM", "140": "CF", "148": "TD", "174": "KM",
  "178": "CG", "180": "CD", "384": "CI", "262": "DJ", "818": "EG", "226": "GQ", "232": "ER", "748": "SZ", "231": "ET", "266": "GA",
  "270": "GM", "288": "GH", "324": "GN", "624": "GW", "404": "KE", "426": "LS", "430": "LR", "434": "LY", "450": "MG", "454": "MW",
  "466": "ML", "478": "MR", "504": "MA", "508": "MZ", "516": "NA", "562": "NE", "566": "NG", "646": "RW", "678": "ST", "686": "SN",
  "694": "SL", "706": "SO", "710": "ZA", "728": "SS", "729": "SD", "834": "TZ", "768": "TG", "788": "TN", "800": "UG", "732": "EH",
  "894": "ZM", "716": "ZW",
};
/* Ville principale de chaque marché de la démonstration : [longitude, latitude, nom]. */
const CITIES = {
  GA: [9.45, 0.39, "Libreville"], CM: [9.7, 4.05, "Douala"], CI: [-4.01, 5.36, "Abidjan"], SN: [-17.47, 14.72, "Dakar"],
  MA: [-7.59, 33.57, "Casablanca"], GH: [-0.19, 5.6, "Accra"], NG: [3.38, 6.52, "Lagos"], KE: [36.82, -1.29, "Nairobi"],
  RW: [30.06, -1.95, "Kigali"], ZA: [28.05, -26.2, "Johannesburg"], TZ: [39.21, -6.79, "Dar es Salaam"], EG: [31.24, 30.04, "Le Caire"],
  CG: [15.24, -4.26, "Brazzaville"], CD: [15.31, -4.32, "Kinshasa"], ET: [38.74, 9.03, "Addis-Abeba"], BJ: [2.39, 6.37, "Cotonou"],
  TG: [1.22, 6.13, "Lomé"],
};

const W = 2000, LON0 = -18.6, LON1 = 51.8, LAT0 = -35.4, LAT1 = 37.8;
const S = W / (LON1 - LON0), H = Math.round((LAT1 - LAT0) * S);
const px = (lon, lat) => [Math.round((lon - LON0) * S), Math.round((LAT1 - lat) * S)];
const inside = ([lon, lat]) => lon >= LON0 - 0.5 && lon <= LON1 + 0.5 && lat >= LAT0 - 0.5 && lat <= LAT1 + 0.5;

const area = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1]); return Math.abs(a / 2); };
const centroid = (r) => {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const f = r[j][0] * r[i][1] - r[i][0] * r[j][1]; a += f; cx += (r[j][0] + r[i][0]) * f; cy += (r[j][1] + r[i][1]) * f; }
  return a ? [Math.round(cx / (3 * a)), Math.round(cy / (3 * a))] : r[0];
};
/* Chemin compact : coordonnées entières, déplacements relatifs, espaces omis devant un signe moins. */
const pathOf = (rings) => rings.map((r) => {
  let s = `M${r[0][0]} ${r[0][1]}l`, first = true;
  for (let i = 1; i < r.length; i++) {
    for (const v of [r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]]) { s += (first || v < 0 ? "" : " ") + v; first = false; }
  }
  return s + "z";
}).join("");

const countries = [];
for (const f of feature(topo, topo.objects.countries).features) {
  const id = AFRICA[f.id] ?? (f.properties.name === "Somaliland" ? "XS" : null);
  if (!id) continue;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  const rings = [];
  for (const poly of polys) {
    if (!poly[0].some(inside)) continue; // territoire hors du cadre
    for (const ring of poly) {
      const pts = [];
      for (const c of ring) { const p = px(c[0], c[1]); const q = pts[pts.length - 1]; if (!q || q[0] !== p[0] || q[1] !== p[1]) pts.push(p); }
      if (pts.length > 1 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) pts.pop();
      if (pts.length >= 3 && area(pts) >= 3) rings.push(pts);
    }
  }
  if (!rings.length) continue;
  const main = rings.reduce((a, b) => (area(b) > area(a) ? b : a));
  countries.push({ id, d: pathOf(rings), c: centroid(main), market: id in CITIES, points: rings.reduce((n, r) => n + r.length, 0) });
}
countries.sort((a, b) => a.id.localeCompare(b.id));
const cities = Object.fromEntries(Object.entries(CITIES).map(([k, [lon, lat, name]]) => [k, [...px(lon, lat), name]]));

const out = `/* Contours des pays d'Afrique. FICHIER GÉNÉRÉ par tools/build-africa.mjs : ne pas modifier à la main.
   Source : Natural Earth (domaine public), 1:50 m, projection plate carrée, repère de ${W} × ${H} unités.
   Chaque pays : code à deux lettres, chemin (compatible Path2D et SVG), centre, et s'il est un marché de la démonstration. */
export type AtlasCountry = { id: string; d: string; c: [number, number]; market: boolean };
export const ATLAS_W = ${W};
export const ATLAS_H = ${H};
export const ATLAS: AtlasCountry[] = ${JSON.stringify(countries.map(({ points, ...c }) => c))};
/* Ville principale de chaque marché : [x, y, nom]. */
export const ATLAS_CITIES: Record<string, [number, number, string]> = ${JSON.stringify(cities)};
`;
fs.writeFileSync(path.join(root, "src/data/africa.ts"), out);
console.log(`${countries.length} pays · ${countries.reduce((n, c) => n + c.points, 0)} points · ${(out.length / 1024).toFixed(0)} Ko · repère ${W} × ${H}`);
console.log("marchés :", countries.filter((c) => c.market).map((c) => c.id).join(" "));
