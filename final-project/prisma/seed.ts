// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.user.create({
        data: {
        email: `testemail2@gmail.com`,
        name: 'Test',
        boards : {
            create: {
                title : "My Board",
                stacks : {
                    create: [{
                        title : "To Do",
                        cards : {
                            create : [
                                {
                                title : "Set up ORM",
                            }
                        ],
                        }
                    }],
                }
            }
        }
        },
    })
}

    main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
