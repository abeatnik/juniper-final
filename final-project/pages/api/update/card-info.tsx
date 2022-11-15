import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { cardId, title, description } = req.body;
    const result = await prisma.card.update({
        where: {
            id: cardId,
        },
        data: {
            description: description,
            title: title,
        },
    });
    result && res.json(result);
}
