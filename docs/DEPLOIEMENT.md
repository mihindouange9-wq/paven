# Mise en ligne de PAVEN sur Render

Site statique : Render exécute `npm ci && npm run build` puis sert `dist/` depuis son CDN. Tout est décrit dans
`render.yaml` : build, dossier publié, réécriture d'adresses (nécessaire aux routes `/app/*`), en-têtes de cache et de
sécurité, variables d'environnement.

## 1. Dépôt

Dépôt GitHub privé `mihindouange9-wq/paven`, branche `main`. Le dépôt local y est rattaché : modifier, commiter,
`git push`.

## 2. Service Render

**En ligne depuis le 9 octobre 2026 : https://paven.onrender.com** (service `srv-db4bn9nlot8c738g7kb0`, espace de
travail « My Workspace »). Chaque push sur `main` redéploie en une à deux minutes.

Le service a été créé par l'API de Render avec `tools/render-deploy.mjs`, qui reproduit `render.yaml` (les pages
« Deploy to Render » et « New Blueprint » du tableau de bord renvoyaient en boucle sur la même page). Pour recréer le
service ou forcer un déploiement :

```
RENDER_API_KEY=rnd_xxx node tools/render-deploy.mjs
```

La clé se crée dans Render → Account Settings → API Keys ; la supprimer après usage. Si le service existe déjà, le
script demande simplement un nouveau déploiement et le suit jusqu'à l'état « live ».

Le dépôt GitHub a été rendu **public** le 9 octobre 2026 : Render ne pouvait pas lire le dépôt privé (l'application
GitHub de Render n'avait pas accès à `paven`). Pour le repasser en privé sans casser les déploiements, d'abord
autoriser l'application Render sur le dépôt (https://github.com/apps/render/installations/new), puis
`gh repo edit mihindouange9-wq/paven --visibility private`.

Variante par le tableau de bord, si elle fonctionne : **New** → **Blueprint** → dépôt `paven` → **Apply**.

## 3. Adresse publique (`SITE_URL`)

`SITE_URL` alimente la balise canonical, Open Graph, `robots.txt`, `sitemap.xml` et les données structurées. Quand le
domaine définitif est rattaché (Settings → Custom Domains), mettre `SITE_URL` à jour dans `render.yaml` (ou dans
l'onglet Environment) et redéployer.

## 4. Vérifications après déploiement

- `/`, `/app`, `/app/decouvrir` répondent (la réécriture `/*` → `index.html` sert les routes de l'application).
- `/robots.txt` et `/sitemap.xml` pointent vers le bon domaine ; `/robots.txt` interdit l'indexation de `/app`.
- `curl -I https://<domaine>/` : `content-security-policy`, `x-frame-options: DENY`, `strict-transport-security`.
- Aperçu de partage (image `og-image.png`) sur WhatsApp, LinkedIn ou Facebook.

## 5. À décider avant l'annonce publique

Nom de domaine, textes légaux (confidentialité, conditions, sécurité), version anglaise (le sélecteur FR / EN est en
place, les textes sont dans `src/content/fr.ts`), et le branchement d'un vrai moteur de données.
