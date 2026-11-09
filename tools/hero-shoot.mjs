// Le bain vivant de l'accueil : quatre images à un demi-battement d'écart, la cadence d'affichage, puis le passage
// du stylet (souris). node tools/hero-shoot.mjs [url] [dossier]
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
const url = process.argv[2] ?? "http://localhost:5192";
const out = process.argv[3] ?? ".impeccable/review/hero";
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--hide-scrollbars", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["laptop", { width: 1366, height: 700 }], ["mobile", { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle0" });
  await sleep(5200);
  await page.screenshot({ path: path.join(out, `${name}-scene.png`) });
  if (name === "desktop") {
    const clip = await page.evaluate(() => { const r = document.querySelector(".hero__stage").getBoundingClientRect(); return { x: r.x - 60, y: r.y, width: r.width + 60, height: r.height }; });
    for (let i = 0; i < 4; i++) { await page.screenshot({ path: path.join(out, `rythme-${i}.png`), clip }); await sleep(650); }
    const fps = await page.evaluate(() => new Promise((ok) => { let n = 0; const t0 = performance.now(); const f = () => { n++; performance.now() - t0 < 2000 ? requestAnimationFrame(f) : ok(Math.round(n / 2)); }; requestAnimationFrame(f); }));
    const cost = await page.evaluate(() => { const c = document.querySelector(".hero__bath canvas"); return c.width + " × " + c.height; });
    console.log(`  cadence d'affichage : ${fps} images/s · toile ${cost}`);
    // le stylet : la souris traverse le bain
    const r = await page.evaluate(() => { const b = document.querySelector(".hero__stage").getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
    for (let s = 0; s <= 14; s++) { await page.mouse.move(r.x + r.w * (0.25 + 0.6 * s / 14), r.y + r.h * (0.12 + 0.2 * s / 14)); await sleep(22); }
    await sleep(120);
    await page.screenshot({ path: path.join(out, "stylet.png"), clip });
  }
  console.log(name, errors.length ? "ERREURS : " + errors.slice(0, 3).join(" | ") : "aucune erreur console");
  await page.close();
}
await browser.close();
