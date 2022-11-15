import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;
    const result =
        typeof userId === "string" &&
        (await prisma.user.findUnique({
            where: {
                id: userId,
            },
        }));
    result && res.json(result);
}
