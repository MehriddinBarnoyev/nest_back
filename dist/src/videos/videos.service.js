"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const youtube_service_1 = require("./youtube.service");
const client_1 = require("@prisma/client");
let VideosService = class VideosService {
    prisma;
    youtubeService;
    constructor(prisma, youtubeService) {
        this.prisma = prisma;
        this.youtubeService = youtubeService;
    }
    async create(dto, userId) {
        return await this.prisma.videoAsset.create({
            data: {
                ...dto,
                createdBy: userId,
            },
        });
    }
    async findAll(userId, userRole, page = 1, limit = 10, q) {
        const skip = (page - 1) * limit;
        const where = {};
        if (userRole !== client_1.UserRole.ADMIN) {
            where.createdBy = userId;
        }
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { providerVideoId: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [results, total] = await Promise.all([
            this.prisma.videoAsset.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.videoAsset.count({ where }),
        ]);
        return {
            results,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const video = await this.prisma.videoAsset.findUnique({
            where: { id },
        });
        if (!video) {
            throw new common_1.NotFoundException('Video asset not found');
        }
        return video;
    }
    async update(id, dto) {
        try {
            return await this.prisma.videoAsset.update({
                where: { id },
                data: dto,
            });
        }
        catch (error) {
            throw new common_1.NotFoundException('Video asset not found');
        }
    }
    async remove(id) {
        try {
            await this.prisma.videoAsset.delete({ where: { id } });
            return { success: true };
        }
        catch (error) {
            throw new common_1.NotFoundException('Video asset not found');
        }
    }
    async ingestYoutube(url, title, description, userId) {
        const videoId = this.youtubeService.parseVideoId(url);
        const embedUrl = this.youtubeService.toEmbedUrl(videoId);
        const videoAsset = await this.prisma.videoAsset.upsert({
            where: {
                provider_providerVideoId: {
                    provider: client_1.VideoProvider.YOUTUBE,
                    providerVideoId: videoId,
                },
            },
            update: {
                title: title || `YouTube Video ${videoId}`,
                description: description || null,
                sourceUrl: url,
                status: client_1.VideoStatus.READY,
                playbackMeta: {
                    embedUrl,
                    source: 'youtube',
                },
                updatedAt: new Date(),
            },
            create: {
                title: title || `YouTube Video ${videoId}`,
                provider: client_1.VideoProvider.YOUTUBE,
                providerVideoId: videoId,
                description: description || null,
                sourceUrl: url,
                status: client_1.VideoStatus.READY,
                playbackMeta: {
                    embedUrl,
                    source: 'youtube',
                },
                createdBy: userId,
            },
        });
        return {
            success: true,
            data: videoAsset,
        };
    }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        youtube_service_1.YoutubeService])
], VideosService);
//# sourceMappingURL=videos.service.js.map