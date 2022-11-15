import prisma from "../../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email } = req.query;
    const result =
        typeof email === "string" &&
        (await prisma.user.findUnique({
            where: {
                email: email,
            },
        }));
    result && res.json(result);
}
