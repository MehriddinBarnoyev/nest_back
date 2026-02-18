import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class IngestYoutubeDto {
    @ApiProperty({
        example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'YouTube video URL (supports youtube.com/watch, youtu.be, and youtube.com/shorts formats)',
    })
    @IsUrl({}, { message: 'Please provide a valid URL' })
    @IsNotEmpty()
    url: string;

    @ApiProperty({
        example: 'Introduction to NestJS',
        description: 'User-provided description for the video',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 'Introduction to NestJS',
        description: 'User-provided title for the video',
        required: false,
    })
    @IsString()
    @IsOptional()
    title?: string;
}
