// Contrôle du MP4 produit par lecture réelle dans Chrome : à chaque image présentée on note le temps média ; aux instants
// cibles on dessine l image dans une planche (video/LOCAGAB-30s-lecture.jpg). node tools/video-check.mjs [chemin.mp4]
import http from "node:http";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { setTimeout as attendre } from "node:timers/promises";

const FICHIER = process.argv[2] ? join(process.cwd(), process.argv[2]) : join(process.cwd(), "livrables", "PAVEN-film-30s.mp4");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const serveur = http.createServer(async (q, r) => {
  const p = q.url.split("?")[0];
  if (p === "/film.mp4") { const d = await readFile(FICHIER); const range = q.headers.range; if (range) { const [a, b] = range.replace("bytes=", "").split("-").map(Number); const fin = b || d.length - 1; r.writeHead(206, { "Content-Type": "video/mp4", "Content-Range": `bytes ${a}-${fin}/${d.length}`, "Accept-Ranges": "bytes", "Content-Length": fin - a + 1 }); r.end(d.subarray(a, fin + 1)); } else { r.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": d.length, "Accept-Ranges": "bytes" }); r.end(d); } return; }
  r.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); r.end(`<!doctype html><meta charset="utf-8"><video id="v" src="/film.mp4" muted playsinline preload="auto"></video>`);
});
await new Promise((ok) => serveur.listen(0, "127.0.0.1", ok));
const BASE = `http://127.0.0.1:${serveur.address().port}`;
const port = 9700 + Math.floor(Math.random() * 200);
const chrome = spawn(CHROME, ["--headless=new", "--no-first-run", "--disable-extensions", "--autoplay-policy=no-user-gesture-required", "--disable-background-timer-throttling", `--remote-debugging-port=${port}`, `--user-data-dir=${join(tmpdir(), "locagab-lecture-" + port)}`, "--window-size=1000,700", "about:blank"], { stdio: "ignore" });
let cible = null;
for (let i = 0; i < 80 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { /* attente */ } }
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((ok) => { ws.onopen = ok; });
let n = 0; const attentes = new Map();
ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && attentes.has(t.id)) { attentes.get(t.id)(t); attentes.delete(t.id); } };
const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; attentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const evaluer = async (expression, timeout = 120000) => { const r = await envoyer("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true, timeout }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || "erreur"); return r.result?.result?.value; };
await envoyer("Page.enable"); await envoyer("Runtime.enable");
await envoyer("Page.navigate", { url: BASE + "/" });
await attendre(800);
const info = await evaluer(`(async () => {
  const v = document.getElementById('v');
  await new Promise((ok) => { if (v.readyState >= 1) ok(); v.onloadedmetadata = ok; });
  const cibles = [0.5, 2.5, 4.5, 7.0, 9.0, 11.0, 13.0, 15.5, 17.0, 19.0, 21.5, 23.0, 25.0, 27.5, 29.0, 29.9];
  const vw = 320, vh = 180, cols = 4; const c = document.createElement('canvas'); c.width = vw * cols; c.height = vh * Math.ceil(cibles.length / cols); const g = c.getContext('2d'); g.fillStyle = '#222'; g.fillRect(0, 0, c.width, c.height);
  let k = 0; const vus = [];
  await new Promise((fin) => {
    const pas = (now, meta) => {
      while (k < cibles.length && meta.mediaTime >= cibles[k]) { const x = (k % cols) * vw, y = Math.floor(k / cols) * vh; g.drawImage(v, x + 1, y + 1, vw - 2, vh - 2); g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x + 1, y + 1, 110, 20); g.fillStyle = '#fff'; g.font = '600 12px sans-serif'; g.fillText(cibles[k].toFixed(1) + ' → ' + meta.mediaTime.toFixed(2), x + 6, y + 15); vus.push(meta.mediaTime.toFixed(2)); k++; }
      if (k < cibles.length && !v.ended) v.requestVideoFrameCallback(pas); else fin();
    };
    v.requestVideoFrameCallback(pas); v.onended = fin; v.play();
  });
  return { duree: v.duration, vus, planche: c.toDataURL('image/jpeg', 0.85).split(',')[1] };
})()`);
await writeFile(join(process.cwd(), "livrables", "controle-lecture.jpg"), Buffer.from(info.planche, "base64"));
console.log(`durée ${info.duree.toFixed(2)} s · instants présentés : ${info.vus.join(", ")}`);
try { ws.close(); } catch { /* fermé */ }
chrome.kill(); serveur.close();
