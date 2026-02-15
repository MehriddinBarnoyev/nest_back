import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class PreviewYoutubeDto {
    @ApiProperty({
        example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'YouTube video URL (supports youtube.com/watch, youtu.be, and youtube.com/shorts formats)',
    })
    @IsUrl({}, { message: 'Please provide a valid URL' })
    @IsNotEmpty()
    url: string;
}
