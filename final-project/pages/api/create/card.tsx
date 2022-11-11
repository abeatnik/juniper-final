import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { title, description, stackId } = req.body;
    const result = await prisma.card.create({
        data: {
            title: title,
            description: description,
            stackId: stackId,
        },
    });
    console.log("inserted in db: ", result);
    res.json(result);
}
