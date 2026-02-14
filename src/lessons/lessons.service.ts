import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { UserRole } from '@prisma/client';

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

    async create(courseId: string, userId: string, userRole: string, dto: CreateLessonDto) {
        await this.checkCourseOwner(courseId, userId, userRole);
        return await this.prisma.lesson.create({
            data: {
                courseId,
                ...dto,
            },
        });
    }

    async findAll(courseId: string) {
        return await this.prisma.lesson.findMany({
            where: { courseId },
            orderBy: { orderNo: 'asc' },
            include: {
                section: true,
                videoAsset: true,
            },
        });
    }

    async update(id: string, userId: string, userRole: string, dto: UpdateLessonDto) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson) throw new NotFoundException('Lesson not found');

        await this.checkCourseOwner(lesson.courseId, userId, userRole);

        return await this.prisma.lesson.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string, userRole: string) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson) throw new NotFoundException('Lesson not found');

        await this.checkCourseOwner(lesson.courseId, userId, userRole);

        await this.prisma.lesson.delete({ where: { id } });
        return { success: true };
    }
}
