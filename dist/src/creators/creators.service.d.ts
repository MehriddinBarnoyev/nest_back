import { PrismaService } from '../prisma/prisma.service';
import { CreateCreatorProfileDto } from './dto/create-creator-profile.dto';
import { UpdateCreatorProfileDto } from './dto/update-creator-profile.dto';
export declare class CreatorsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProfile(userId: string, dto: CreateCreatorProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        orgId: string | null;
        displayName: string;
        bio: string | null;
        websiteUrl: string | null;
        socialLinks: import("@prisma/client/runtime/library").JsonValue;
        payoutSettings: import("@prisma/client/runtime/library").JsonValue;
        isPublic: boolean;
    }>;
    getMyProfile(userId: string): Promise<{
        user: {
            role: import("@prisma/client").$Enums.UserRole;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        orgId: string | null;
        displayName: string;
        bio: string | null;
        websiteUrl: string | null;
        socialLinks: import("@prisma/client/runtime/library").JsonValue;
        payoutSettings: import("@prisma/client/runtime/library").JsonValue;
        isPublic: boolean;
    }>;
    updateMyProfile(userId: string, dto: UpdateCreatorProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        orgId: string | null;
        displayName: string;
        bio: string | null;
        websiteUrl: string | null;
        socialLinks: import("@prisma/client/runtime/library").JsonValue;
        payoutSettings: import("@prisma/client/runtime/library").JsonValue;
        isPublic: boolean;
    }>;
    deleteMyProfile(userId: string): Promise<{
        success: boolean;
    }>;
}
