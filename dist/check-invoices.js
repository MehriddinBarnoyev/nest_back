"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=check-invoices.js.map