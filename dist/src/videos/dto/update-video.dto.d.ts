import { CreateVideoDto } from './create-video.dto';
import { VideoStatus } from '@prisma/client';
declare const UpdateVideoDto_base: import("@nestjs/common").Type<Partial<CreateVideoDto>>;
export declare class UpdateVideoDto extends UpdateVideoDto_base {
    status?: VideoStatus;
}
export {};
