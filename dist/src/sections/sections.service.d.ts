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
        courseId: string;
        title: string;
        orderNo: number;
    }>;
    findAll(courseId: string): Promise<({
        lessons: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        orderNo: number;
    })[]>;
    update(id: string, userId: string, userRole: string, dto: UpdateSectionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        title: string;
        orderNo: number;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        success: boolean;
    }>;
}
