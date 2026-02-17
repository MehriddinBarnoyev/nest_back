import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Prisma } from '@prisma/client';
export declare class CoursesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    canAccessCourse(userId: string | null, courseId: string): Promise<boolean>;
    create(userId: string, dto: CreateCourseDto): Promise<{
        id: string;
        meta: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        creatorId: string;
        orgId: string | null;
        title: string;
        slug: string;
        description: string | null;
        coverFileId: string | null;
        visibility: import("@prisma/client").$Enums.CourseVisibility;
        language: string | null;
        level: string | null;
        tags: string[];
        priceType: string;
        priceAmount: number;
        previewLessonCount: number;
        publishedAt: Date | null;
    }>;
    findAll(user: any, page?: number, limit?: number, q?: string): Promise<{
        results: ({
            _count: {
                sections: number;
                lessons: number;
            };
        } & {
            id: string;
            meta: Prisma.JsonValue;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            status: import("@prisma/client").$Enums.CourseStatus;
            creatorId: string;
            orgId: string | null;
            title: string;
            slug: string;
            description: string | null;
            coverFileId: string | null;
            visibility: import("@prisma/client").$Enums.CourseVisibility;
            language: string | null;
            level: string | null;
            tags: string[];
            priceType: string;
            priceAmount: number;
            previewLessonCount: number;
            publishedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findPublic(page?: number, limit?: number, q?: string): Promise<{
        results: ({
            creator: {
                displayName: string;
            };
        } & {
            id: string;
            meta: Prisma.JsonValue;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            status: import("@prisma/client").$Enums.CourseStatus;
            creatorId: string;
            orgId: string | null;
            title: string;
            slug: string;
            description: string | null;
            coverFileId: string | null;
            visibility: import("@prisma/client").$Enums.CourseVisibility;
            language: string | null;
            level: string | null;
            tags: string[];
            priceType: string;
            priceAmount: number;
            previewLessonCount: number;
            publishedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, user: any): Promise<{
        creator: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            orgId: string | null;
            displayName: string;
            bio: string | null;
            websiteUrl: string | null;
            socialLinks: Prisma.JsonValue;
            payoutSettings: Prisma.JsonValue;
            isPublic: boolean;
        };
        sections: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            title: string;
            orderNo: number;
        }[];
    } & {
        id: string;
        meta: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        creatorId: string;
        orgId: string | null;
        title: string;
        slug: string;
        description: string | null;
        coverFileId: string | null;
        visibility: import("@prisma/client").$Enums.CourseVisibility;
        language: string | null;
        level: string | null;
        tags: string[];
        priceType: string;
        priceAmount: number;
        previewLessonCount: number;
        publishedAt: Date | null;
    }>;
    findOnePublic(id: string): Promise<{
        creator: {
            displayName: string;
            bio: string | null;
        };
        sections: ({
            lessons: {
                id: string;
                title: string;
                orderNo: number;
                type: import("@prisma/client").$Enums.LessonType;
                isPreview: boolean;
                durationSec: number | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            title: string;
            orderNo: number;
        })[];
    } & {
        id: string;
        meta: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        creatorId: string;
        orgId: string | null;
        title: string;
        slug: string;
        description: string | null;
        coverFileId: string | null;
        visibility: import("@prisma/client").$Enums.CourseVisibility;
        language: string | null;
        level: string | null;
        tags: string[];
        priceType: string;
        priceAmount: number;
        previewLessonCount: number;
        publishedAt: Date | null;
    }>;
    update(id: string, userId: string, userRole: string, dto: UpdateCourseDto): Promise<{
        id: string;
        meta: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        creatorId: string;
        orgId: string | null;
        title: string;
        slug: string;
        description: string | null;
        coverFileId: string | null;
        visibility: import("@prisma/client").$Enums.CourseVisibility;
        language: string | null;
        level: string | null;
        tags: string[];
        priceType: string;
        priceAmount: number;
        previewLessonCount: number;
        publishedAt: Date | null;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        success: boolean;
    }>;
    findMyCourses(userId: string, page?: number, limit?: number): Promise<{
        results: ({
            _count: {
                lessons: number;
            };
            creator: {
                displayName: string;
            };
        } & {
            id: string;
            meta: Prisma.JsonValue;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            status: import("@prisma/client").$Enums.CourseStatus;
            creatorId: string;
            orgId: string | null;
            title: string;
            slug: string;
            description: string | null;
            coverFileId: string | null;
            visibility: import("@prisma/client").$Enums.CourseVisibility;
            language: string | null;
            level: string | null;
            tags: string[];
            priceType: string;
            priceAmount: number;
            previewLessonCount: number;
            publishedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
