// Capture la construction de l'atlas (scène « Marchés ») à plusieurs instants, puis l'état interactif.
// node tools/atlas-shoot.mjs [url] [dossier]
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
const url = process.argv[2] ?? "http://localhost:5192";
const out = process.argv[3] ?? ".impeccable/review/atlas";
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--hide-scrollbars", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle0" });
  await sleep(2500);
  await page.evaluate(() => window.dispatchEvent(new Event("touchstart")));
  const top = await page.evaluate(() => Math.round(document.getElementById("marches").getBoundingClientRect().top + scrollY));
  const stage = async () => page.evaluate(() => { const r = document.querySelector(".map__stage").getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height }; });
  await page.evaluate((y) => window.scrollTo(0, y - innerHeight * 0.9), top);
  await sleep(300);
  const t0 = Date.now();
  await page.evaluate((y) => window.scrollTo(0, y), name === "mobile" ? top + 520 : top);
  const clip = await stage();
  for (const t of [350, 900, 1500, 2300, 3200, 4300, 6800]) {
    await sleep(Math.max(0, t - (Date.now() - t0)));
    await page.screenshot({ path: path.join(out, `${name}-${String(t).padStart(4, "0")}.png`), clip, captureBeyondViewport: false });
  }
  if (name === "desktop") {
    // choix d'un autre pays sur la carte : le Kenya (clic sur Nairobi)
    const p = await page.evaluate(() => { const c = document.querySelector(".atlas__canvas").getBoundingClientRect(); return { x: c.x, y: c.y, w: c.width, h: c.height }; });
    const k = Math.min(p.w / 2000, p.h / 2080) * 0.93, ox = (p.w - 2000 * k) / 2, oy = (p.h - 2080 * k) / 2;
    await page.mouse.click(p.x + ox + 1574 * k, p.y + oy + 1111 * k);
    await sleep(900);
    console.log("  pays choisi au clic :", await page.evaluate(() => document.querySelector(".map__select").value));
    await page.screenshot({ path: path.join(out, `${name}-choix.png`), clip, captureBeyondViewport: false });
    await page.screenshot({ path: path.join(out, `${name}-scene.png`) });
  }
  console.log(name, errors.length ? "ERREURS : " + errors.slice(0, 4).join(" | ") : "aucune erreur console");
  await page.close();
}
await browser.close();
