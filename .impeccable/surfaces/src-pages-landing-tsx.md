---
version: 1
slug: "src-pages-landing-tsx"
primary_target: "src/pages/Landing.tsx"
related_targets: ["src/App.tsx"]
---

# Surface : landing PAVEN (src/pages/Landing.tsx) — mode Persuade

Audience : dirigeants d'entreprises africaines qui cherchent un partenaire dans leur pays ou sur un autre marché africain ; lecteurs secondaires : investisseurs, institutions, incubateurs. Action : « Trouver un partenaire » ; preuve : le moteur de compatibilité expliqué (94 % décomposé) et les niveaux de vérification. Contraintes : palette, polices et interdits du brief (PRODUCT.md) ; aucune entreprise réelle, données signalées comme démonstration. Les écrans produit (/app/*) héritent du même monde en mode Operate.

## Direction contract

THESIS: La landing est un dossier d'expansion qui se remplit sous les yeux du visiteur, champ par champ, jusqu'au tampon de compatibilité. Elle refuse l'arrangement de la catégorie : titre centré, graphe de nœuds lumineux, trois cartes de fonctionnalités.

OWN-WORLD: Papier off-white #F5F2EC réglé de filets raisin #242124 à 1 px ; champs de saisie teintés buff #D8C39A ; tampons sunset #E96A4F (score, VÉRIFIÉ, étape) ; libellés de champs en Manrope capitales espacées 0,14 em, valeurs en DM Sans ; chiffres tabulaires dans des cellules à largeur fixe dont le changement est un fondu, jamais un saut ; un axe vertical de route qui règle la page de DEPUIS à VERS ; une légende constante des types de partenariat (marqueur stable sur tout le site) ; un état change le remplissage d'un champ (hachure, aplat, contour), pas seulement sa teinte ; les routes se tracent au défilement et sont déjà tracées en mouvement réduit ; aucune ombre hors du tampon et du téléphone ; sections sombres en raisin pour le moteur et la clôture.

STORY: Le visiteur comprend qu'il est une entreprise africaine qui cherche quelque chose, voit un dossier Libreville → Douala se remplir et aboutir à 94 % expliqué, croit à la vérification parce qu'elle est montrée pièce par pièce, et clique « Trouver un partenaire ».

FIRST VIEWPORT: Navigation en filet fin. Colonne gauche (5/12) : titre « Les affaires changent de rythme quand l'Afrique se connecte. » en Manrope 700 à 5 rem, chapeau DM Sans, deux actions (pleine sunset / contour raisin). Colonne droite (6/12) : le dossier, une fiche réglée de filets avec les champs DEPUIS · Libreville, VERS · Douala, OBJECTIF · Distributeur qui se remplissent au défilement, une route verticale qui se trace entre les deux villes, puis le tampon « 94 % · COMPATIBLE » qui se pose en bas à droite. Sous le dossier, le bandeau des villes du réseau comme ports d'escale, en capitales espacées.

FORM: Le dossier de commerce international (connaissement, lettre de crédit), candidat 5 de la liste ordonnée, clé de tirage fffb381b, choisi par le client sur la page de décision. Interaction signature : le dossier qui se remplit au défilement et le tampon qui se pose (scale 1,12 → 1, rotation −3° → −2°, ease expo.out). Grammaire de mouvement : filets et routes en stroke-dashoffset, champs remplis par pas, aucun rebond, 180 / 420 / 800 ms, courbe cubic-bezier(0.22, 1, 0.36, 1). Raises : chiffres à cellules fixes (compteur nixie), axe unique (plongée), légende tenue droite (jardin de pluie), tracés au défilement (fanzine), tampon de section (coffeehouse), états par remplissage (Memphis).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
