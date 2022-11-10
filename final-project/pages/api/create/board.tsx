import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { title } = req.body;
    const session = await getSession({ req });
    const userEmail =
        session && typeof session.user?.email === "string"
            ? session.user.email
            : "";
    const data = await prisma.user.findUnique({
        where: {
            email: userEmail,
        },
        select: {
            id: true,
        },
    });

    const result =
        data &&
        (await prisma.board.create({
            data: {
                title: title,
                users: {
                    connect: { id: data.id },
                },
            },
        }));

    res.json(result);
}
