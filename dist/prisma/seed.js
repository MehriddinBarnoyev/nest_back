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
    const passwordHash = await bcrypt.hash('123456', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@platform.com' },
        update: { passwordHash },
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
        update: { passwordHash },
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
        update: { passwordHash },
        create: {
            email: 'student@platform.com',
            passwordHash,
            fullName: 'Alice Student',
            role: client_1.UserRole.STUDENT,
            isVerified: true,
        },
    });
    console.log('Student created:', student.email);
    const publicCourse = await prisma.course.upsert({
        where: { creatorId_slug: { creatorId: creatorProfile.id, slug: 'intro-to-web' } },
        update: {},
        create: {
            creatorId: creatorProfile.id,
            title: 'Intro to Web Development',
            slug: 'intro-to-web',
            description: 'Learn HTML, CSS and JS for free!',
            status: client_1.CourseStatus.PUBLISHED,
            visibility: client_1.CourseVisibility.PUBLIC,
            priceType: 'FREE',
            priceAmount: 0,
            currency: 'UZS',
            publishedAt: new Date(),
        },
    });
    console.log('Public Course created:', publicCourse.title);
    const privateCourse = await prisma.course.upsert({
        where: { creatorId_slug: { creatorId: creatorProfile.id, slug: 'nestjs-masterclass' } },
        update: {},
        create: {
            creatorId: creatorProfile.id,
            title: 'NestJS Masterclass (PRO)',
            slug: 'nestjs-masterclass',
            description: 'Advanced patterns and architecture with NestJS',
            status: client_1.CourseStatus.PUBLISHED,
            visibility: client_1.CourseVisibility.PRIVATE,
            priceType: 'ONE_TIME',
            priceAmount: 500000,
            currency: 'UZS',
            publishedAt: new Date(),
        },
    });
    console.log('Private Course created:', privateCourse.title);
    const section = await prisma.courseSection.upsert({
        where: { courseId_orderNo: { courseId: privateCourse.id, orderNo: 1 } },
        update: {},
        create: {
            courseId: privateCourse.id,
            title: 'Architecture',
            orderNo: 1,
        },
    });
    await prisma.lessonVideo.deleteMany({ where: { lesson: { courseId: privateCourse.id } } });
    await prisma.lesson.deleteMany({ where: { courseId: privateCourse.id } });
    await prisma.videoAsset.deleteMany({ where: { createdBy: creatorUser.id } });
    const video1 = await prisma.videoAsset.create({
        data: {
            provider: 'YOUTUBE',
            providerVideoId: 'dQw4w9WgXcQ',
            title: 'Rick Roll',
            status: 'READY',
            createdBy: creatorUser.id,
        }
    });
    const video2 = await prisma.videoAsset.create({
        data: {
            provider: 'YOUTUBE',
            providerVideoId: 'f02mOEt11OQ',
            title: 'NestJS Course',
            status: 'READY',
            createdBy: creatorUser.id,
        }
    });
    const lesson = await prisma.lesson.create({
        data: {
            courseId: privateCourse.id,
            sectionId: section.id,
            title: 'Microservices with NestJS',
            type: 'VIDEO',
            orderNo: 1,
            isPreview: false,
        },
    });
    await prisma.lessonVideo.createMany({
        data: [
            { lessonId: lesson.id, videoAssetId: video1.id, orderNo: 0 },
            { lessonId: lesson.id, videoAssetId: video2.id, orderNo: 1 },
        ]
    });
    const request = await prisma.accessRequest.create({
        data: {
            userId: student.id,
            courseId: privateCourse.id,
            ownerId: creatorUser.id,
            status: client_1.AccessRequestStatus.INVOICED,
        }
    });
    await prisma.invoice.create({
        data: {
            accessRequestId: request.id,
            courseId: privateCourse.id,
            userId: student.id,
            ownerId: creatorUser.id,
            amount: 500000,
            currency: 'UZS',
            status: 'SENT',
            issuedAt: new Date(),
            note: 'Special discount for you!',
        }
    });
    console.log('Sample Access Request and SENT Invoice created for student.');
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