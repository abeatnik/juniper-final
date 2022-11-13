import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { cardId } = req.query;
    const result =
        typeof cardId === "string" &&
        (await prisma.comment.findMany({
            where: {
                cardId: cardId,
            },
            include: {
                user: true,
            },
        }));
    result && res.json(result);
}
