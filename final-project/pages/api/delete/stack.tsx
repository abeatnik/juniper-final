import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { stackId } = req.body;
    const result = await prisma.stack.delete({
        where: {
            id: stackId,
        },
    });
    result && res.json({ success: true });
}
