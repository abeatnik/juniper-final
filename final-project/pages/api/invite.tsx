import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { boardId } = req.body;
    const result = await prisma.invite.create({
        data: {
            boardId: boardId,
        },
    });
    res.json(result);
}
