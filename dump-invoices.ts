import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const invoices = await prisma.invoice.findMany();
    console.log(JSON.stringify(invoices, null, 2));
}

main().finally(() => prisma.$disconnect());
