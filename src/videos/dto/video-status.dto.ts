import { ApiProperty } from '@nestjs/swagger';

export class PosterDto {
    @ApiProperty({ example: 854 })
    width: number;

    @ApiProperty({ example: 480 })
    height: number;

    @ApiProperty({ example: 'https://d1z78r8i505acl.cloudfront.net/poster/123456.480.jpeg' })
    posterUrl: string;
}

export class VideoStatusResponseDto {
    @ApiProperty({ example: '1234567890' })
    id: string;

    @ApiProperty({ example: 'My Video.mp4' })
    title: string;

    @ApiProperty({ example: 'Video description' })
    description: string;

    @ApiProperty({ example: 1519700000 })
    upload_time: number;

    @ApiProperty({ example: 125, description: 'Video length in seconds' })
    length: number;

    @ApiProperty({
        example: 'ready',
        description: 'Video status: Pre-Upload, Queued, or ready',
        enum: ['Pre-Upload', 'Queued', 'ready']
    })
    status: string;

    @ApiProperty({ type: [PosterDto] })
    posters: PosterDto[];

    @ApiProperty({ example: ['tag1', 'tag2'] })
    tags: string[];
}
