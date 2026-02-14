import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVideoDto } from './create-video.dto';
import { VideoStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
    @ApiProperty({ enum: VideoStatus, required: false })
    @IsEnum(VideoStatus)
    @IsOptional()
    status?: VideoStatus;
}
