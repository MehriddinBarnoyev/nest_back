import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { CourseStatus, CourseVisibility } from '@prisma/client';

export class CreateCourseDto {
    @ApiProperty({ example: 'NestJS for Advanced Developers' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'nestjs-advanced', required: false })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({ example: 'Learn advanced NestJS patterns', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: CourseStatus.DRAFT, enum: CourseStatus, required: false })
    @IsEnum(CourseStatus)
    @IsOptional()
    status?: CourseStatus;

    @ApiProperty({ example: CourseVisibility.PUBLIC, enum: CourseVisibility, required: false })
    @IsEnum(CourseVisibility)
    @IsOptional()
    visibility?: CourseVisibility;

    @ApiProperty({ example: 'ONE_TIME', enum: ['ONE_TIME', 'SUBSCRIPTION', 'FREE'] })
    @IsString()
    @IsNotEmpty()
    priceType: string;

    @ApiProperty({ example: 4900, description: 'Price in cents' })
    @IsInt()
    @Min(0)
    priceAmount: number;

    @ApiProperty({ example: 'USD', required: false })
    @IsString()
    @IsOptional()
    currency?: string;

    @ApiProperty({ example: ['backend', 'typescript'], required: false })
    @IsOptional()
    tags?: string[];
}

