// Génère les fichiers de marque PAVEN dans public/ : favicon.svg, favicon.ico, icônes PNG, apple-touch-icon,
// image de partage (og-image.png) et les SVG du logo dans public/brand/. Les PNG sont rendus par Chrome sans interface.
// node tools/build-brand.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
fs.mkdirSync(path.join(pub, "brand"), { recursive: true });
const RAISIN = "#242124", OFFWHITE = "#F5F2EC", SUNSET = "#E96A4F";

const mark = (ink, node) => `<path d="M28 12v76" stroke="${ink}" stroke-width="14" stroke-linecap="square" fill="none"/><path d="M28 19h26a19 19 0 0 1 0 38h-8" stroke="${ink}" stroke-width="14" stroke-linecap="square" fill="none"/><circle cx="73" cy="78" r="10" fill="${node}"/>`;
const word = (ink) => `<text x="112" y="80" font-family="Manrope Variable, Manrope, sans-serif" font-weight="800" font-size="78" letter-spacing="-3" fill="${ink}">PAVEN</text>`;
const svg = (w, h, body, title = "PAVEN", extra = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"${extra}><title>${title}</title>${body}</svg>\n`;
const fontCss = () => {
  const f = path.join(root, "node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2");
  const b64 = fs.readFileSync(f).toString("base64");
  return `<style>@font-face{font-family:"Manrope Variable";src:url(data:font/woff2;base64,${b64}) format("woff2");font-weight:200 800}</style>`;
};

/* SVG autonomes (la police est embarquée dans ceux qui portent le mot-symbole) */
const files = {
  "brand/paven-symbole.svg": svg(100, 100, mark(RAISIN, SUNSET), "Symbole PAVEN"),
  "brand/paven-symbole-sombre.svg": svg(100, 100, mark(OFFWHITE, SUNSET), "Symbole PAVEN"),
  "brand/paven-symbole-mono.svg": svg(100, 100, mark(RAISIN, RAISIN), "Symbole PAVEN"),
  "brand/paven-symbole-mono-sombre.svg": svg(100, 100, mark(OFFWHITE, OFFWHITE), "Symbole PAVEN"),
  "brand/paven-logo.svg": svg(330, 100, fontCss() + mark(RAISIN, SUNSET) + word(RAISIN)),
  "brand/paven-logo-sombre.svg": svg(330, 100, fontCss() + mark(OFFWHITE, SUNSET) + word(OFFWHITE)),
  "brand/paven-logo-mono.svg": svg(330, 100, fontCss() + mark(RAISIN, RAISIN) + word(RAISIN)),
  "brand/paven-logo-mono-sombre.svg": svg(330, 100, fontCss() + mark(OFFWHITE, OFFWHITE) + word(OFFWHITE)),
  "favicon.svg": svg(100, 100, `<rect width="100" height="100" fill="${RAISIN}"/>` + mark(OFFWHITE, SUNSET)),
  "brand/paven-icone-application.svg": svg(100, 100, `<rect width="100" height="100" rx="22" fill="${RAISIN}"/>` + mark(OFFWHITE, SUNSET), "Icône PAVEN"),
};
for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(pub, name), body);

/* PNG par Chrome */
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
const render = async (html, w, h, out, scale = 1) => {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: scale });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(pub, out), omitBackground: false });
};
const icon = (s) => `<html><body style="margin:0;background:${RAISIN}"><svg viewBox="0 0 100 100" width="${s}" height="${s}" style="display:block">${mark(OFFWHITE, SUNSET)}</svg></body></html>`;
await render(icon(512), 512, 512, "icon-512.png");
await render(icon(192), 192, 192, "icon-192.png");
await render(icon(180), 180, 180, "apple-touch-icon.png");

const og = `<html><head>${fontCss()}<style>
body{margin:0;width:1200px;height:630px;background:${OFFWHITE};font-family:"Manrope Variable",sans-serif;color:${RAISIN};position:relative;overflow:hidden}
.rule{position:absolute;left:72px;right:72px;top:96px;height:1px;background:${RAISIN}}
.logo{position:absolute;left:72px;top:40px;display:flex;align-items:center;gap:18px;font-weight:800;font-size:34px;letter-spacing:-1.5px}
.title{position:absolute;left:72px;top:150px;width:720px;font-weight:700;font-size:72px;letter-spacing:-3.5px;line-height:0.98}
.sheet{position:absolute;right:72px;top:150px;width:300px;border:1px solid ${RAISIN};background:${OFFWHITE}}
.sheet div{padding:14px 18px;border-bottom:1px solid rgba(36,33,36,.16)}
.sheet small{display:block;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b6468;font-weight:700;margin-bottom:6px}
.sheet b{font-size:22px;letter-spacing:-.5px}
.fill b{background:#ece2c9;padding:4px 8px;margin:0 -8px}
.stamp{position:absolute;right:80px;top:470px;transform:rotate(-2deg);background:${SUNSET};color:#1f1413;border-radius:999px;padding:14px 22px;font-weight:800;letter-spacing:2px;text-transform:uppercase;font-size:14px;text-align:center}
.stamp b{display:block;font-size:34px;letter-spacing:-1px}
.foot{position:absolute;left:72px;bottom:56px;font-size:16px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#6b6468}
</style></head><body>
<div class="logo"><svg viewBox="0 0 100 100" width="56" height="56">${mark(RAISIN, SUNSET)}</svg>PAVEN</div><div class="rule"></div>
<div class="title">Les affaires changent de rythme quand l'Afrique se connecte.</div>
<div class="sheet"><div class="fill"><small>Depuis</small><b>Libreville · GA</b></div><div class="fill"><small>Vers</small><b>Douala · CM</b></div><div><small>Objectif</small><b>Distributeur</b></div><div style="border:0;height:70px"></div></div>
<div class="stamp"><b>94 %</b>compatible</div>
<div class="foot">Africa's Business Connection Infrastructure</div>
</body></html>`;
await render(og, 1200, 630, "og-image.png");
await browser.close();

/* favicon.ico : le PNG 192 embarqué tel quel */
const png = fs.readFileSync(path.join(pub, "icon-192.png"));
const head = Buffer.alloc(6); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
const dir = Buffer.alloc(16); dir.writeUInt8(192, 0); dir.writeUInt8(192, 1); dir.writeUInt16LE(1, 4); dir.writeUInt16LE(32, 6); dir.writeUInt32LE(png.length, 8); dir.writeUInt32LE(22, 12);
fs.writeFileSync(path.join(pub, "favicon.ico"), Buffer.concat([head, dir, png]));
fs.writeFileSync(path.join(pub, "manifest.json"), JSON.stringify({ name: "PAVEN", short_name: "PAVEN", description: "Africa's Business Connection Infrastructure", lang: "fr", start_url: "./", display: "browser", background_color: OFFWHITE, theme_color: RAISIN, icons: [{ src: "icon-192.png", sizes: "192x192", type: "image/png" }, { src: "icon-512.png", sizes: "512x512", type: "image/png" }] }, null, 2));
console.log("marque générée :", Object.keys(files).length, "SVG · icon-512/192 · apple-touch-icon · og-image · favicon.ico · manifest.json");
