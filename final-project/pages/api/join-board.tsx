import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email, inviteId } = req.body;
    const result = await prisma.invite.findUnique({
        where: {
            id: inviteId,
        },
    });
    if (result && result.valid) {
        const { boardId } = result;
        const updated = await prisma.invite.update({
            where: {
                id: inviteId,
            },
            data: {
                valid: false,
            },
        });
        const joined =
            updated &&
            (await prisma.board.update({
                where: {
                    id: boardId,
                },
                data: {
                    users: {
                        connect: { email: email },
                    },
                },
            }));
        res.json(joined);
    }
}
