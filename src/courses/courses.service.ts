import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseStatus, UserRole } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateCourseDto) {
        const creator = await this.prisma.creatorProfile.findUnique({
            where: { userId },
        });

        if (!creator) {
            throw new ForbiddenException('You must have a creator profile to create courses');
        }

        const slug = dto.slug || slugify(dto.title, { lower: true, strict: true });

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

    async findAll(user: any, page = 1, limit = 10, q?: string) {
        const skip = (page - 1) * limit;

        let where: any = {};
        if (user.role !== UserRole.ADMIN) {
            const creator = await this.prisma.creatorProfile.findUnique({
                where: { userId: user.id },
            });
            if (!creator) return { results: [], meta: { total: 0, page, limit, totalPages: 0 } };
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

    async findPublic(page = 1, limit = 10, q?: string) {
        const skip = (page - 1) * limit;
        const where: any = { status: CourseStatus.PUBLISHED };

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

    async findOne(id: string, user: any) {
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
            throw new NotFoundException('Course not found');
        }

        if (user.role !== UserRole.ADMIN) {
            const creator = await this.prisma.creatorProfile.findUnique({
                where: { userId: user.id },
            });
            if (!creator || course.creatorId !== creator.id) {
                throw new ForbiddenException('You do not have access to this course');
            }
        }

        return course;
    }

    async findOnePublic(id: string) {
        const course = await this.prisma.course.findFirst({
            where: { id, status: CourseStatus.PUBLISHED },
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
            throw new NotFoundException('Course not found or not published');
        }

        return course;
    }

    async update(id: string, userId: string, userRole: string, dto: UpdateCourseDto) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course) throw new NotFoundException('Course not found');

        if (userRole !== UserRole.ADMIN) {
            const creator = await this.prisma.creatorProfile.findUnique({ where: { userId } });
            if (!creator || course.creatorId !== creator.id) {
                throw new ForbiddenException('You do not have access to this course');
            }
        }

        const data: any = { ...dto };
        if (dto.status === CourseStatus.PUBLISHED && !course.publishedAt) {
            data.publishedAt = new Date();
        }

        return await this.prisma.course.update({
            where: { id },
            data,
        });
    }

    async remove(id: string, userId: string, userRole: string) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course) throw new NotFoundException('Course not found');

        if (userRole !== UserRole.ADMIN) {
            const creator = await this.prisma.creatorProfile.findUnique({ where: { userId } });
            if (!creator || course.creatorId !== creator.id) {
                throw new ForbiddenException('You do not have access to this course');
            }
        }

        await this.prisma.course.delete({ where: { id } });
        return { success: true };
    }
}
