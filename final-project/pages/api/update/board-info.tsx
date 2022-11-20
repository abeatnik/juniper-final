import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { boardId, title } = req.body;
    const result = await prisma.stack.update({
        where: {
            id: boardId,
        },
        data: {
            title: title,
        },
    });
    console.log(result);
    result && res.json(result);
}
