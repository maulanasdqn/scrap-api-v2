import { JSDOM } from "jsdom";
import axios from "axios";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { PageEmittedEvents } from "puppeteer";

const PuppeteerBliBli = async (url: string) => {
  return await puppeteer
    .use(StealthPlugin())
    .launch({
      headless: true,
      executablePath: "/etc/profiles/per-user/ms/bin/google-chrome-stable",
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--headless",
        "--disable-debugging",
      ],
    })
    .then(async (browser: { newPage: () => any; close: () => any }) => {
      const page = await browser.newPage();
      await page.setViewport({ width: 300, height: 300 });
      await page.setRequestInterception(true);
      page.on(
        PageEmittedEvents.Request,
        (req: {
          resourceType: () => string;
          abort: () => any;
          continue: () => void;
        }) => {
          if (
            !["document", "xhr", "fetch", "script"].includes(req.resourceType())
          ) {
            return req.abort();
          }
          req.continue();
        }
      );
      await page.goto(url, { waitUntil: "load" });
      console.log("Request from blibli");
      const product_name = await page.evaluate(
        () => document.querySelector(".product-name")?.textContent
      );
      const product_price = await page.evaluate(
        () => document.querySelector(".product-price")?.textContent
      );
      await browser.close();
      return {
        product_name: product_name?.trim(),
        product_price: product_price?.trim(),
      };
    });
};

const PuppeteerShopee = async (url: string) => {
  return await puppeteer
    .use(StealthPlugin())
    .launch({
      headless: true,
      executablePath: "/etc/profiles/per-user/ms/bin/google-chrome-stable",
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--headless",
        "--disable-debugging",
      ],
    })
    .then(async (browser: { newPage: () => any; close: () => any }) => {
      const page = await browser.newPage();
      await page.setViewport({ width: 300, height: 300 });
      await page.setRequestInterception(true);
      page.on(
        PageEmittedEvents.Request,
        (req: {
          resourceType: () => string;
          abort: () => any;
          continue: () => void;
        }) => {
          if (
            !["document", "xhr", "fetch", "script"].includes(req.resourceType())
          ) {
            return req.abort();
          }
          req.continue();
        }
      );
      await page.goto(url, { waitUntil: "networkidle2" });
      console.log("Request from Shopee");
      const product_name = await page.evaluate(
        () =>
          document.querySelector(
            "#main > div > div:nth-child(3) > div.yBgZUE > div > div.page-product > div.container > div.product-briefing.flex.card._2qM0Iy > div.flex.flex-auto.eTjGTe > div > div._2rQP1z > span"
          )?.textContent
      );
      const product_price = await page.evaluate(
        () =>
          document.querySelector(
            "#main > div > div:nth-child(3) > div.yBgZUE > div > div.page-product > div.container > div.product-briefing.flex.card._2qM0Iy > div.flex.flex-auto.eTjGTe > div > div:nth-child(3) > div > div > div > div > div > div"
          )?.textContent
      );
      await browser.close();
      return {
        product_name: product_name?.trim(),
        product_price: product_price?.trim(),
      };
    });
};

const get = async (url: string) => {
  const config = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36",
    },
  };

  if (url.includes("tokopedia")) {
    console.log("Access Tokopedia");
    try {
      const resp = await axios.get(url);
      const dom = new JSDOM(resp.data);
      const product_name = dom.window.document
        .querySelector("[data-testid='lblPDPDetailProductName']")
        .textContent.trim();
      const product_price = dom.window.document.querySelector(
        "[data-testid='lblPDPDetailProductPrice']"
      ).textContent;
      return {
        product_name,
        product_price,
      };
    } catch (err) {
      return err.message;
    }
  }

  if (url.includes("jakmall")) {
    console.log("Access Jakmall");
    try {
      const resp = await axios.get(url);
      const dom = new JSDOM(resp.data);
      const product_name =
        dom.window.document.querySelector("h1.dp__name").textContent;
      const product_price = resp.data.match(
        /\bRp\s\W*\d\W*\d*\d*\b\w*.\d*/gm
      )[0];

      return {
        product_name,
        product_price,
      };
    } catch (err) {
      return err.message;
    }
  }

  if (url.includes("lazada")) {
    console.log("Access Lazada");
    try {
      const resp = await axios.get(url);
      const dom = new JSDOM(resp.data);
      const product_name = dom.window.document.querySelector(
        "h1.pdp-mod-product-badge-title"
      ).textContent;
      const product_price = dom.window.document.querySelector(
        "span.pdp-price.pdp-price_type_normal.pdp-price_color_orange.pdp-price_size_xl"
      ).textContent;
      return {
        product_name,
        product_price,
      };
    } catch (err) {
      return err.message;
    }
  }

  if (url.includes("shopee")) {
    try {
      return await PuppeteerShopee(url);
    } catch (err) {
      return err.message;
    }
  }

  if (url.includes("blibli")) {
    try {
      return await PuppeteerBliBli(url);
    } catch (err) {
      return err.message;
    }
  }
};

export default get;
