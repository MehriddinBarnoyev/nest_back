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
    }>;
    findAll(page?: number, limit?: number, q?: string): Promise<{
        results: {
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
    }>;
    update(id: string, dto: UpdateVideoDto): Promise<{
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
        };
    }>;
}
