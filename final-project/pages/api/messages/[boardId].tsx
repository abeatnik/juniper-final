import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { boardId } = req.query;
    const result =
        typeof boardId === "string" &&
        (await prisma.message.findMany({
            where: {
                boardId: boardId,
            },
            include: {
                user: true,
            },
            take: 20,
            orderBy: {
                createdAt: "desc",
            },
        }));
    result && res.json(result);
}
