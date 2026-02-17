import { CourseStatus, CourseVisibility } from '@prisma/client';
export declare class CreateCourseDto {
    title: string;
    slug?: string;
    description?: string;
    status?: CourseStatus;
    visibility?: CourseVisibility;
    priceType: string;
    priceAmount: number;
    currency?: string;
    tags?: string[];
}
