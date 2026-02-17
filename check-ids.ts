import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true }
    });
    console.log('Users:');
    users.forEach(u => console.log(`${u.id} | ${u.email} | ${u.role}`));

    const invoices = await prisma.invoice.findMany({
        select: { userId: true, status: true }
    });
    console.log('\nInvoices:');
    invoices.forEach(i => console.log(`UserID: ${i.userId} | Status: ${i.status}`));
}

main().finally(() => prisma.$disconnect());
