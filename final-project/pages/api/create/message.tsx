import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { text, boardId, email } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    const result =
        user &&
        (await prisma.message.create({
            data: {
                text: text,
                boardId: boardId,
                userId: user.id,
            },
            include: {
                user: true,
            },
        }));
    console.log("inserted in db: ", result);
    res.json(result);
}
