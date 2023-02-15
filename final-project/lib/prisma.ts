import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({
        rejectOnNotFound: false,
    });
} else {
    let globalWithPrisma = global as typeof globalThis & {
        prisma: PrismaClient;
    };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = new PrismaClient({
            rejectOnNotFound: false,
        });
    }
    prisma = globalWithPrisma.prisma;
}

export default prisma;

// code modification with help of aqrin: https://github.com/prisma/prisma/discussions/10037
