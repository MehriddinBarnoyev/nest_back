import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, q?: string): Promise<{
        results: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            fullName: string | null;
            isVerified: boolean;
            isBlocked: boolean;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        fullName: string | null;
        isVerified: boolean;
        isBlocked: boolean;
        createdAt: Date;
        creatorProfile: {
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
        } | null;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        fullName: string | null;
        isVerified: boolean;
        isBlocked: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
