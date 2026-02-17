import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'strongPassword123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'John Student', required: false })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiProperty({ enum: UserRole, example: UserRole.STUDENT, description: 'Default is STUDENT', required: false })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}

