import puppeteer from "puppeteer";
import dotenv from "dotenv";
import fs from "fs";
import PDFDocument from "pdfkit";

dotenv.config();

const path: string[] = [
  "nutthanonn",
  "watcharapol28",
  "tententgc",
  "EzSAC5311",
  "MrT-jesus-1995",
  "i2onin",
];

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (let i = 0; i < path.length; i++) {
    console.log(`Start capture ${path[i]}`);
    await page.goto(`${process.env.LINK as string}/${path[i]}`, {
      waitUntil: "networkidle2",
    });
    await page.screenshot({
      path: `./images/${
        path[i].split("/").join("-").length === 0
          ? "home"
          : path[i].split("/").join("-")
      }.png`,
      fullPage: true,
    });
  }

  const doc = new PDFDocument({ compress: false });

  doc.pipe(fs.createWriteStream("output.pdf"));

  for (let i = 0; i < path.length; i++) {
    doc.image(
      `./images/${
        path[i].split("/").join("-").length === 0
          ? "home"
          : path[i].split("/").join("-")
      }.png`,
      {
        cover: [doc.page.width - 100, doc.page.height - 300],
        align: "center",
        valign: "center",
        fit: [doc.page.width - 100, doc.page.height - 300],
      }
    );
    doc.addPage();
  }

  doc.end();

  await browser.close();
  console.log("Done");
})();
