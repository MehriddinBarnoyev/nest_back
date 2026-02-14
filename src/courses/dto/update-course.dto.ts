import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { CourseStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @ApiProperty({ enum: CourseStatus, required: false })
    @IsEnum(CourseStatus)
    @IsOptional()
    status?: CourseStatus;
}
