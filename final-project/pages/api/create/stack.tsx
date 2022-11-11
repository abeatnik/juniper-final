import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { title, boardId } = req.body;
    const result = await prisma.stack.create({
        data: {
            title: title,
            boardId: boardId,
        },
    });
    console.log("inserted in db: ", result);
    res.json(result);
}
