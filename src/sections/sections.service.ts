import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class SectionsService {
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

    async create(courseId: string, userId: string, userRole: string, dto: CreateSectionDto) {
        await this.checkCourseOwner(courseId, userId, userRole);
        return await this.prisma.courseSection.create({
            data: {
                courseId,
                title: dto.title,
                orderNo: dto.orderNo,
            },
        });
    }

    async findAll(courseId: string) {
        return await this.prisma.courseSection.findMany({
            where: { courseId },
            orderBy: { orderNo: 'asc' },
            include: {
                lessons: {
                    orderBy: { orderNo: 'asc' },
                },
            },
        });
    }

    async update(id: string, userId: string, userRole: string, dto: UpdateSectionDto) {
        const section = await this.prisma.courseSection.findUnique({ where: { id } });
        if (!section) throw new NotFoundException('Section not found');

        await this.checkCourseOwner(section.courseId, userId, userRole);

        return await this.prisma.courseSection.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string, userRole: string) {
        const section = await this.prisma.courseSection.findUnique({ where: { id } });
        if (!section) throw new NotFoundException('Section not found');

        await this.checkCourseOwner(section.courseId, userId, userRole);

        await this.prisma.courseSection.delete({ where: { id } });
        return { success: true };
    }
}
