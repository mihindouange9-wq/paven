// Étude d'un site de référence : captures au fil du défilement, polices, couleurs et structure relevées dans la page.
// node tools/reference.mjs <url> <dossier> [nombre de captures]
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const url = process.argv[2];
const out = process.argv[3] ?? ".impeccable/review/reference";
const shots = Number(process.argv[4] ?? 10);
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--hide-scrollbars", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"],
});
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  try { await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 }); } catch (e) { console.log("chargement :", e.message); }
  await sleep(5000);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${name} : ${total} px = ${(total / vp.height).toFixed(1)} écrans`);
  const n = name === "desktop" ? shots : Math.min(5, shots);
  for (let i = 0; i < n; i++) {
    const y = Math.round(((total - vp.height) * i) / Math.max(1, n - 1));
    // défilement à la molette, pour déclencher les animations liées au défilement
    const from = await page.evaluate(() => scrollY);
    for (let k = 1; k <= 12; k++) { await page.evaluate((v) => window.scrollTo(0, v), from + ((y - from) * k) / 12); await sleep(70); }
    await sleep(1800);
    await page.screenshot({ path: path.join(out, `${name}-${String(i + 1).padStart(2, "0")}.jpg`), type: "jpeg", quality: 80 });
  }
  if (name === "desktop") {
    const facts = await page.evaluate(() => {
      const count = (m, k) => m.set(k, (m.get(k) || 0) + 1);
      const fonts = new Map(), bgs = new Map(), colors = new Map(), radii = new Map();
      for (const e of document.querySelectorAll("body *")) {
        const c = getComputedStyle(e), r = e.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        count(fonts, c.fontFamily.split(",")[0].trim() + " " + c.fontWeight);
        if (c.backgroundColor !== "rgba(0, 0, 0, 0)" && r.width * r.height > 4000) bgs.set(c.backgroundColor, (bgs.get(c.backgroundColor) || 0) + Math.round(r.width * r.height / 1000));
        if (e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) count(colors, c.color);
        if (c.borderRadius !== "0px" && r.width > 40) count(radii, c.borderRadius);
      }
      const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k} (${v})`);
      const vars = {};
      for (const sheet of document.styleSheets) { try { for (const rule of sheet.cssRules) if (rule.selectorText === ":root" || rule.selectorText === "html" || rule.selectorText === "body") for (const p of rule.style) if (p.startsWith("--") && /#|rgb|hsl/.test(rule.style.getPropertyValue(p))) vars[p] = rule.style.getPropertyValue(p).trim(); } catch {} }
      const heads = [...document.querySelectorAll("h1, h2")].slice(0, 14).map((h) => { const c = getComputedStyle(h); return `${h.tagName} ${c.fontSize}/${c.lineHeight} ${c.fontWeight} ls ${c.letterSpacing} tt ${c.textTransform} — ${h.innerText.replace(/\s+/g, " ").slice(0, 60)}`; });
      const sections = [...document.querySelectorAll("main > *, body > section, body > div > section, section")].slice(0, 24).map((s) => `${s.tagName}.${(s.className || "").toString().split(" ").slice(0, 2).join(".")} ${Math.round(s.getBoundingClientRect().height)}px bg ${getComputedStyle(s).backgroundColor}`);
      return { title: document.title, generator: document.querySelector('meta[name="generator"]')?.content, fonts: top(fonts, 8), backgrounds: top(bgs, 14), textColors: top(colors, 10), radii: top(radii, 8), vars, heads, sections, libs: [...document.scripts].map((s) => s.src).filter(Boolean).map((s) => s.split("/").pop().split("?")[0]).slice(0, 25), canvas: document.querySelectorAll("canvas").length, video: document.querySelectorAll("video").length };
    });
    fs.writeFileSync(path.join(out, "releve.json"), JSON.stringify(facts, null, 2));
    console.log(JSON.stringify(facts, null, 1).slice(0, 6000));
  }
  await page.close();
}
await browser.close();
