import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateCourseDto): Promise<{
        id: string;
        meta: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        orgId: string | null;
        creatorId: string;
        title: string;
        slug: string;
        description: string | null;
        coverFileId: string | null;
        status: import("@prisma/client").$Enums.CourseStatus;
        language: string | null;
        level: string | null;
        tags: string[];
        priceType: string;
        priceAmount: number;
        currency: string;
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
            meta: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
            updatedAt: Date;
            orgId: string | null;
            creatorId: string;
            title: string;
            slug: string;
            description: string | null;
            coverFileId: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            language: string | null;
            level: string | null;
            tags: string[];
            priceType: string;
            priceAmount: number;
            currency: string;
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
            meta: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
            updatedAt: Date;
            orgId: string | null;
            creatorId: string;
            title: string;
            slug: string;
            description: string | null;
            coverFileId: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            language: string | null;
            level: string | null;
            tags: string[];
            priceType: string;
            priceAmount: number;
            currency: string;
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
            socialLinks: import("@prisma/client/runtime/library").JsonValue;
            payoutSettings: import("@prisma/client/runtime/library").JsonValue;
            isPublic: boolean;
        };
        sections: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            orderNo: number;
            courseId: string;
        }[];
    } & {
        id: string;
        meta: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        orgId: string | null;
        creatorId: string;
        title: string;
        slug: string;
        description: string | null;
        coverFileId: string | null;
        status: import("@prisma/client").$Enums.CourseStatus;
        language: string | null;
        level: string | null;
        tags: string[];
        priceType: string;
        priceAmount: number;
        currency: string;
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
                meta: import("@prisma/client/runtime/library").JsonValue;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                orderNo: number;
                courseId: string;
                type: import("@prisma/client").$Enums.LessonType;
                isPreview: boolean;
                contentText: string | null;
                embedUrl: string | null;
                fileId: string | null;
                durationSec: number | null;
                sectionId: string | null;
                videoAssetId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            orderNo: number;
            courseId: string;
        })[];
    } & {
        id: string;
        meta: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        orgId: string | null;
        creatorId: string;
        title: string;
        slug: string;
        description: string | null;
        coverFileId: string | null;
        status: import("@prisma/client").$Enums.CourseStatus;
        language: string | null;
        level: string | null;
        tags: string[];
        priceType: string;
        priceAmount: number;
        currency: string;
        previewLessonCount: number;
        publishedAt: Date | null;
    }>;
    update(id: string, userId: string, userRole: string, dto: UpdateCourseDto): Promise<{
        id: string;
        meta: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        orgId: string | null;
        creatorId: string;
        title: string;
        slug: string;
        description: string | null;
        coverFileId: string | null;
        status: import("@prisma/client").$Enums.CourseStatus;
        language: string | null;
        level: string | null;
        tags: string[];
        priceType: string;
        priceAmount: number;
        currency: string;
        previewLessonCount: number;
        publishedAt: Date | null;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        success: boolean;
    }>;
}
