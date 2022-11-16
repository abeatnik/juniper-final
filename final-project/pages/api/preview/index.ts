import puppeteer from "puppeteer";
import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        let { link } = req.body;
        let image = typeof link === "string" && (await getPreview(link));

        res.status(200).json({
            image,
        });
    } catch (error) {
        res.status(500).json({
            error: JSON.stringify(error),
        });
    }
}

let getPreview = async (link: string) => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(link);
    let image = await page.screenshot({ encoding: "base64" });
    await browser.close();
    return image;
};
