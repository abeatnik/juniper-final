//boilerplate from: https://vercel.com/guides/nextjs-prisma-postgres

import * as dotenv from "dotenv";
dotenv.config();
import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) =>
    NextAuth(req, res, authOptions);
export default authHandler;

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    // pages: {
    //     signIn: "/auth/signin",
    //     signOut: "/auth/signout",
    //     error: "/auth/error", // Error code passed in query string as ?error=
    //     verifyRequest: "/auth/verify-request", // (used for check email message)
    //     // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
};
