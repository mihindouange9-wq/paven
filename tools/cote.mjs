// Place plusieurs PNG côte à côte, réduits. node tools/cote.mjs <sortie> <largeur de chacun> <png...>
import fs from "node:fs";
import puppeteer from "puppeteer-core";
const [out, w, ...files] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
const b64 = await page.evaluate(async (imgs, w) => {
  const list = []; for (const d of imgs) { const im = new Image(); im.src = "data:image/png;base64," + d; await im.decode(); list.push(im); }
  const h = Math.round(list[0].naturalHeight * w / list[0].naturalWidth), gap = 8;
  const c = document.createElement("canvas"); c.width = list.length * w + (list.length - 1) * gap; c.height = h;
  const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingQuality = "high";
  list.forEach((im, i) => x.drawImage(im, i * (w + gap), 0, w, h));
  return c.toDataURL("image/jpeg", 0.86).split(",")[1];
}, files.map((f) => fs.readFileSync(f).toString("base64")), Number(w));
fs.writeFileSync(out, Buffer.from(b64, "base64"));
await browser.close();
