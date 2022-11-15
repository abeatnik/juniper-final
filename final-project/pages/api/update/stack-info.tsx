import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { stackId, title } = req.body;
    const result = await prisma.stack.update({
        where: {
            id: stackId,
        },
        data: {
            title: title,
        },
    });
    result && res.json(result);
}
