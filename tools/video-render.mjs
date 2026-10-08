// Film PAVEN 30 s : sert video/ en HTTP, capture la scène image par image dans Chrome (ligne de temps GSAP
// placée à chaque instant), puis encode en MP4 H.264 + AAC par WebCodecs dans une seconde page Chrome.
// node tools/video-render.mjs                → video/LOCAGAB-30s.mp4 (1920 × 1080, 30 i/s)
// node tools/video-render.mjs --apercu       → planche-contact video/apercu.jpg (images clés) sans encoder
// Options : --ips 30  --debit 12000 (kb/s)  --echelle 1 (0.5 pour un brouillon rapide)
import http from "node:http";
import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile, rm, stat } from "node:fs/promises";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { setTimeout as attendre } from "node:timers/promises";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const VIDEO = join(RACINE, "video");
const args = process.argv.slice(2);
const option = (nom, defaut) => { const i = args.indexOf("--" + nom); return i >= 0 ? Number(args[i + 1]) : defaut; };
const APERCU = args.includes("--apercu");
const IPS = option("ips", 30);
const DEBIT = option("debit", 12000) * 1000;
const ECHELLE = option("echelle", 1);
const L = 1920, H = 1080;
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const DOSSIER = join(tmpdir(), `locagab-video-${Date.now()}`);
await mkdir(join(DOSSIER, "frames"), { recursive: true });

/* ---------- serveur local : video/ et le dossier des images ---------- */
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const serveur = http.createServer(async (q, r) => {
  const p = decodeURIComponent(q.url.split("?")[0]);
  const fichier = p.startsWith("/frames/") ? join(DOSSIER, p) : join(VIDEO, p === "/" ? "/scene.html" : p);
  try { const d = await readFile(fichier); r.writeHead(200, { "Content-Type": TYPES[extname(fichier)] || "application/octet-stream", "Cache-Control": "no-store" }); r.end(d); }
  catch { r.writeHead(404); r.end(); }
});
await new Promise((ok) => serveur.listen(0, "127.0.0.1", ok));
const PORT = serveur.address().port;
const BASE = `http://127.0.0.1:${PORT}`;

/* ---------- Chrome piloté par le protocole DevTools ---------- */
async function ouvrirChrome(taille) {
  const port = 9500 + Math.floor(Math.random() * 400);
  const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars", "--no-first-run", "--disable-extensions", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--force-device-scale-factor=1", `--remote-debugging-port=${port}`, `--user-data-dir=${DOSSIER}/profil-${port}`, `--window-size=${taille}`, "about:blank"], { stdio: "ignore" });
  let cible = null;
  for (let i = 0; i < 80 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { /* attente */ } }
  if (!cible) throw new Error("Chrome injoignable");
  const ws = new WebSocket(cible.webSocketDebuggerUrl);
  await new Promise((ok) => { ws.onopen = ok; });
  let n = 0; const attentes = new Map(); const erreurs = [];
  ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && attentes.has(t.id)) { attentes.get(t.id)(t); attentes.delete(t.id); return; } if (t.method === "Runtime.exceptionThrown") erreurs.push((t.params.exceptionDetails?.exception?.description || "").split("\n")[0]); if (t.method === "Runtime.consoleAPICalled" && t.params.type === "error") erreurs.push(t.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 200)); };
  const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; attentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
  const evaluer = async (expression, timeout = 60000) => { const r = await envoyer("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true, timeout }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || "erreur"); return r.result?.result?.value; };
  await envoyer("Page.enable"); await envoyer("Runtime.enable");
  return { envoyer, evaluer, erreurs, fermer: () => { try { ws.close(); } catch { /* fermé */ } chrome.kill(); } };
}

/* ---------- 1. capture ---------- */
const largeur = Math.round((L * ECHELLE) / 2) * 2, hauteur = Math.round((H * ECHELLE) / 2) * 2;
const scene = await ouvrirChrome(`${L},${H}`);
await scene.envoyer("Emulation.setDeviceMetricsOverride", { width: L, height: H, deviceScaleFactor: ECHELLE, mobile: false });
await scene.envoyer("Page.navigate", { url: `${BASE}/scene.html` });
for (let i = 0; i < 120; i++) { if (await scene.evaluer("window.pret === true")) break; await attendre(250); }
if (!(await scene.evaluer("window.pret === true"))) { console.error("scène non prête", scene.erreurs); process.exit(1); }
const DUREE = await scene.evaluer("window.DUREE");
const total = Math.round(DUREE * IPS);
const image = async (t, format = "jpeg") => {
  await scene.evaluer(`new Promise((ok) => { window.seek(${t}); requestAnimationFrame(() => requestAnimationFrame(ok)); })`);
  const { data } = (await scene.envoyer("Page.captureScreenshot", { format, quality: 93, captureBeyondViewport: false })).result;
  return Buffer.from(data, "base64");
};

if (APERCU) {
  /* planche-contact : 24 instants clés dans la propre page (canvas), pour contrôle visuel */
  const temps = [0.6, 1.6, 2.8, 3.9, 5.2, 6.5, 7.3, 8.3, 9.3, 10.6, 11.4, 12.6, 13.9, 15.2, 16.4, 17.2, 18.4, 19.6, 21.0, 22.2, 24.6, 26.2, 28.2, 29.8];
  const vignettes = [];
  for (const t of temps) vignettes.push({ t, data: (await image(t)).toString("base64") });
  const planche = await scene.evaluer(`(async () => {
    const vignettes = ${JSON.stringify(vignettes)};
    const vw = 480, vh = 270, cols = 4, rows = Math.ceil(vignettes.length / cols);
    const c = document.createElement('canvas'); c.width = vw * cols; c.height = vh * rows; const g = c.getContext('2d');
    g.fillStyle = '#222'; g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < vignettes.length; i++) { const img = new Image(); img.src = 'data:image/jpeg;base64,' + vignettes[i].data; await img.decode(); const x = (i % cols) * vw, y = Math.floor(i / cols) * vh; g.drawImage(img, x + 2, y + 2, vw - 4, vh - 4); g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x + 2, y + 2, 70, 26); g.fillStyle = '#fff'; g.font = '600 15px Manrope, sans-serif'; g.fillText(vignettes[i].t.toFixed(1) + ' s', x + 10, y + 21); }
    return c.toDataURL('image/jpeg', 0.86).split(',')[1];
  })()`, 120000);
  await writeFile(join(VIDEO, "apercu.jpg"), Buffer.from(planche, "base64"));
  console.log(`video/apercu.jpg : ${temps.length} images clés · erreurs page : ${scene.erreurs.length ? scene.erreurs.join(" | ") : "aucune"}`);
  scene.fermer(); serveur.close(); await attendre(600); await rm(DOSSIER, { recursive: true, force: true }).catch(() => {});
  process.exit(0);
}

console.log(`Film PAVEN · ${largeur}×${hauteur} · ${IPS} i/s · ${total} images`);
const debut = Date.now();
for (let i = 0; i < total; i++) {
  await writeFile(join(DOSSIER, "frames", `i${String(i).padStart(5, "0")}.jpg`), await image(i / IPS));
  if (i % 60 === 0) process.stdout.write(`  capture ${i}/${total} (${((Date.now() - debut) / 1000).toFixed(0)} s)\r`);
}
console.log(`  capture ${total}/${total} en ${((Date.now() - debut) / 1000).toFixed(0)} s · erreurs page : ${scene.erreurs.length ? scene.erreurs.join(" | ") : "aucune"}`);
const affiche = await image(29.6);
scene.fermer();

/* ---------- 2. encodage ---------- */
const enc = await ouvrirChrome("800,600");
await enc.envoyer("Page.navigate", { url: `${BASE}/encodeur.html` });
for (let i = 0; i < 80; i++) { if (await enc.evaluer("window.pret === true")) break; await attendre(250); }
console.log(`  encodage H.264 ${largeur}×${hauteur} à ${DEBIT / 1000} kb/s…`);
const reperes = [18.4, 18.8, 19.2, 19.6, 20.0, 20.4];
const taille = await enc.evaluer(`window.encoder(${JSON.stringify({ dossier: `${BASE}/frames`, total, ips: IPS, largeur, hauteur, debit: DEBIT, reperes })})`, 1800000);
const erreur = await enc.evaluer("window.erreur || ''");
if (erreur) { console.error("échec :", erreur); enc.fermer(); process.exit(1); }
const audio = await enc.evaluer("window.audio"), crete = await enc.evaluer("window.crete || 0");
const morceaux = [];
for (let d = 0; d < taille; d += 8_000_000) morceaux.push(Buffer.from(await enc.evaluer(`window.tranche(${d}, ${Math.min(taille, d + 8_000_000)})`, 120000), "base64"));
enc.fermer();
const sortie = join(RACINE, "livrables", "PAVEN-film-30s.mp4"); await mkdir(join(RACINE, "livrables"), { recursive: true });
await writeFile(sortie, Buffer.concat(morceaux));
await writeFile(join(RACINE, "livrables", "PAVEN-film-30s-affiche.jpg"), affiche);
serveur.close();
await attendre(600); await rm(DOSSIER, { recursive: true, force: true }).catch(() => {});
const { size } = await stat(sortie);
console.log(`\n  ${sortie}\n  ${(size / 1048576).toFixed(1)} Mo · ${DUREE} s · audio AAC : ${audio ? "oui (crête " + crete.toFixed(2) + ")" : "non"}\n  affiche : livrables/PAVEN-film-30s-affiche.jpg`);
