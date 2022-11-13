import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { cardId } = req.body;
    const result = await prisma.card.delete({
        where: {
            id: cardId,
        },
    });
    result && res.json({ success: true });
}
