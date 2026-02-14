import { PrismaClient, UserRole, CourseStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('1236', 10);

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@platform.com' },
        update: {},
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
        update: {},
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
        update: {},
        create: {
            email: 'student@platform.com',
            passwordHash,
            fullName: 'Alice Student',
            role: UserRole.STUDENT,
            isVerified: true,
        },
    });
    console.log('Student created:', student.email);

    // 4. Create Sample Course
    const course = await prisma.course.upsert({
        where: { creatorId_slug: { creatorId: creatorProfile.id, slug: 'nestjs-masterclass' } },
        update: {},
        create: {
            creatorId: creatorProfile.id,
            title: 'NestJS Masterclass',
            slug: 'nestjs-masterclass',
            description: 'Comprehensive guide to backend development with NestJS',
            status: CourseStatus.PUBLISHED,
            priceType: 'ONE_TIME',
            priceAmount: 4900,
            currency: 'USD',
            publishedAt: new Date(),
        },
    });
    console.log('Course created:', course.title);

    // 5. Create Sections and Lessons
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
