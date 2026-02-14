import { LessonType } from '@prisma/client';
export declare class CreateLessonDto {
    title: string;
    type: LessonType;
    orderNo: number;
    isPreview?: boolean;
    contentText?: string;
    embedUrl?: string;
    videoAssetId?: string;
    durationSec?: number;
    sectionId?: string;
}
