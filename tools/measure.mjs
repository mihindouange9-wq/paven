// Hauteur de chaque section de la landing, en pixels et en écrans. node tools/measure.mjs [url]
import puppeteer from "puppeteer-core";
const url = process.argv[2] ?? "http://localhost:5191";
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
for (const [name, width, height, mobile] of [["ordinateur", 1440, 900, false], ["mobile", 390, 844, true]]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 1500));
  const rows = await page.evaluate(() => [...document.querySelectorAll("main > *, footer")].map((s) => [s.id || s.className.split(" ")[0], Math.round(s.getBoundingClientRect().height)]));
  const total = rows.reduce((a, r) => a + r[1], 0);
  console.log(`${name} : ${total} px = ${(total / height).toFixed(1)} écrans`);
  console.log("  " + rows.map((r) => `${r[0]} ${(r[1] / height).toFixed(1)}`).join(" · "));
  await page.close();
}
await browser.close();
