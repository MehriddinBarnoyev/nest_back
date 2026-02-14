"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcrypt.hash('1236', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@platform.com' },
        update: {},
        create: {
            email: 'admin@platform.com',
            passwordHash,
            fullName: 'System Admin',
            role: client_1.UserRole.ADMIN,
            isVerified: true,
        },
    });
    console.log('Admin created:', admin.email);
    const creatorUser = await prisma.user.upsert({
        where: { email: 'creator@platform.com' },
        update: {},
        create: {
            email: 'creator@platform.com',
            passwordHash,
            fullName: 'John Creator',
            role: client_1.UserRole.CREATOR,
            isVerified: true,
        },
    });
    console.log('Creator user created:', creatorUser.email);
    const creatorProfile = await prisma.creatorProfile.upsert({
        where: { userId: creatorUser.id },
        update: {},
        create: {
            userId: creatorUser.id,
            displayName: 'Premium Academy',
            bio: 'Providing best technical education',
        },
    });
    console.log('Creator profile created:', creatorProfile.displayName);
    const student = await prisma.user.upsert({
        where: { email: 'student@platform.com' },
        update: {},
        create: {
            email: 'student@platform.com',
            passwordHash,
            fullName: 'Alice Student',
            role: client_1.UserRole.STUDENT,
            isVerified: true,
        },
    });
    console.log('Student created:', student.email);
    const course = await prisma.course.upsert({
        where: { creatorId_slug: { creatorId: creatorProfile.id, slug: 'nestjs-masterclass' } },
        update: {},
        create: {
            creatorId: creatorProfile.id,
            title: 'NestJS Masterclass',
            slug: 'nestjs-masterclass',
            description: 'Comprehensive guide to backend development with NestJS',
            status: client_1.CourseStatus.PUBLISHED,
            priceType: 'ONE_TIME',
            priceAmount: 4900,
            currency: 'USD',
            publishedAt: new Date(),
        },
    });
    console.log('Course created:', course.title);
    const section = await prisma.courseSection.create({
        data: {
            courseId: course.id,
            title: 'Introduction',
            orderNo: 1,
        },
    });
    await prisma.lesson.create({
        data: {
            courseId: course.id,
            sectionId: section.id,
            title: 'Welcome to the Course',
            type: 'TEXT',
            orderNo: 1,
            isPreview: true,
            contentText: 'This is a sample introduction lesson.',
        },
    });
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map