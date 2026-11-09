// Contrôle du comportement du nuage : passage terminé seul, retour, liens internes, rail, choix de la scène
// « Comment ça marche », mouvement réduit. node tools/nuage-check.mjs [url]
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:5191";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--hide-scrollbars", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
});
let failed = 0;
const check = (label, ok, detail = "") => { if (!ok) failed++; console.log(`${ok ? "ok  " : "ÉCHEC"} ${label}${detail ? " — " + detail : ""}`); };

async function open(reduced) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
  await sleep(reduced ? 800 : 4200);
  const tops = await page.evaluate(() => [...document.querySelectorAll("[data-scene]")].map((s) => Math.round(s.getBoundingClientRect().top + scrollY)));
  const state = () => page.evaluate(() => ({ y: Math.round(scrollY), cloud: getComputedStyle(document.querySelector(".nuage")).visibility, current: [...document.querySelectorAll(".rail__dot")].findIndex((a) => a.hasAttribute("aria-current")), focus: document.activeElement?.id || document.activeElement?.tagName }));
  return { page, errors, tops, state };
}

{
  const { page, errors, tops, state } = await open(false);
  const vh = 900;
  // 1. Arrêt au milieu d'un passage, en descendant : il se termine sur la scène suivante
  await page.evaluate((y) => window.scrollTo(0, y), tops[1] - vh + 0.4 * vh);
  await sleep(200);
  check("le nuage est visible au milieu du passage", (await state()).cloud === "visible");
  await sleep(1900);
  let s = await state();
  check("passage terminé seul vers la scène 2", Math.abs(s.y - tops[1]) <= 1, `y=${s.y}, attendu ${tops[1]}`);
  check("nuage dissipé une fois arrivé", s.cloud === "hidden");
  check("rail sur la scène 2", s.current === 1, `courant=${s.current}`);
  // 2. En remontant : retour à la scène précédente
  await page.evaluate((y) => window.scrollTo(0, y), tops[1] - 0.35 * vh);
  await sleep(2200);
  s = await state();
  check("en remontant, retour à la scène 1", Math.abs(s.y - (tops[1] - vh)) <= 1, `y=${s.y}, attendu ${tops[1] - vh}`);
  // 3. Lien du menu : le nuage joue en un geste et mène à la scène
  await page.click('.header__nav a[href="#marches"]');
  await sleep(250);
  check("nuage joué au clic sur « Marchés »", (await state()).cloud === "visible");
  await sleep(1900);
  s = await state();
  check("arrivée sur la scène Marchés", Math.abs(s.y - tops[4]) <= 1, `y=${s.y}, attendu ${tops[4]}`);
  check("nuage dissipé après le lien", s.cloud === "hidden");
  check("le focus suit la scène", s.focus === "marches", `focus=${s.focus}`);
  check("adresse mise à jour", (await page.evaluate(() => location.hash)) === "#marches");
  // 4. Rail
  await page.click('.rail__dot[href="#parcours"]');
  await sleep(2100);
  s = await state();
  check("rail : arrivée sur Comment ça marche", Math.abs(s.y - tops[2]) <= 1 && s.current === 2, `y=${s.y}, courant=${s.current}`);
  // 5. Les trois choix sont réels
  const before = await page.evaluate(() => document.querySelector(".how__rows").innerText + document.querySelector(".how__found").innerText);
  await page.click(".how__type:nth-child(2)");
  await page.select(".how__fromto label:last-child select", "MA");
  await sleep(200);
  const after = await page.evaluate(() => document.querySelector(".how__rows").innerText + document.querySelector(".how__found").innerText);
  check("le besoin et le marché changent le résultat", before !== after, after.replace(/\s+/g, " ").slice(0, 90));
  await page.click(".how__scope button:first-child");
  await sleep(150);
  check("« Mon pays » désactive la destination", await page.evaluate(() => document.querySelector(".how__fromto label:last-child select").disabled));
  // 6. Chaque scène, une fois ouverte, montre tout son contenu (aucun élément resté masqué par une animation)
  for (const id of ["plateforme", "parcours", "compatibilite", "marches", "confiance", "commencer"]) {
    await page.click(`.rail__dot[href="#${id}"]`);
    await sleep(3600);
    const hidden = await page.evaluate((id) => [...document.getElementById(id).querySelectorAll("*")].filter((e) => { const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (c.visibility === "hidden" || Number(c.opacity) < 0.5) && !e.closest(".sr-only"); }).map((e) => e.className.toString().split(" ")[0] || e.tagName).slice(0, 4), id);
    check(`scène ${id} : tout le contenu est visible`, hidden.length === 0, hidden.join(", "));
  }
  check("aucune erreur de console", errors.length === 0, errors.slice(0, 3).join(" | "));
  await page.close();
}

{
  const { page, errors, tops, state } = await open(true);
  const y = tops[1] - 900 + 0.4 * 900;
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await sleep(1200);
  let s = await state();
  check("mouvement réduit : aucun défilement automatique", Math.abs(s.y - y) <= 1, `y=${s.y}`);
  check("mouvement réduit : aucun nuage", s.cloud === "hidden");
  check("mouvement réduit : le contenu est visible sans animation", await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].every((e) => getComputedStyle(e).opacity === "1" && getComputedStyle(e).visibility === "visible")));
  await page.click('.header__nav a[href="#confiance"]');
  await sleep(400);
  s = await state();
  check("mouvement réduit : le lien mène directement à la scène", Math.abs(s.y - tops[5]) <= 1, `y=${s.y}, attendu ${tops[5]}`);
  check("mouvement réduit : aucune erreur de console", errors.length === 0, errors.slice(0, 3).join(" | "));
  await page.close();
}
await browser.close();
console.log(failed ? `${failed} contrôle(s) en échec` : "tous les contrôles passent");
process.exit(failed ? 1 : 0);
