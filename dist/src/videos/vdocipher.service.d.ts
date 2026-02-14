import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { UploadCredentialsResponseDto } from './dto/upload-credentials.dto';
import { VideoStatusResponseDto } from './dto/video-status.dto';
export declare class VdoCipherService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly apiSecret;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    getUploadCredentials(title: string, folderId?: string): Promise<UploadCredentialsResponseDto>;
    getVideoStatus(videoId: string): Promise<VideoStatusResponseDto>;
}
