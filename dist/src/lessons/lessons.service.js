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
    async create(courseId, userId, userRole, dto) {
        await this.checkCourseOwner(courseId, userId, userRole);
        return await this.prisma.lesson.create({
            data: {
                courseId,
                ...dto,
            },
        });
    }
    async findAll(courseId) {
        return await this.prisma.lesson.findMany({
            where: { courseId },
            orderBy: { orderNo: 'asc' },
            include: {
                section: true,
                videoAsset: true,
            },
        });
    }
    async update(id, userId, userRole, dto) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        await this.checkCourseOwner(lesson.courseId, userId, userRole);
        return await this.prisma.lesson.update({
            where: { id },
            data: dto,
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
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map