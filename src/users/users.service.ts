import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(page = 1, limit = 10, q?: string) {
        const skip = (page - 1) * limit;
        const where = q
            ? {
                OR: [
                    { email: { contains: q, mode: 'insensitive' as const } },
                    { fullName: { contains: q, mode: 'insensitive' as const } },
                ],
            }
            : {};

        const [results, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    fullName: true,
                    isVerified: true,
                    isBlocked: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
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
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                fullName: true,
                isVerified: true,
                isBlocked: true,
                createdAt: true,
                creatorProfile: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: dto,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    fullName: true,
                    isVerified: true,
                    isBlocked: true,
                },
            });
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    async remove(id: string) {
        try {
            await this.prisma.user.delete({ where: { id } });
            return { success: true };
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }
}
