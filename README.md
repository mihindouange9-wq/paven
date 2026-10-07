# PAVEN — Africa's Business Connection Infrastructure

Plateforme B2B qui aide les entreprises africaines à trouver les bons partenaires (distributeurs, fournisseurs,
partenaires technologiques et stratégiques), dans leur pays ou sur un autre marché africain. Ce dépôt contient la
démonstration frontend complète : landing narrative et espace produit (treize écrans) alimentés par des données fictives.

Vision : **Make Africa easier to do business with.**

## Démarrer

```bash
npm install
npm run dev        # http://127.0.0.1:5190
npm run build      # vérification TypeScript puis build de production dans dist/
npm run preview    # sert dist/ sur http://127.0.0.1:5191
```

Stack : Vite 6 · React 19 · TypeScript · React Router 7 · CSS natif (jetons en variables) · GSAP 3 + ScrollTrigger ·
Lucide · Manrope et DM Sans auto-hébergées (fontsource). Sur ce poste, `rollup` et `esbuild` sont figés par
`overrides` ; ailleurs ces overrides sont sans effet.

## Organisation

```
index.html                 métadonnées, Open Graph ; adresses absolues et JSON-LD injectés par vite.config.ts
render.yaml                Blueprint Render (site statique, réécriture, en-têtes, SITE_URL)
public/                    favicon, icônes, manifest, og-image, brand/ (logos SVG)
src/
  main.tsx                 routeur : / (landing) et /app/* (espace, chargé à la demande)
  styles/                  tokens.css (palette, rôles, typographie), base.css, components.css (vocabulaire du dossier)
  brand/Logo.tsx           symbole et logo (le symbole : une route qui part d'un marché vers un autre)
  components/              ui.tsx (Field, Score, Country, PType, Stamp, Button…), AfricaMap, Phone, CompanyRow
  sections/                les quatorze sections de la landing
  pages/Landing.tsx        assemblage de la landing + landing.css
  app/                     Shell (rail, barre) + app.css + pages/ (Overview, Discover, Matches, MatchDetail,
                           Companies, CompanyProfile, Opportunities, Messages, DealRooms, DealRoomDetail,
                           Expansion, Pipeline, Analytics)
  content/fr.ts            tous les textes de l'interface (français)
  data/types.ts            modèle : Company, Country, City, Industry, PartnershipType, Opportunity, Match,
                           Message, DealRoom, User, Verification, Market, ExpansionRequest
  data/mock.ts             données de démonstration (entreprises fictives, scores, conversations)
tools/
  build-brand.mjs          régénère favicon, icônes, og-image, manifest et les SVG de public/brand/
  shoot.mjs                captures de la landing section par section (ordinateur et téléphone)
  shoot-app.mjs            captures des écrans de l'espace, débordements et erreurs console
PRODUCT.md                 vérité produit issue du brief client
DESIGN.md                  système visuel documenté depuis le build
docs/DEPLOIEMENT.md        mise en ligne sur Render
```

## Données

Toutes les entreprises, personnes, chiffres par pays, scores et conversations sont **fictifs** et signalés comme tels
dans l'interface. Pour brancher un vrai moteur, remplacer `src/data/mock.ts` par des appels d'API qui respectent
`src/data/types.ts`.

## Vérification

```bash
npm run build && npm run preview
node tools/shoot.mjs http://127.0.0.1:5191 .impeccable/review/shots 1440,390
node tools/shoot-app.mjs http://127.0.0.1:5191 .impeccable/review/app 1440,390
```

Le second outil signale tout débordement horizontal et toute erreur console sur les treize écrans.
