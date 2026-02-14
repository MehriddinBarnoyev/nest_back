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
exports.CreatorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CreatorsService = class CreatorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProfile(userId, dto) {
        const existingProfile = await this.prisma.creatorProfile.findUnique({
            where: { userId },
        });
        if (existingProfile) {
            throw new common_1.ConflictException('Creator profile already exists for this user');
        }
        return await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { role: client_1.UserRole.CREATOR },
            });
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
    async getMyProfile(userId) {
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
            throw new common_1.NotFoundException('Creator profile not found');
        }
        return profile;
    }
    async updateMyProfile(userId, dto) {
        const profile = await this.prisma.creatorProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Creator profile not found');
        }
        return await this.prisma.creatorProfile.update({
            where: { userId },
            data: dto,
        });
    }
    async deleteMyProfile(userId) {
        const profile = await this.prisma.creatorProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Creator profile not found');
        }
        return await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { role: client_1.UserRole.STUDENT },
            });
            await tx.creatorProfile.delete({
                where: { userId },
            });
            return { success: true };
        });
    }
};
exports.CreatorsService = CreatorsService;
exports.CreatorsService = CreatorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CreatorsService);
//# sourceMappingURL=creators.service.js.map