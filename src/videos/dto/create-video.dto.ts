import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { VideoProvider, VideoStatus } from '@prisma/client';

export class CreateVideoDto {
    @ApiProperty({ enum: VideoProvider, example: 'VDOCIPHER' })
    @IsEnum(VideoProvider)
    @IsNotEmpty()
    provider: VideoProvider;

    @ApiProperty({ example: 'vid-123' })
    @IsString()
    @IsNotEmpty()
    providerVideoId: string;

    @ApiProperty({ example: 'Introduction Video', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 600, required: false })
    @IsInt()
    @IsOptional()
    durationSec?: number;
}
