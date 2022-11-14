import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { boardId } = req.query;
    const result =
        typeof boardId === "string" &&
        (await prisma.board.findUnique({
            where: {
                id: boardId,
            },
            include: {
                users: true,
            },
        }));
    result && res.json(result);
}
