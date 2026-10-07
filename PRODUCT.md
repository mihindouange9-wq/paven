# Product

<!-- impeccable:product-schema 1 -->

Source : brief maître PAVEN remis par le client le 7 octobre 2026 (56 sections) et réponses du client le même jour (pile, langue, diffusion). Tout ce qui suit en est tiré ; les points non tranchés sont marqués comme tels, jamais remplis.

## Platform

web

## Stack

Choix du client : Vite + React + TypeScript, CSS natif (jetons en variables CSS, pas de Tailwind : ses binaires récents sont bloqués sur le poste de développement), GSAP + ScrollTrigger, Lucide. Données mockées structurées comme un vrai produit. Hébergement : Render (site statique, Blueprint), dépôt GitHub privé.

## Users

- **Dirigeants et responsables du développement d'entreprises africaines** (PME, startups, groupes régionaux) qui veulent trouver un distributeur, un fournisseur, un sous-traitant, un partenaire technologique, commercial ou stratégique, dans leur pays ou dans un autre marché africain. Scène type : une entreprise agroalimentaire de Libreville ouvre son ordinateur, dit ce qu'elle cherche, choisit le Cameroun, et veut savoir avec qui elle pourrait réellement travailler à Douala.
- **Entreprises qui se rendent trouvables** : elles décrivent ce qu'elles offrent et ce qu'elles cherchent, et reçoivent des demandes de partenariat.
- Lecteurs secondaires de la présentation : incubateurs, investisseurs, institutions, partenaires commerciaux, grandes entreprises.

Langue de l'interface : français d'abord (choix du client), anglais ensuite par un sélecteur FR / EN. Marché : l'Afrique comme réseau de marchés interconnectés ; aucun pays ne domine.

## Product Purpose

PAVEN est une infrastructure digitale de mise en relation entre entreprises africaines. Elle transforme « je veux développer mon entreprise mais je ne connais pas les bonnes entreprises avec lesquelles travailler » en « PAVEN me montre avec qui je pourrais réellement travailler ». Vision : *Make Africa easier to do business with.* Succès : un visiteur comprend en moins de dix secondes qu'il est une entreprise africaine, qu'il cherche quelque chose, que PAVEN l'aide à trouver la bonne entreprise, et qu'il peut se développer en Afrique.

## Positioning

**Africa's Business Connection Infrastructure.** PAVEN n'est ni un réseau social, ni un LinkedIn africain, ni un annuaire, ni une marketplace, ni un site d'annonces, ni une plateforme de freelances, ni du networking générique. Son mécanisme propre : un **moteur de compatibilité expliqué**. Chaque mise en relation porte un score (ex. 94 %) décomposé en raisons mesurées (marché cible, secteur, capacité de distribution, taille, couverture géographique, objectif de partenariat), puis se poursuit dans un **Deal Room** à étapes (Découverte → Conversation → Évaluation → Négociation → Partenariat). Le problème résolu n'est pas l'absence d'entreprises mais la difficulté à identifier les bonnes.

## Operating Context

- Scénarios narratifs imposés : Gabon → Cameroun (agroalimentaire cherche distributeur, 94 %), Libreville → Abidjan (startup, partenaire technologique), Dakar → Casablanca (approvisionnement industriel), Nairobi → Kigali (technologie), Lagos → Accra (distribution), et le local Libreville → Port-Gentil / Franceville / Oyem / Moanda (fournisseur).
- Villes narratives : Libreville, Douala, Yaoundé, Port-Gentil, Franceville, Abidjan, Dakar, Casablanca, Lagos, Accra, Nairobi, Kigali, Johannesburg, Le Caire, Dar es Salaam.
- Flux utilisateur : définir le besoin → choisir le marché (mon pays ou un autre marché africain, Depuis → Vers) → découvrir les entreprises → comparer la compatibilité → se connecter → construire le partenariat.
- Réalités à refléter : pays et villes africains, devises africaines, tailles d'entreprises adaptées, expansion régionale, partenariats transfrontaliers ; conçu pour l'Afrique dès le départ, pas une plateforme américaine recouverte d'une couche africaine.

## Capabilities and Constraints

Écrans à livrer, cohérents entre eux : landing, dashboard (Overview, Discover, Matches, Companies, Opportunities, Messages, Deal Rooms, Expansion, Analytics), découverte avec filtres (pays, ville, secteur, taille, type de partenariat, marché, vérification, capacités), profil d'entreprise, détail de match avec explication, opportunités, expansion (Depuis → Vers → Objectif → « PAVEN a trouvé 18 entreprises »), messages, Deal Room (conversation, documents, NDA, étapes, tâches, calendrier, notes, statut), pipeline de partenariats (Potentiel 12 · Contactées 6 · En discussion 4 · Négociation 2 · Actives 3), interface mobile intégrée à la composition.

Interactions réelles attendues avec données mockées : sélection de pays, filtres, recherche, onglets, cartes interactives, score, ouverture de profils, boutons de connexion, changement d'étape, pipeline, navigation du dashboard, menu responsive.

Modèle de données (même mocké) : Company, Country, City, Industry, PartnershipType, Opportunity, Match, Message, DealRoom, User, Verification, Market, ExpansionRequest.

Confiance : trois niveaux affichés, « Entreprise vérifiée » (identité légale), « Informations vérifiées » (informations principales confirmées), « Prête au partenariat » (besoins et capacités clairement indiqués). Aucune certification inventée.

Contraintes dures : pas de landing SaaS générique, pas de violet ni bleu SaaS, pas de dégradés multicolores ni de blobs, pas d'illustrations IA génériques ni de personnages 3D, pas de poignée de main, de globe cliché, de carte d'Afrique littérale ou décorative partout, de motifs tribaux, de textures africaines artificielles, de glassmorphism, d'arrondis partout, d'animations aléatoires, de particules, de titres marketing creux (« Unlock your potential »). Chaque élément doit aider à comprendre comment PAVEN connecte les entreprises ; sinon il est retiré.

Performance : images, polices, animations, JS optimisés ; 60 i/s ; lazy loading et découpage de code. Responsive repensé : 1440+, 768+, 390+. Accessibilité : contrastes, clavier, focus, labels, ARIA, HTML sémantique, mouvement réduit. SEO : métadonnées, Open Graph, données structurées, aperçu social.

Non décidé : nom de domaine, textes légaux, tarification, langues au-delà de FR/EN, existence réelle du moteur (le MVP est une démonstration frontend).

## Brand Commitments

- Nom : **PAVEN**. Signature : *Make Africa easier to do business with.* Positionnement : *Africa's Business Connection Infrastructure.* Pied de page : *Built for African business.*
- Palette imposée : Raisin Black #242124 (principale : navigation, typographie forte, sections premium, fonds, institutionnel), Buff #D8C39A (secondaire : matière, territoire, chaleur, patrimoine contemporain), Sunset #E96A4F (accent contrôlé : CTA, indicateurs, compatibilité, notifications, points de connexion), Off White #F5F2EC (surfaces éditoriales), White #FFFFFF (interfaces, respiration). Jamais de dégradés criards.
- Typographie imposée : Manrope (titres, chiffres, navigation, boutons, UI) et DM Sans (paragraphes, descriptions, interfaces complexes).
- Logo à créer : symbole minimal, abstrait, géométrique, monochrome possible, favicon et icône d'app ; évoque connexion, convergence, mouvement, réseau, expansion, passage d'un marché à un autre ; peut suggérer un P sans être littéral. Interdits : poignée de main, globe, silhouettes, puzzle, chaînes, flèches évidentes, carte d'Afrique littérale, bâtiments, icônes de networking. Livrer : principal, symbole, monochrome, inversé, favicon, espacement, tailles minimales.
- Identité : panafricaine, premium, contemporaine, sobre, technologique, institutionnelle sans froideur, ambitieuse, internationale ; l'Afrique moderne, structurée, économiquement puissante. Jamais safari, tribal, touristique, folklorique. Direction artistique : modernisme africain, architecture africaine contemporaine, design éditorial suisse, fintech premium, cartographie contemporaine, systèmes modulaires, signalétique africaine contemporaine. Sensation : *quiet confidence*.
- Copie : langage direct (« Trouvez le partenaire qu'il vous faut », « Entrez sur un nouveau marché africain », « Voyez pourquoi cette entreprise vous correspond », « Démarrez la conversation », « Construisez le partenariat »), titres du brief à conserver en substance (hero, problème, moteur, carte, expansion, local, transfrontalier, confiance, CTA final).

## Evidence on Hand

Le brief uniquement. Aucune entreprise réelle, aucun chiffre réel, aucun client, aucun témoignage : toutes les entreprises (Kivu Foods, AgroDistrib Cameroon, Nexa Côte d'Ivoire, Atlas Manufacturing, Savanna Logistics…), scores, statistiques par pays et conversations sont des données de démonstration fictives, signalées comme telles. Ne jamais citer de vraie entreprise sans autorisation. Logo et visuels : à créer.

## Product Principles

1. **Montrer le mécanisme, pas le promettre** : un match est toujours expliqué, chiffre par chiffre.
2. **L'Afrique comme réseau** : les villes et les flux Depuis → Vers racontent le commerce ; aucun pays ne domine, aucune carte touristique.
3. **Le produit doit sembler réel** : écrans cohérents, interactions fonctionnelles, données crédibles ; l'utilisateur doit pouvoir imaginer l'utiliser demain.
4. **La confiance au centre** : vérification, intentions claires, explications, conversations privées, Deal Rooms.
5. **Chaque élément répond à une question** : aide-t-il à comprendre comment PAVEN connecte les entreprises africaines ? Sinon, il disparaît.
