import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { YoutubeService } from './youtube.service';
export declare class VideosService {
    private prisma;
    private youtubeService;
    constructor(prisma: PrismaService, youtubeService: YoutubeService);
    create(dto: CreateVideoDto, userId: string): Promise<{
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
    }>;
    findAll(page?: number, limit?: number, q?: string): Promise<{
        results: {
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
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, dto: UpdateVideoDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    ingestYoutube(url: string, description: string | undefined, userId: string): Promise<{
        success: boolean;
        data: {
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
    }>;
}
