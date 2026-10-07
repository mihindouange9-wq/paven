# Mise en ligne de PAVEN sur Render

Site statique : Render exécute `npm ci && npm run build` puis sert `dist/` depuis son CDN. Tout est décrit dans
`render.yaml` : build, dossier publié, réécriture d'adresses (nécessaire aux routes `/app/*`), en-têtes de cache et de
sécurité, variables d'environnement.

## 1. Dépôt

Dépôt GitHub privé `mihindouange9-wq/paven`, branche `main`. Le dépôt local y est rattaché : modifier, commiter,
`git push`.

## 2. Service Render

1. Ouvrir https://render.com/deploy?repo=https://github.com/mihindouange9-wq/paven, ou tableau de bord → **New** →
   **Blueprint** → dépôt `paven`. Le dépôt étant privé, Render doit avoir accès au compte GitHub (Configure account).
2. Render lit `render.yaml` et propose le service `paven` (site statique). Nommer le Blueprint `paven`, cliquer sur
   **Apply**.
3. Premier déploiement en deux à trois minutes : https://paven.onrender.com. Chaque push sur `main` redéploie.

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
