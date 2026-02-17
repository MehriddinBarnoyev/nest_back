import { PrismaClient, UserRole, CourseStatus, CourseVisibility, AccessRequestStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('123456', 10);

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@platform.com' },
        update: { passwordHash },
        create: {
            email: 'admin@platform.com',
            passwordHash,
            fullName: 'System Admin',
            role: UserRole.ADMIN,
            isVerified: true,
        },
    });
    console.log('Admin created:', admin.email);

    // 2. Create Creator
    const creatorUser = await prisma.user.upsert({
        where: { email: 'creator@platform.com' },
        update: { passwordHash },
        create: {
            email: 'creator@platform.com',
            passwordHash,
            fullName: 'John Creator',
            role: UserRole.CREATOR,
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

    // 3. Create Student
    const student = await prisma.user.upsert({
        where: { email: 'student@platform.com' },
        update: { passwordHash },
        create: {
            email: 'student@platform.com',
            passwordHash,
            fullName: 'Alice Student',
            role: UserRole.STUDENT,
            isVerified: true,
        },
    });
    console.log('Student created:', student.email);


    // 4. Create PUBLIC Course
    const publicCourse = await prisma.course.upsert({
        where: { creatorId_slug: { creatorId: creatorProfile.id, slug: 'intro-to-web' } },
        update: {},
        create: {
            creatorId: creatorProfile.id,
            title: 'Intro to Web Development',
            slug: 'intro-to-web',
            description: 'Learn HTML, CSS and JS for free!',
            status: CourseStatus.PUBLISHED,
            visibility: CourseVisibility.PUBLIC,
            priceType: 'FREE',
            priceAmount: 0,
            currency: 'UZS',
            publishedAt: new Date(),
        },
    });
    console.log('Public Course created:', publicCourse.title);

    // 5. Create PRIVATE Course
    const privateCourse = await prisma.course.upsert({
        where: { creatorId_slug: { creatorId: creatorProfile.id, slug: 'nestjs-masterclass' } },
        update: {},
        create: {
            creatorId: creatorProfile.id,
            title: 'NestJS Masterclass (PRO)',
            slug: 'nestjs-masterclass',
            description: 'Advanced patterns and architecture with NestJS',
            status: CourseStatus.PUBLISHED,
            visibility: CourseVisibility.PRIVATE,
            priceType: 'ONE_TIME',
            priceAmount: 500000,
            currency: 'UZS',
            publishedAt: new Date(),
        },
    });
    console.log('Private Course created:', privateCourse.title);

    // 6. Create Sections and Lessons
    const section = await prisma.courseSection.upsert({
        where: { courseId_orderNo: { courseId: privateCourse.id, orderNo: 1 } },
        update: {},
        create: {
            courseId: privateCourse.id,
            title: 'Architecture',
            orderNo: 1,
        },
    });

    // Clear existing lessons/videos for idempotency
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

    // 7. Create Sample Access Request + Sent Invoice
    const request = await prisma.accessRequest.create({
        data: {
            userId: student.id,
            courseId: privateCourse.id,
            ownerId: creatorUser.id,
            status: AccessRequestStatus.INVOICED,
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

