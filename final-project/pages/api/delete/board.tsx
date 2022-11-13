import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { boardId } = req.body;
    const result = await prisma.board.delete({
        where: {
            id: boardId,
        },
    });
    result && res.json({ success: true });
}
