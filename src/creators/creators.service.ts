import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCreatorProfileDto } from './dto/create-creator-profile.dto';
import { UpdateCreatorProfileDto } from './dto/update-creator-profile.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class CreatorsService {
    constructor(private prisma: PrismaService) { }

    async createProfile(userId: string, dto: CreateCreatorProfileDto) {
        const existingProfile = await this.prisma.creatorProfile.findUnique({
            where: { userId },
        });

        if (existingProfile) {
            throw new ConflictException('Creator profile already exists for this user');
        }

        return await this.prisma.$transaction(async (tx) => {
            // Update user role to CREATOR
            await tx.user.update({
                where: { id: userId },
                data: { role: UserRole.CREATOR },
            });

            // Create profile
            return await tx.creatorProfile.create({
                data: {
                    userId,
                    displayName: dto.displayName,
                    bio: dto.bio,
                    websiteUrl: dto.websiteUrl,
                    socialLinks: dto.socialLinks || {},
                },
            });
        });
    }

    async getMyProfile(userId: string) {
        const profile = await this.prisma.creatorProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        email: true,
                        fullName: true,
                        role: true,
                    },
                },
            },
        });

        if (!profile) {
            throw new NotFoundException('Creator profile not found');
        }

        return profile;
    }

    async updateMyProfile(userId: string, dto: UpdateCreatorProfileDto) {
        const profile = await this.prisma.creatorProfile.findUnique({
            where: { userId },
        });

        if (!profile) {
            throw new NotFoundException('Creator profile not found');
        }

        return await this.prisma.creatorProfile.update({
            where: { userId },
            data: dto,
        });
    }

    async deleteMyProfile(userId: string) {
        const profile = await this.prisma.creatorProfile.findUnique({
            where: { userId },
        });

        if (!profile) {
            throw new NotFoundException('Creator profile not found');
        }

        return await this.prisma.$transaction(async (tx) => {
            // Downgrade user role to STUDENT
            await tx.user.update({
                where: { id: userId },
                data: { role: UserRole.STUDENT },
            });

            await tx.creatorProfile.delete({
                where: { userId },
            });

            return { success: true };
        });
    }
}
