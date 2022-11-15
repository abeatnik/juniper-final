import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { cardId, userId } = req.body;
    const result = await prisma.card.update({
        where: {
            id: cardId,
        },
        data: {
            user: { connect: { id: userId } },
        },
    });
    result && res.json(result);
}
