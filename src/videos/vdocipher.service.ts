import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UploadCredentialsResponseDto } from './dto/upload-credentials.dto';
import { VideoStatusResponseDto } from './dto/video-status.dto';

@Injectable()
export class VdoCipherService {
    private readonly logger = new Logger(VdoCipherService.name);
    private readonly apiSecret: string;
    private readonly baseUrl = 'https://dev.vdocipher.com/api';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        const secret = this.configService.get<string>('VDO_SECRET_KEY');
        if (!secret) {
            throw new Error('VDO_SECRET_KEY is not configured');
        }
        this.apiSecret = secret;
    }

    /**
     * Get upload credentials from VdoCipher
     * @param title - Video title
     * @param folderId - Optional folder ID
     * @returns Upload credentials and video ID
     */
    async getUploadCredentials(
        title: string,
        folderId?: string,
    ): Promise<UploadCredentialsResponseDto> {
        try {
            this.logger.debug(`Requesting upload credentials for video: ${title}`);

            const params: any = { title };
            if (folderId) {
                params.folderId = folderId;
            }

            const response = await firstValueFrom(
                this.httpService.put(`${this.baseUrl}/videos`, null, {
                    params,
                    headers: {
                        Authorization: `Apisecret ${this.apiSecret}`,
                    },
                }),
            );

            this.logger.debug(`Upload credentials obtained for video ID: ${response.data.videoId}`);
            return response.data;
        } catch (error) {
            this.logger.error('Failed to get upload credentials from VdoCipher', error.response?.data || error.message);
            throw new InternalServerErrorException(
                'Failed to get upload credentials. Please try again later.',
            );
        }
    }

    /**
     * Get video status from VdoCipher
     * @param videoId - VdoCipher video ID
     * @returns Video status and metadata
     */
    async getVideoStatus(videoId: string): Promise<VideoStatusResponseDto> {
        try {
            this.logger.debug(`Fetching status for video ID: ${videoId}`);

            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/videos/${videoId}`, {
                    headers: {
                        Authorization: `Apisecret ${this.apiSecret}`,
                        Accept: 'application/json',
                    },
                }),
            );

            this.logger.debug(`Video status: ${response.data.status}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to get video status for ID: ${videoId}`, error.response?.data || error.message);
            throw new InternalServerErrorException(
                'Failed to get video status. Please try again later.',
            );
        }
    }
}
