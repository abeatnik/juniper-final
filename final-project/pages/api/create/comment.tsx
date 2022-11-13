import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { text, cardId, email } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    const result =
        user &&
        (await prisma.comment.create({
            data: {
                text: text,
                cardId: cardId,
                userId: user.id,
            },
            include: {
                user: true,
            },
        }));
    console.log("inserted in db: ", result);
    res.json(result);
}
