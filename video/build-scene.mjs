/* PAVEN — film de 30 s : génère video/scene.html, une scène 1920 × 1080 animée par une ligne de temps GSAP
   déterministe (window.seek(t) place la scène à l'instant t ; tools/video-render.mjs capture image par image).
   node video/build-scene.mjs */
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const RAISIN = '#242124', BUFF = '#D8C39A', SUNSET = '#E96A4F', OFF = '#F5F2EC', WHITE = '#FFFFFF';
const RAISIN_DEEP = '#1A1719', BUFF_TINT = '#ECE2C9', INK_MUTED = '#6B6468', PAPER_MUTED = '#D9CDB0', SUNSET_INK = '#B84B33', SUNSET_SOFT = '#F0A391', RAISIN_SOFT = '#3A3639';

const lettres = (t) => [...t].map((c) => `<span class="l">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
const lignes = (arr, classe = '') => arr.map((l) => `<span class="mask"><span class="ln ${classe}">${l}</span></span>`).join('');
const mark = (ink, node, size) => `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><path class="mk-stem" d="M28 12v76" stroke="${ink}" stroke-width="14" stroke-linecap="square" fill="none" pathLength="1"/><path class="mk-route" d="M28 19h26a19 19 0 0 1 0 38h-8" stroke="${ink}" stroke-width="14" stroke-linecap="square" fill="none" pathLength="1"/><circle class="mk-node" cx="73" cy="78" r="10" fill="${node}"/></svg>`;
const code = (c) => `<span class="code">${c}</span>`;
const field = (label, value, cls = '') => `<div class="field ${cls}"><span class="flabel">${label}</span><span class="fvalue">${value}</span></div>`;

const REASONS = [['92 %', 'Marché cible'], ['89 %', 'Secteur'], ['96 %', 'Capacité de distribution'], ['90 %', "Taille d'entreprise"], ['93 %', 'Couverture géographique'], ['91 %', 'Objectif de partenariat']];
const STAGES = ['Découverte', 'Conversation', 'Évaluation', 'Négociation', 'Partenariat'];

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>PAVEN — film 30 s</title>
<style>
@font-face { font-family: "Manrope"; src: url("assets/fonts/manrope-latin-wght-normal.woff2") format("woff2"); font-weight: 200 800; }
@font-face { font-family: "DM Sans"; src: url("assets/fonts/dm-sans-latin-wght-normal.woff2") format("woff2"); font-weight: 100 1000; }
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; background: #000; }
body { width: 1920px; height: 1080px; overflow: hidden; font-family: "DM Sans", sans-serif; color: ${OFF}; -webkit-font-smoothing: antialiased; }
#stage { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: ${RAISIN}; }
#bain { position: absolute; inset: 0; }
#bain-fade { position: absolute; inset: 0; background: linear-gradient(90deg, ${RAISIN} 0%, ${RAISIN} 18%, rgba(36,33,36,0) 48%); }
.feuille { background: ${OFF}; color: ${RAISIN}; box-shadow: 0 50px 90px -40px rgba(10,8,9,.85), 0 2px 0 0 rgba(36,33,36,.3); }
.scene { position: absolute; inset: 0; }
.panneau { position: absolute; inset: 0; background: ${RAISIN}; }
.mask { display: block; overflow: hidden; padding-bottom: 0.14em; margin-bottom: -0.14em; }
.mask .ln { display: block; will-change: transform; }
.ui { font-family: "Manrope", sans-serif; }
.label { display: inline-flex; align-items: center; gap: 14px; font-family: "Manrope", sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: ${PAPER_MUTED}; }
.label .l { display: inline-block; }
.titre { font-family: "Manrope", sans-serif; font-weight: 700; letter-spacing: -0.04em; line-height: 0.98; color: ${OFF}; }
.feuille .titre, .sur-feuille .titre { color: ${RAISIN}; }
.rule { position: absolute; height: 1px; background: rgba(245,242,236,.32); transform-origin: left; }
.stamp { display: inline-grid; place-items: center; gap: 2px; padding: 18px 30px; border: 3px solid ${SUNSET}; border-radius: 999px; color: ${SUNSET_SOFT}; font-family: "Manrope", sans-serif; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; font-size: 18px; line-height: 1; transform: rotate(-2deg); background: ${RAISIN}; }
.stamp--solid { background: ${SUNSET}; color: #1F1413; }
.stamp strong { font-size: 44px; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.code { display: inline-grid; place-items: center; min-width: 44px; height: 32px; padding: 0 8px; border: 1.5px solid rgba(36,33,36,.4); font-family: "Manrope", sans-serif; font-size: 14px; font-weight: 800; letter-spacing: 0.12em; margin-left: 14px; vertical-align: middle; }
/* S1 */
#s1 .marque { position: absolute; left: 160px; top: 380px; display: flex; align-items: center; gap: 36px; }
#s1 .marque .mot { font-family: "Manrope", sans-serif; font-weight: 800; font-size: 150px; letter-spacing: -0.05em; color: ${OFF}; line-height: 1; }
#s1 .label { position: absolute; left: 160px; top: 600px; }
#s1 .rule { left: 160px; top: 340px; width: 1600px; }
/* S2 */
#s2 .titre { position: absolute; left: 160px; top: 210px; width: 980px; font-size: 104px; }
#s2 .liste { position: absolute; left: 1180px; top: 240px; width: 580px; border-top: 1px solid ${OFF}; }
#s2 .item { display: grid; grid-template-columns: 1fr 120px; align-items: center; padding: 24px 0; border-bottom: 1px solid rgba(245,242,236,.16); font-family: "Manrope", sans-serif; font-size: 30px; font-weight: 700; letter-spacing: -0.02em; color: ${OFF}; }
#s2 .item .hatch { height: 34px; background: repeating-linear-gradient(135deg, rgba(245,242,236,.16) 0 1px, transparent 1px 6px); }
#s2 .item .l2 { grid-column: 1 / -1; font-family: "DM Sans", sans-serif; font-weight: 400; font-size: 20px; color: ${PAPER_MUTED}; margin-top: 6px; }
/* S3 */
#s3 { z-index: 2; }
#s3 .panneau { clip-path: inset(100% 0 0 0); background: ${OFF}; }
#s3 .phrase { position: absolute; left: 160px; top: 380px; width: 1500px; font-size: 104px; color: ${RAISIN}; }
#s3 .stamp { position: absolute; right: 160px; top: 700px; }
/* S4 dossier */
#s4 .sheet { position: absolute; left: 780px; top: 150px; width: 980px; }
#s4 .head { display: flex; justify-content: space-between; padding: 22px 32px; border-bottom: 1.5px solid rgba(36,33,36,.4); font-family: "Manrope", sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: ${INK_MUTED}; }
#s4 .head b { color: ${RAISIN}; }
#s4 .body { display: grid; grid-template-columns: 40px 1fr; gap: 0 24px; padding: 8px 32px 70px; }
#s4 .route { width: 40px; height: 100%; grid-row: 1; }
#s4 .route path { stroke: ${RAISIN}; stroke-width: 2; fill: none; }
#s4 .route circle { fill: ${SUNSET}; }
.field { display: grid; gap: 8px; padding: 20px 0; border-bottom: 1px solid rgba(36,33,36,.16); }
.flabel { font-family: "Manrope", sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: ${INK_MUTED}; }
.fvalue { font-family: "Manrope", sans-serif; font-weight: 700; font-size: 30px; letter-spacing: -0.02em; line-height: 1.2; color: ${RAISIN}; display: inline-flex; align-items: center; }
.field--lg .fvalue { font-size: 60px; letter-spacing: -0.035em; }
.field .fvalue { background: ${BUFF_TINT}; padding: 8px 14px; margin-left: -14px; }
.field--empty .fvalue { background: repeating-linear-gradient(135deg, rgba(36,33,36,.1) 0 1px, transparent 1px 6px); color: transparent; }
.fvalue .meta { font-family: "DM Sans", sans-serif; font-weight: 400; font-size: 22px; color: ${INK_MUTED}; margin-left: 14px; letter-spacing: 0; }
.ptype { display: inline-flex; align-items: center; gap: 14px; }
.ptype i { width: 16px; height: 16px; background: ${RAISIN}; }
#s4 .stamp { position: absolute; right: 32px; bottom: 26px; }
.feuille .stamp { background: ${OFF}; color: ${SUNSET_INK}; }
.feuille .stamp--solid, #s3 .stamp--solid { background: ${SUNSET}; color: #1F1413; }
#s4 .cote { position: absolute; left: 160px; top: 200px; width: 560px; }
#s4 .cote h3 { font-family: "Manrope", sans-serif; font-size: 64px; font-weight: 700; letter-spacing: -0.035em; line-height: 1.02; color: ${OFF}; margin: 0 0 28px; }
#s4 .cote p { font-size: 26px; line-height: 1.45; color: ${PAPER_MUTED}; margin: 0; }
#s4 .ports { position: absolute; left: 160px; top: 980px; display: flex; gap: 40px; font-family: "Manrope", sans-serif; font-size: 17px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${PAPER_MUTED}; }
#s4 .ports span b { color: ${SUNSET_SOFT}; margin-right: 10px; font-size: 13px; }
#s4 .ports span::before { content: ''; display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${SUNSET}; box-shadow: 0 0 0 3px ${RAISIN}, 0 0 0 5px ${BUFF}; margin-right: 16px; vertical-align: middle; }
/* S5 moteur */
#s5 .panneau { display: none; }
#s5 .intro { position: absolute; left: 160px; top: 200px; width: 620px; }
#s5 .intro .titre { color: ${OFF}; font-size: 76px; }
#s5 .intro p { font-size: 26px; line-height: 1.45; color: ${PAPER_MUTED}; margin: 32px 0 0; }
#s5 .card { position: absolute; left: 880px; top: 150px; width: 880px; }
#s5 .chead { display: flex; justify-content: space-between; padding: 20px 32px; border-bottom: 1.5px solid rgba(36,33,36,.4); font-family: "Manrope", sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: ${INK_MUTED}; }
#s5 .chead b { color: ${RAISIN}; }
#s5 .partner { display: grid; grid-template-columns: 84px 1fr auto; gap: 24px; align-items: center; padding: 26px 32px; border-bottom: 1px solid rgba(36,33,36,.16); }
#s5 .mono { width: 84px; height: 84px; display: grid; place-items: center; border: 1.5px solid rgba(36,33,36,.4); font-family: "Manrope", sans-serif; font-weight: 800; font-size: 26px; letter-spacing: 0.04em; }
#s5 .partner h4 { margin: 0 0 6px; font-family: "Manrope", sans-serif; font-size: 34px; font-weight: 700; letter-spacing: -0.02em; }
#s5 .partner p { margin: 0; font-size: 20px; color: ${INK_MUTED}; }
#s5 .score { font-family: "Manrope", sans-serif; font-weight: 800; font-size: 110px; letter-spacing: -0.05em; line-height: 0.9; font-variant-numeric: tabular-nums; }
#s5 .score small { font-size: 40px; font-weight: 700; letter-spacing: 0; margin-left: 4px; }
#s5 .why { padding: 20px 32px 8px; font-family: "Manrope", sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: ${INK_MUTED}; }
#s5 .reasons { padding: 0 32px 28px; }
#s5 .reason { display: grid; gap: 8px; padding: 14px 0; border-top: 1px solid rgba(36,33,36,.16); }
#s5 .rhead { display: flex; gap: 20px; align-items: baseline; font-family: "Manrope", sans-serif; font-size: 22px; font-weight: 700; }
#s5 .rhead b { color: ${SUNSET_INK}; font-weight: 800; min-width: 70px; font-variant-numeric: tabular-nums; }
#s5 .bar { height: 5px; background: rgba(36,33,36,.16); overflow: hidden; }
#s5 .bar i { display: block; height: 100%; background: ${RAISIN}; transform-origin: left; }
#s5 .stamp { position: absolute; right: 150px; top: 86px; z-index: 2; }
/* S6 deal room */
#s6 .panneau { background: ${BUFF}; clip-path: inset(0 0 100% 0); }
#s6 .titre { color: ${RAISIN}; }
#s6 .titre { position: absolute; left: 160px; top: 240px; font-size: 104px; width: 1400px; }
#s6 .stages { position: absolute; left: 160px; top: 700px; width: 1600px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
#s6 .stage { display: grid; gap: 18px; font-family: "Manrope", sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${RAISIN}; }
#s6 .stage i { display: block; height: 10px; background: rgba(36,33,36,.18); position: relative; overflow: hidden; }
#s6 .stage i b { position: absolute; inset: 0; background: ${RAISIN}; transform-origin: left; }
#s6 .stage.is-current { color: ${SUNSET_INK}; }
#s6 .stage.is-current i b { background: ${SUNSET}; }
#s6 .stamp { position: absolute; left: 160px; top: 860px; background: ${BUFF}; color: ${SUNSET_INK}; }
#s6 .titre { top: 200px; }
/* S7 fin */
#s7 .panneau { display: none; }
#s7 .logo { position: absolute; left: 160px; top: 300px; display: flex; align-items: center; gap: 44px; }
#s7 .logo .mot { font-family: "Manrope", sans-serif; font-weight: 800; font-size: 170px; letter-spacing: -0.05em; color: ${OFF}; line-height: 1; }
#s7 .vision { position: absolute; left: 160px; top: 560px; font-family: "Manrope", sans-serif; font-weight: 700; font-size: 48px; letter-spacing: -0.03em; color: ${OFF}; white-space: nowrap; }
#s7 .url { position: absolute; left: 160px; top: 660px; font-size: 26px; font-weight: 500; color: ${PAPER_MUTED}; letter-spacing: 0.02em; }
#s7 .built { position: absolute; left: 160px; bottom: 80px; text-align: left; font-family: "Manrope", sans-serif; font-size: 17px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: ${PAPER_MUTED}; }
#s7 .rule { left: 160px; bottom: 150px; top: auto; width: 1600px; background: rgba(245,242,236,.32); }
</style>
</head>
<body>
<div id="stage">
  <canvas id="bain" width="1920" height="1080"></canvas>
  <div id="bain-fade"></div>
  <!-- S1 : la marque -->
  <div class="scene" id="s1">
    <span class="rule"></span>
    <div class="marque">${mark(OFF, SUNSET, 170)}<span class="mot">PAVEN</span></div>
    <p class="label">${lettres("Africa's Business Connection Infrastructure")}</p>
  </div>
  <!-- S2 : le problème -->
  <div class="scene" id="s2">
    <h1 class="titre">${lignes(["L'Afrique a les", 'entreprises. Le défi,', "c'est de trouver", 'les bonnes.'])}</h1>
    <div class="liste">
      ${[['Des marchés fragmentés', 'Dispersées entre des dizaines de marchés.'], ['Une visibilité limitée', 'Qui est réellement compatible ?'], ['La confiance', 'Des informations fiables avant de collaborer.'], ["L'expansion", 'Des partenaires locaux que l’on ne connaît pas.']].map(([a, b]) => `<div class="item"><span>${a}</span><span class="hatch"></span><span class="l2">${b}</span></div>`).join('')}
    </div>
  </div>
  <!-- S3 : la réponse -->
  <div class="scene" id="s3">
    <div class="panneau"></div>
    <h2 class="titre phrase">${lignes(['PAVEN vous montre', 'avec qui vous pouvez', 'réellement travailler.'])}</h2>
    <span class="stamp stamp--solid">Compatibilité expliquée</span>
  </div>
  <!-- S4 : le dossier -->
  <div class="scene" id="s4">
    <div class="sheet feuille">
      <div class="head"><b>Dossier d'expansion</b><span>N° PV-2026-0417</span></div>
      <div class="body">
        <svg class="route" viewBox="0 0 40 420" preserveAspectRatio="none" aria-hidden="true"><path d="M20 30V392"/><circle class="dot-from" cx="20" cy="30" r="8"/><circle class="dot-to" cx="20" cy="392" r="8"/></svg>
        <div class="fields">
          ${field('Entreprise', 'Gabon Fresh Foods<span class="meta">Agroalimentaire · Libreville</span>')}
          ${field('Depuis', 'Libreville ' + code('GA'), 'field--lg')}
          ${field('Vers', 'Douala ' + code('CM'), 'field--lg')}
          ${field('Objectif', '<span class="ptype"><i></i>Distributeur</span>')}
          ${field('Résultat', '3 partenaires potentiels · AgroDistrib Cameroon en tête')}
        </div>
      </div>
      <span class="stamp stamp--solid dossier-stamp"><strong>94 %</strong>compatible</span>
    </div>
    <div class="cote">
      <h3>${lignes(['Dites ce que', 'vous cherchez.', 'Choisissez', 'le marché.'])}</h3>
      <p>Distributeur, fournisseur, partenaire technologique ou stratégique, dans votre pays ou sur un autre marché africain. PAVEN remplit le dossier et trouve les entreprises compatibles.</p>
    </div>
    <div class="ports">${[['GA', 'Libreville'], ['CM', 'Douala'], ['CI', 'Abidjan'], ['NG', 'Lagos'], ['SN', 'Dakar'], ['MA', 'Casablanca'], ['KE', 'Nairobi'], ['RW', 'Kigali'], ['ZA', 'Johannesburg']].map(([c, v]) => `<span><b>${c}</b>${v}</span>`).join('')}</div>
  </div>
  <!-- S5 : le moteur -->
  <div class="scene" id="s5">
    <div class="panneau"></div>
    <div class="intro"><h2 class="titre">${lignes(['Toutes les', 'connexions ne sont', 'pas des opportunités.'])}</h2><p>Chaque mise en relation est un score expliqué, critère par critère. Jamais un pourcentage seul.</p></div>
    <div class="card feuille">
      <div class="chead"><b>Compatibilité d'entreprise</b><span>Réf. M-AGRODISTRIB</span></div>
      <div class="partner"><span class="mono">AD</span><div><h4>AgroDistrib Cameroon</h4><p>Douala, Cameroun · Distribution / Agroalimentaire</p></div><span class="score"><span class="val">0</span><small>%</small></span></div>
      <div class="why">Pourquoi cette compatibilité ?</div>
      <div class="reasons">${REASONS.map(([s, l]) => `<div class="reason"><div class="rhead"><b>${s}</b>${l}</div><span class="bar"><i style="width:${parseInt(s)}%"></i></span></div>`).join('')}</div>
    </div>
    <span class="stamp stamp--solid"><strong>94 %</strong>compatible</span>
  </div>
  <!-- S6 : le deal room -->
  <div class="scene" id="s6">
    <div class="panneau"></div>
    <h2 class="titre">${lignes(['Une conversation.', 'Un Deal Room.', 'Un partenariat.'])}</h2>
    <div class="stages">${STAGES.map((s) => `<div class="stage"><i><b></b></i>${s}</div>`).join('')}</div>
    <span class="stamp">Négociation</span>
  </div>
  <!-- S7 : fin -->
  <div class="scene" id="s7">
    <div class="panneau"></div>
    <div class="logo">${mark(OFF, SUNSET, 190)}<span class="mot">PAVEN</span></div>
    <p class="vision">Make Africa easier to do business with.</p>
    <p class="url">paven.onrender.com</p>
    <span class="rule"></span>
    <p class="built">Built for African business</p>
  </div>
</div>
<script src="assets/gsap.min.js"></script>
<script>
/* Marbrure déterministe (ebru), portée de src/components/Marbling.tsx */
const SEG = 96;
const circle = (d) => Array.from({ length: SEG }, (_, i) => { const a = (i / SEG) * Math.PI * 2; return [d.x + Math.cos(a) * d.r, d.y + Math.sin(a) * d.r]; });
const pushByDrop = (p, d) => { const dx = p[0] - d.x, dy = p[1] - d.y, dist2 = dx * dx + dy * dy; if (dist2 < 1e-6) return [p[0] + d.r, p[1]]; const f = Math.sqrt(1 + (d.r * d.r) / dist2); return [d.x + dx * f, d.y + dy * f]; };
const pushByTine = (p, t) => { const len = Math.hypot(t.dx, t.dy) || 1, ux = t.dx / len, uy = t.dy / len, nx = -uy, ny = ux; const d = Math.abs((p[0] - t.x) * nx + (p[1] - t.y) * ny); const k = t.z * Math.pow(t.c, d); return [p[0] + ux * k, p[1] + uy * k]; };
const POS = { casablanca: [0.18, 0.12], cairo: [0.82, 0.10], dakar: [0.07, 0.30], lagos: [0.30, 0.34], abidjan: [0.17, 0.50], nairobi: [0.90, 0.42], kigali: [0.76, 0.54], johannesburg: [0.72, 0.88], douala: [0.68, 0.24], libreville: [0.44, 0.21] };
const at = (id) => ({ x: 0.5 + POS[id][0] * 0.5, y: 0.08 + POS[id][1] * 0.84 });
const drop = (id, r, color) => ({ kind: 'drop', drop: { ...at(id), r: r * 0.72, color } });
const TINE_C = 3e-8;
const L = at('libreville'), D = at('douala'), vx = D.x - L.x, vy = D.y - L.y, vl = Math.hypot(vx, vy), nx = -vy / vl, ny = vx / vl;
const OPS = [drop('casablanca', 0.055, '${BUFF}'), drop('casablanca', 0.028, '${OFF}'), drop('cairo', 0.045, '${OFF}'), drop('dakar', 0.05, '${SUNSET}'), drop('dakar', 0.024, '${BUFF}'),
  drop('lagos', 0.075, '${BUFF}'), drop('lagos', 0.05, '${SUNSET}'), drop('lagos', 0.03, '${OFF}'), drop('lagos', 0.013, '${BUFF}'), drop('abidjan', 0.045, '${OFF}'),
  drop('nairobi', 0.06, '${BUFF}'), drop('nairobi', 0.034, '${OFF}'), drop('kigali', 0.04, '${OFF}'), drop('johannesburg', 0.07, '${SUNSET}'),
  drop('douala', 0.07, '${BUFF}'), drop('douala', 0.042, '${OFF}'), drop('douala', 0.02, '${SUNSET}'),
  drop('libreville', 0.09, '${SUNSET}'), drop('libreville', 0.062, '${BUFF}'), drop('libreville', 0.038, '${OFF}'), drop('libreville', 0.017, '${SUNSET}'),
  { kind: 'tine', tine: { x: L.x + nx * 0.025, y: L.y + ny * 0.025, dx: vx, dy: vy, z: 0.06, c: TINE_C } },
  { kind: 'tine', tine: { x: L.x - nx * 0.025, y: L.y - ny * 0.025, dx: vx, dy: vy, z: 0.04, c: TINE_C } },
  drop('libreville', 0.012, '${OFF}')];
const HERO_LEN = OPS.length;
for (let i = 0; i < 5; i++) OPS.push({ kind: 'tine', tine: { x: 0, y: 0.12 + i * 0.17, dx: 1, dy: 0.06, z: 0.06, c: 1e-10 } });
OPS.push(drop('libreville', 0.012, '${OFF}'));
const bain = { n: 0 };
const cv = document.getElementById('bain'), cx = cv.getContext('2d');
function drawBain() {
  const W = 1920, H = 1080, shapes = [];
  const n = Math.min(OPS.length, Math.max(0, Math.floor(bain.n))), frac = Math.max(0, Math.min(1, bain.n - n));
  const apply = (op, t = 1) => { if (op.kind === 'drop') { const d = { ...op.drop, r: op.drop.r * t }; for (const s of shapes) s.pts = s.pts.map((p) => pushByDrop(p, d)); shapes.push({ color: d.color, pts: circle(d) }); } else { const tn = { ...op.tine, z: op.tine.z * t }; for (const s of shapes) s.pts = s.pts.map((p) => pushByTine(p, tn)); } };
  for (let i = 0; i < n; i++) apply(OPS[i]);
  if (frac > 0.02 && n < OPS.length) apply(OPS[n], frac);
  cx.fillStyle = '${RAISIN}'; cx.fillRect(0, 0, W, H);
  for (const s of shapes) { cx.beginPath(); s.pts.forEach((p, i) => (i ? cx.lineTo(p[0] * W, p[1] * H) : cx.moveTo(p[0] * W, p[1] * H))); cx.closePath(); cx.fillStyle = s.color; cx.fill(); }
}
const E = { out: 'power3.out', out4: 'power4.out', inout: 'power3.inOut', exp: 'expo.inOut' };
gsap.set('.scene', { autoAlpha: 0 });
gsap.set('#s1', { autoAlpha: 1 });
const tl = gsap.timeline({ paused: true, defaults: { ease: E.out } });
const stampIn = (sel, at) => tl.fromTo(sel, { autoAlpha: 0, scale: 1.12, rotate: -3 }, { autoAlpha: 1, scale: 1, rotate: -2, duration: 0.55, ease: 'expo.out' }, at);

/* S1 — 0 → 3.4 : le filet, la marque qui se trace, l'étiquette */
gsap.set('#s1 .mk-stem, #s1 .mk-route', { strokeDasharray: 1, strokeDashoffset: 1 });
tl.to(bain, { n: HERO_LEN, duration: 3.0, ease: 'none' }, 0.2);
tl.fromTo('#s1 .rule', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: E.inout }, 0.1)
  .to('#s1 .mk-stem', { strokeDashoffset: 0, duration: 0.6, ease: E.inout }, 0.4)
  .to('#s1 .mk-route', { strokeDashoffset: 0, duration: 0.8, ease: E.inout }, 0.9)
  .from('#s1 .mk-node', { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: E.out4 }, 1.6)
  .from('#s1 .mot', { autoAlpha: 0, x: -30, duration: 1.0, ease: E.out4 }, 1.0)
  .fromTo('#s1 .label .l', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.016 }, 1.8)
  .to('#s1', { autoAlpha: 0, duration: 0.4 }, 3.4);

/* S2 — 3.4 → 7.6 : le problème */
tl.to('#bain', { x: 220, y: 560, duration: 1.4, ease: E.inout }, 3.2)
  .to('#bain', { x: 0, y: 0, scale: 1, duration: 0.01 }, 9.0);
tl.set('#s2', { autoAlpha: 1 }, 3.4)
  .fromTo('#s2 .titre .ln', { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: E.out4, stagger: 0.11 }, 3.5)
  .fromTo('#s2 .item', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.16 }, 4.1)
  .to('#s2 .item, #s2 .titre', { autoAlpha: 0.25, duration: 0.6 }, 6.9);

/* S3 — 7.4 → 10.4 : la réponse */
tl.set('#s3', { autoAlpha: 1 }, 7.4)
  .to('#s3 .panneau', { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: E.exp }, 7.4)
  .to('#s2', { autoAlpha: 0, duration: 0.1 }, 8.6)
  .fromTo('#s3 .phrase .ln', { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: E.out4, stagger: 0.11 }, 8.2);
stampIn('#s3 .stamp', 9.3);
tl.to('#s3 .phrase, #s3 .stamp', { autoAlpha: 0, y: -24, duration: 0.5, ease: E.inout }, 10.2);

/* S4 — 10.4 → 17.4 : le dossier se remplit */
tl.set('#s4', { autoAlpha: 1 }, 10.3)
  .to('#s3 .panneau', { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: E.exp }, 10.3)
  .to('#s3', { autoAlpha: 0, duration: 0.01 }, 11.25);
{
  const fields = gsap.utils.toArray('#s4 .field');
  fields.forEach((f) => f.classList.add('field--empty'));
  gsap.set('#s4 .dossier-stamp', { autoAlpha: 0 });
  gsap.set('#s4 .route path', { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set('#s4 .route path', { attr: { pathLength: 1 } });
  tl.fromTo('#s4 .sheet', { autoAlpha: 0, y: -40, rotate: -1 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 0.9, ease: 'expo.out' }, 10.4)
    .fromTo('#s4 .cote h3 .ln', { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: E.out4, stagger: 0.1 }, 10.8)
    .fromTo('#s4 .cote p', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 11.6)
    .fromTo('#s4 .ports span', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, 11.4);
  fields.forEach((f, i) => {
    const at = 11.2 + i * 0.5;
    tl.call(() => f.classList.remove('field--empty'), [], at)
      .from(f.querySelector('.fvalue'), { autoAlpha: 0, x: -8, duration: 0.45, ease: 'power2.out' }, at + 0.02);
  });
  tl.to('#s4 .route path', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 12.0)
    .from('#s4 .dot-to', { scale: 0, transformOrigin: '50% 50%', duration: 0.4 }, 13.0);
  stampIn('#s4 .dossier-stamp', 14.2);
  tl.to('#s4 .sheet', { y: -10, duration: 3, ease: 'sine.inOut' }, 14.4)
    .to('#s4 .sheet, #s4 .cote, #s4 .ports', { autoAlpha: 0, y: -30, duration: 0.6, ease: E.inout }, 16.8);
}

/* S5 — 17.4 → 23.2 : le moteur */
tl.set('#s5', { autoAlpha: 1 }, 17.2)
  .fromTo('#s5 .panneau', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.0, ease: E.exp }, 17.2)
  .to('#s4', { autoAlpha: 0, duration: 0.01 }, 18.3)
  .fromTo('#s5 .intro .ln', { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: E.out4, stagger: 0.1 }, 17.8)
  .fromTo('#s5 .intro p', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 18.5)
  .fromTo('#s5 .card', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1.0, ease: E.out4 }, 17.9)
  .set('#s5 .bar i', { scaleX: 0 }, 17.2)
  .set('#s5 .reason', { opacity: 0.35 }, 17.2)
  .set('#s5 .stamp', { autoAlpha: 0 }, 17.2);
{
  const counter = { n: 0 };
  const val = document.querySelector('#s5 .val');
  for (let i = 0; i < 6; i++) {
    const at = 18.4 + i * 0.4;
    tl.to('#s5 .reason:nth-child(' + (i + 1) + ')', { opacity: 1, duration: 0.3 }, at)
      .to('#s5 .reason:nth-child(' + (i + 1) + ') .bar i', { scaleX: 1, duration: 0.6 }, at);
  }
  tl.to(counter, { n: 94, duration: 2.6, ease: 'power2.out', onUpdate: () => { val.textContent = Math.round(counter.n); } }, 18.4);
  stampIn('#s5 .stamp', 21.2);
  tl.to('#s5 .intro, #s5 .card, #s5 .stamp', { autoAlpha: 0, y: -24, duration: 0.6, ease: E.inout }, 22.7);
}

/* S6 — 23.2 → 27.2 : le deal room */
tl.set('#s6', { autoAlpha: 1 }, 23.0)
  .to('#s6 .panneau', { clipPath: 'inset(0 0 0% 0)', duration: 1.0, ease: E.exp }, 23.0)
  .to('#s5', { autoAlpha: 0, duration: 0.01 }, 24.1)
  .fromTo('#s6 .titre .ln', { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: E.out4, stagger: 0.12 }, 23.6)
  .set('#s6 .stage i b', { scaleX: 0 }, 23.0)
  .set('#s6 .stamp', { autoAlpha: 0 }, 23.0)
  .fromTo('#s6 .stage', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 24.4);
{
  for (let i = 0; i < 4; i++) {
    const at = 24.8 + i * 0.4;
    tl.to('#s6 .stage:nth-child(' + (i + 1) + ') i b', { scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, at);
    if (i === 3) tl.call(() => document.querySelectorAll('#s6 .stage')[3].classList.add('is-current'), [], at);
  }
  stampIn('#s6 .stamp', 26.0);
  tl.to('#s6 .titre, #s6 .stages, #s6 .stamp', { autoAlpha: 0, y: -24, duration: 0.5, ease: E.inout }, 26.9);
}

/* S7 — 27 → 30 : la marque */
tl.set('#s7', { autoAlpha: 1 }, 27.0)
  .to('#s6 .panneau', { clipPath: 'inset(0 0 100% 0)', duration: 1.0, ease: E.exp }, 27.0)
  .to('#s6', { autoAlpha: 0, duration: 0.01 }, 28.1)
  .to(bain, { n: OPS.length, duration: 1.4, ease: 'none' }, 27.4)
  .fromTo('#s7 .logo', { autoAlpha: 0, y: 30, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: E.out4 }, 27.6)
  .fromTo('#s7 .vision', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 28.3)
  .fromTo('#s7 .url', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 28.8)
  .fromTo('#s7 .rule', { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: E.inout }, 28.6)
  .fromTo('#s7 .built', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 29.0);
tl.set({}, {}, 30);

window.DUREE = 30;
window.seek = (t) => { tl.pause(); tl.time(Math.min(t, 30), false); drawBain(); };
window.tl = tl;
Promise.all([document.fonts.ready]).then(() => { window.seek(0); window.pret = true; });
</script>
</body>
</html>`;

await writeFile(join(ICI, 'scene.html'), html, 'utf8');
console.log('video/scene.html écrit');
