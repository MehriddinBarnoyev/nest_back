import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkCourseOwner;
    create(courseId: string, userId: string, userRole: string, dto: CreateLessonDto): Promise<{
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
    }>;
    findAll(courseId: string): Promise<({
        section: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            orderNo: number;
            courseId: string;
        } | null;
        videoAsset: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orgId: string | null;
            title: string | null;
            description: string | null;
            status: import("@prisma/client").$Enums.VideoStatus;
            durationSec: number | null;
            provider: import("@prisma/client").$Enums.VideoProvider;
            providerVideoId: string;
            sourceUrl: string | null;
            sizeBytes: bigint | null;
            playbackMeta: import("@prisma/client/runtime/library").JsonValue;
            uploadMeta: import("@prisma/client/runtime/library").JsonValue;
            createdBy: string | null;
        } | null;
    } & {
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
    })[]>;
    update(id: string, userId: string, userRole: string, dto: UpdateLessonDto): Promise<{
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
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        success: boolean;
    }>;
}
