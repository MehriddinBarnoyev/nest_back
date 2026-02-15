import { VideosService } from './videos.service';
import { VdoCipherService } from './vdocipher.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { GetUploadCredentialsDto } from './dto/upload-credentials.dto';
import { IngestYoutubeDto } from './dto/ingest-youtube.dto';
export declare class VideosController {
    private videosService;
    private vdoCipherService;
    constructor(videosService: VideosService, vdoCipherService: VdoCipherService);
    getUploadCredentials(dto: GetUploadCredentialsDto): Promise<import("./dto/upload-credentials.dto").UploadCredentialsResponseDto>;
    getVideoStatus(videoId: string): Promise<import("./dto/video-status.dto").VideoStatusResponseDto>;
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
    ingestYoutube(dto: IngestYoutubeDto, userId: string): Promise<{
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
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
