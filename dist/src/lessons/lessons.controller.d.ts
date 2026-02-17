import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsController {
    private lessonsService;
    constructor(lessonsService: LessonsService);
    create(courseId: string, userId: string, userRole: string, dto: CreateLessonDto): Promise<({
        videos: ({
            videoAsset: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.VideoStatus;
                orgId: string | null;
                title: string | null;
                description: string | null;
                durationSec: number | null;
                createdBy: string | null;
                provider: import("@prisma/client").$Enums.VideoProvider;
                providerVideoId: string;
                sourceUrl: string | null;
                sizeBytes: bigint | null;
                playbackMeta: import("@prisma/client/runtime/library").JsonValue;
                uploadMeta: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            orderNo: number;
            lessonId: string;
            videoAssetId: string;
        })[];
    } & {
        id: string;
        meta: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        orderNo: number;
        sectionId: string | null;
        type: import("@prisma/client").$Enums.LessonType;
        isPreview: boolean;
        contentText: string | null;
        embedUrl: string | null;
        fileId: string | null;
        durationSec: number | null;
    }) | null>;
    findAll(courseId: string): Promise<({
        section: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            title: string;
            orderNo: number;
        } | null;
        videos: ({
            videoAsset: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.VideoStatus;
                orgId: string | null;
                title: string | null;
                description: string | null;
                durationSec: number | null;
                createdBy: string | null;
                provider: import("@prisma/client").$Enums.VideoProvider;
                providerVideoId: string;
                sourceUrl: string | null;
                sizeBytes: bigint | null;
                playbackMeta: import("@prisma/client/runtime/library").JsonValue;
                uploadMeta: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            orderNo: number;
            lessonId: string;
            videoAssetId: string;
        })[];
    } & {
        id: string;
        meta: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        orderNo: number;
        sectionId: string | null;
        type: import("@prisma/client").$Enums.LessonType;
        isPreview: boolean;
        contentText: string | null;
        embedUrl: string | null;
        fileId: string | null;
        durationSec: number | null;
    })[]>;
    update(id: string, userId: string, userRole: string, dto: UpdateLessonDto): Promise<({
        videos: ({
            videoAsset: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.VideoStatus;
                orgId: string | null;
                title: string | null;
                description: string | null;
                durationSec: number | null;
                createdBy: string | null;
                provider: import("@prisma/client").$Enums.VideoProvider;
                providerVideoId: string;
                sourceUrl: string | null;
                sizeBytes: bigint | null;
                playbackMeta: import("@prisma/client/runtime/library").JsonValue;
                uploadMeta: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            orderNo: number;
            lessonId: string;
            videoAssetId: string;
        })[];
    } & {
        id: string;
        meta: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        orderNo: number;
        sectionId: string | null;
        type: import("@prisma/client").$Enums.LessonType;
        isPreview: boolean;
        contentText: string | null;
        embedUrl: string | null;
        fileId: string | null;
        durationSec: number | null;
    }) | null>;
    remove(id: string, userId: string, userRole: string): Promise<{
        success: boolean;
    }>;
    findOnePublic(id: string, userId: string): Promise<{
        course: {
            id: string;
            meta: import("@prisma/client/runtime/library").JsonValue;
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
        };
        videos: ({
            videoAsset: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.VideoStatus;
                orgId: string | null;
                title: string | null;
                description: string | null;
                durationSec: number | null;
                createdBy: string | null;
                provider: import("@prisma/client").$Enums.VideoProvider;
                providerVideoId: string;
                sourceUrl: string | null;
                sizeBytes: bigint | null;
                playbackMeta: import("@prisma/client/runtime/library").JsonValue;
                uploadMeta: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            orderNo: number;
            lessonId: string;
            videoAssetId: string;
        })[];
    } & {
        id: string;
        meta: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        orderNo: number;
        sectionId: string | null;
        type: import("@prisma/client").$Enums.LessonType;
        isPreview: boolean;
        contentText: string | null;
        embedUrl: string | null;
        fileId: string | null;
        durationSec: number | null;
    }>;
}
