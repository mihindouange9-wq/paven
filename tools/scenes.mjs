// Contrôle des scènes de la page d'accueil : une capture par scène (ordinateur et téléphone), les étapes d'un
// passage par le nuage, la hauteur de chaque scène, les débordements et les erreurs de console.
// node tools/scenes.mjs [url] [dossier] [profils : desktop,mobile,laptop]
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:5191";
const out = process.argv[3] ?? ".impeccable/review/scenes";
const only = (process.argv[4] ?? "desktop,mobile").split(",");
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PROFILES = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1366, height: 700 },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--hide-scrollbars", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
});

for (const name of only) {
  const vp = PROFILES[name];
  const page = await browser.newPage();
  await page.setViewport(vp);
  const errors = [];
  page.on("pageerror", (e) => errors.push("page : " + e.message));
  page.on("console", (m) => m.type() === "error" && errors.push("console : " + m.text()));
  await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await sleep(4200); // entrée de l'accueil
  // un doigt posé : le passage ne se termine pas seul pendant les captures
  await page.evaluate(() => window.dispatchEvent(new Event("touchstart")));
  const scenes = async () => page.evaluate(() => [...document.querySelectorAll("[data-scene]")].map((s) => ({ id: s.id, top: Math.round(s.getBoundingClientRect().top + scrollY), h: Math.round(s.getBoundingClientRect().height) })));
  let list = await scenes();
  const vh = vp.height;
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${name} : ${total} px = ${(total / vh).toFixed(1)} écrans · ` + list.map((s) => `${s.id} ${(s.h / vh).toFixed(2)}`).join(" · "));

  for (let i = 0; i < list.length; i++) {
    list = await scenes();
    const s = list[i];
    // approche par petits pas, comme un visiteur
    const from = await page.evaluate(() => scrollY);
    for (let y = from; y < s.top; y += vh * 0.25) { await page.evaluate((y) => window.scrollTo(0, y), y); await sleep(60); }
    await page.evaluate((y) => window.scrollTo(0, y), s.top);
    await sleep(2600);
    await page.screenshot({ path: path.join(out, `${name}-${i + 1}-${s.id}.png`) });
    // scène plus haute que l'écran : la suite
    for (let k = 1; s.h > vh * (k + 0.15); k++) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.min(s.top + k * vh, s.top + s.h - vh));
      await sleep(900);
      await page.screenshot({ path: path.join(out, `${name}-${i + 1}-${s.id}-suite${k}.png`) });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 0) console.log(`  débordement horizontal de ${overflow} px sur ${s.id}`);
  }

  // Le nuage : six étapes du passage de la scène 1 à la scène 2, puis de la 2 à la 3
  list = await scenes();
  for (const b of [1, 2]) {
    for (const d of [0.2, 0.34, 0.5, 0.68, 0.82, 0.93]) {
      await page.evaluate((y) => window.scrollTo(0, y), list[b].top - vh + d * vh);
      await sleep(420);
      await page.screenshot({ path: path.join(out, `${name}-nuage${b}-${String(Math.round(d * 100)).padStart(2, "0")}.png`), type: "png" });
    }
  }
  const gl = await page.evaluate(() => { const c = document.querySelector(".nuage"); return { w: c.width, h: c.height, voile: c.classList.contains("nuage--voile") }; });
  console.log(`  nuage : toile ${gl.w} × ${gl.h}${gl.voile ? " (repli sans WebGL)" : ""}`);
  if (errors.length) console.log("  ERREURS : " + [...new Set(errors)].slice(0, 6).join(" | "));
  await page.close();
}
await browser.close();
