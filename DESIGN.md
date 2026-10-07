---
name: PAVEN
description: Le dossier d'expansion — papier off-white réglé, champs buff, tampons sunset ; l'infrastructure de mise en relation entre entreprises africaines.
colors:
  raisin: "#242124"
  buff: "#d8c39a"
  sunset: "#e96a4f"
  offwhite: "#f5f2ec"
  white: "#ffffff"
  raisin-soft: "#3a3639"
  raisin-deep: "#1a1719"
  ink-muted: "#6b6468"
  ink-faint: "#8c8488"
  buff-tint: "#ece2c9"
  buff-deep: "#b89a63"
  buff-ink: "#6e5a30"
  sunset-ink: "#b84b33"
  sunset-soft: "#f0a391"
  on-sunset: "#1f1413"
  paper-muted: "#d9cdb0"
  rule: "rgb(36 33 36 / 0.16)"
  rule-strong: "rgb(36 33 36 / 0.32)"
  rule-on-dark: "rgb(245 242 236 / 0.16)"
  rule-on-dark-strong: "rgb(245 242 236 / 0.34)"
typography:
  display:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.4rem + 4.6vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.6vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "DM Sans Variable, DM Sans, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.03rem + 0.4vw, 1.3125rem)"
    fontWeight: 420
    lineHeight: 1.5
  body:
    fontFamily: "DM Sans Variable, DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 420
    lineHeight: 1.6
  small:
    fontFamily: "DM Sans Variable, DM Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 420
    lineHeight: 1.6
  value:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  score:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
    fontFeature: "tabular-nums"
  label:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
  ui:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
rounded:
  sm: "2px"
  pill: "999px"
spacing:
  2xs: "0.25rem"
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "1.5rem"
  2xl: "2.5rem"
  3xl: "4rem"
  gutter: "clamp(1.25rem, 0.5rem + 3.4vw, 3rem)"
  section: "clamp(5rem, 3rem + 7vw, 9rem)"
components:
  button-primary:
    backgroundColor: "{colors.sunset}"
    textColor: "{colors.on-sunset}"
    typography: "{typography.ui}"
    rounded: "0"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "#d95d43"
    textColor: "{colors.on-sunset}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.raisin}"
    typography: "{typography.ui}"
    rounded: "0"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-outline-hover:
    backgroundColor: "{colors.raisin}"
    textColor: "{colors.offwhite}"
  button-light:
    backgroundColor: "transparent"
    textColor: "{colors.offwhite}"
    typography: "{typography.ui}"
    rounded: "0"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-light-hover:
    backgroundColor: "{colors.offwhite}"
    textColor: "{colors.raisin}"
  button-small:
    padding: "0 1rem"
    height: "2.5rem"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.raisin}"
    typography: "{typography.ui}"
    rounded: "0"
    padding: "0 0.85rem"
    height: "2.25rem"
  chip-hover:
    backgroundColor: "{colors.buff-tint}"
  chip-selected:
    backgroundColor: "{colors.raisin}"
    textColor: "{colors.offwhite}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.raisin}"
    typography: "{typography.ui}"
    rounded: "0"
    padding: "0 0.85rem"
    height: "2.75rem"
  label:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
  field-filled:
    backgroundColor: "{colors.buff-tint}"
    textColor: "{colors.raisin}"
    typography: "{typography.value}"
    rounded: "0"
    padding: "0.35rem 0.6rem"
  sheet:
    backgroundColor: "{colors.offwhite}"
    textColor: "{colors.raisin}"
    rounded: "0"
    padding: "0.5rem 1.25rem 1.25rem"
  panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.raisin}"
    rounded: "0"
    padding: "1rem 1.25rem 1.25rem"
  stamp:
    backgroundColor: "{colors.offwhite}"
    textColor: "{colors.sunset-ink}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1rem"
  stamp-solid:
    backgroundColor: "{colors.sunset}"
    textColor: "{colors.on-sunset}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1rem"
  monogram:
    backgroundColor: "{colors.offwhite}"
    textColor: "{colors.raisin}"
    rounded: "0"
    size: "2.75rem"
  country-code:
    backgroundColor: "transparent"
    textColor: "{colors.raisin}"
    typography: "{typography.label}"
    rounded: "0"
    padding: "0 0.35rem"
    height: "1.5rem"
  country-code-filled:
    backgroundColor: "{colors.raisin}"
    textColor: "{colors.offwhite}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.paper-muted}"
    typography: "{typography.ui}"
    rounded: "0"
    padding: "0.6rem 0.5rem"
  nav-link-active:
    backgroundColor: "{colors.raisin-soft}"
    textColor: "{colors.offwhite}"
---

# Design System: PAVEN

## Overview

**Creative North Star: « Le dossier d'expansion »**

PAVEN se présente comme un dossier de commerce international qui se remplit sous les yeux du lecteur : une feuille off-white réglée de filets raisin à 1 px, des champs dont la valeur se pose sur un aplat buff, et un tampon sunset qui vient clore chaque étape (score, « compatible », titre de section). Rien n'est décoré : chaque filet sépare un champ, chaque teinte signale un état, chaque chiffre est posé dans une cellule à largeur fixe. La densité est celle d'un formulaire administratif bien composé, non celle d'une landing SaaS ; la lecture avance de haut en bas le long d'un axe de route unique, de DEPUIS à VERS.

La matière est plate. Le papier (Blanc cassé), le papier sombre (Noir raisin pour le moteur et la clôture, Raisin profond pour le pied de page) et le blanc (interfaces de l'espace produit) se superposent par contraste de ton, jamais par ombre portée. Le seul objet qui projette une ombre est le téléphone dessiné en CSS ; le seul élément incliné est le tampon. Les icônes de type de partenariat sont une légende géométrique constante (carré plein, cercle, losange, hachure, triangle…), tenue identique de la landing à l'espace produit.

Le mouvement reste la grammaire du dossier : les champs se remplissent par pas, les routes se tracent en `stroke-dashoffset`, le tampon se pose (échelle 1,12 → 1, rotation −3° → −2°, `expo.out`), sans rebond. Tout est déjà visible sans JavaScript et déjà tracé en mouvement réduit. Rejets confirmés par la construction : pas de dégradés multicolores, pas de blobs, pas de glassmorphism, pas d'arrondis généralisés, pas de carte d'Afrique littérale (la carte est une trame de points sans frontière), pas de titre centré, pas de grille de trois cartes.

**Key Characteristics:**
- Papier Blanc cassé réglé de filets raisin à 1 px ; les listes sont des registres (`border-top` plein, lignes séparées par un filet à 16 %).
- Trois états de champ par remplissage : hachure (vide), aplat buff (rempli), contour seul (neutre) ; jamais une simple variation de teinte.
- Chiffres Manrope 800 en cellules de 0,62 em, `tabular-nums` ; le score change par fondu, pas par saut.
- Sunset réservé aux tampons, aux pastilles de vérification, aux routes, au CTA principal et aux chiffres d'accent.
- Un seul élément incliné (le tampon, −2°), une seule ombre (le téléphone), une seule courbe (`cubic-bezier(0.22, 1, 0.36, 1)`).
- Légende de types de partenariat constante sur tout le site.

## Colors

Cinq couleurs imposées, toutes les nuances dérivées en restent des teintes ; le Noir raisin écrit, le Blanc cassé porte, le Buff remplit, le Sunset tamponne.

### Primary
- **Noir raisin** (`raisin`) : l'encre. Texte, filets pleins des registres, boutons contour, chips et pays sélectionnés (fond raisin, texte Blanc cassé), fonds des sections « moteur » et « clôture » (`data-tone="dark"`), rail de navigation de l'espace produit.
- **Raisin doux** (`raisin-soft`) : surfaces posées sur le raisin (fiche du moteur, champ rempli en ton sombre, lien de rail actif).
- **Raisin profond** (`raisin-deep`) : pied de page uniquement.

### Secondary
- **Buff** (`buff`) : matière et territoire. Barres de critères sur fond raisin, fond de section `data-tone="buff"`. Rarement en aplat large.
- **Teinte buff** (`buff-tint`) : le champ rempli (`.field--filled`), le survol des lignes d'entreprise, des chips, des compteurs et des conversations : « cette ligne est touchée ».
- **Buff profond** (`buff-deep`) et **Encre buff** (`buff-ink`) : buff lisible en texte (6,1:1 sur raisin, 5,9:1 sur clair) ; réservés aux cas où un buff doit être lu.
- **Papier atténué** (`paper-muted`) : texte secondaire sur raisin (9:1), libellés et liens du pied de page et du rail.

### Tertiary
- **Sunset** (`sunset`) : l'accent contrôlé. Tampons pleins, CTA principal, pastilles de vérification actives, points de route et villes actives sur la carte, remplissage de la ligne de parcours, barre de survol sous les liens de navigation, sélection de texte, caret, badge de notification.
- **Encre sunset** (`sunset-ink`) : sunset lisible sur clair (4,6:1). Texte des tampons en contour, indices de problème, numéros d'étape, scores d'accent, codes de ports, anneau de focus.
- **Sunset doux** (`sunset-soft`) : sunset lisible sur raisin (7:1). Scores des critères du moteur, coches, survol des liens du pied de page, focus en ton sombre.
- **Sur sunset** (`on-sunset`) : l'encre posée sur un aplat sunset (tampon plein, bouton principal, badges).

### Neutral
- **Blanc cassé** (`offwhite`) : le papier. Fond du corps, des fiches, de l'en-tête (à 94 % quand il devient plein), texte sur raisin.
- **Blanc** (`white`) : les interfaces. Fond des panneaux, compteurs, bulles de message, cartes de pipeline et champs de saisie de l'espace produit.
- **Encre atténuée** (`ink-muted`) : texte secondaire sur clair (5,2:1), libellés, chapeaux, métadonnées, placeholders.
- **Encre pâle** (`ink-faint`) : métadonnées discrètes sur clair (3,6:1), grands textes seulement.
- **Filet** (`rule`) / **Filet fort** (`rule-strong`) : filets de registre et cadres sur clair. Sur raisin, **Filet sur sombre** (`rule-on-dark`) / **Filet fort sur sombre** (`rule-on-dark-strong`).

Les rôles basculent par attribut de ton : `data-tone="paper"` (défaut), `"dark"`, `"white"`, `"buff"` redéfinissent `--bg`, `--fg`, `--fg-muted`, `--line`, `--line-strong`, `--field`, `--accent-text` ; les composants ne lisent que ces rôles.

### Named Rules
**The Stamp Rule.** Le Sunset en aplat n'apparaît que sur ce qui tamponne ou appelle : tampon plein, CTA principal, pastille de vérification, point de route, badge de notification. Jamais en fond de section, jamais en dégradé, jamais en texte brut (le texte prend `sunset-ink` sur clair, `sunset-soft` sur raisin).
**The Fill-Not-Tint Rule.** Un état se lit au remplissage : vide = hachure, rempli = aplat buff-tint, choisi = aplat raisin avec texte Blanc cassé, touché = buff-tint. Changer seulement la teinte d'un texte ne suffit pas à signaler un état.
**The Ink-Role Rule.** Toute couleur de texte provient d'un rôle de ton (`--fg`, `--fg-muted`, `--accent-text`), jamais d'une couleur brute : la même fiche doit rester lisible posée sur papier, sur raisin ou sur buff.

## Typography

**Display Font:** Manrope Variable (avec Manrope, system-ui, sans-serif)
**Body Font:** DM Sans Variable (avec DM Sans, system-ui, sans-serif)
**Label/Mono Font:** Manrope en capitales espacées ; les chiffres sont en Manrope `tabular-nums` (pas de monospace).

**Character :** Manrope porte tout ce qui est structure, chiffre, bouton, libellé et titre (700–800, interlettrage serré de −0,02 à −0,04 em) ; DM Sans à 420 porte les paragraphes, chapeaux, descriptions et valeurs rédigées. Le contraste est celui d'un formulaire : libellé en petites capitales espacées, valeur en gras serré, explication en texte courant.

### Hierarchy
- **Display** (700, `clamp(2.75rem, 1.4rem + 4.6vw, 5.25rem)`, 0.98, −0,04 em) : le titre du hero uniquement, lignes révélées une à une ; à partir de 1024 px le hero le plafonne à `clamp(2.75rem, 1rem + 3.9vw, 4rem)` pour tenir sur 6/12 colonnes.
- **Headline** (700, `clamp(2rem, 1.3rem + 2.6vw, 3.5rem)`, 1.04, −0,035 em) : titre de chaque section ; la clôture monte à `clamp(2.25rem, 1.4rem + 3.6vw, 4.5rem)` ; les pages de l'espace produit descendent à `clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)`.
- **Title** (700, `clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)`, 1.2, −0,02 em) : nom d'entreprise, titre de critère, étape.
- **Lead** (DM Sans 420, `clamp(1.125rem, 1.03rem + 0.4vw, 1.3125rem)`, 1.5, `ink-muted`) : chapeau sous chaque titre, 32–36 rem de large maximum.
- **Body** (DM Sans 420, 1rem, 1.6) : paragraphes et explications, 28–44 rem de large selon le contexte.
- **Small** (DM Sans 420, 0.875rem / 0.9375rem) : métadonnées, notes de démonstration, texte de table.
- **Value** (Manrope 700, 1.125rem, 1.2, −0,02 em) : la valeur d'un champ ; grande variante `clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)` à −0,03 em pour DEPUIS / VERS.
- **Score** (Manrope 800, 1.5rem par défaut jusqu'à 4.5rem dans le moteur, 0.9, −0,04 em, `tabular-nums`) : chaque chiffre dans une cellule de 0,62 em centrée, le « % » à 0,4 em.
- **Label** (Manrope 700, 0.6875rem, 0,14 em, capitales) : libellé de champ, en-tête de table (0,12 em), ports du hero (0,8125rem, 0,12 em), étapes de Deal Room (0,75rem, 0,06–0,08 em).
- **UI** (Manrope 600–700, 0.875–0.9375rem, −0,01 em) : boutons, chips, liens de navigation, pays, type de partenariat.

### Named Rules
**The Fixed-Cell Rule.** Un chiffre qui peut changer vit dans une cellule à largeur fixe (`.score__cell`, 0,62 em, `tabular-nums`) : le compteur monte par fondu de contenu, la mise en page ne bouge jamais.
**The Label-Then-Value Rule.** Toute donnée est présentée libellé au-dessus (Manrope capitales 0,14 em, `fg-muted`), valeur au-dessous (Manrope 700 serré), filet en bas. Pas de libellé inline, pas de deux-points.

## Layout

Le conteneur mesure `min(100% − 2 × gouttière, 1280px)` avec une gouttière fluide `clamp(1.25rem, 0.5rem + 3.4vw, 3rem)`. Chaque section respire d'un `padding-block` fluide `clamp(5rem, 3rem + 7vw, 9rem)` et porte son ton (`data-tone`) ; les sections sombres (moteur, clôture) alternent avec le papier.

Les sections de la landing suivent une grille asymétrique copie / dossier : une colonne, puis à partir de 960 px `5fr 7fr` (problème, besoin, où, expansion, confiance, mobile), `4fr 7fr` (moteur) ou `7fr 5fr` (carte), avec un écart de 3–4 rem ; la colonne de copie est souvent collante (`top: 7rem`). Le hero passe à `6fr 6fr` à 1024 px, hauteur minimale 100 vh, et porte le dossier à droite ; sous 1024 px la navigation se replie dans une feuille pleine page Blanc cassé et le tampon de section repasse en flux (statique, au-dessus du titre). Les paliers observés sont 600 px (pile mobile, routes verticales), 760 px, 900/960 px (grilles à deux colonnes), 1024 px (navigation complète, hero 6/6), 1100 px (espace produit en 7/5).

L'espace produit se compose d'un rail fixe de 16,5 rem (Noir raisin, hors écran sous 1024 px, scrim raisin à 40 %) et d'une page `padding: 2.25rem 2.5rem 4rem` sur grand écran. Les compteurs sont des cellules séparées par 1 px de `rule-strong` (gap 1px sur fond filet), deux par ligne puis quatre ou cinq à 900 px.

Rythme interne : les champs se posent à `0.85rem 0` avec un écart de 0,35 rem entre libellé et valeur ; les lignes de registre à `1rem 0` ; les en-têtes de fiche à `0.9rem 1.25rem` ; les corps de fiche à `0.5rem 1.25rem 1.25rem`. Les écarts entre blocs d'une page vont de 0,75 rem (listes serrées) à 1,75–2,5 rem (groupes) et 3–4 rem (colonnes).

**The Single-Axis Rule.** Une route ne se trace que sur un seul axe : verticale dans le dossier (24 px de large, point d'origine raisin, point d'arrivée sunset), horizontale dans le parcours à partir de 960 px, courbe quadratique sur la carte. Jamais de graphe de nœuds multiples.

## Elevation & Depth

Le système est plat et réglé. La profondeur se lit par superposition de tons (papier Blanc cassé → panneau Blanc ; raisin → raisin doux) et par la force du filet (16 % pour une ligne, 32 % pour un cadre, 100 % raisin pour une tête de registre). Les fiches (`.sheet`, `.panel`) sont de simples cadres à 1 px ; les tampons sont plats ; aucun composant n'a d'ombre au repos ni au survol. L'en-tête fixe et la barre de l'espace produit utilisent un fond Blanc cassé à 94 % avec un flou d'arrière-plan de 8 px et un filet bas : c'est le seul flou du site, et il n'est pas un verre (pas de bordure claire, pas de reflet).

### Shadow Vocabulary
- **Corps du téléphone** (`box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.12), 0 46px 70px -34px rgb(36 33 36 / 0.55)`) : uniquement sur `.phone`, l'objet physique posé sur la page. Son corps est un dégradé sombre monochrome (`#3b3538 → #141214 → #0e0c0d → #2b2628`), le seul dégradé de surface du site.

### Named Rules
**The Phone-Only Shadow Rule.** La seule ombre portée du site est celle du téléphone. Les fiches, tampons, boutons, chips, panneaux et menus restent plats ; un composant qui a besoin de se détacher change de ton ou de filet, pas d'élévation.

## Shapes

Le dossier est carré. `--radius` vaut 2 px et ne sert qu'à l'anneau de focus ; les boutons, champs, chips, fiches, panneaux, monogrammes, codes pays, badges et bulles de message ont des angles vifs (0). Les seules formes rondes sont celles qui le sont par nature : le tampon (pilule à 999 px, bordure 2 px, incliné de −2°), les pastilles de vérification et les points de route (cercles), les marqueurs circulaires de la légende, et le téléphone (48 px extérieur, 40 px écran).

Les bordures sont le langage : 1 px `rule` pour séparer, 1 px `rule-strong` pour cadrer, 1 px raisin plein pour ouvrir un registre, 2 px raisin pour les marqueurs et les étapes, 1 px pointillé pour un emplacement vide de pipeline, hachure à 135° (1 px tous les 6 px) pour un champ vide. Les marqueurs de type de partenariat sont des carrés de 0,75 rem dont la géométrie (plein, cercle, losange, soulignement 6 px, hachure, triangle `clip-path`, tirets, double cercle, demi-teinte diagonale) identifie le type sans icône.

**The Only-Tilt Rule.** Le tampon est le seul élément incliné (−2° au repos, −3° à l'arrivée). Aucun autre bloc, image ou texte ne tourne.

## Components

Précis et posé : des champs de formulaire sur papier réglé, des boutons rectangulaires de 3,25 rem, un tampon qui se pose. Tout composant lit ses couleurs dans les rôles de ton et reste identique entre la landing et l'espace produit.

### Buttons
- **Shape:** rectangle à angles vifs (0), hauteur minimale 3,25 rem, `padding: 0 1.5rem`, Manrope 700 à 0,9375 rem, icône Lucide à 1,1 em à droite.
- **Primary:** aplat Sunset, texte `on-sunset`, bordure Sunset ; survol en sunset assombri (`#d95d43`).
- **Outline (défaut):** transparent, bordure et texte Noir raisin ; survol inverse (fond raisin, texte Blanc cassé).
- **Light (sur raisin):** bordure et texte Blanc cassé ; survol inverse (fond Blanc cassé, texte raisin).
- **Small:** 2,5 rem de haut, `padding: 0 1rem`, 0,875 rem.
- **Hover / Focus / Active:** transitions linéaires de 180 ms sur fond, couleur et bordure ; `:active` à `scale(0.985)` ; focus visible par anneau 2 px `sunset-ink` décalé de 3 px (`sunset-soft` sur raisin) ; désactivé à 45 % d'opacité.

### Chips
- **Style:** bordure 1 px `rule-strong`, fond transparent, Manrope 600 à 0,8125 rem, 2,25 rem de haut, `padding: 0 0.85rem`, angles vifs.
- **State:** survol en `buff-tint` ; sélectionné (`aria-pressed="true"`) en aplat raisin, texte Blanc cassé (inversé sur ton sombre). Même traitement pour les boutons de type de besoin (grille à filets raisin) et de pays.

### Cards / Containers
- **Fiche (`.sheet`) :** cadre 1 px `rule-strong`, fond du ton courant ; en-tête `0.9rem 1.25rem` avec libellé fort à gauche et référence tabulaire à droite, séparé par un filet fort ; corps `0.5rem 1.25rem 1.25rem` en grille de champs (1 ou 2 colonnes, écart 1,5 rem). Sur raisin la fiche prend `raisin-soft`.
- **Panneau (`.panel`) :** même anatomie, fond Blanc, pour l'espace produit ; variante `--dark` en raisin avec rôles redéfinis.
- **Compteur :** cellules Blanc séparées par 1 px de filet fort, chiffre Manrope 800 à 2,25 rem, survol `buff-tint`.
- **Shadow Strategy:** aucune (voir Elevation & Depth).

### Inputs / Fields
- **Champ de dossier (`.field`) :** libellé capitales espacées puis valeur Manrope 700, filet bas 1 px `rule`, `padding: 0.85rem 0`. États : *plain* (texte seul), *filled* (valeur sur aplat `buff-tint`, `padding: 0.35rem 0.6rem`, débordant de −0,6 rem), *empty* (hachure, texte transparent, « — »).
- **Saisie (`.input`, `.select`) :** fond Blanc (raisin doux sur ton sombre), bordure 1 px `rule-strong`, 2,75 rem de haut, DM Sans à 0,9375 rem, caret Sunset, placeholder `ink-muted` ; sélecteur avec chevron dessiné en deux dégradés de 5 px.
- **Focus:** anneau 2 px `sunset-ink` sans décalage, bordure effacée.
- **Case à cocher :** `accent-color` Sunset.

### Navigation
- **En-tête de landing :** barre fixe de 4,5 rem, transparente puis Blanc cassé à 94 % avec flou 8 px et filet bas une fois défilée ; liens Manrope 600 à 0,875 rem avec soulignement Sunset 2 px qui s'étend depuis la gauche en 420 ms ; sélecteur FR / EN en deux boutons cadrés, l'actif en aplat raisin ; sous 1024 px, bouton à deux barres et feuille pleine page aux liens de 1,5 rem séparés par des filets.
- **Rail de l'espace produit :** colonne raisin de 16,5 rem, liens Manrope 600 à 0,9375 rem en `paper-muted`, marqueur carré 0,5 rem à bordure 1,5 px ; survol et actif en Blanc cassé sur `raisin-soft`, marqueur rempli Sunset. Barre supérieure collante avec recherche cadrée et cloche à badge Sunset.

### Stamp (signature)
Pilule à bordure 2 px Sunset, Manrope 800 à 0,75 rem en capitales espacées de 0,1 em, inclinée de −2°, fond du ton ; variante pleine en aplat Sunset / texte `on-sunset` ; le chiffre à 1,5 rem en `tabular-nums`. Posé en bas à droite d'une fiche ou en haut à droite d'une section (`.section-stamp`, décalé de −3,4 / −4,2 rem). Arrivée : opacité 0 → 1, échelle 1,12 → 1, rotation −3° → −2°, 550 ms `expo.out`, une seule fois.

### Score, pays, type, monogramme, vérification (vocabulaire du dossier)
- **Score :** cellules de 0,62 em, Manrope 800 serré, « % » à 0,4 em ; variante d'accent en `accent-text`.
- **Pays :** code en case carrée 2 × 1,5 rem, bordure `rule-strong`, 0,6875 rem à 0,12 em, suivi du nom en Manrope 600 ; variante pleine en aplat raisin.
- **Type de partenariat :** marqueur géométrique constant de 0,75 rem (voir Shapes) + nom en Manrope 600 à 0,875 rem.
- **Monogramme :** carré de 2,75 rem (4,5 rem en grand), initiales Manrope 800, cadre `rule-strong` ; variante sombre en aplat raisin.
- **Vérification :** trois pastilles de 0,5 rem, actives en Sunset avec anneau `outline` Sunset décalé de 2 px, inactives en contour `rule-strong` et texte atténué.

### Registres, tables, étapes
- **Registre (`.ledger`, `.company-row`, `.task`, `.doc`) :** tête à filet raisin plein, lignes à filet `rule`, `padding: 1rem 0` ; survol d'une ligne cliquable en `buff-tint` débordant de 0,75 rem.
- **Table :** en-têtes en libellé capitales 0,12 em sur filet raisin, cellules à filet `rule`, colonnes numériques alignées à droite en Manrope 700 tabulaire.
- **Étapes de Deal Room :** cinq libellés capitales à barre supérieure de 6 px (filet, raisin pour « fait », Sunset pour « en cours ») ; défilement horizontal sous 600 px.
- **Barres de critères :** 4 px, piste `rule`, remplissage raisin sur clair et Buff sur raisin, qui s'étendent depuis la gauche (`scaleX`).

### Carte abstraite (signature)
Trame de points `rule-strong` (r 0,42, pas 2,1) à l'intérieur d'un contour jamais dessiné ; villes en nœuds raisin (r 0,9 → 1,3 et Sunset quand actives), étiquettes Manrope 700 à 2,1 px, routes en courbes quadratiques Sunset à 0,45 d'épaisseur tracées au défilement (`data-draw`, 1,4 s `power2.inOut`). Aucune frontière, aucune couleur par pays.

## Do's and Don'ts

### Do:
- **Do** poser toute donnée en champ libellé / valeur / filet (Manrope capitales 0,14 em à 0,6875 rem, puis Manrope 700 serré, puis 1 px `rule`).
- **Do** mettre tout chiffre variable en cellules fixes `tabular-nums` et le faire changer par fondu, jamais par saut de mise en page.
- **Do** lire les couleurs dans les rôles de ton (`--bg`, `--fg`, `--fg-muted`, `--line`, `--field`, `--accent-text`) et poser le ton d'une section par `data-tone`.
- **Do** signaler un état par le remplissage : hachure pour vide, aplat `buff-tint` pour rempli ou touché, aplat raisin / texte Blanc cassé pour choisi.
- **Do** réserver l'aplat Sunset au tampon, au CTA principal, aux pastilles de vérification, aux points de route et aux badges ; en texte, utiliser `sunset-ink` sur clair et `sunset-soft` sur raisin.
- **Do** utiliser le marqueur géométrique constant de type de partenariat partout où un type est nommé.
- **Do** tracer les routes en `stroke-dashoffset` au défilement, une seule fois, et les livrer déjà tracées en mouvement réduit ; durées 180 / 420 / 800 ms, courbe `cubic-bezier(0.22, 1, 0.36, 1)`, tampon en `expo.out` 550 ms.
- **Do** garder les angles vifs (0) sur tout ce qui n'est pas un tampon, une pastille ou le téléphone.

### Don't:
- **Don't** ajouter une ombre portée à autre chose que le téléphone ; les fiches, tampons, boutons et menus restent plats.
- **Don't** incliner autre chose que le tampon.
- **Don't** utiliser de dégradé de surface hors du corps du téléphone, ni de dégradé multicolore, ni de blob, ni de glassmorphism.
- **Don't** introduire de bleu ou de violet, ni une sixième couleur : toute nuance dérive des cinq couleurs imposées.
- **Don't** dessiner de frontières, de pays colorés ou de carte d'Afrique littérale ; la carte reste une trame de points, des villes et des routes.
- **Don't** centrer un titre de section ni composer une grille de trois cartes de fonctionnalités.
- **Don't** faire rebondir une animation ni animer une propriété de mise en page ; les champs se remplissent par pas, les barres par `scaleX`.
- **Don't** remplacer la légende géométrique des types de partenariat par des icônes, ni un filet par un espace blanc.
