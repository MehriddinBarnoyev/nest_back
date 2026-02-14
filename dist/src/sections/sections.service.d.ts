import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
export declare class SectionsService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkCourseOwner;
    create(courseId: string, userId: string, userRole: string, dto: CreateSectionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        orderNo: number;
        courseId: string;
    }>;
    findAll(courseId: string): Promise<({
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
    })[]>;
    update(id: string, userId: string, userRole: string, dto: UpdateSectionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        orderNo: number;
        courseId: string;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        success: boolean;
    }>;
}
