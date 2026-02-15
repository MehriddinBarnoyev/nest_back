import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { YoutubeService } from './youtube.service';
import { VideoProvider, VideoStatus } from '@prisma/client';

@Injectable()
export class VideosService {
    constructor(
        private prisma: PrismaService,
        private youtubeService: YoutubeService,
    ) { }

    async create(dto: CreateVideoDto, userId: string) {
        return await this.prisma.videoAsset.create({
            data: {
                ...dto,
                createdBy: userId,
            },
        });
    }

    async findAll(page = 1, limit = 10, q?: string) {
        const skip = (page - 1) * limit;
        const where = q
            ? {
                OR: [
                    { title: { contains: q, mode: 'insensitive' as const } },
                    { providerVideoId: { contains: q, mode: 'insensitive' as const } },
                ],
            }
            : {};

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

    async findOne(id: string) {
        const video = await this.prisma.videoAsset.findUnique({
            where: { id },
        });

        if (!video) {
            throw new NotFoundException('Video asset not found');
        }

        return video;
    }

    async update(id: string, dto: UpdateVideoDto) {
        try {
            return await this.prisma.videoAsset.update({
                where: { id },
                data: dto,
            });
        } catch (error) {
            throw new NotFoundException('Video asset not found');
        }
    }

    async remove(id: string) {
        try {
            await this.prisma.videoAsset.delete({ where: { id } });
            return { success: true };
        } catch (error) {
            throw new NotFoundException('Video asset not found');
        }
    }

    /**
     * Ingest YouTube video and save to database
     * No API calls - frontend handles preview via iframe
     */
    async ingestYoutube(url: string, description: string | undefined, userId: string) {
        const videoId = this.youtubeService.parseVideoId(url);
        const embedUrl = this.youtubeService.toEmbedUrl(videoId);

        // Upsert video asset using unique constraint on (provider, providerVideoId)
        const videoAsset = await this.prisma.videoAsset.upsert({
            where: {
                provider_providerVideoId: {
                    provider: VideoProvider.YOUTUBE,
                    providerVideoId: videoId,
                },
            },
            update: {
                description: description || null,
                sourceUrl: url,
                status: VideoStatus.READY,
                playbackMeta: {
                    embedUrl,
                    source: 'youtube',
                },
                updatedAt: new Date(),
            },
            create: {
                provider: VideoProvider.YOUTUBE,
                providerVideoId: videoId,
                description: description || null,
                sourceUrl: url,
                status: VideoStatus.READY,
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
}
