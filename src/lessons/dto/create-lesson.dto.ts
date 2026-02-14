import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { LessonType } from '@prisma/client';

export class CreateLessonDto {
    @ApiProperty({ example: 'Introduction to NestJS' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ enum: LessonType, example: 'VIDEO' })
    @IsEnum(LessonType)
    @IsNotEmpty()
    type: LessonType;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    orderNo: number;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isPreview?: boolean;

    @ApiProperty({ example: 'Some text content', required: false })
    @IsString()
    @IsOptional()
    contentText?: string;

    @ApiProperty({ example: 'https://embed.url', required: false })
    @IsString()
    @IsOptional()
    embedUrl?: string;

    @ApiProperty({ example: 'uuid-of-video-asset', required: false })
    @IsUUID()
    @IsOptional()
    videoAssetId?: string;

    @ApiProperty({ example: 600, required: false })
    @IsInt()
    @IsOptional()
    durationSec?: number;

    @ApiProperty({ example: 'uuid-of-section', required: false })
    @IsUUID()
    @IsOptional()
    sectionId?: string;
}
