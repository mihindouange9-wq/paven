// Planche-contact d'une capture pleine page : la page est découpée en colonnes à échelle réduite.
// node tools/planche.mjs <png> <sortie> [colonnes] [largeur de colonne]
import fs from "node:fs";
import puppeteer from "puppeteer-core";
const [src, out, cols = "4", colW = "360"] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
const b64 = await page.evaluate(async (data, cols, colW) => {
  const im = new Image(); im.src = "data:image/png;base64," + data; await im.decode();
  const s = colW / im.naturalWidth, part = Math.ceil(im.naturalHeight / cols), gap = 12;
  const c = document.createElement("canvas"); c.width = cols * colW + (cols - 1) * gap; c.height = Math.ceil(part * s);
  const x = c.getContext("2d"); x.fillStyle = "#777"; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingQuality = "high";
  for (let i = 0; i < cols; i++) x.drawImage(im, 0, i * part, im.naturalWidth, part, i * (colW + gap), 0, colW, part * s);
  return c.toDataURL("image/jpeg", 0.85).split(",")[1];
}, fs.readFileSync(src).toString("base64"), Number(cols), Number(colW));
fs.writeFileSync(out, Buffer.from(b64, "base64"));
await browser.close();
