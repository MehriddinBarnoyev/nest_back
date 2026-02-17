import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const invoices = await prisma.invoice.findMany({
        include: { user: true, course: true }
    });
    console.log('Total Invoices:', invoices.length);
    invoices.forEach(inv => {
        console.log(`Invoice ID: ${inv.id}, User: ${inv.user.email}, Status: ${inv.status}, Course: ${inv.course.title}`);
    });

    const entitlements = await prisma.entitlement.findMany({
        include: { user: true, course: true }
    });
    console.log('\nTotal Entitlements:', entitlements.length);
    entitlements.forEach(e => {
        console.log(`User: ${e.user.email}, Course: ${e.course.title}`);
    });
}

main().finally(() => prisma.$disconnect());
