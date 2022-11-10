import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (session) {
        res.send({
            content: "signed in connection",
        });
    } else {
        res.send({
            error: "You must be signed in to view the page content",
        });
    }
};
