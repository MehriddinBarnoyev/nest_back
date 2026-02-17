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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let LessonsService = class LessonsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkCourseOwner(courseId, userId, userRole) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (userRole !== client_1.UserRole.ADMIN) {
            const creator = await this.prisma.creatorProfile.findUnique({ where: { userId } });
            if (!creator || course.creatorId !== creator.id) {
                throw new common_1.ForbiddenException('You do not have access to this course');
            }
        }
        return course;
    }
    async checkVideoOwnership(videoAssetIds, userId, userRole) {
        if (userRole === client_1.UserRole.ADMIN)
            return;
        const videos = await this.prisma.videoAsset.findMany({
            where: { id: { in: videoAssetIds } },
            select: { id: true, createdBy: true },
        });
        if (videos.length !== videoAssetIds.length) {
            throw new common_1.NotFoundException('Some video assets were not found');
        }
        for (const video of videos) {
            if (video.createdBy !== userId) {
                throw new common_1.ForbiddenException(`You do not own video asset ${video.id}`);
            }
        }
    }
    async create(courseId, userId, userRole, dto) {
        await this.checkCourseOwner(courseId, userId, userRole);
        const { videoAssetIds, ...data } = dto;
        if (dto.type === client_1.LessonType.VIDEO && (!videoAssetIds || videoAssetIds.length === 0)) {
            throw new common_1.BadRequestException('Video type lessons must have at least one video asset');
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
    async findAll(courseId) {
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
    async update(id, userId, userRole, dto) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        await this.checkCourseOwner(lesson.courseId, userId, userRole);
        const { videoAssetIds, ...data } = dto;
        if (videoAssetIds) {
            if (dto.type === client_1.LessonType.VIDEO && videoAssetIds.length === 0) {
                throw new common_1.BadRequestException('Video type lessons must have at least one video asset');
            }
            await this.checkVideoOwnership(videoAssetIds, userId, userRole);
        }
        return await this.prisma.$transaction(async (tx) => {
            await tx.lesson.update({
                where: { id },
                data: data,
            });
            if (videoAssetIds) {
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
    async remove(id, userId, userRole) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        await this.checkCourseOwner(lesson.courseId, userId, userRole);
        await this.prisma.lesson.delete({ where: { id } });
        return { success: true };
    }
    async findOnePublic(id, userId) {
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
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (lesson.isPreview)
            return lesson;
        const hasAccess = await this.canAccessCourse(userId, lesson.courseId);
        if (!hasAccess) {
            if (!userId) {
                throw new common_1.UnauthorizedException('You must be logged in to access this lesson');
            }
            else {
                throw new common_1.ForbiddenException('You do not have access to this course. Please purchase or request access.');
            }
        }
        return lesson;
    }
    async canAccessCourse(userId, courseId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course)
            return false;
        if (course.visibility === 'PUBLIC')
            return true;
        if (!userId)
            return false;
        const entitlement = await this.prisma.entitlement.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
        if (!entitlement)
            return false;
        if (entitlement.activeUntil && entitlement.activeUntil < new Date()) {
            return false;
        }
        return true;
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map