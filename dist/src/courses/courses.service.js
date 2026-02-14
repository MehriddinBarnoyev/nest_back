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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const slugify_1 = __importDefault(require("slugify"));
let CoursesService = class CoursesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const creator = await this.prisma.creatorProfile.findUnique({
            where: { userId },
        });
        if (!creator) {
            throw new common_1.ForbiddenException('You must have a creator profile to create courses');
        }
        const slug = dto.slug || (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        return await this.prisma.course.create({
            data: {
                creatorId: creator.id,
                title: dto.title,
                slug,
                description: dto.description,
                priceType: dto.priceType,
                priceAmount: dto.priceAmount,
                currency: dto.currency || 'USD',
                tags: dto.tags || [],
            },
        });
    }
    async findAll(user, page = 1, limit = 10, q) {
        const skip = (page - 1) * limit;
        let where = {};
        if (user.role !== client_1.UserRole.ADMIN) {
            const creator = await this.prisma.creatorProfile.findUnique({
                where: { userId: user.id },
            });
            if (!creator)
                return { results: [], meta: { total: 0, page, limit, totalPages: 0 } };
            where.creatorId = creator.id;
        }
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [results, total] = await Promise.all([
            this.prisma.course.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { sections: true, lessons: true },
                    },
                },
            }),
            this.prisma.course.count({ where }),
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
    async findPublic(page = 1, limit = 10, q) {
        const skip = (page - 1) * limit;
        const where = { status: client_1.CourseStatus.PUBLISHED };
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [results, total] = await Promise.all([
            this.prisma.course.findMany({
                where,
                skip,
                take: limit,
                orderBy: { publishedAt: 'desc' },
                include: {
                    creator: {
                        select: { displayName: true },
                    },
                },
            }),
            this.prisma.course.count({ where }),
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
    async findOne(id, user) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                creator: true,
                sections: {
                    orderBy: { orderNo: 'asc' },
                },
            },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (user.role !== client_1.UserRole.ADMIN) {
            const creator = await this.prisma.creatorProfile.findUnique({
                where: { userId: user.id },
            });
            if (!creator || course.creatorId !== creator.id) {
                throw new common_1.ForbiddenException('You do not have access to this course');
            }
        }
        return course;
    }
    async findOnePublic(id) {
        const course = await this.prisma.course.findFirst({
            where: { id, status: client_1.CourseStatus.PUBLISHED },
            include: {
                creator: { select: { displayName: true, bio: true } },
                sections: {
                    orderBy: { orderNo: 'asc' },
                    include: {
                        lessons: {
                            where: { isPreview: true },
                            orderBy: { orderNo: 'asc' },
                        },
                    },
                },
            },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found or not published');
        }
        return course;
    }
    async update(id, userId, userRole, dto) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (userRole !== client_1.UserRole.ADMIN) {
            const creator = await this.prisma.creatorProfile.findUnique({ where: { userId } });
            if (!creator || course.creatorId !== creator.id) {
                throw new common_1.ForbiddenException('You do not have access to this course');
            }
        }
        const data = { ...dto };
        if (dto.status === client_1.CourseStatus.PUBLISHED && !course.publishedAt) {
            data.publishedAt = new Date();
        }
        return await this.prisma.course.update({
            where: { id },
            data,
        });
    }
    async remove(id, userId, userRole) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (userRole !== client_1.UserRole.ADMIN) {
            const creator = await this.prisma.creatorProfile.findUnique({ where: { userId } });
            if (!creator || course.creatorId !== creator.id) {
                throw new common_1.ForbiddenException('You do not have access to this course');
            }
        }
        await this.prisma.course.delete({ where: { id } });
        return { success: true };
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map