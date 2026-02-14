import { VideoProvider } from '@prisma/client';
export declare class CreateVideoDto {
    provider: VideoProvider;
    providerVideoId: string;
    title?: string;
    durationSec?: number;
}
