import { CreateCourseDto } from './create-course.dto';
import { CourseStatus } from '@prisma/client';
declare const UpdateCourseDto_base: import("@nestjs/common").Type<Partial<CreateCourseDto>>;
export declare class UpdateCourseDto extends UpdateCourseDto_base {
    status?: CourseStatus;
}
export {};
