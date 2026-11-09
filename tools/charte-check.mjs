// Contrôle de la charte typographique : pour CHAQUE texte affiché (page d'accueil et espace), relève la police
// réellement utilisée par le navigateur, glyphe par glyphe, et la couleur du texte.
//   - seules Manrope et DM Sans sont admises ;
//   - tout chiffre est en Manrope, même au milieu d'un paragraphe ;
//   - titres, boutons, libellés, navigation : Manrope ; paragraphes : DM Sans ;
//   - toute couleur de texte vient de la palette (jetons de src/styles/tokens.css).
// node tools/charte-check.mjs [url]
import fs from "node:fs";
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:5192";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGES = ["/", "/app", "/app/decouvrir", "/app/compatibilites/m-agrodistrib", "/app/expansion", "/app/deal-rooms", "/app/partenariats", "/app/messages"];

/* Couleurs admises : les jetons, résolus depuis tokens.css. */
const tokens = fs.readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");
const hexes = [...tokens.matchAll(/#([0-9a-f]{6})\b/gi)].map((m) => m[1].toLowerCase());
const allowed = new Set(hexes.map((h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",")));
const rgbOf = (c) => { const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/) || c.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/); if (!m) return null; const v = m.slice(1, 4).map(Number); return (c.startsWith("color(") ? v.map((x) => Math.round(x * 255)) : v.map(Math.round)).join(","); };

const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--hide-scrollbars", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
let failures = 0, texts = 0;
const report = (page, kind, list) => { if (!list.length) return; failures += list.length; console.log(`  ${kind} (${list.length}) :`); for (const l of [...new Set(list)].slice(0, 12)) console.log("    " + l); };

for (const p of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]); // tout le contenu visible, sans animation
  await page.goto(base + p, { waitUntil: "networkidle0", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready.then(() => true));
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 700) { await page.evaluate((y) => window.scrollTo(0, y), y); await sleep(80); }
  await sleep(500);

  const client = await page.createCDPSession();
  await client.send("DOM.enable"); await client.send("CSS.enable");
  const { root } = await client.send("DOM.getDocument", { depth: -1 });
  const items = [];
  const walk = (node, parent) => {
    if (node.nodeType === 3 && node.nodeValue.trim() && parent && !["script", "style", "noscript", "title", "option"].includes(parent.localName)) items.push({ id: node.nodeId, text: node.nodeValue.trim(), parent });
    for (const c of node.children ?? []) walk(c, node.nodeType === 1 ? node : parent);
  };
  walk(root, null);

  const foreign = [], digits = [], role = [], colors = [];
  for (const it of items) {
    let fonts;
    try { ({ fonts } = await client.send("CSS.getPlatformFontsForNode", { nodeId: it.id })); } catch { continue; }
    if (!fonts.length) continue; // texte non affiché
    texts++;
    const fams = fonts.map((f) => f.familyName);
    const cls = (it.parent.attributes ?? []).reduce((o, v, i, a) => (i % 2 === 0 && v === "class" ? a[i + 1] : o), "");
    const where = `<${it.parent.localName}${cls ? "." + cls.split(" ")[0] : ""}> « ${it.text.slice(0, 46)} »`;
    const ok = (f) => /^Manrope/.test(f) || /^DM Sans/.test(f) || f === "PAVEN Chiffres";
    if (!fams.every(ok)) foreign.push(`${where} → ${fams.join(", ")}`);
    const hasDigit = /\d/.test(it.text), onlyDigits = /^[\d\s%.,:+\-–·/]+$/.test(it.text) && hasDigit;
    const manrope = fams.some((f) => /^Manrope/.test(f) || f === "PAVEN Chiffres"), dm = fams.some((f) => /^DM Sans/.test(f));
    if (hasDigit && !manrope) digits.push(`${where} → ${fams.join(", ")}`);
    if (onlyDigits && dm && !/[·:.,/\-–+]/.test(it.text)) digits.push(`${where} → chiffres rendus en ${fams.join(", ")}`);
    const tag = it.parent.localName;
    if ((/^h[1-4]$/.test(tag) || tag === "button" || /(^|\s)(btn|label|chip|stamp|score|tabular)/.test(cls)) && dm && !/^[^A-Za-zÀ-ÿ]*$/.test(it.text)) role.push(`${where} → devrait être en Manrope (${fams.join(", ")})`);
    if ((tag === "p" || tag === "figcaption") && !/(answer|found|legend|statement|how__n|engine__meta)/.test(cls) && !dm && /[a-zà-ÿ]{4,}/.test(it.text) && !/(^|\s)(label|tabular)/.test(cls)) role.push(`${where} → devrait être en DM Sans (${fams.join(", ")})`);
  }
  // couleurs de texte
  const found = await page.evaluate(() => {
    const out = {};
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode());) {
      if (!n.nodeValue.trim()) continue; const e = n.parentElement; const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const c = getComputedStyle(e); if (c.visibility === "hidden") continue;
      (out[c.color] ||= []).push(`<${e.localName}${e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : ""}> « ${n.nodeValue.trim().slice(0, 30)} »`);
    }
    return out;
  });
  for (const [c, where] of Object.entries(found)) { const k = rgbOf(c); if (!k || !allowed.has(k)) colors.push(`${c} : ${where[0]} (${where.length} texte${where.length > 1 ? "s" : ""})`); }

  console.log(`${p} : ${items.length} textes relevés`);
  report(p, "police hors charte", foreign);
  report(p, "chiffres hors Manrope", digits);
  report(p, "rôle de police non respecté", role);
  report(p, "couleur de texte hors palette", colors);
  await page.close();
}
await browser.close();
console.log(failures ? `${failures} écart(s) à la charte sur ${texts} textes affichés` : `charte respectée : ${texts} textes affichés, tous en Manrope ou DM Sans, chiffres en Manrope, couleurs de la palette`);
process.exit(failures ? 1 : 0);
