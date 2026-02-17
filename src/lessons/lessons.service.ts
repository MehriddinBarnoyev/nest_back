import { Injectable, NotFoundException, ForbiddenException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { UserRole, LessonType } from '@prisma/client';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService) { }

    private async checkCourseOwner(courseId: string, userId: string, userRole: string) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course) throw new NotFoundException('Course not found');

        if (userRole !== UserRole.ADMIN) {
            const creator = await this.prisma.creatorProfile.findUnique({ where: { userId } });
            if (!creator || course.creatorId !== creator.id) {
                throw new ForbiddenException('You do not have access to this course');
            }
        }
        return course;
    }

    private async checkVideoOwnership(videoAssetIds: string[], userId: string, userRole: string) {
        if (userRole === UserRole.ADMIN) return;

        const videos = await this.prisma.videoAsset.findMany({
            where: { id: { in: videoAssetIds } },
            select: { id: true, createdBy: true },
        });

        if (videos.length !== videoAssetIds.length) {
            throw new NotFoundException('Some video assets were not found');
        }

        for (const video of videos) {
            if (video.createdBy !== userId) {
                throw new ForbiddenException(`You do not own video asset ${video.id}`);
            }
        }
    }

    async create(courseId: string, userId: string, userRole: string, dto: CreateLessonDto) {
        await this.checkCourseOwner(courseId, userId, userRole);

        const { videoAssetIds, ...data } = dto;

        if (dto.type === LessonType.VIDEO && (!videoAssetIds || videoAssetIds.length === 0)) {
            throw new BadRequestException('Video type lessons must have at least one video asset');
        }

        if (videoAssetIds && videoAssetIds.length > 0) {
            await this.checkVideoOwnership(videoAssetIds, userId, userRole);
        }

        return await this.prisma.$transaction(async (tx) => {
            const lesson = await tx.lesson.create({
                data: {
                    courseId,
                    ...data,
                },
            });

            if (videoAssetIds && videoAssetIds.length > 0) {
                await tx.lessonVideo.createMany({
                    data: videoAssetIds.map((id, index) => ({
                        lessonId: lesson.id,
                        videoAssetId: id,
                        orderNo: index,
                    })),
                });
            }

            return tx.lesson.findUnique({
                where: { id: lesson.id },
                include: { videos: { include: { videoAsset: true } } },
            });
        });
    }

    async findAll(courseId: string) {
        return await this.prisma.lesson.findMany({
            where: { courseId },
            orderBy: { orderNo: 'asc' },
            include: {
                section: true,
                videos: {
                    include: { videoAsset: true },
                    orderBy: { orderNo: 'asc' },
                },
            },
        });
    }

    async update(id: string, userId: string, userRole: string, dto: UpdateLessonDto) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson) throw new NotFoundException('Lesson not found');

        await this.checkCourseOwner(lesson.courseId, userId, userRole);

        const { videoAssetIds, ...data } = dto;

        if (videoAssetIds) {
            if (dto.type === LessonType.VIDEO && videoAssetIds.length === 0) {
                throw new BadRequestException('Video type lessons must have at least one video asset');
            }
            await this.checkVideoOwnership(videoAssetIds, userId, userRole);
        }

        return await this.prisma.$transaction(async (tx) => {
            await tx.lesson.update({
                where: { id },
                data: data as any,
            });

            if (videoAssetIds) {
                // Replace all video associations
                await tx.lessonVideo.deleteMany({ where: { lessonId: id } });
                if (videoAssetIds.length > 0) {
                    await tx.lessonVideo.createMany({
                        data: videoAssetIds.map((vid, index) => ({
                            lessonId: id,
                            videoAssetId: vid,
                            orderNo: index,
                        })),
                    });
                }
            }

            return tx.lesson.findUnique({
                where: { id },
                include: { videos: { include: { videoAsset: true } } },
            });
        });
    }

    async remove(id: string, userId: string, userRole: string) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson) throw new NotFoundException('Lesson not found');

        await this.checkCourseOwner(lesson.courseId, userId, userRole);

        await this.prisma.lesson.delete({ where: { id } });
        return { success: true };
    }

    async findOnePublic(id: string, userId: string | null) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: {
                course: true,
                videos: {
                    include: { videoAsset: true },
                    orderBy: { orderNo: 'asc' },
                },
            },
        });

        if (!lesson) throw new NotFoundException('Lesson not found');

        // If lesson is preview, it's public
        if (lesson.isPreview) return lesson;

        // Otherwise check course access
        const hasAccess = await this.canAccessCourse(userId, lesson.courseId);

        if (!hasAccess) {
            if (!userId) {
                // Not logged in and not public
                throw new UnauthorizedException('You must be logged in to access this lesson');
            } else {
                // Logged in but no access
                throw new ForbiddenException('You do not have access to this course. Please purchase or request access.');
            }
        }

        return lesson;
    }

    private async canAccessCourse(userId: string | null, courseId: string): Promise<boolean> {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) return false;

        // Public courses are accessible to everyone
        if (course.visibility === 'PUBLIC') return true;

        // For private courses, check entitlement
        if (!userId) return false;

        const entitlement = await this.prisma.entitlement.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (!entitlement) return false;

        if (entitlement.activeUntil && entitlement.activeUntil < new Date()) {
            return false;
        }

        return true;
    }
}


