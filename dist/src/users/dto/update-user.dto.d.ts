import { UserRole } from '@prisma/client';
export declare class UpdateUserDto {
    role?: UserRole;
    fullName?: string;
    isVerified?: boolean;
    isBlocked?: boolean;
}
