import { PrismaClient } from '@prisma/client';

async function main() {
    const ports = [5433, 5432];

    for (const port of ports) {
        console.log(`\n🔍 Testing connection on port ${port}...`);
        const databaseUrl = `postgresql://creator_user:NewStrongPass123@localhost:${port}/creator_db?schema=public`;
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: databaseUrl,
                },
            },
        });

        try {
            await prisma.$connect();
            console.log(`✅ Success! Connected to database on port ${port}.`);
            const usersCount = await prisma.user.count();
            console.log(`📊 Number of users: ${usersCount}`);
            await prisma.$disconnect();
            return; // Exit if success
        } catch (error) {
            console.error(`❌ Failed on port ${port}: ${error.message}`);
            await prisma.$disconnect();
        }
    }
}

main();
